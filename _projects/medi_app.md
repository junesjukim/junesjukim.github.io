---
layout: project
title: MEDi
tagline: An Android assistant that helps blind and low-vision shoppers find the right medicine. Point at a product and hear what it is.
description: On-device AI that helps visually impaired people identify pharmaceutical products.
kind: Product
year: 2025
importance: 4
thumb: /assets/img/thumbs/medi.jpg
role: Engineer
context: 2nd Company, an accessibility startup
stack: [Kotlin, TensorFlow Lite, MediaPipe, Android NDK]
links:
  - label: GitHub
    url: https://github.com/2nd-Company/MEDi
highlights:
  - "Fuses on-device object detection with **MediaPipe hand tracking**. Point at a product and get spoken confirmation or a correction."
  - "**0.76 mAP** on held-out real-store images, using a hybrid real + synthetic dataset."
  - "Led the latency work: **TFLite quantization** and asynchronous detection and tracking streams for smooth real-time guidance."
  - "Released for **beta testing on Google Play**."
---

### Problem

Many over-the-counter medicines come in near-identical packaging, and braille is almost never printed on the box. For a blind or low-vision shopper, that makes picking the right product on a crowded pharmacy shelf slow and risky: a similar-looking box can hold a different drug. General-purpose reading and magnifier apps help with text, but they are not built for this task. They can be slow, describe everything in view rather than the one item the user cares about, and are not reliable enough for medical labels.

We built MEDi at 2nd Company to handle one narrow job well: the user says what they are looking for, points at a product, and the app tells them whether they have the right one.

### How it works

The interaction is a short loop. The user taps to start, says the name of the medication, and then points the phone camera at the shelf. From that point everything runs on the device, which keeps latency low and keeps camera frames on the phone.

<div class="fig-row fig-row--phones">
  <figure><img src="/assets/img/medi_app/Screenshot1.jpeg" alt="MEDi start screen with a single Touch to Start prompt" loading="lazy"><figcaption>A single full-screen tap target starts the app.</figcaption></figure>
  <figure><img src="/assets/img/medi_app/Screenshot2.jpeg" alt="Prompt reading Tell Us Your Medication, Touch to Record" loading="lazy"><figcaption>The user is asked to say which medication they want.</figcaption></figure>
  <figure><img src="/assets/img/medi_app/Screenshot3.jpeg" alt="Listening screen while the spoken request is recorded" loading="lazy"><figcaption>The app listens for the spoken request.</figcaption></figure>
</div>

Two models run on each camera frame. An object detector, running in TensorFlow Lite, finds and labels products on the shelf. MediaPipe Hand Landmarker tracks the user's hand. We chose an off-the-shelf hand tracker so our own effort could go into product detection, which no existing model covered.

The app then takes the index-fingertip landmark and checks which detected bounding box, if any, contains it. If the user is pointing at the requested product, the app confirms it out loud. If they are pointing at something else, it names that product and says which direction the target is in.

<div class="fig-row fig-row--phones">
  <figure><img src="/assets/img/medi_app/Screenshot4.jpeg" alt="Live camera view with Tussin DM boxes detected and the user's hand skeleton overlaid" loading="lazy"><figcaption>Detected products (blue boxes) and the tracked hand, with the fingertip marked in red.</figcaption></figure>
  <figure><img src="/assets/img/medi_app/Screenshot5.jpeg" alt="Live camera view detecting Miralax while the user points at a nearby bottle" loading="lazy"><figcaption>The fingertip is tested against each detected box to decide what the user is pointing at.</figcaption></figure>
  <figure><img src="/assets/img/medi_app/Screenshot6.jpeg" alt="Live camera view detecting Metamucil containers on a lower shelf" loading="lazy"><figcaption>Detection on a crowded shelf, with the hand pointing away from the detected products.</figcaption></figure>
</div>

### Data and model

Hand-labeling shelf footage does not scale, so we used a hybrid dataset. For training, we used standardized product images crawled from the web to synthetically generate 2,000 images. For validation and testing, we used only real video we filmed at an on-campus convenience store. The prototype product set included beverages as well as over-the-counter medicines. Keeping real footage out of training gave an honest measure of how the model does in a real store.

We managed annotation and augmentation (brightness, contrast, rotation) in Roboflow. On a held-out set of 20 real images, the detector reached 0.76 mAP. Per-class scores varied, and weaker classes such as ZzzQuil are the clearest place to add training data.

### My contribution

I led the latency work. The first version of the detector was too slow on phone hardware for real-time guidance to be usable. I made two changes. First, I converted the detection model to TensorFlow Lite and quantized it, which cut the model size substantially while keeping accuracy at 0.76 mAP. Second, I restructured the pipeline so hand tracking and object detection run as separate asynchronous streams, so neither model has to wait for the other. Together these changes brought the loop to a point where the feedback feels responsive.

### What's next

- Expand the detector to a much larger catalog of pharmaceutical products. This mostly means collecting and labeling more data.
- Add OCR to read dosages, warnings, and especially expiration dates from the packaging.
- Test in more varied stores, with different layouts, lighting, and packaging, and add help with navigating inside the store.

MEDi is in beta testing on [Google Play](https://play.google.com/apps/testing/com.MedI).
