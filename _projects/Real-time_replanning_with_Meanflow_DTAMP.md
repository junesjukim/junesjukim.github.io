---
layout: page
title: Replanning Integrating Mean Flow with DTAMP
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
    Demonstration of the robot performing a multi-stage manipulation task in the Ogbench environment.
</div>

---

### **1. Overview**

Following my work on Flow Matching, I encountered significant limitations when scaling to long-horizon tasks in Ogbench and Franka Kitchen. While the standard Diffuser could produce smooth trajectories, it lacked long-term consistency, often failing to chain multiple sub-tasks (e.g., opening a drawer, then grasping an object).

To address this, I pivoted to DTAMP (Diffused Task-Agnostic Milestone Planner), drawing inspiration from its ability to recover performance via replanning when milestones are missed. Which could compensate for the accumulating dynamics error in a long horizon task. My primary objective was to visualize trajectory convergence in the milestone dimension, demonstrating how the robot incrementally approaches its sub-goals. Furthermore, because the inference latency of standard diffusion is too high for practical replanning loops, I implemented Mean Flow and Flow Matching with step skipping to ensure the system could replan within a feasible timeframe.

---

### **2. The Challenge: Identifying the Optimal Replanning Trigger**

To implement robust replanning, the fundamental challenge was not just how to replan, but determining "When is replanning necessary?". Answering this required verifying the integrity of the entire planning pipeline.

Diagnosis of Failure Modes: I broke down the potential failure points into three verification steps:

Representation: Is the milestone latent space learned correctly?

Generation: Are the generated milestones semantically valid?

Execution: Is the robot actually arriving at these milestones?


Findings & Bottleneck: My analysis revealed that while the representation space was well-structured and milestone generation was generally appropriate (despite occasional redundant loops like lifting and replacing a cube), the primary failure occurred in execution—the robot frequently failed to reach the target milestone.


Overcoming Visualization Limitations: Verifying these states using dimensionality reduction (UMAP/t-SNE) was effective in simpler environments like Franka Kitchen, but failed to provide clear clusters in the complex Ogbench tasks. To resolve this ambiguity, I trained a dedicated Observation Decoder to reconstruct latent milestones back into visual images. This allowed me to visually confirm that while the planner intended valid states, the low-level controller was failing to converge, accurately pinpointing the need for replanning.

<div class="row justify-content-center"> <div class="col-sm-8 mt-3 mt-md-0"> {% include figure.liquid path="assets/img/dtamp_umap.png" title="Embedding Space Analysis" class="img-fluid rounded z-depth-1" %} </div> </div> <div class="caption"> Umap Visualization of Franka Kitchen Episode illustrating how a successful trajectory is visualized. </div>
---

### **3. Methodology: Meanflow-DTAMP & Replanning**

To compensate the dynamics error, I integrated **Mean Flow** into the DTAMP framework to facilitate stable milestone replanning.

#### **3.1 Mean Flow**
Unlike standard diffusion which is stochastic, I implemented **Mean Flow**, which models the field of average velocity $u(z,r,t)$. This deterministic approach aligns the generation process with the displacement vector, reducing variance and allowing for consistent one-step sampling that is crucial for real-time replanning.

$$u(z_t, r, t) = v(z_t, t) - (t-r)\frac{d}{dt}u(z_t, r, t)$$


<div class="row justify-content-center"> <div class="col-sm-8 mt-3 mt-md-0"> {% include figure.liquid path="assets/img/dtamp_meanflow.png" title="Embedding Space Analysis" class="img-fluid rounded z-depth-1" %} </div> </div>
<div class="caption">
    Visualization of the average velocity field $u(z, r, t)$ in Mean Flow (Image source: Mean Flow paper). The deterministic path ensures tighter alignment with the target trajectory compared to instantaneous velocity fields.
</div>

#### **3.2 DTAMP with Target Interval Conditioning**

I adopted the DTAMP architecture, which conditions the generator on a target interval ($\Delta$) between milestones. This mechanism enables the planner to decompose long-horizon tasks (e.g., "Cube-double-play") into a sequence of reachable sub-goals (milestones, $g_{1:K}$). By explicitly controlling this interval, I ensured that consecutive milestones are generated close enough for the low-level action policy to reach them reliably, thereby preventing execution failures.

<div class="row justify-content-center"> <div class="col-sm-8 mt-3 mt-md-0"> {% include figure.liquid path="assets/img/dtamp_arch.png" title="Embedding Space Analysis" class="img-fluid rounded z-depth-1" %} </div> </div>
<div class="caption">
    DTAMP architecture from the DTAMP paper.
</div>

---

### **4. Key Experiments & Analysis**

#### **4.1 Meanflow vs. Diffusion Performance**
I compared Meanflow against standard Diffusion and Flow Matching on the Franka Kitchen Tasks. Meanflow demonstrated superior stability, achieving competitive or higher scores in mixed environments **with minimal inference latency.** Unlike diffusion, which requires hundreds of iterations, Meanflow's deterministic sampling allowed for maintaining high trajectory fidelity even when compressed to a single step.

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/dtamp_result.png" title="Meanflow vs Diffusion, Flowmatching Performance" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Performance comparison on Kitchen-Mixed-v0. Meanflow (Green) consistently achieves high success rates (approx 74.5) even at varied step counts, outperforming standard flow matching and diffusion in stability.
</div>

#### **4.2 Ogbench Milestone Analysis**
In the challenging **Ogbench Cube-Double-Play** task, I analyzed the "Milestone Distance" metric to evaluate execution stability. The graph below illustrates the distance between the robot's current state and the target milestone over time.

* **Ideal Pattern (Sawtooth):** The red line typically shows a gradual decline as the robot approaches a milestone, followed by an immediate spike when it switches to the next target. This repetitive "approach-and-switch" pattern indicates successful execution.
* **Failure Mode & Replanning:** A critical issue arises when the robot exceeds the maximum time limit for a milestone. The system forces a switch to the next target, often causing the distance to **explode** as the robot falls behind the planned trajectory. This abnormal spike serves as a clear, data-driven trigger to discard current plans and **regenerate new milestones**.

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
         {% include figure.liquid path="assets/img/dtamp_milestone.mp4" title="Milestone Distance Tracking" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Analysis of Milestone Distance. The early phase shows the ideal 'sawtooth' pattern of reaching and switching milestones. Around step 45, a forced switch causes a distance explosion, triggering the replanning algorithm.
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