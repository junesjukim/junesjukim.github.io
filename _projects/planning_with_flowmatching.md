---
layout: page
title: Planning with Flowmatching
description: Optimizing real-time robotic control by transitioning from Diffusion to Flow Matching to reduce sampling steps and analyze dynamics errors.
img: assets/img/diffuser_kitchen.png
importance: 2
category: work
---

<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include video.liquid path="assets/img/flow_kitchen.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
</div>
<div class="caption">
    Demonstration of a kitchen partial-task execution controlled by a Flow Matching-based diffuser model.
</div>

---

### **1. Overview**

During my research internship at the **SNU Robot Learning Lab (RLLAB)**, I tackled the dual challenges of **latency** and **control stability** in deploying generative models for robotic manipulation. While Diffusion Models generate high-quality behaviors, their iterative sampling limits real-time application, and standard architectures often struggle with stability in complex tasks.

### **1. Overview**

During my research internship at the **SNU Robot Learning Lab (RLLAB)**, I addressed the critical trade-off between **inference latency** and **control stability** in robotic manipulation. While Diffusion Models generate high-quality behaviors, their iterative sampling limits real-time application. To overcome this, I introduced a **model re-parameterization technique**—predicting denoised data directly—which significantly enhanced performance in high-dimensional environments like Pen-Clone, proving that architectural choices are as vital as algorithmic speed.

My research focused on optimizing the **jannerm/diffuser** framework by transitioning to **Flow Matching (FM)** for faster inference. Crucially, I went beyond speed optimization by introducing **architectural improvements**—specifically **model re-parameterization** and **advantage-based guidance**—to enhance trajectory fidelity. This holistic approach allowed the system to achieve real-time replanning capabilities while significantly outperforming baseline models in complex environments like Franka Kitchen.

---

### **2. The Challenge: Latency vs. High-Fidelity Control**

Achieving real-time control requires not only speed but also physical precision. I identified critical hurdles that standard generative models face in dynamic environments:

* **Inference Bottleneck (Speed):** Standard diffusion requires dozens of steps to transform noise into a valid trajectory. This latency disrupts the high-frequency feedback loops (50Hz+) required for responsive control.

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/flow_sampling_step.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Performance degradation in standard models: Reducing sampling steps drastically lowers success rates, highlighting the need for a more efficient generation method.
</div>

* **Dynamics Instability & Error (Performance):** In partially observable and high-dimensional tasks (e.g., Franka Kitchen), small prediction errors compound over time. My analysis revealed that standard velocity-based prediction often fails to capture stable dynamics, leading to "shaky" motion and task failure after a certain horizon.

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/flow_dynamics_error.png" title="Dynamics Error Analysis" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Dynamics error analysis showing a critical spike in prediction error after approx. 100 steps. This necessitated robust guidance and replanning strategies.
</div>
---

### **3. Methodology: Transition to Flow Matching**

I modified the **jannerm/diffuser** framework to use Flow Matching instead of standard diffusion and added step skipping and advantage guidance.  

#### **3.1 Optimal Transport (OT) Paths**
I implemented flowmathing with **Optimal Transport (OT) paths**, which create straighter, simpler mathematical routes for the model to follow. These paths are easier to learn and allow for faster sampling without losing accuracy.

<div class="row justify-content-center">
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/flow_diff_OT.png" title="Diffusion vs Optimal Transport Paths" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    $$\psi_{t}(x_{0}|x_{1})=(1-(1-\sigma_{min})t)x_{0}+tx_{1}$$
    Comparison of probability paths: Diffusion (curved, slow) vs. Optimal Transport (straight, fast).
</div>


#### **3.2 Model Output Re-parameterization**
To further optimize performance, I experimented with the model's output parameterization. Drawing inspiration from the jannerm/diffuser framework, which offers two prediction modes—predicting epsilon (error) and predicting denoised data—I hypothesized that predicting **"denoised data"** ($\hat{x}_0$) directly might be more advantageous than the standard approach of predicting velocity ($v_t$) in the current model architecture using Temporal U-Net. Intuitively, this re-parameterization allows the model to leverage the temporal structure more effectively. I implemented this approach and found that deriving velocity from predicted denoised data significantly improved stability and task success rates in complex manipulation tasks like Pen-clone environments.

The velocity is derived from the predicted denoised data using the following transformation:

$$v_t = \frac{\hat{x}_0 - x_t}{1 - \bar{t}}$$

where $\hat{x}_0$ is the predicted denoised data, $x_t$ is the noisy input at time $t$, and $\bar{t}$ is the normalized time.

#### **3.3 Advanced Guidance via Advantage Optimization**

I identified that the one of the primary bottlenecks in model performance was the inaccurate guidance stemming from unstable value estimation. To address this, I developed an Advantage-based guidance system.

**1. Limitation of Standard Guidance:** Standard Diffuser models typically estimate the value of an entire trajectory to guide the sampling process, but this approach suffers from high variance. Furthermore, it often relies on values derived from the behavior policy rather than the optimal policy, leading to sub-optimal trajectory generation.

**2. Advantage-Based Solution:** To provide more precise guidance, I utilized Implicit Q-Learning (IQL) to separately train robust $Q$ and $V$ functions. I calculated the Advantage ($A(s, a) = Q(s, a) - V(s)$) and applied gradient-based guidance to steer the generation process toward actions with higher Advantage, thereby maximizing success rates while minimizing dynamics errors.

---

### **4. Key Experiments & Analysis**

#### **4.1 Efficiency Trade-off Analysis**

While Flow Matching provides a significant speed advantage, maintaining performance at low sampling steps is critical.

**Finding:** In the Walker2d-Medium-Replay task, reducing sampling steps from 20 to 4 caused a sharp performance drop in the baseline Diffusion model ($63.6 \rightarrow 52.8$). In contrast, the Flow Matching model maintained a significantly higher success rate ($69.3 \rightarrow 61.9$), demonstrating superior robustness for low-latency control.

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/flow_result1.png" title="Efficiency Trade-off on Walker2d" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Performance comparison on Walker2d-Medium-Replay. Flow Matching (Blue) retains high performance even at 4 sampling steps, enabling 5x faster inference than the baseline.
</div>

#### **4.2 Optimization for Complex Manipulation**

Initial experiments revealed that standard Flow Matching (predicting velocity) struggled in high-dimensional tasks like Pen-cloned-v0.

**Hypothesis & Fix:** I hypothesized that velocity variance was too high for stable learning. By re-parameterizing the model to predict "Denoised Data ($\hat{x}_0$)", I achieved a breakthrough in performance.

**Result:** This architectural change improved the score from 49.8 (Velocity) to 66.8 (Denoised Data), significantly outperforming the Diffusion baseline (44.1).

<div class="row justify-content-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/flow_result2.png" title="Ablation Study on Model Output" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Ablation study on model output parameterization in Pen-cloned-v0. Predicting 'Denoised Data' proved critical for solving complex manipulation tasks.
</div>

---

### **5. Insights & Contributions**

#### **1. Strategic Latency Optimization**

**Insight:** Real-time robotic control requires a delicate balance between inference speed and actuation precision.

**Contribution:** I quantified this trade-off on the Walker2d benchmark, identifying that Flow Matching maintains robust performance (61.9) even at 4 sampling steps, whereas baseline models degrade significantly. This finding established a viable operating point for high-frequency (50Hz+) control loops.

#### **2. Data-Driven Replanning Architecture**

**Insight:** In partially observable environments, open-loop execution inevitably diverges due to dynamics mismatch.

**Contribution:** Through rigorous error analysis, I discovered that dynamics prediction errors exhibit a non-linear spike after a 100-step horizon. 

#### **3. Architectural Regularization for High-Dimensional Control**

**Insight:** Standard velocity prediction in generative models suffers from high variance in complex action spaces (e.g., Shadow Hand).

**Contribution:** I introduced a model re-parameterization technique predicting "denoised data" ($\hat{x}_0$) directly. This architectural shift acts as an implicit regularizer, yielding a 34% performance gain in the Pen manipulation task and proving that structural priors are as critical as algorithmic choice.