---
layout: page
title: Fully automated hot dog vending machine
img: assets/img/research_robot/thumbnail.png # 연구 관련 대표 이미지 경로
importance: 1
category: personal
---

# Research Internship at SNU RLLAB

<div align="center">
  <img src="/assets/img/research_robot/lab_logo.png" alt="RLLAB Logo" width="300">
</div>
<div align="center">
  <h2>Efficiency & Representation Analysis of Flow Matching</h2>
</div>
<p align="center">Optimizing Diffusion-based Policies for Real-time Robotic Control</p>

---

### **1. Overview**

During my research internship at **SNU Robot Learning Lab (RLLAB)**, I focused on improving the inference efficiency of generative behavior models. While Diffusion Models show state-of-the-art performance in robotic manipulation, their iterative sampling process poses challenges for real-time control. 

My research explored **Flow Matching (FM)** as a faster alternative and investigated how **Step-skipping** affects performance across complex tasks like the Franka Kitchen and Shadow Hand Pen environments. Furthermore, I utilized **UMAP** to visualize the latent representations of **DTAMP**, providing a basis for efficient replanning strategies.

---

### **2. The Challenge: Real-time Generative Policy**

The primary bottleneck in deploying Diffusion-based Foundation Models in the physical world is **latency**. 

* **Inference Bottleneck**: Standard Diffusion models require dozens of denoising steps, which is often too slow for high-frequency (e.g., 50Hz+) robot control.
* **Performance vs. Speed Trade-off**: Aggressive step-skipping (reducing sampling steps) often leads to a sharp decline in success rates, especially in long-horizon tasks.
* **Lack of Interpretability**: Understanding how these models represent multi-modal action distributions is crucial for robust **Replanning** when the robot encounters unexpected disturbances.

---

### **3. Methodology & Research Stack**

I conducted extensive experiments to compare generative modeling techniques and their architectural variations.

* **Core Algorithms**:
    * **Diffuser**: The baseline diffusion model for trajectory generation.
    * **Flow Matching (FM)**: A simulation-free training objective for continuous-time normalizing flows, offering more efficient sampling paths.
    * **DTAMP (Diffusion-based Trajectory and Motion Planning)**: Integrating diffusion models with classical motion planning frameworks.
* **Environments**:
    * **Franka Kitchen**: Long-horizon multi-task manipulation.
    * **Shadow Hand Pen**: High-DoF (Degree of Freedom) dexterous manipulation.
    * **OGBench**: A comprehensive benchmark for offline goal-conditioned RL.
* **Tools**: Python, PyTorch, MuJoCo, UMAP, Git.

---

### **4. Key Experiments & Performance Analysis**

#### **4.1 Flow Matching vs. Diffusion**
I validated that Flow Matching-based policies converge faster during training and provide straighter probability paths, which is advantageous for fewer-step sampling compared to traditional Diffusion.

#### **4.2 Step-skipping & Performance Degradation**
I analyzed the "Critical Step Point" where performance begins to drop.
* **Finding**: In the **Kitchen** environment, decreasing steps below 5 led to a ~40% drop in success rate, whereas simpler tasks were more resilient. 
* **Insight**: The complexity of the task (multi-object interaction) directly correlates with the required sampling density of the generative model.

#### **4.3 Mean-flow & DTAMP Integration**
Experimented with **Mean-flow** to stabilize action generation. By averaging flow directions, I achieved smoother trajectories in the **OGBench** and **Pen** environments.

---

### **5. Representation Analysis for Replanning**

To understand the decision-making process of the DTAMP-based model, I implemented a **Representation Visualization** pipeline.

* **UMAP Visualization**: I projected the high-dimensional latent actions into a 2D space.
* **Result**: The visualization revealed distinct clusters for different sub-tasks (e.g., "opening a microwave" vs. "moving a kettle").
* **Replanning Insight**: By monitoring the trajectory in the latent space, we can identify when the robot deviates from the learned distribution, enabling more proactive and intelligent replanning.

---

### **6. Technical Contributions & Lessons Learned**

Through this research, I deepened my understanding of the mathematical foundations of **Physical AI**.

* **Optimization**: Successfully identified the trade-offs between sampling speed and manipulation accuracy, a critical factor for RLWRLD's Foundation Model development.
* **Analytic Skills**: Instead of just running benchmarks, I developed custom visualization tools (UMAP-based) to interpret model behavior, which is essential for debugging black-box AI models in robotics.
* **Scalability**: Gained experience handling complex multi-modal data in varied simulation environments (Kitchen, Pen), preparing me to contribute to large-scale VLA (Vision-Language-Action) models.

---

### **7. Visual Results (Simulations) 🤖**

<div class="row justify-content-sm-center mt-3">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/research_robot/kitchen_gif.gif" title="Franka Kitchen Experiment" class="img-fluid rounded z-depth-1" %}
    <p class="text-center">Franka Kitchen Task Execution</p>
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/research_robot/umap_plot.png" title="UMAP Visualization" class="img-fluid rounded z-depth-1" %}
    <p class="text-center">UMAP Latent Representation Analysis</p>
  </div>
</div>

---

#### **Contact**
**Sungjoo Kim**
- [GitHub](https://github.com/junesjukim)
- [LinkedIn](https://www.linkedin.com/in/sungjoo-kim-june777)
- junesjukim@gmail.com