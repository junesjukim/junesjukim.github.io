---
layout: page
title: Urban Autonomous Racing
description: Building and racing a fully autonomous vehicle, focusing on robust state-based control systems and a custom perception data engine.
img: assets/img/urban_autonomous_racing_title.jpg
importance: 4
category: work
---

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/urban_autonomous_racing_title.jpg" title="2022 AI Robot Car Race" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The project team and participants at the 2022 Autonomous Driving Robot Race. This event was Korea’s first autonomous vehicle race with a simultaneous start, where teams competed in advanced self-driving technologies such as obstacle avoidance and mandatory lane changes on a real-world track.
</div>

---

### **1. Overview**

This project details the end-to-end development of an autonomous race car, from data collection to deployment in a live competition. Our most significant engineering achievement was designing a robust state machine for lateral control that solved critical high-speed instabilities—a common and challenging problem in real-world robotics. This portfolio outlines our data-centric approach to perception and our first-principles approach to vehicle control.

<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0 d-flex justify-content-center">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/6g1dRy3FMRg?si=fGUnJSEjoJ6GWHc5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
</div>
<div class="caption">
    Full, unedited footage of our vehicle's final run in the 2022 Autonomous Driving Robot Race. This video provides a complete overview of the system's performance in a live competition environment.
</div>

---

### **2. The Challenge: Urban Autonomous Racing**

Urban environments pose unique challenges for autonomous vehicles.
*   **Complex and Dynamic Environments:** Heavy traffic, unpredictable pedestrians, and complex road structures.
*   **Sensor Limitations:** Occlusions, adverse weather conditions, and sensor noise.
*   **Real-time Decision Making:** The need for fast and accurate perception, planning, and control.

The project was developed for the **2022 Segye AI Robot Car Race, hosted by Segye Ilbo**. This event, held at the Sunmun University  Campus, was the first autonomous racing competition in Korea to feature a simultaneous start. It introduced specific challenges such as navigating a 1.2km track for 10 laps, totaling over 12km, within a one-hour time limit. A key requirement was to perform dynamic obstacle avoidance, as organizers could place unexpected obstacles on the track to test lane-changing algorithms. Before the race, all vehicles had to pass a safety inspection, including a mandatory emergency stop test from a speed of at least 10 km/h. The competition consisted of a qualifying round (a single lap time trial to determine grid position) and a final race where all 7 vehicles started simultaneously. The primary goal was to complete the race without any collisions, emphasizing safety and reliability.

<div class="row justify-content-sm-center">
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include video.liquid path="assets/img/urban_autonomous_racing_road_obstacles.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include video.liquid path="assets/img/urban_autonomous_racing_simultaneous_starting.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
</div>
<div class="caption">
    **Left:** Dynamic obstacle avoidance during the race. **Right:** Simultaneous start of all competing vehicles.
</div>

---

### **3. System Architecture & Hardware**

#### **3.1 System Overview (Hardware & Software Stack)**

The vehicle is built on a modular hardware and software architecture to ensure flexibility and robustness.

*   **Hardware Stack**:
    *   **Chassis**: ERP42 UGV Platform
    *   **Compute**: NEOUSYS POC-545, NVIDIA Jetson Xavier
    *   **Primary Sensors**: Velodyne VLP-16 LiDAR, Logitech RGB Camera
    *   **GPS/IMU**: u-blox GPS, Low-cost IMU
    *   **Controller**: ERP42 Internal Motor Controller

*   **Software Stack**:
    *   **OS**: Ubuntu 18.04
    *   **Framework**: Robot Operating System (ROS1) Melodic
    *   **Key Libraries**: `OpenCV 3.2`, `PCL` for point cloud processing, `YOLOv5` for obstacle detection, `Gazebo by MORAI` for simulation, `Rviz` for visualization.

---

### **4. Dataset Collection & Preparation Strategy**

To develop a robust vehicle and road obstacle detection model that could be effectively fused with LiDAR sensor outputs, we implemented a systematic and comprehensive dataset preparation strategy. A calibrated RealSense depth camera was utilized for data collection, ensuring accurate alignment between vision and LiDAR modalities. The dataset was primarily focused from images captured at distances of 10 to 15 meters ahead of the vehicle and within an angle of up to 30 degrees, reflecting the operational range required for real-time obstacle avoidance.

The output of the vision model was intended to serve as the primary input for obstacle avoidance control, with detection beginning at 10 to 15 meters. For close-range emergency stops, we relied exclusively on the LiDAR sensor, and therefore, close obstacle detection was not a focus during vision model training.

The primary data source consisted of video recordings from a camera mounted on the vehicle during a previous competition. From over 56,000 frames, we extracted approximately 8,000 images by sampling every 7th frame to ensure diversity while managing redundancy. In addition, we specifically augmented the dataset with scenarios where obstacles appeared on the right side of the vehicle during left turn maneuvers, as these situations were identified as particularly challenging during real-world operation.

For efficient and collaborative labeling, we utilized **Roboflow**, a platform that streamlined the annotation process. Our team successfully labeled around 4,000 images, creating a high-quality dataset tailored to race-specific scenarios. This dataset was then split into training and validation sets to develop and fine-tune our detection model, with a portion reserved for final testing.

<div class="row justify-content-sm-center">
    <div class="col-sm-5 mt-3 mt-md-0">
        <div class="rounded z-depth-1" style="height: 250px; background-image: url('{{"/assets/img/urban_autonomous_racing_dataset.png" | relative_url }}'); background-size: cover; background-position: center;">
        </div>
    </div>
    <div class="col-sm-5 mt-3 mt-md-0">
        <div class="rounded z-depth-1" style="height: 250px; background-image: url('{{"/assets/img/urban_autonomous_racing_dataset_simulation.jpg" | relative_url }}'); background-size: cover; background-position: center;">
        </div>
    </div>
</div>
<div class="caption">
    **Left:** A glimpse into our extensive, custom-built dataset, featuring over 4,000 labeled images that capture a wide variety of real-world racing scenarios. **Right:** The simulated environment in which our models were rigorously tested, allowing for rapid iteration and validation of our autonomous driving algorithms.
</div>

---

### **5. Model Development & Optimization**

#### **5.1 Model Selection & Evolution**

We selected YOLOv5 for its balance of speed and accuracy, making it suitable for real-time object detection on our hardware. The model was trained on our custom dataset of ~4,000 labeled images. The training results showed excellent performance on the validation set, with the model effectively learning to identify vehicles in various racing scenarios. Analysis of the F1, Precision, and Recall curves indicated a well-generalized model. However, the label analysis also revealed some imbalance in the dataset, such as a concentration of objects at specific sizes, which informed areas for future data augmentation.

#### **5.2 Inference Analysis & Improvement Plan**

The model demonstrated robust object detection in general driving conditions, but inference analysis revealed limitations in specific scenarios:

*   **Detection Errors & Inaccurate Bounding Boxes:**
    *   The model frequently misidentified a vehicle's right wheel as a separate, smaller object, leading to duplicate detections.
    *   Bounding box predictions were often imprecise, with vehicle wheels partially cropped, resulting in an incorrect size.

*   **Poor Generalization to Unseen Scenarios:**
    *   The model failed to detect vehicles at very close ranges, as this scenario was absent from our training data.
    *   Overlapping vehicles, also missing from the dataset, were either not detected or were identified with an incorrectly small bounding box.

To address these issues and guide future development, we have outlined the following improvement plan:

*   **Data Augmentation & Hyperparameter Tuning:**
    *   For the misdetection and bounding box issues, we plan to add more relevant data to improve model accuracy. We can then raise the confidence threshold to filter out false positives.
    *   We enabled YOLOv5’s `--agnostic` NMS (Non-Maximal Suppression) to prevent duplicate detections across different classes and manually tune the `multi_label` parameter to adjust sensitivity to smaller objects.

*   **Edge-Case Data Enhancement:**
    *   To handle close-proximity and overlapping vehicle scenarios, we focused on collecting and labeling data that specifically covers these edge cases to enrich the dataset.

<div class="row justify-content-sm-center">
    <div class="col-sm-5 mt-3 mt-md-0">
        <div class="rounded z-depth-1" style="height: 250px; background-image: url('{{"/assets/img/urban_autonomous_racing_model_error_1.png" | relative_url }}'); background-size: cover; background-position: center;">
        </div>
    </div>
    <div class="col-sm-5 mt-3 mt-md-0">
        <div class="rounded z-depth-1" style="height: 250px; background-image: url('{{"/assets/img/urban_autonomous_racing_model_error_2.png" | relative_url }}'); background-size: cover; background-position: center;">
        </div>
    </div>
</div>
<div class="caption">
    **Left & Right:** Examples of model inference errors. The left image shows a case of duplicate detection where the vehicle's wheel is mistaken for a separate object. The right image illustrates incorrect bounding box sizing when vehicles are overlapping.
</div>

---

### **6. Core Technologies**

This section is structured around the core engineering challenges our team solved, mirroring the primary functions of the autonomous system.

#### **6.1 Path Tracking & Localization: Race Line Fidelity**
*   **Problem:** High-speed racing requires precise adherence to the pre-defined race line (RDDF). Any deviation, whether from GPS drift or suboptimal controller tuning, could lead to slower lap times or disengaging from the optimal path in tight corners.
*   **Solution:** We implemented a robust path tracking controller that continuously calculated the vehicle's lateral error to the path and commanded precise steering adjustments. The controller's look-ahead distance was tuned to balance aggressive cornering with high-speed stability. This ensured the vehicle remained on the optimal race line as its foundational state.

#### **6.2 Perception: Building a World Model**
*   **Challenge (LiDAR Processing):** Raw LiDAR point clouds are noisy and dense. The challenge was to reliably and quickly extract actionable information: the presence and location of nearby obstacles for the avoidance system.
*   **Solution (LiDAR Processing):** We developed a processing pipeline that segmented the 360-degree point cloud into three critical zones: forward, adjacent left, and adjacent right. By applying distance thresholds and filtering within these zones, we provided a clean, boolean state of lane occupancy to the decision-making logic, abstracting away the raw sensor complexity.
<br>
*   **Challenge (Vision Model):** For more advanced behaviors, we needed to identify *what* the obstacles were (e.g., another car). The primary challenge was the lack of a high-quality, race-specific dataset.
*   **Solution (Vision Model):** We built a custom "data engine," treating data as a first-class product. We systematically processed over 56,000 frames of race video and used Roboflow to manage a distributed labeling effort, yielding a high-quality, in-domain dataset of ~4,000 images. This tailored dataset was critical for training a robust YOLOv5 model that became the core of our vision-based perception system.

#### **6.3 Decision Making & Controls: High-Speed Maneuvering**
*   **Challenge (Longitudinal Control):** Maintaining a safe distance from a car ahead without jerky movements. Using raw relative velocity from sensors was too unstable for smooth control.
*   **Solution (Longitudinal Control):** We designed a robust proportional-derivative-like velocity controller: `Target Velocity = k * (d - s)^n`. This function used only the stable "distance to obstacle" measurement, resulting in smooth and predictable deceleration when following other vehicles.
<br>
*   **Challenge (Lateral Control):** The most critical challenge was control oscillation during lane changes. An initial attempt caused the vehicle to "wiggle" as it tried to initiate new avoidance maneuvers while already performing one—a classic problem in robotics.
*   **Solution (Lateral Control):** We engineered a formal state machine for lateral control. By defining three distinct states—`DEFAULT`, `CHANGING_LANE`, and `COOLDOWN`—we ensured the vehicle committed to a maneuver once initiated. The system would only re-evaluate its environment for a new lane change after the current one was fully completed and a brief cooldown period had passed for stabilization. This state-based architecture was the key to enabling clean, decisive, and safe high-speed lane changes.

---

### **7. Results**

The final integrated system was tested in a obstacled racing environment. The individual components like object detection and localization performed well, issue emerged during high-speed avoidance maneuvers. The vehicle successfully detected oncoming obstacles but often initiated the lane-change maneuver too late. This delay meant the car would reach its emergency stop distance before it could complete the avoidance, resulting in a full stop rather than a smooth lane change. This "wiggling" behavior, where the car hesitated before acting, was a key bottleneck that prevented successful race completion.

<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include video.liquid path="assets/img/urban_autonomous_racing_model_result.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
</div>
<div class="caption">
    Competition demonstration showing the complete autonomous mission including navigation, object detection, and decision making.
</div>

---

### **8. Technical Contributions & Lessons Learned**

**Data Science Contributions:**
- Created a high-quality, labeled dataset of ~4,000 images for vehicle detection in a racing context, using video from a live competition and the Roboflow platform.
- Successfully trained and validated a YOLOv5 model for real-time vehicle detection, achieving high performance and identifying specific areas for future improvement.

**Engineering Insights:**
- **The Challenge of Dependency Management**: A major insight was the extreme difficulty of creating a stable development environment with a complex web of version-specific dependencies (NVIDIA drivers, CUDA, OpenCV, ROS). This process proved to be a significant project bottleneck.
- **Strategic Adaptation**: The project highlighted the need for agility. Faced with development hurdles, the team effectively pivoted from an initial, complex camera-LiDAR fusion goal to a more pragmatic approach prioritizing a functional LiDAR-based system and using the first competition as a data gathering opportunity.
- **Robust Control Logic**: Developed a stable longitudinal velocity control algorithm based on distance and current speed, avoiding reliance on noisy relative velocity measurements which proved critical for safe following behavior.
- **State Management for Robust Maneuvers**: A critical insight was the necessity of a proper state machine for executing complex, multi-stage actions like lane changes. Simple approaches like timers or flags were insufficient and led to system instability. Implementing a state-based logic (e.g., `DEFAULT`, `CHANGING_LANE`, `COOLDOWN`) was key to achieving clean, reliable maneuvers without control oscillation.

---

### **9. Conclusion & Future Work**

This project successfully demonstrated the feasibility of a robust and reliable autonomous driving system for urban environments.

**Technical Contributions:**
- Developed a modular architecture for autonomous racing focused on **Tracking, Detection, and Avoidance**.
- Implemented a state-based lateral control algorithm for robust, stable lane change maneuvers.
- Implemented and refined a **LiDAR-based avoidance algorithm** and a **custom velocity control law** to navigate a dynamic race environment.

**Potential next steps include:**
*   Improving the decision-making latency for avoidance maneuvers to enable smoother, higher-speed lane changes.
*   Enriching the training dataset with more examples of overlapping and close-proximity vehicles to improve detection robustness.
*   Implementing an active learning loop to automatically flag challenging or underrepresented scenarios from new driving data for labeling, allowing us to systematically improve the perception model's robustness over time.
*   Refining the state transition conditions, potentially incorporating sensor fusion data for more robust triggers.
