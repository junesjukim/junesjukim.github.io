---
layout: project
title: Unmanned Orchard Robot
tagline: A low-cost ROS robot that navigates GPS-denied orchard rows and maps healthy and diseased fruit in real time.
description: Vision-based autonomous guidance and yield monitoring for orchards.
kind: Robotics
importance: 3
thumb: /assets/img/thumbs/orchard-robot.jpg
context: Agricultural Robot Competition, Rural Development Administration
recognition: Grand Prize
award: Grand Prize
stack: [ROS Melodic, GMapping SLAM, YOLOv5n, Jetson Nano, RPLiDAR]
hero:
  video: /assets/img/unmanned_orchard_full_demo.mp4
  caption: Full autonomous run with navigation, detection, and mapping.
highlights:
  - "**LiDAR SLAM** (GMapping) with wheel odometry to navigate under dense canopy with no GPS."
  - "YOLOv5n tuned for the Jetson Nano: **97% test accuracy** on tree, healthy fruit, and diseased fruit."
  - "A **diversity-first dataset** built from systematic distance, angle, and lighting sweeps with bias correction, then fine-tuned on competition data."
  - "**Three hardware iterations** on camera placement to get complete fruit counts."
---

### Problem

Orchards are a hard place for a small robot. The canopy blocks GPS, rows are irregular and cluttered with obstacles, and light changes with time of day and weather. The competition, run by Korea's Rural Development Administration, asked teams to drive a mock orchard autonomously, find every tree, and report where the healthy and diseased fruit were. Our goal was to do this on a low-cost platform with only cameras and a 2D LiDAR.

### System

The robot is a TurtleBot3 Burger with the compute and sensors swapped out:

| Component | Choice |
|---|---|
| Compute | NVIDIA Jetson Nano |
| Navigation sensor | RPLiDAR A2M8 (2D LiDAR) |
| Vision | 2 x Logitech C270 webcams |
| Motor control | OpenCR 1.0 with Dynamixel motors |
| Software | Ubuntu 18.04, ROS Melodic, GMapping, PyTorch, OpenCV |

Navigation uses GMapping SLAM: the LiDAR maps tree trunks and obstacles, and wheel odometry from the Dynamixels keeps the pose estimate consistent between scans, so the robot can follow rows without GPS. While it drives, the detector runs on the camera streams and each detection is tied to the robot's position on the map.

<div class="fig-row">
  <figure>
    <img src="/assets/img/unmanned_orchard_hardware_overview.png" alt="Hardware block diagram: two RGB cameras to single board computer, OpenCR, Dynamixel wheels, LiDAR, battery" loading="lazy">
    <figcaption>Hardware layout: cameras feed the Jetson Nano; the OpenCR board drives the wheels and powers the LiDAR.</figcaption>
  </figure>
  <figure>
    <img src="/assets/img/unmanned_orchard_algorithm_overview.jpg" alt="Software flow: camera and LiDAR feed odometry, drive, and detection loop" loading="lazy">
    <figcaption>Runtime loop: odometry, driving, and detection run together from start to finish.</figcaption>
  </figure>
</div>

Most of the hardware work went into the cameras. We rebuilt the camera mount three times, changing camera type, position, and tilt. Our first side-facing layout missed fruit in the middle of the tree and undercounted; the final version mounts both webcams higher with a tilt chosen to cover the canopy, which gave complete counts.

<div class="fig-row">
  <figure>
    <img src="/assets/img/unmanned_orchard_hardware_v1.jpg" alt="First prototype with ribbon-cable cameras" loading="lazy">
    <figcaption>Stage 1 prototype.</figcaption>
  </figure>
  <figure>
    <img src="/assets/img/unmanned_orchard_hardware_v2.jpg" alt="Second prototype with repositioned cameras" loading="lazy">
    <figcaption>Stage 2: cameras repositioned.</figcaption>
  </figure>
  <figure>
    <img src="/assets/img/unmanned_orchard_hardware_2.jpg" alt="Competition robot with two Logitech webcams mounted high" loading="lazy">
    <figcaption>Stage 3: the competition build.</figcaption>
  </figure>
</div>

### Data

The detector has three classes: tree, healthy fruit, and diseased fruit. Rather than collecting as many images as possible, we planned the lab dataset as a sweep: every combination of 0–5 healthy and 0–2 diseased fruit, at 3 camera distances and 10 angles, with the fruit repositioned once. We then checked it for bias and patched the gaps:

- **Scale.** Most fruit appeared small, so we added close-up shots (30 images across healthy/diseased count combinations).
- **Viewpoint.** 180-degree rotations with repositioning, so the model does not depend on a frontal view.
- **Lighting.** Deliberate variation in lighting and camera settings.

The final lab set had 786 images. We added 345 images from the competition environment to adapt to the real cameras and lighting.

<figure>
  <video src="/assets/img/unmanned_orchard_dataset_collection.mp4" autoplay muted loop playsinline controls preload="metadata"></video>
  <figcaption>Collecting the lab dataset by sweeping distance and angle around a staged tree.</figcaption>
</figure>

### Model

We started with YOLOv5s on COCO-pretrained weights and moved to YOLOv5n so it would run in real time on the Jetson Nano. Training ran for 200 epochs with early stopping off, keeping the best checkpoint, and used YOLOv5's automatic anchor fitting and mosaic augmentation. The model reached 97% accuracy on the test set. Per-class recall on the validation set was 1.00 for trees, 0.99 for healthy fruit, and 0.97 for diseased fruit, and F1 across all classes peaked at 0.99 at a confidence threshold of 0.677.

<div class="fig-row">
  <figure>
    <img src="/assets/img/unmanned_orchard_confusion_matrix.png" alt="Normalized confusion matrix for tree, fruit, and sick fruit classes" loading="lazy">
    <figcaption>Normalized confusion matrix. Most remaining errors are background false positives.</figcaption>
  </figure>
  <figure>
    <img src="/assets/img/unmanned_orchard_confidence_matrix.png" alt="F1 versus confidence curve per class" loading="lazy">
    <figcaption>F1 against confidence threshold, per class and overall.</figcaption>
  </figure>
</div>

### Results

In the competition's mock orchard, the robot drove the rows on its own, detected every target tree, and produced a position map of healthy and diseased fruit. The project won the Grand Prize at the 60th-anniversary Agricultural Robot Competition.

<figure>
  <video src="/assets/img/unmanned_orchard_ai_detection_2.mp4" autoplay muted loop playsinline controls preload="metadata"></video>
  <figcaption>On-board detections of trees, healthy fruit, and diseased fruit on the Jetson Nano.</figcaption>
</figure>

### Takeaways

- **Plan the dataset.** A small dataset designed around distance, angle, count, and lighting, then audited for bias, beat simply collecting more. A model trained only on lab data outperformed one trained on mixed lab and competition data.
- **Camera geometry is part of the model.** Changing the camera's frame width changed the proportions of targets in the image, and we had to retrain. Rotation augmentation needed care too, since trees are strongly vertical.
- **The edge device sets the architecture.** The Jetson Nano's budget decided the move from YOLOv5s to YOLOv5n.

Next steps would be testing in a real orchard, adding a manipulator for harvesting, visual-inertial SLAM for more reliable long-run localization, and more fruit and disease types.
