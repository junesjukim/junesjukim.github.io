---
layout: page
title: MEDi App
description: An interactive AI assistant for visually-impaired shoppers, enabling real-time product finding and navigation in retail stores using on-device computer vision and hand-tracking.
img: assets/img/medi_app_title.jpeg
importance: 2
category: work
---

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/medi_app_title.jpeg" title="The MEDi App in Action" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    MEDi: An AI-driven platform assisting visually impaired individuals with product identification in retail environments.
</div>

---

### **1. Overview**

This project, developed for the **2024 Summer Explore CSR AIoT Lab**, details the creation of the "Convenience Store Helper" (MEDi App), an assistive AIoT application for visually impaired individuals. The project moves beyond simple object recognition to create an interactive, real-time guidance system. Our core achievement is the successful implementation of a complex, multi-model AI pipeline on a mobile device, which interprets a user's spoken request for a product and provides intuitive, directional feedback to help them locate it. This system is designed to directly address the navigational, informational, and physical barriers that make retail environments challenging for visually impaired shoppers.

---

### **2. The Challenge: The Visually Impaired Shopper's Experience**

The primary motivation for this application stems from in-depth user research, including interviews with visually impaired individuals who frequent convenience stores. This research revealed a journey fraught with obstacles, validating the need for a more advanced assistive tool.

*   **Navigational and Physical Hurdles**: Users reported difficulty finding store entrances, locating key areas like the sales counter, and navigating aisles. Collisions with product displays are common, and retrieving items from high or low shelves is a significant challenge. Modern touch-screen appliances, like microwaves, are often unusable due to the lack of tactile feedback.

*   **Profound Information Deficit**: The most critical barrier is the lack of access to product information. Braille on packaging is exceedingly rare and often generic (e.g., "beverage"). This leaves users unable to determine a product's name, flavor, price, or, critically, its expiration date.

*   **Limitations of Existing Tools**: Our review of existing technologies revealed critical gaps. Reactive tools like "Show Now" require the user to find the product first, failing to solve the primary search problem. General-purpose apps like "Sullivan Plus" often provide excessive, non-contextual information, leading to cognitive overload.

This analysis crystalized the need for a proactive, interactive, and contextually-aware system that allows a user to state their intent and receive guided, relevant assistance.

---

### **3. System Architecture & Technology Stack**

The application is built on a sophisticated, multi-stage system architecture designed to facilitate a seamless interactive loop between the user and their environment. The entire pipeline is optimized for on-device performance to ensure low latency and user privacy.

*   **Prototyping & Learning Platform**:
    *   **Hardware**: Google Coral Dev Board with Edge TPU coprocessor. This platform was used during our "Ambient On-Device AI Bootcamp" to master the principles of on-device AI, including model optimization and quantization, before tackling the mobile environment.

*   **Mobile Development Environment**:
    *   **IDE**: Android Studio
    *   **Build System**: Gradle for managing dependencies like TensorFlow Lite and MediaPipe.
    *   **Core Frameworks**:
        *   **TensorFlow Lite**: For high-performance, on-device inference of our computer vision models.
        *   **Google MediaPipe**: For robust, real-time hand landmark detection.
    *   **Language & Tools**: Kotlin with the Android NDK for integrating high-performance C++ libraries.

The system's logic follows a continuous guidance loop, orchestrated from user input to system output.

<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/medi_app_flowchart.svg" title="Interactive Guidance Loop" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The application's architecture translates a user's spoken request into real-time visual analysis and back into audible guidance, creating a seamless interactive loop.
</div>

---

### **4. Dataset Collection & Preparation Strategy**

A robust object detection model requires a high-quality, diverse dataset. We adopted a pragmatic, hybrid strategy to combine the high fidelity of real-world data with the scalability of synthetic data.

*   **Data Sources**:
    1.  **Direct Capture (Real Data)**: We captured video of beverages at an on-campus convenience store. This data, perfectly representing the target environment, was used exclusively for the validation and test sets to ensure an unbiased measure of true performance.
    2.  **AI Hub (Synthetic Data)**: To overcome the bottleneck of manual labeling, we leveraged standardized product images from AI Hub, a South Korean government-backed data initiative. We used these to synthetically generate 2,000 training images.

*   **Data Platform**: We used **Roboflow** as a comprehensive platform for dataset management, annotation, and augmentation. Augmentations like altering brightness, contrast, and rotation were applied to make the model more robust to real-world environmental variations.

*   **Final Dataset Split**:

| Data Split | Type | Source | Image Count | Percentage |
| :--- | :--- | :--- | :--- | :--- |
| **Training Set** | Synthetic | AI Hub Data | 2000 | 82.0% |
| | Real | Direct Capture | 442 | 18.0% |
| **Validation Set** | Real | Direct Capture | 116 | 4.0% |
| **Test Set** | Real | Direct Capture | 20 | 1.0% |

---

### **5. Model Development & Optimization**

Our evaluation focused on the industry-standard metric of mean Average Precision (mAP), which provides a comprehensive summary of model performance across all object classes.

*   **Evaluation Metric**: The mAP score is the mean of the Average Precision (AP) scores for each class. AP itself summarizes the precision-recall curve, providing a robust measure of a model's performance in both finding all relevant objects (recall) and ensuring its predictions are correct (precision).

*   **Performance Results**: After training, our model was tested on the holdout set of 20 real-world images, achieving a final **mAP of 0.76**. This is a strong and highly commendable result for a prototype system operating in such a challenging domain.

*   **Per-Class Performance**:

| Product Class | Average Precision (AP) |
| :--- | :--- |
| Powerade | 0.73 |
| Pocari | 0.77 |
| Bong Bong Grape | 0.84 |
| Guronsan | 0.72 |
| Grinded Pear | 0.80 |
| Vita500 | 0.69 |
| Wisaengcheon | 0.74 |
| Hovenia | 0.79 |
| **Average (mAP)** | **0.76** |

The variance in AP scores provides a clear path for future improvement: collecting more training examples for lower-scoring classes like "Vita500" can help boost their performance.

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
    {% include figure.liquid path="assets/img/medi_app/screenshot1.jpeg" title="Screenshot 1" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/medi_app/screenshot2.jpeg" title="Screenshot 2" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/medi_app/screenshot3.jpeg" title="Screenshot 3" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="row justify-content-sm-center mt-3">
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/medi_app/screenshot4.jpeg" title="Screenshot 4" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/medi_app/screenshot5.jpeg" title="Screenshot 5" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/medi_app/screenshot6.jpeg" title="Screenshot 6" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

---

### **8. Technical Contributions & Lessons Learned**

*   **Innovative UI/UX**: The project's most innovative feature is its intuitive hand-pointing interface, which leverages a sophisticated hand-tracking model to create a natural and direct mode of interaction, moving beyond purely verbal feedback systems.

*   **Pragmatic Data Engineering**: We demonstrated a successful and pragmatic dataset strategy, combining real-world data for validation with scalable synthetic data for training, which was a key enabler of our prototype's success.

*   **On-Device AI Mastery**: The successful implementation of the entire multi-model system within a mobile Android environment demonstrates a mastery of on-device AI principles, including model optimization and building efficient, real-time data pipelines.

*   **Limitation as a Guide**: A key lesson was acknowledging the prototype's narrow scope. While it successfully finds a small catalog of products, our own research shows this is just one piece of a much larger puzzle. This limitation provides a clear roadmap for future work.

---

### **9. Conclusion & Future Work**

The "Convenience Store Helper" successfully proves the viability of its core technological approach. The path forward lies in systematically expanding its capabilities to create a holistic solution that addresses the full spectrum of challenges faced by visually impaired shoppers.

*   **Model Expansion and Scalability**: The immediate next step is to expand the object detection model to include hundreds of product categories beyond beverages, requiring a significant data collection and labeling effort.

*   **Enhanced Functional Capabilities**: Future development should focus on integrating new AI models to address other identified user needs:
    *   **Optical Character Recognition (OCR)**: To read prices, nutritional information, and, most critically, expiration dates.
    *   **General Navigation**: To assist with obstacle avoidance and guidance to key store landmarks like the checkout counter and exit.

*   **Increased Robustness**: Future work must focus on improving the system's reliability in a wider variety of "open environment" conditions, including diverse store layouts, lighting, and seasonal product displays.

Project Link: [https://github.com/2nd-Company/MEDi](https://github.com/2nd-Company/MEDi) 