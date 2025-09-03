This open-source project uses natural geometry to reinvent prosthetics.
By combining the golden ratio (1.618) with CNC precision and EMG sensor optimization, this system designs and manufactures prosthetic sockets with mathematically ideal comfort, fit, and signal performance.

The entire system runs in JavaScript and outputs real-world CNC toolpaths, sensor pocket layouts, and detailed manufacturing metrics — enabling low-cost, high-quality myoelectric prosthetics to be produced anywhere.

# Prosthetic-arm-CNC
Golden Ratio CNC Prosthetic Arm System  A precision-engineered, bio-optimized prosthetic socket and manufacturing system built using the golden ratio. Designed for affordable, high-performance myoelectric arms. Generates complete toolpaths, sensor layouts, and production reports for CNC fabrication.


#  Prosthetic Arm CNC Manufacturing System

This project contains a **fully operational Golden Ratio-optimized prosthetic design system**, written in pure JavaScript. It creates:

- Golden ratio socket designs
- EMG sensor layouts using the golden angle (137.5°)
- CNC toolpaths with roughing, finishing, and spiral reliefs
- G-code-style outputs and machining cost estimates
- Full production report with socket geometry and timeline

➡**Core file:** [`prosthetic_cnc_system.js`](./prosthetic_cnc_system.js)  
 **Run with Node.js** to simulate the full design and manufacturing process.

---

## Key Features

- Socket tapering using φ = 1.618...
- EMG sensor layout optimized for myoelectric signal pickup
- Comfort channels in golden spiral for pressure relief
- CNC toolpath generation using roughing + finish passes
- Cost/time/efficiency calculator
- G-code output-style list
- Modular functions for easy integration

---

## Example Output

The script generates detailed console output like:

=== Prosthetic Arm CNC Manufacturing System ===

Patient Measurements:
	•	Forearm Length: 240mm
	•	Circumference: 220mm
	•	Residual Length: 160mm

=== Golden Ratio Socket Design ===
Proximal Diameter: 220.0mm
Distal Diameter: 136.4mm

---

##  How to Run

```bash
node prosthetic_cnc_system.js

Requires only Node.js, no dependencies.

##  Golden Ratio Fractal Codec (Compression + Pattern Analysis)

This module compresses and analyzes numeric data using φ self-similarity, Fibonacci scaling, and fractal pattern recognition.

Key features:
- Golden spiral geometry & pattern generation
- Recursive φ-scale segment correlation
- Fractal detection + data compression
- Reconstructive decoder with residual healing
- Error analysis (MSE, PSNR)
- Bio-similar signal test data generator

Use Cases:
- Fractal signal compression
- Bio-inspired CNC optimization
- Symbolic AI memory encoding
- Fibonacci data analytics

➡See: [`Phi_fractal_codec.js`](./Phi_fractal_codec.js)

🔍 Scope Statement

This repository is a prototype designed for personal sufficiency, testing, and symbolic exploration.
It is not intended for scaling, commercialization, or mass-production.
	•	Purpose → Serves as a working tool, proof-of-concept, or symbolic framework for local use.
	•	Design Philosophy → Built on principles of fit-for-purpose sufficiency, resilience, and personal autonomy, not corporate scaling.
	•	Usage → Treat this as a seed or example, to be adapted or studied as needed. It is complete in scope for its intended function.
	•	Limitations → It may lack packaging, optimization, or interfaces expected in production software—by design.
	•	Ethos → Prioritizes anonymity, autonomy, and independence over growth or competition.


Yes. I built one.  
