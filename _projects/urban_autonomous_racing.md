---
layout: project
title: Urban Autonomous Racing
tagline: An autonomous race car for Korea's first simultaneous-start self-driving race, with LiDAR avoidance, a custom perception data engine, and a lane-change state machine.
description: Building and racing a fully autonomous vehicle with state-based control and a custom perception data engine.
kind: Robotics
year: 2022
importance: 5
thumb: /assets/img/thumbs/autonomous-racing.jpg
context: 2022 Segye AI Robot Car Race
stack: [ROS Melodic, Velodyne VLP-16, YOLOv5, PCL, Jetson Xavier]
hero:
  image: /assets/img/urban_autonomous_racing_title.jpg
  caption: Our car on the grid at the 2022 Segye AI Robot Car Race, with the Velodyne VLP-16 on the roll hoop.
highlights:
  - "Built a **data engine** that turned 56k race frames into ~4,000 labeled images for an in-domain YOLOv5 detector."
  - "Designed a **DEFAULT → CHANGING_LANE → COOLDOWN** state machine that removed lane-change oscillation."
  - "Smooth car-following with a **distance-only velocity law**, avoiding noisy relative-velocity estimates."
  - "Avoidance triggered too late and led to emergency stops. **Decision latency** is the next thing to fix."
---

### The race

The 2022 Segye AI Robot Car Race, hosted by Segye Ilbo at Sunmoon University, was the first autonomous race in Korea with a simultaneous start. The format was 10 laps of a 1.2 km track, just over 12 km, within a one-hour limit. Organizers could drop obstacles on the track to force lane changes, and every car had to pass an emergency-stop test from at least 10 km/h. A single-lap time trial set the grid, and then all seven cars started the final together. Finishing without a collision was the main goal.

### System

| Layer | Components |
|---|---|
| Platform | ERP42 UGV with its internal motor controller |
| Compute | Neousys POC-545, NVIDIA Jetson Xavier |
| Sensors | Velodyne VLP-16 LiDAR, RGB camera, u-blox GPS, low-cost IMU |
| Software | Ubuntu 18.04, ROS Melodic, OpenCV 3.2, PCL, YOLOv5 |
| Simulation and debugging | MORAI simulator, RViz |

The stack has three jobs: track, detect and avoid. Path tracking follows a pre-recorded GPS race line (RDDF), steering against lateral error with a look-ahead distance tuned to balance cornering against high-speed stability.

We originally planned a full camera-LiDAR fusion pipeline. Getting NVIDIA drivers, CUDA, OpenCV and ROS to agree on versions became a major bottleneck, so we cut scope to a LiDAR-first system and used the competition partly to collect data.

### Perception

**LiDAR.** Avoidance runs on the point cloud. We split the 360° scan into three zones (ahead, adjacent left and adjacent right), filtered each by distance threshold, and reduced them to a boolean occupancy per lane. Close-range emergency stops rely on LiDAR alone.

**Vision.** The camera model identifies obstacles 10–15 m ahead and within about 30° of the heading, early enough to plan a lane change. No race-specific dataset existed, so we built one. From 56,000+ frames of video recorded at a previous competition, we sampled every 7th frame to get about 8,000 candidates. We added cases where an obstacle sits on the right during a left turn, which had caused trouble on track. We then labeled about 4,000 images in Roboflow and split them into train, validation and test sets for YOLOv5.

<figure>
  <img src="/assets/img/urban_autonomous_racing_dataset_simulation.jpg" alt="Grid of simulated race cars with bounding-box labels" loading="lazy">
  <figcaption>Labeled vehicle renders from the MORAI simulator, used to test the detector before track time.</figcaption>
</figure>

<div class="fig-row">
  <figure>
    <video src="/assets/img/urban_racing_clip1.mp4" poster="/assets/img/urban_racing_clip1.jpg" autoplay muted loop playsinline preload="metadata"></video>
    <figcaption>A car ahead through a curve.</figcaption>
  </figure>
  <figure>
    <video src="/assets/img/urban_racing_clip2.mp4" poster="/assets/img/urban_racing_clip2.jpg" autoplay muted loop playsinline preload="metadata"></video>
    <figcaption>A car overtaking at close range.</figcaption>
  </figure>
  <figure>
    <video src="/assets/img/urban_racing_clip3.mp4" poster="/assets/img/urban_racing_clip3.jpg" autoplay muted loop playsinline preload="metadata"></video>
    <figcaption>Several cars ahead in the pack.</figcaption>
  </figure>
</div>

<p class="fig-note">Detector output (ERP42 boxes) on onboard footage from the 2022 race. Video recorded by the UOS Robotics team.</p>

The detector worked well in normal driving, but had clear failure modes. It sometimes detected a vehicle's right wheel as a second, smaller object, and its boxes often clipped the wheels. It also missed vehicles at very close range and handled overlapping vehicles poorly. Neither case was in the training data. We enabled YOLOv5's class-agnostic NMS and tuned `multi_label` to suppress duplicate boxes. The remaining failures need data: more close-range and overlap examples, then a higher confidence threshold.

<div class="fig-row">
  <figure>
    <img src="/assets/img/urban_autonomous_racing_model_error_1.png" alt="Detection of a race car with a duplicate box on its wheel" loading="lazy">
    <figcaption>A duplicate box on the wheel of a distant car.</figcaption>
  </figure>
  <figure>
    <img src="/assets/img/urban_autonomous_racing_model_error_2.png" alt="Detections of a near and a far race car" loading="lazy">
    <figcaption>Near and far cars in race footage. Close-range and overlapping vehicles were the weakest cases.</figcaption>
  </figure>
</div>

### Control

**Longitudinal.** Relative velocity from the sensors was too noisy to use for car-following. We commanded speed from distance alone: `Target Velocity = k * (d - s)^n`, where `d` is the distance to the obstacle ahead and `k`, `s` and `n` are tuning parameters. This gave smooth, predictable deceleration behind other cars.

**Lateral.** The first lane-change logic used timers and flags, and it oscillated. The car would start a new avoidance while already in one and wiggle across the lane. We replaced it with a three-state machine. From `DEFAULT` the car enters `CHANGING_LANE` and commits to the maneuver until it finishes. It then enters `COOLDOWN` to settle before it may consider another change. This removed the oscillation.

### Results

Tracking, localization and detection held up in the race. Avoidance at speed did not. The car detected obstacles but started lane changes too late, so it often reached its emergency-stop distance before the maneuver finished and came to a full stop instead of passing. That latency kept us from completing the race cleanly.

### Takeaways

- Multi-stage maneuvers need explicit states; timers and flags were not enough.
- Building control on the most stable measurement (distance) paid off over a richer but noisy one.
- Data is the lever for perception. Next is an active-learning loop that flags close and overlapping cases for labeling.
- The real bottleneck is decision latency: avoidance must trigger earlier, possibly with fused sensor cues for the state transitions.
