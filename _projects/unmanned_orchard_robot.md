---
layout: page
title: Unmanned Orchard Robot
description: Vision-Based Autonomous Guidance and Yield Monitoring
img: assets/img/4.jpg
importance: 4
category: work
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/4.jpg" title="Unmanned Orchard Robot in Action" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The unmanned robot navigating a test environment designed to mimic a real orchard.
</div>

---

### **1. Overview**

This project introduces a **ROS-based autonomous robot** designed for modernizing orchard management. By leveraging computer vision and SLAM, the robot can navigate orchard rows, monitor fruit growth status, and detect diseases in real-time. This system aims to solve critical challenges in precision agriculture, such as labor shortages and the need for timely data-driven interventions. Our key achievement was the development of a fully integrated platform that successfully performed these tasks in a complex environment, ultimately winning the **Grand Prize at the Agricultural Robot Competition** hosted by the Rural Development Administration of Korea.

---

### **2. The Challenge: Precision Agriculture in Orchards**

Orchard environments pose unique challenges for automation. 
*   **GNSS-Denied Environment:** Dense canopies block GPS signals, making standard navigation methods unreliable.
*   **Unstructured Terrain:** Irregular row spacing and scattered obstacles require robust perception and dynamic path planning.
*   **Variable Conditions:** Fluctuating light and weather conditions demand a vision system that is resilient to change.

Our goal was to build a cost-effective robot that could reliably operate under these constraints using primarily vision and LiDAR sensors.

---

### **3. System Architecture**

The robot is built on a modular hardware and software architecture to ensure flexibility and robustness.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/system_diagram.jpg" title="Hardware Architecture" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-4 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/algorithm_overview.jpg" title="Software Flow" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    **Left:** A diagram of the core hardware components and their connections. **Right:** The high-level software process flow from sensing to action.
</div>

*   **Hardware Stack**:
    *   **Chassis**: TurtleBot3 Burger
    *   **Single Board Computer**: NVIDIA Jetson Nano
    *   **Primary Sensor (SLAM)**: RPLiDAR A2M8 2D LiDAR
    *   **Vision Sensors**: 2 x Logitech C270 Webcams
    *   **Controller**: OpenCR 1.0 with Dynamixel motors

*   **Software Stack**:
    *   **OS**: Ubuntu 18.04
    *   **Framework**: Robot Operating System (ROS1) Melodic
    *   **Key Libraries**: `GMapping` for SLAM, `Pytorch` for deep learning, `OpenCV` for image processing.

---

### **4. Core Technologies**

#### **Autonomous Navigation with SLAM**
To navigate without GPS, the robot uses the **GMapping SLAM** algorithm. The 2D LiDAR sensor scans the environment to build a map of tree trunks and other obstacles. This map, combined with wheel odometry data from the Dynamixel motors, allows the robot to accurately determine its position and navigate autonomously along the orchard rows.

*`[Here, you can add more technical details about the SLAM implementation, such as parameter tuning or how you handled sensor fusion. A GIF showing the map being built in RViz would be perfect here.]`*

#### **Fruit and Disease Detection with YOLOv5**
We developed a real-time object detection model to identify and classify fruits.
1.  **Data Collection**: We captured over 1,000 images from the testbed environment under various lighting conditions.
2.  **Model Training**: We fine-tuned a **YOLOv5n** model on a custom dataset with three classes: `Tree`, `Fruit`, and `SickFruit`. The model was optimized for performance on the edge (NVIDIA Jetson Nano).
3.  **Performance**: The final model achieved **97% accuracy** on the test set, demonstrating its ability to reliably detect targets for yield monitoring.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/yolo_detection_example.gif" title="Real-time Fruit Detection" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    A demonstration of the YOLOv5 model identifying healthy and sick fruits in real-time.
</div>

---

### **5. Results & Demonstration**

The final integrated system was tested in a mock orchard environment. The robot successfully navigated the rows, detected all target trees, and created a position map of healthy and diseased fruits. The project's success was recognized with the **Grand Prize** at the 60th-anniversary Agricultural Robot Competition.

*`[This is a great place to add a full video of the robot completing its mission. You can also add more images or a small gallery showing different aspects of the project.]`*

---

### **6. Conclusion & Future Work**
This project successfully demonstrated the feasibility of a low-cost, vision-based robot for orchard automation. The modular design allows for future enhancements.

Potential next steps include:
*   Testing and fine-tuning the system in a real-world orchard.
*   Integrating a robotic arm for automated harvesting or spot-spraying based on detection results.
*   Improving long-term localization robustness with advanced visual SLAM techniques. 