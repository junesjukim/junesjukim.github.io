---
layout: page
title: Planning with Flowmatching
description: Optimizing real-time robotic control by transitioning from Diffusion to Flow Matching to reduce sampling steps and analyze dynamics errors.
img: assets/img/diffuser_kitchen.png
importance: 2
category: work
---



<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0 d-flex justify-content-center">
        {% include video.liquid path="assets/img/diffuser_kitchen.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
</div>
<div class="caption">
    Demonstration of Flow Matching for robotic trajectory planning.
</div>

---

### **1. Overview**

[cite_start]During my research internship at the **SNU Robot Learning Lab (RLLAB)**, I focused on making generative behavior models fast enough for real-world robot control[cite: 2, 505]. [cite_start]While Diffusion Models excel at creating complex actions, they are often too slow because they require many calculation steps[cite: 5, 48]. [cite_start]My research explored **Flow Matching (FM)** as a faster alternative[cite: 6, 509]. I optimized the system to maintain high performance even when significantly reducing the number of sampling steps, which is critical for robots that must react in milliseconds.

---

### **2. The Challenge: Speed vs. Performance**

In robotics, a controller must send commands very quickly (often 50Hz or more). Generative models face three main problems:
* [cite_start]**High Latency**: Standard diffusion requires too many steps to turn noise into a valid action for live robots[cite: 13, 516].
* [cite_start]**Step-Skipping Degradation**: When we try to save time by skipping steps, the quality of movement usually drops quickly[cite: 24, 527].
* [cite_start]**Dynamics Error**: Small mistakes in predicting the next state accumulate over time, causing the robot to shake or fail the task[cite: 292, 298].



---

### **3. Methodology: Transition to Flow Matching**

[cite_start]I modified the **jannerm/diffuser** framework to use Flow Matching instead of standard diffusion[cite: 4, 47]. 

#### **3.1 Optimal Transport Paths**
[cite_start]I implemented **Optimal Transport (OT) paths**, which create straighter, simpler mathematical routes for the model to follow[cite: 17, 520]. [cite_start]These paths are easier to learn and allow for faster sampling without losing accuracy[cite: 19, 522].

$$\psi_{t}(x_{0}|x_{1})=(1-(1-\sigma_{min})t)x_{0}+tx_{1}$$
$$\mu_{t}(x_{1})=tx_{1}, \sigma_{t}(x_{1})=1-(1-\sigma_{min})t$$

[cite_start][cite: 18, 521]



#### **3.2 Advanced Guidance Systems**
[cite_start]To ensure the robot moves toward a goal rather than randomly, I used **Advantage-based guidance**[cite: 317, 322]. [cite_start]By calculating the "Advantage" (using Q and V functions from IQL), I guided the model to generate paths that maximize success while minimizing physical errors[cite: 326, 331].

---

### **4. Key Experiments & Analysis**

#### **4.1 Sampling Efficiency (D4RL Benchmarks)**
[cite_start]I found that Flow Matching could achieve high scores even with only **1 to 4 steps**, whereas traditional models often need 20[cite: 25, 27].

#### **4.2 Handling Complex Tasks (Kitchen & Pen)**
[cite_start]I pushed the model further in complex environments like the **Franka Kitchen** and **Shadow Hand Pen**[cite: 28, 29, 30]. [cite_start]I analyzed how changing the model output to "denoised data" instead of "velocity" improved performance in these difficult tasks[cite: 202, 232].

---

### **5. Insights & Contributions**

* [cite_start]**Real-time Feasibility**: Identified the "trade-off" point where a robot can run at high speeds without failing[cite: 132].
* [cite_start]**Error Correction**: My analysis showed that **Dynamics Errors** spike after 100 steps, providing a clear target for where "replanning" is most needed[cite: 300].