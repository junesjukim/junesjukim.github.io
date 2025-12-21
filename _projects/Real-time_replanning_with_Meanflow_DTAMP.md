---
layout: page
title: Robust Hierarchical Planning with Meanflow-DTAMP
description: Developing a high-speed planning system using one-step sampling and latent representation analysis for complex manipulation.
img: assets/img/research_robot/dtamp_thumb.png
importance: 1
category: work
---

<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        
    </div>
</div>
<div class="caption">
    [cite_start]Testing Meanflow-DTAMP in the OGBench environment: complex multi-stage tasks like unlocking and opening drawers[cite: 346, 352].
</div>

---

### **1. Overview**

[cite_start]This project focused on **DTAMP (Diffusion-based Trajectory and Motion Planning)**, a framework that uses generative models to plan complex robot movements[cite: 343]. [cite_start]I improved this system by adding **Meanflow**, a technique that allows the model to "plan" its entire path in just **one single step**[cite: 353, 361]. [cite_start]This speed allows the robot to instantly fix its path if it is disturbed, a process known as **Replanning**[cite: 345, 492].

---

### **2. The Challenge: Long-Horizon Manipulation**

[cite_start]In tasks like **OGBench**, the robot must perform sequences of actions where the next step depends on the success of the last (e.g., unlocking a button before opening a window)[cite: 271, 352]. 
* **One-Step Sampling**: Traditional models take too long to replan. [cite_start]We need "one-step" inference for real-time reactivity[cite: 353].
* [cite_start]**Representation Analysis**: We need to know if the model "understands" the goal properly before it starts moving[cite: 503].

---

### **3. Methodology: Meanflow and Latent Analysis**

#### **3.1 Meanflow: One-Step Planning**
[cite_start]I implemented a **Meanflow** sampler that learns the average velocity of trajectories[cite: 353]. [cite_start]This allows the robot to generate a full motion plan instantly[cite: 482].

#### **3.2 Target Interval Conditioning**
[cite_start]I improved the quality of plans by conditioning the model on the temporal interval ($\Delta$) of the sampled sequence[cite: 483, 486]. [cite_start]This ensures intermediate "milestones" are physically realistic[cite: 489].

---

### **4. Representation Analysis (UMAP)**

[cite_start]To understand the model's internal "thinking," I used **UMAP** to project complex goal embeddings into 2D maps[cite: 503]. 

* [cite_start]**Milestone Quality**: I checked if the generated milestones matched the training data distribution[cite: 503].
* [cite_start]**Failure Detection**: By visualizing the latent space, I could identify when the robot was confused and needed to trigger a **Replanning** phase[cite: 492].



---

### **5. Results & Contributions**

* [cite_start]**One-Step Sampling Success**: My Meanflow implementation achieved a success rate of **75** in the Kitchen task while using only **1 step**, proving it is ready for high-speed deployment[cite: 474, 476].
* [cite_start]**Robust Replanning**: The system effectively handled multi-stage interactions by generating and correcting milestones in real-time[cite: 351].
* [cite_start]**Simulation Scaling**: Gained experience setting up large-scale experiments in **Isaac Sim** and **Isaac Lab** for humanoid and manipulation tasks[cite: 183, 184].

---

#### **Contact**
**Sungjoo Kim**
- [GitHub](https://github.com/junesjukim) | [LinkedIn](https://www.linkedin.com/in/sungjoo-kim-june777)