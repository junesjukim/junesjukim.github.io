---
layout: project
title: Flow Matching × Diffuser
tagline: Swapping diffusion for flow matching in Diffuser to cut sampling steps for real-time control, plus re-parameterization and advantage guidance.
description: Flow matching in Diffuser for faster, more stable trajectory planning.
kind: Research
year: 2025
importance: 2
math: true
thumb: /assets/img/thumbs/flow-matching.jpg
role: Research intern
context: SNU Robot Learning Lab, advised by Prof. Songhwai Oh
stack: [PyTorch, Diffuser, Flow Matching, IQL, D4RL]
hero:
  video: /assets/img/flow_kitchen.mp4
  caption: A Franka Kitchen task controlled by a flow-matching planner.
highlights:
  - "**5× fewer sampling steps.** At 4 steps, flow matching holds 61.9 on Walker2d-Medium-Replay while diffusion drops to 52.8."
  - "Predicting denoised data (x̂₀) instead of velocity raised Pen-cloned from **49.8 → 66.8**, against a diffusion baseline of 44.1."
  - "**Advantage-based guidance** from IQL-trained Q and V functions, for lower-variance trajectory steering."
  - "Found that dynamics error **climbs after ~100 steps** of open-loop execution, which led to the replanning work in Mean Flow × DTAMP."
---

### Problem

Diffuser (Janner et al.) plans by denoising a whole trajectory with a diffusion model. The plans are good, but each one costs dozens of denoising steps, which is too slow for a control loop that has to replan at 50 Hz or more. Cutting the step count on the stock model is not an option: on Franka Kitchen (kitchen-partial-v0), Diffuser scores 44.7 at 16 steps but falls to 35.7 at 4 steps and 33.5 at 1 step.

During my internship at the SNU Robot Learning Lab, I set out to make Diffuser fast enough for real-time replanning without giving up plan quality.

### Approach

I made three changes to the jannerm/diffuser codebase.

**Flow matching with optimal-transport paths.** I replaced the diffusion process with flow matching and used the optimal-transport conditional path, which moves each sample along a straight line between noise and data. Straight paths are easier to learn and hold up better when integrated with only a few large steps.

<figure>
  <img src="/assets/img/flow_diff_OT.png" alt="Curved diffusion probability paths next to straight optimal-transport paths" loading="lazy">
  <figcaption>Diffusion paths (left) curve; optimal-transport paths (right) are straight. Figure from Lipman et al., "Flow Matching for Generative Modeling" (ICLR 2023).</figcaption>
</figure>

**Predicting clean data instead of velocity.** Diffuser can predict either the noise or the denoised trajectory. Standard flow matching predicts the velocity $v_t$. I suspected that with Diffuser's temporal U-Net, predicting the clean trajectory $\hat{x}_0$ directly would give a lower-variance target that makes better use of the temporal structure. The velocity needed for integration is then recovered as

$$v_t = \frac{\hat{x}_0 - x_t}{1 - t},$$

where $x_t$ is the current sample and $t \in [0, 1]$ is normalized time, with $t = 1$ at the data.

**Advantage-based guidance.** Diffuser steers sampling with a value estimate of the whole trajectory. That estimate has high variance and reflects the behavior policy rather than the optimal one. Instead, I trained separate $Q$ and $V$ functions with Implicit Q-Learning (IQL) and guided sampling with the gradient of the advantage $A(s, a) = Q(s, a) - V(s)$, pushing generation toward higher-advantage actions.

### Results

**Fewer steps.** On Walker2d-Medium-Replay, going from 20 to 4 sampling steps drops Diffuser from 63.6 to 52.8. The flow-matching planner goes from 69.3 to **61.9**. Four steps is a 5× reduction in sampling cost, and at that setting the flow-matching planner still does nearly as well as Diffuser does at 20 steps. Below 4 steps, both models degrade sharply.

<figure>
  <img src="/assets/img/flow_result1.png" alt="Line plot of normalized score against sampling steps for Diffuser and flow matching on Walker2d-Medium-Replay" loading="lazy">
  <figcaption>Normalized score vs. sampling steps on Walker2d-Medium-Replay. Flow matching keeps most of its performance at 4 steps.</figcaption>
</figure>

**Output parameterization.** On the high-dimensional Adroit Pen-cloned-v0 task, velocity prediction was the weak point. Switching to clean-data prediction raised the score from 49.8 to **66.8**, about a 34% relative gain, against a diffusion baseline of 44.1.

<figure>
  <img src="/assets/img/flow_result2.png" alt="Bar chart comparing Diffusion, flow matching with velocity output, and flow matching with denoised-data output on Pen-cloned-v0" loading="lazy">
  <figcaption>Output-parameterization ablation on Pen-cloned-v0. Predicting the denoised trajectory gives the largest gain.</figcaption>
</figure>

**Where open-loop plans break.** Faster sampling alone does not fix drift. When I tracked the gap between planned and actual dynamics over an episode, the error stayed near zero for about 100 steps, then climbed steadily with two sharp jumps later on. Beyond that horizon, executing a plan open-loop is unreliable.

<figure>
  <img src="/assets/img/flow_dynamics_error.png" alt="Dynamics error norm over environment steps, flat until about step 100 and then rising" loading="lazy">
  <figcaption>Dynamics error norm over an episode. The error starts rising around step 100.</figcaption>
</figure>

### Takeaways

- Flow matching with straight OT paths gives a practical speed-quality trade-off: 4 steps is a workable setting for replanning at control rates.
- The prediction target matters as much as the generative framework. Predicting clean data acted as an implicit regularizer and mattered most in high-dimensional manipulation.
- The dynamics-error analysis showed that plans need refreshing before roughly 100 steps. That result motivated my follow-up work on real-time replanning with Mean Flow and DTAMP.
