---
layout: page
title: Unmanned Orchard Robot
description: Vision-Based Autonomous Guidance and Yield Monitoring
img: assets/img/unmanned_orchard_hardware_1.jpg
importance: 4
category: work
---

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/unmanned_orchard_hardware_1.jpg" title="Unmanned Orchard Robot Hardware" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The unmanned robot designed for autonomous orchard management and fruit monitoring.
</div>

---

### **1. Overview**

This project introduces a **ROS-based autonomous robot** designed for modernizing orchard management. By leveraging computer vision and SLAM, the robot can navigate orchard rows, monitor fruit growth status, and detect diseases in real-time. This system aims to solve critical challenges in precision agriculture, such as labor shortages and the need for timely data-driven interventions. Our key achievement was the development of a fully integrated platform that successfully performed these tasks in a complex environment, ultimately winning the **Grand Prize at the Agricultural Robot Competition** hosted by the Rural Development Administration of Korea.

<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include video.liquid path="assets/img/unmanned_orchard_full_demo.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
</div>
<div class="caption">
    Complete demonstration of the unmanned orchard robot in action, showcasing autonomous navigation and fruit detection capabilities.
</div>

---

### **2. The Challenge: Precision Agriculture in Orchards**

Orchard environments pose unique challenges for automation. 
*   **GNSS-Denied Environment:** Dense canopies block GPS signals, making standard navigation methods unreliable.
*   **Unstructured Terrain:** Irregular row spacing and scattered obstacles require robust perception and dynamic path planning.
*   **Variable Conditions:** Fluctuating light and weather conditions demand a vision system that is resilient to change.

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/unmanned_orchard_environment.jpg" title="Challenging Orchard Environment" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The real orchard environment presents major challenges for autonomous robots: deep tree shade, irregular terrain, various obstacles, and rapidly changing lighting conditions depending on time and weather. Overcoming these complexities was a core challenge of this project.
</div>

Our goal was to build a cost-effective robot that could reliably operate under these constraints using primarily vision and LiDAR sensors.

---

### **3. System Architecture & Hardware**

The robot is built on a modular hardware and software architecture to ensure flexibility and robustness.

<div class="row justify-content-sm-center">
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/unmanned_orchard_hardware_overview.png" title="Hardware Architecture Overview" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/unmanned_orchard_algorithm_overview.jpg" title="Algorithmic System Overview" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    **Left:** Hardware architecture overview showing system components and their interconnections. **Right:** Algorithmic workflow demonstrating the integration of SLAM navigation and computer vision for autonomous orchard management.
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
    *   **Key Libraries**: `GMapping` for SLAM, `PyTorch` for deep learning, `OpenCV` for image processing.

---

### **4. Dataset Collection & Preparation Strategy**

To develop a robust fruit detection system, we implemented a systematic and comprehensive dataset preparation strategy that emphasized diversity and bias reduction.

<div class="row justify-content-sm-center">
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include video.liquid path="assets/img/unmanned_orchard_dataset_collection.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include video.liquid path="assets/img/unmanned_orchard_dataset.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
</div>
<div class="caption">
    **Left:** Dataset collection process showing systematic data capture from multiple angles and distances. **Right:** Overview of the diverse dataset including different fruit conditions and environmental scenarios.
</div>

#### **4.1 Initial Laboratory Dataset (793 images)**
We first created a controlled dataset in our laboratory environment to establish baseline performance:
- **Fruit Combinations**: Healthy fruits (0-5), Diseased fruits (0-2)
- **Distance Variations**: 3 different camera-to-tree distances
- **Angular Coverage**: 10 different angles per setup
- **Position Adjustments**: Complete fruit repositioning for 2x variation
- **Total Systematic Combinations**: 6×3×3×10×2 = 1,080 planned images

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/unmanned_orchard_yolov5_mosaicaugmentation.jpg" title="YOLOv5 Mosaic Augmentation Example" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Example of YOLOv5's Mosaic Augmentation technique applied to our orchard dataset, combining multiple images to increase training robustness.
</div>

#### **4.2 Bias Reduction Strategies**
To address potential data biases, we implemented several corrective measures:

1. **Scale Bias Correction**: Added close-up fruit images to counteract the bias toward small-scale fruits
   - Healthy fruits: 2, 1, 0 configurations
   - Diseased fruits: 4, 3, 2, 1, 0 configurations  
   - 2 images per configuration: 3×5×2 = 30 additional images

<div class="row justify-content-sm-center">
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/unmanned_orchard_scaled_dataset.jpg" title="Scale Bias Correction - Various Fruit Scales" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/unmanned_orchard_scaled_dataset_2.jpg" title="Close-up Dataset Examples" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    **Left:** Examples of various fruit scales in the dataset showing different distances and sizes to reduce scale bias. **Right:** Close-up fruit images added to counteract small-scale bias, featuring different configurations of healthy and diseased fruits.
</div>

2. **Angular Diversity**: 180-degree rotation captures with repositioning to handle non-frontal detection scenarios

3. **Environmental Adaptation**: Systematic variation in lighting conditions and camera settings

**Final Lab Dataset**: 786 images with rich diversity and minimal bias

#### **4.3 Competition Environment Adaptation (345 images)**
- **Transfer Learning Strategy**: Used lab dataset for pre-training, then fine-tuned with competition environment data
- **Camera-Specific Tuning**: Adapted to actual camera specifications, lighting, and field conditions
- **Validation**: Lab-only model (best.pt) outperformed mixed-data model, confirming our diversity-first approach

---

### **5. Model Development & Optimization**

#### **5.1 Model Selection & Evolution**

<div class="row justify-content-sm-center align-items-stretch">
    <div class="col-sm-5 mt-3 mt-md-0 d-flex">
        <div class="w-100">
            {% include figure.liquid path="assets/img/unmanned_orchard_train_result.jpg" title="Training Results Comparison" class="img-fluid rounded z-depth-1" %}
        </div>
    </div>
    <div class="col-sm-5 mt-3 mt-md-0 d-flex">
        <div class="w-100">
            {% include figure.liquid path="assets/img/unmanned_orchard_confidence_matrix.png" title="Model Confidence Analysis" class="img-fluid rounded z-depth-1" %}
        </div>
    </div>
</div>
<div class="caption">
    **Left:** Comprehensive training results showing loss curves and performance metrics across different model iterations. **Right:** Model confidence analysis demonstrating prediction reliability and uncertainty quantification across different classes.
</div>

**Model Evolution Process:**
1. **Initial Model**: YOLOv5s with pretrained COCO weights
2. **Optimization**: Transitioned to YOLOv5n for Jetson Nano compatibility
3. **Transfer Learning**: Leveraged ImageNet and COCO pretrained weights over random initialization
4. **Edge Optimization**: Model specifically tuned for real-time inference on edge hardware

#### **5.2 Training Strategy**
- **Epochs**: 200 epochs with best model checkpoint saving
- **Early Stopping**: Disabled to ensure complete training convergence
- **Anchor Optimization**: YOLOv5's automatic anchor optimization using K-means and genetic algorithms
- **Auto-Scaling**: Automatic image size normalization for robust performance

<div class="row justify-content-center">
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/unmanned_orchard_confusion_matrix.png" title="Model Performance - Confusion Matrix" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Confusion matrix showing excellent classification performance across all three classes: Tree, Healthy Fruit (정상과), and Diseased Fruit (질병과).
</div>

#### **5.3 Technical Insights**
- **Bounding Box Adaptation**: Camera width changes required retraining due to target proportion variations
- **Rotation Sensitivity**: Simple rotation affected tree detection (vertical vs. horizontal orientation)
- **Mosaic Augmentation**: Enhanced model robustness through YOLOv5's advanced data augmentation

---

### **6. Core Technologies**

#### **6.1 Autonomous Navigation with SLAM**
To navigate without GPS, the robot uses the **GMapping SLAM** algorithm. The 2D LiDAR sensor scans the environment to build a map of tree trunks and other obstacles. This map, combined with wheel odometry data from the Dynamixel motors, allows the robot to accurately determine its position and navigate autonomously along the orchard rows.

#### **6.2 Real-time Fruit Detection & Classification**
Our YOLOv5n model performs real-time detection with the following specifications:
- **Classes**: Tree, Healthy Fruit, Diseased Fruit
- **Accuracy**: 97% on test dataset
- **Inference Speed**: Optimized for Jetson Nano real-time processing
- **Robustness**: Handles various lighting conditions and viewing angles

<div class="row justify-content-sm-center">
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include video.liquid path="assets/img/unmanned_orchard_ai_detection.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include video.liquid path="assets/img/unmanned_orchard_ai_detection_2.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
</div>
<div class="caption">
    Real-time demonstration of the YOLOv5n model identifying healthy and diseased fruits with high accuracy, showing bounding boxes and classification confidence scores optimized for edge computing.
</div>

---

### **7. Results & Competition Success**

The final integrated system was tested in a mock orchard environment. The robot successfully navigated the rows, detected all target trees, and created a position map of healthy and diseased fruits. The project's success was recognized with the **Grand Prize** at the 60th-anniversary Agricultural Robot Competition.

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/unmanned_orchard_competition_result.jpg" title="Competition Grand Prize Results" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Grand Prize award at the 60th Anniversary Agricultural Robot Competition hosted by the Rural Development Administration of Korea.
</div>

<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include video.liquid path="assets/img/unmanned_orchard_full_demo_2.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
</div>
<div class="caption">
    Competition demonstration showing the complete autonomous mission including navigation, fruit detection, and mapping capabilities.
</div>

**Key Achievements:**
- Successful autonomous navigation in GPS-denied environment
- 97% accuracy in fruit and disease detection with systematic dataset preparation
- Real-time processing on edge computing platform (Jetson Nano)
- Robust performance under various lighting and weather conditions
- Advanced data preparation strategy with bias reduction techniques
- **Grand Prize** winner at national agricultural robotics competition

---

### **8. Technical Contributions & Lessons Learned**

**Data Science Contributions:**
- Systematic dataset design methodology emphasizing diversity over quantity
- Bias identification and mitigation strategies for agricultural computer vision
- Transfer learning optimization for domain-specific applications
- Edge computing model optimization maintaining high accuracy

**Engineering Insights:**
- Camera-specific retraining necessity for bounding box accuracy
- Importance of angular diversity in agricultural object detection
- Edge hardware constraints driving model architecture decisions
- Integration challenges between SLAM navigation and computer vision systems

---

### **9. Conclusion & Future Work**

This project successfully demonstrated the feasibility of a low-cost, vision-based robot for orchard automation with a particular emphasis on rigorous data preparation and model optimization for edge computing environments.

**Technical Contributions:**
- Integration of SLAM navigation with computer vision for precision agriculture
- Edge-optimized deep learning model with systematic dataset preparation
- Robust system design for challenging outdoor environments
- Comprehensive bias reduction methodology for agricultural AI

**Potential next steps include:**
*   Testing and fine-tuning the system in real-world orchard environments
*   Integrating robotic manipulation for automated harvesting based on detection results
*   Improving long-term localization robustness with visual-inertial SLAM
*   Expanding detection capabilities to multiple fruit varieties and disease types
*   Scaling dataset preparation methodology for larger agricultural applications 