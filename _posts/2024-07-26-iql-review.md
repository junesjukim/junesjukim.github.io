---
layout: post
title: "Implicit Q-Learning (IQL) Explained"
date: 2024-07-26 10:00:00 +0900
categories: [paper reviews]
---

Implicit Q-Learning (IQL) is a simple yet powerful algorithm for offline reinforcement learning. Unlike traditional methods that rely on explicit policy constraints or complex value function regularization, IQL takes a different approach by learning a Q-function implicitly.

The core idea is to treat the offline RL problem as a supervised learning problem. IQL uses **Expectile Regression** on the Q-function to extract a policy directly from the learned values. This avoids the need for out-of-distribution action queries, which is a major challenge in offline settings.

By fitting one state-action value function and a simple state value function, IQL can derive a policy without ever needing to query the Q-function with unseen actions. This makes it a robust and effective method, demonstrating strong performance on standard offline RL benchmarks. It's a great example of how reframing a problem can lead to simpler and more stable solutions. 