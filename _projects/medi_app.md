---
layout: page
title: MEDi
description: An AI-driven platform to help visually impaired individuals identify pharmaceutical products.
img: assets/img/medi_app/MEDi_logo.jpeg
importance: 2
category: personal
---

Project Link: [https://github.com/2nd-Company/MEDi](https://github.com/2nd-Company/MEDi)

<div align="center">
  <img src="/assets/img/medi_app/MEDi_logo.jpeg" alt="MEDi Logo" width="200">
</div>
<div align="center">
  <h2>MEDi</h2>
</div>
<p align="center">AI-driven medication detection platform</p>

---

### **1. Overview**

Hello, we are a startup named **2nd Company**, creating an AI-driven platform designed to assist visually impaired individuals in efficiently and accurately identifying pharmaceutical products in stores.

To prevent medication misuse, we developed a way to guide pharmaceutical shopping effectively. In February 2025, we launched a platform called MEDi. 

**MEDi** provides step-by-step shopping guide agents by utilizing hand-tracking and object detection rather than broad assistance. For added convenience, we also offer audible recognition features essential for users to navigate their shopping experience with ease and confidence.

The **MEDi** team is constantly striving to improve and develop the platform, setting goals to provide accurate information and a user-friendly UI/UX. We are deeply committed to continually enhancing the environment for people who often remain in the shadows, ensuring they have access to tools that empower their daily lives.

---

### **2. The Challenge: The Visually Impaired Shopper's Experience**

The primary motivation for this application stems from the significant challenges visually impaired individuals face when identifying and managing medications. Safe and effective medication use depends on access to clear, accurate information, which is often unavailable on standard packaging.

*   **Identification & Safety Hurdles**: Many medications come in similar packaging, making it difficult to distinguish between them without sight. This can lead to dangerous medication errors. Reading small-print instructions, dosages, and warnings on labels is a major obstacle.

*   **Profound Information Deficit**: The most critical barrier is the lack of access to crucial information. Expiration dates, potential side effects, and allergen warnings are vital for safety but are inaccessible on standard packaging. Braille is almost never present on pharmaceutical products.

*   **Limitations of Existing Tools**: While general-purpose magnification or reading apps exist, they are not tailored for the specific task of medication identification. They can be slow, provide non-contextual information, and may not be reliable for the critical task of reading medical text, leading to cognitive overload and potential errors.

This analysis crystalized the need for a proactive, interactive, and contextually-aware system designed specifically for identifying medications and providing guided, relevant assistance.

---

### **3. System Architecture & Technology Stack**

The application is built on a sophisticated, multi-stage system architecture designed to facilitate a seamless interactive loop between the user and their environment. The entire pipeline is optimized for on-device performance to ensure low latency and user privacy.

*   **Prototyping & Learning Platform**:
    *   **Hardware**: Android Device

*   **Mobile Development Environment**:
    *   **IDE**: Android Studio
    *   **Build System**: Gradle for managing dependencies like TensorFlow Lite and MediaPipe.
    *   **Core Frameworks**:
        *   **TensorFlow Lite**: For high-performance, on-device inference of our computer vision models.
        *   **Google MediaPipe**: For robust, real-time hand landmark detection.
    *   **Language & Tools**: Kotlin with the Android NDK for integrating high-performance C++ libraries.

The system's logic follows a continuous guidance loop, orchestrated from user input to system output. The application's architecture translates a user's spoken request into real-time visual analysis and back into audible guidance, creating a seamless interactive loop.

---

### **4. Dataset Collection & Preparation Strategy**

A robust object detection model requires a high-quality, diverse dataset. We adopted a pragmatic, hybrid strategy to combine the high fidelity of real-world data with the scalability of synthetic data.

*   **Data Sources**:
    1.  **Direct Capture (Real Data)**: We captured video of beverages at an on-campus convenience store. This data, perfectly representing the target environment, was used exclusively for the validation and test sets to ensure an unbiased measure of true performance.
    2.  **Web Crawling (Synthetic Data)**: To overcome the bottleneck of manual labeling, we leveraged standardized product images from Google. We used these to synthetically generate 2,000 training images.

*   **Data Platform**: We used **Roboflow** as a comprehensive platform for dataset management, annotation, and augmentation. Augmentations like altering brightness, contrast, and rotation were applied to make the model more robust to real-world environmental variations.

---

### **5. Model Development & Optimization**

Our evaluation focused on the industry-standard metric of mean Average Precision (mAP), which provides a comprehensive summary of model performance across all object classes.

*   **Evaluation Metric**: The mAP score is the mean of the Average Precision (AP) scores for each class. AP itself summarizes the precision-recall curve, providing a robust measure of a model's performance in both finding all relevant objects (recall) and ensuring its predictions are correct (precision).

*   **Performance Results**: After training, our model was tested on the holdout set of 20 real-world images, achieving a final **mAP of 0.76**. This is a strong and highly commendable result for a prototype system operating in such a challenging domain.

The variance in AP scores provides a clear path for future improvement: collecting more training examples for lower-scoring classes like "Zzzquil" can help boost their performance.

---

### **6. Core Technologies**

The application's functionality is driven by the intelligent fusion of two distinct, real-time AI models.

#### **6.1 Core Challenge 1: Real-Time Object Detection on Crowded Shelves**

Detecting products on a dense retail shelf is a difficult computer vision problem due to severe occlusion, clutter, and variations in lighting and product placement. Our hybrid dataset and robust model training produced a system capable of handling these challenges in real-time.

#### **6.2 Core Challenge 2: Intuitive Interaction via Hand Landmark Detection**

To create a truly intuitive interface, we moved beyond purely verbal commands and empowered the user to simply **point**. This paradigm is enabled by a second AI model that transforms the user's hand into a natural input device.

*   **Technology**: We integrated **Google's MediaPipe Hand Landmarker**, a state-of-the-art solution for real-time, on-device hand tracking. Using a powerful, pre-built framework allowed us to focus our development efforts on the unsolved, domain-specific problem of product detection.

*   **Implementation**: The system fuses the outputs from the two AI pipelines. It extracts the coordinate of the user's index fingertip from the hand landmark model and performs a geometric test to see if it falls within the bounding box of any product detected by the object recognition model. This allows the system to confirm a user's selection ("Yes, that is Pocari") or provide corrective feedback ("You are pointing at Powerade. Pocari is to the right").

---

### **7. Results & Outcome**

The project successfully produced a functional proof-of-concept that validates our core approach. The final Android application demonstrates the feasibility of using a complex, on-device AI pipeline to solve a real-world accessibility problem. The **mAP score of 0.76** on a real-world test set confirms that the vision model is performing at a level sufficient for a compelling demonstration.

#### **Screenshots 📱**
<div class="row justify-content-sm-center mt-2">
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/medi_app/Screenshot1.jpeg" title="Screenshot 1" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/medi_app/Screenshot2.jpeg" title="Screenshot 2" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/medi_app/Screenshot3.jpeg" title="Screenshot 3" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="row justify-content-sm-center mt-3">
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/medi_app/Screenshot4.jpeg" title="Screenshot 4" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/medi_app/Screenshot5.jpeg" title="Screenshot 5" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/medi_app/Screenshot6.jpeg" title="Screenshot 6" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

---

### **8. Technical Contributions & Lessons Learned**

During the development of MEDi, I took the lead in solving a critical performance bottleneck in our on-device inference pipeline. The initial model exhibited high latency on mobile hardware, making the real-time guidance feature unreliable. To address this, I implemented a two-pronged optimization strategy. First, I migrated the object detection model to TensorFlow Lite and applied quantization techniques, which significantly reduced the model size while maintaining our target accuracy of **0.76 mAP**. Second, I re-architected the data flow to process the hand-tracking and object detection streams asynchronously. These optimizations substantially reduced processing latency, resulting in a smooth and responsive user experience. This project was a valuable experience in optimizing AI models for resource-constrained environments, strengthening my ability to build practical, scalable AI products.

---

### **9. Conclusion & Future Work**

The MEDi app successfully proves the viability of its core technological approach. The path forward lies in systematically expanding its capabilities to create a holistic solution that addresses the full spectrum of challenges faced by visually impaired shoppers.

*   **Model Expansion and Scalability**: The immediate next step is to expand the object detection model to include a comprehensive database of pharmaceutical products, requiring a significant data collection and labeling effort.

*   **Enhanced Functional Capabilities**: Future development should focus on integrating new AI models to address other identified user needs:
    *   **Optical Character Recognition (OCR)**: To read prescription labels, dosages, warnings, and, most critically, expiration dates from packaging.
    *   **General Navigation**: To assist with navigating complex pharmacy environments.

*   **Increased Robustness**: Future work must focus on improving the system's reliability in a wider variety of "open environment" conditions, including diverse pharmacy layouts, lighting, and packaging variations.

---

#### **Download ⬇️**

https://play.google.com/apps/testing/com.MedI

MEDi is currently having a beta testing process.

---

#### **Permissions 🔒**

Camera permission is required to proceed to the Medication Detection phase.

---

#### **License**
This repository has been created as a part of the ongoing development of the [MEDi](https://github.com/2nd-Company/MEDi) project.

The work in this repository is licensed under the [MIT](https://github.com/2nd-Company/MEDi/blob/main/LICENSE) license.

Copyright (c) 2025 2nd Company

---

#### **Contact**

[Sungjoo Kim](https://github.com/junesjukim) 
- https://www.linkedin.com/in/sungjoo-kim-june777 
- junesjukim@gmail.com

[Ethan Park](https://github.com/ethansjpark) 
- https://www.linkedin.com/in/esjp/
- ethansjpark@gmail.com

Project Link: [https://github.com/2nd-Company/MEDi](https://github.com/2nd-Company/MEDi)

---

#### **Built With**
* [![TensorFlow Lite][TensorFlow]][TensorFlowLite-url]
* [![Kotlin-l][Kotlin]][Kotlin-url]

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/2nd-Company/MEDi?style=for-the-badge&color=green
[contributors-url]: https://github.com/2nd-Company/MEDi/contributors
[license-shield]: https://img.shields.io/github/license/2nd-Company/Medi?style=for-the-badge
[license-url]: https://github.com/2nd-Company/MEDi/blob/main/LICENSE 
[linkedin-shield]: /assets/img/Linkedin.png
[github-surl]: https://github.com/junesjukim
[github-eurl]: https://github.com/ethansjpark
[linkedin-surl]: https://www.linkedin.com/in/sungjoo-kim-june777
[linkedin-eurl]: https://www.linkedin.com/in/esjp/
[TensorFlow]: https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white
[TensorFlowLite-url]: https://ai.google.dev/edge/lite/
[Kotlin]: https://img.shields.io/badge/kotlin-%237F52FF.svg?style=for-the-badge&logo=kotlin&logoColor=white
[Kotlin-url]: https://kotlinlang.org/ 