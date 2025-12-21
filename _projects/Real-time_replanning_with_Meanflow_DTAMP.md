---
layout: page
title: Robust Replanning Integrating Mean Flow with DTAMP
description: Overcoming dynamics hallucination in long-horizon manipulation by integrating Mean Flow, Flow matching with DTAMP-based replanning strategies.
img: assets/img/dtamp.png
importance: 1
category: work
---

<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include video.liquid path="assets/img/dtamp_stats.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
</div>
<div class="caption">
    Demonstration of the robot performing a multi-stage manipulation task in the Ogbench environment using the Meanflow-DTAMP planner.
</div>

---

### **1. Overview**

Following my work on Flow Matching, I encountered significant limitations when scaling to long-horizon tasks in **Ogbench** and **Franka Kitchen**. While standard generative models could produce smooth trajectories, they lacked long-term consistency, often failing to chain multiple sub-tasks (e.g., opening a drawer, then grasping an object).

[cite_start]To address this, I pivoted to **DTAMP (Diffusion-based Task and Motion Planning)**, adapting it to utilize **Mean Flow** instead of stochastic diffusion[cite: 503, 510]. [cite_start]My objective was to enable **robust replanning** by leveraging the deterministic nature of Mean Flow to perform one-step lookaheads and milestone generation, ensuring the robot can recover from dynamics errors during execution[cite: 511, 513].

---

### **2. The Challenge: Dynamics Error & Hallucination**

Despite the speed of Flow Matching, my analysis revealed a critical "Dynamics Error" where the model's internal prediction drifted from physical reality.

* **Dynamics Hallucination:** [cite_start]In the Kitchen environment, I observed that the model would receive a reward for opening a shelf, yet the next predicted observation would hallucinate the shelf as closed[cite: 345, 346]. [cite_start]This disconnect stemmed from the lack of velocity data in the observation space[cite: 348, 349].
* **Error Accumulation:** [cite_start]Quantitative analysis showed that the $L2$ norm of the dynamics error spiked significantly after approximately **100 steps**, rendering open-loop planning unfeasible for long sequences[cite: 302].

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
         {% include figure.liquid path="assets/img/dynamics_error_spike.png" title="Dynamics Error Analysis" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [cite_start]Analysis of Dynamics Error over time. The error norm (blue line) spikes drastically around step 100, indicating the horizon limit for accurate open-loop prediction[cite: 301].
</div>

---

### **3. Methodology: Meanflow-DTAMP & Replanning**

To solve the dynamics mismatch, I integrated **Mean Flow** into the DTAMP framework to facilitate stable, closed-loop replanning.

#### **3.1 Mean Flow Matching**
[cite_start]Unlike standard diffusion which is stochastic, I implemented **Mean Flow**, which models the field of average velocity $u(z,r,t)$[cite: 639]. [cite_start]This deterministic approach aligns the generation process with the displacement vector, reducing variance and allowing for consistent one-step sampling that is crucial for real-time replanning[cite: 513, 639].

$$u(z_t, r, t) = v(z_t, t) - (t-r)\frac{d}{dt}u(z_t, r, t)$$

<div class="caption">
    [cite_start]Visualization of the average velocity field $u(z, r, t)$ in Mean Flow. The deterministic path ensures tighter alignment with the target trajectory compared to instantaneous velocity fields[cite: 639].
</div>

#### **3.2 DTAMP with Target Interval Conditioning**
[cite_start]I adopted the DTAMP architecture, which conditions the generator on a **target interval ($\Delta$)** between milestones[cite: 640]. [cite_start]This allows the planner to break down long-horizon tasks (like "Cube-double-play") into reachable sub-goals (milestones) $g_{1:K}$[cite: 641, 646].


#### **3.3 Closed-Loop Replanning Strategy**
[cite_start]I developed a replanning logic that monitors the distance between the current robot state and the generated milestone[cite: 433, 455].
* [cite_start]**Trigger:** If the robot fails to reach a milestone within a calculated timestep threshold, or if the trajectory deviates significantly, the system triggers a replan[cite: 456, 493].
* [cite_start]**Execution:** The system regenerates the next set of milestones based on the *actual* current state rather than the predicted state, correcting for the dynamics hallucination[cite: 489, 490].

---

### **4. Key Experiments & Analysis**

#### **4.1 Meanflow vs. Diffusion Performance**
[cite_start]I compared Meanflow against standard Diffusion and Flow Matching on the D4RL Kitchen benchmarks. Meanflow demonstrated superior stability, achieving competitive or higher scores in mixed environments[cite: 518, 532].

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/meanflow_performance.png" title="Meanflow vs Diffusion Performance" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [cite_start]Performance comparison on Kitchen-Mixed-v0. Meanflow (Green) consistently achieves high success rates (approx 74.5) even at varied step counts, outperforming standard flow matching in stability[cite: 532, 542].
</div>

#### **4.2 Ogbench Milestone Analysis**
[cite_start]In the challenging **Ogbench Cube-Double-Play** task, I analyzed the "Milestone Distance" metric. The graph below shows the distance between the robot and the generated milestone over time[cite: 435, 436].
* **Insight:** Sharp drops in distance indicate successful milestone reaching. [cite_start]However, spikes (as seen around step 45) indicate deviation, providing a clear signal for when replanning is necessary[cite: 435].

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
         {% include figure.liquid path="assets/img/milestone_distance.png" title="Milestone Distance Tracking" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [cite_start]Tracking the distance to the next milestone during execution. The system monitors this metric to trigger replanning when the robot fails to converge to the sub-goal[cite: 452, 439].
</div>

#### **4.3 Embedding Space Analysis (UMAP)**
[cite_start]To diagnose why certain tasks failed, I visualized the goal embeddings using UMAP. The visualization revealed that generated milestones (red dots) occasionally diverged from the manifold of valid trajectories (background point cloud), guiding the robot toward physically impossible states[cite: 398, 660].

#### 4.3 Embedding Space Analysis (UMAP)
[cite_start]To diagnose why certain tasks failed, I visualized the goal embeddings using UMAP. The visualization revealed that generated milestones (red dots) occasionally diverged from the manifold of valid trajectories (background point cloud), guiding the robot toward physically impossible states[cite: 398, 660].

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/umap_embedding.png" title="UMAP Visualization" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    [cite_start]UMAP visualization of goal embeddings. Red trajectory points show the planned milestones overlayed on the learned latent space of the task[cite: 660].
</div>

---

### **5. Insights & Contributions**

* **Necessity of Replanning:** [cite_start]My experiments confirmed that in stochastic environments like Ogbench, open-loop planning is insufficient. The introduction of milestone-based replanning allowed the robot to recover from grasping failures that previously caused episode termination[cite: 494, 651].
* **Density of Milestones:** [cite_start]I found that the success of DTAMP heavily relies on the density of milestones. Sparse milestones led to "blind spots" where the local policy could not find a path to the next sub-goal. Increasing milestone density proved essential for complex manipulation tasks[cite: 496, 497].
* **Advantage of Deterministic Sampling:** [cite_start]Switching to Mean Flow allowed for faster, deterministic sampling. This efficiency is critical for replanning, as the robot must generate new trajectories in real-time without the computational overhead of stochastic diffusion steps[cite: 513].