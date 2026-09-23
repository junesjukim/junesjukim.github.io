---
layout: project
title: Mean Flow × DTAMP
tagline: Real-time milestone replanning for long-horizon manipulation, using one-step Mean Flow sampling inside a hierarchical planner.
description: Real-time milestone replanning for long-horizon manipulation with one-step Mean Flow sampling inside DTAMP.
kind: Research
year: 2025
importance: 1
math: true
thumb: /assets/img/thumbs/meanflow-dtamp.jpg
role: Research intern
context: SNU Robot Learning Lab, advised by Prof. Songhwai Oh
stack: [PyTorch, Mean Flow, Flow Matching, DTAMP, OGBench, Franka Kitchen]
hero:
  video: /assets/img/dtamp_stats.mp4
  caption: Multi-stage manipulation in OGBench, driven by generated milestones.
highlights:
  - Replaced iterative diffusion with **Mean Flow** for deterministic one-step milestone generation, making closed-loop replanning fast enough to run.
  - Used **milestone-distance spikes** as a data-driven trigger to throw away a failing plan and regenerate milestones.
  - With a single sampling step, Mean Flow scores **75** on Kitchen-Partial, above the 63.4 reported in the DTAMP paper.
  - Trained an **observation decoder** that renders latent milestones as images, which showed that failures came from low-level execution rather than planning.
---

### Problem

After working on flow-matching planners, I ran into their limits on long-horizon tasks in OGBench and Franka Kitchen. A standard Diffuser produces smooth trajectories but loses consistency over long horizons, so it often fails to chain sub-tasks such as opening a drawer and then grasping an object. Small dynamics errors accumulate, and an open-loop plan has no way to recover.

DTAMP (Diffused Task-Agnostic Milestone Planner) addresses this by planning a sequence of latent milestones $g_{1:K}$ and replanning when they are missed. That only works if two things hold: sampling a new plan is fast enough to do inside the control loop, and there is a reliable signal for *when* to replan. Standard diffusion fails the first requirement, so most of this project was about both.

### Approach

**Fast milestone generation.** I replaced the diffusion backbone with Mean Flow, which learns the average velocity $u(z, r, t)$ over an interval instead of the instantaneous velocity $v(z, t)$:

$$u(z_t, r, t) = v(z_t, t) - (t-r)\frac{d}{dt}u(z_t, r, t)$$

Because $u$ describes the whole displacement from $r$ to $t$, a single deterministic step can map noise to a full set of milestones. For comparison I also ran flow matching and diffusion with reduced (skipped) sampling steps.

<figure>
  <img src="/assets/img/dtamp_meanflow.png" alt="Average velocity field u(z, r, t) versus instantaneous velocity v along a curved path" loading="lazy">
  <figcaption>Mean Flow's average velocity u(z, r, t) spans the interval between r and t, which is what allows one-step sampling. Image from the Mean Flow paper.</figcaption>
</figure>

**Milestone spacing.** DTAMP conditions the generator on a target interval $\Delta$ between milestones. Keeping $\Delta$ small makes milestones denser, so each one stays within reach of the low-level policy.

**A replanning trigger.** On OGBench Cube-Double-Play I tracked the distance between the current state and the active milestone. In a healthy rollout it forms a sawtooth: it falls as the robot approaches a milestone, then jumps when the target switches. When the robot exceeds the time limit for a milestone, the forced switch leaves it far behind the plan and the distance spikes. I used that spike as the signal to discard the plan and generate new milestones.

<figure>
  <video src="/assets/img/dtamp_milestone.mp4" autoplay muted loop playsinline controls preload="metadata"></video>
  <figcaption>Milestone distance over an episode: the sawtooth of reaching and switching milestones, then a spike around step 45 after a forced switch, which triggers replanning.</figcaption>
</figure>

### Results

On Franka Kitchen (300 training diffusion steps, no target interval conditioning), diffusion collapses once sampling drops below 50 steps. One-step Mean Flow scores 75 on kitchen-partial, above the paper's diffusion result, but 68.25 on kitchen-mixed, below it. Flow matching with $x_0$ prediction holds up across step counts on kitchen-mixed.

| Sampling steps | Partial: Diffusion | Partial: FM (vel.) | Partial: FM ($x_0$) | Partial: Mean Flow | Mixed: Diffusion | Mixed: FM (vel.) | Mixed: FM ($x_0$) | Mixed: Mean Flow |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 300 | 73 | 54 | 62 | – | 73 | 53 | 75 | – |
| 50 | 73 | 56 | 69.5 | – | 70 | 53 | 74.5 | – |
| 30 | 0.5 | 54 | 64 | – | 2.5 | 55 | 73 | – |
| 10 | 1.5 | 54 | 64.5 | – | 6 | 52 | 73.5 | – |
| 4 | – | – | 54 | – | – | – | 74.5 | – |
| 1 | – | – | 52.5 | **75** | – | – | 72.5 | **68.25** |

Paper scores for DTAMP: 63.4 ± 8.80 on kitchen-partial and 74.4 ± 1.39 on kitchen-mixed.

To check where failures came from, I verified the pipeline stage by stage: the milestone latent space, the generated milestones, and whether the robot actually reached them. In Franka Kitchen, UMAP of the goal embeddings showed clear structure, with successful trajectories following the manifold. In OGBench the global projection showed no usable structure, even though the milestones behaved consistently up close. To get around this I trained an observation decoder that renders latent milestones as images. The generated milestones were mostly sensible, apart from occasional redundant loops such as lifting and replacing a cube. The failures came from execution: the low-level controller often did not reach the milestone.

<div class="fig-row">
  <figure>
    <img src="/assets/img/dtamp_umap.png" alt="UMAP of kitchen-partial goal embeddings with one episode trajectory overlaid" loading="lazy">
    <figcaption>Franka Kitchen: a successful episode follows the embedding manifold.</figcaption>
  </figure>
  <figure>
    <img src="/assets/img/dtamp_umap_og.png" alt="UMAP of cube-double-play goal embeddings with milestones overlaid" loading="lazy">
    <figcaption>OGBench Cube-Double-Play: no clear global structure.</figcaption>
  </figure>
</div>

### Takeaways

- In OGBench, open-loop planning cannot absorb dynamics errors. Replanning on milestone-distance spikes lets the robot recover from failures such as a missed grasp.
- Milestone density matters. Sparse milestones leave gaps the low-level policy cannot bridge.
- Replanning is only practical if sampling is cheap. One-step Mean Flow makes that possible, though on kitchen-mixed it still trails multi-step sampling.
- Low-dimensional projections were not enough to debug planning in complex scenes. Decoding milestones into images was what located the bottleneck.
