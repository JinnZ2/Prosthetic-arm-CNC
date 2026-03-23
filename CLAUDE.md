# CLAUDE.md

## Project Overview

Golden Ratio CNC Prosthetic Arm System — a pure JavaScript prototype that generates bio-optimized prosthetic socket designs, CNC toolpaths, EMG sensor layouts, and manufacturing metrics using the golden ratio (φ = 1.618).

**No dependencies. No build tools. No framework.** Runs directly with Node.js.

## Repository Structure

```
Prosthetic-arm-CNC/
├── Prosthetic-CNC-system.js      # Core prosthetic socket design & CNC toolpath generation
├── Enhanced-golden-CNC-system.js  # Advanced patterns (honeycomb, Voronoi, fractal trees)
├── Phi-fractal-codec.js           # Golden ratio data compression & fractal analysis
├── README.md                      # Project documentation
├── LICENSE                        # MIT License
└── .gitignore
```

## Source Files

### Prosthetic-CNC-system.js (~595 lines)
- **Class**: `ProstheticCNCSystem`
- Core socket design with golden ratio tapering
- EMG sensor positioning using golden angle (137.5°)
- CNC toolpath generation (roughing + finishing passes)
- G-code output, cost/time estimation
- **Entry point**: `new ProstheticCNCSystem().runDemo()`

### Enhanced-golden-CNC-system.js (~609 lines)
- **Class**: `EnhancedCNCGoldenSystem`
- Bio-inspired pattern generation (leaf, honeycomb, Voronoi)
- Fractal tree structures, golden spiral patterns
- Material-specific feedrate optimization (aluminum, steel, titanium, carbon fiber, brass, plastic, wood)
- **Entry point**: `new EnhancedCNCGoldenSystem().demonstrateEnhancedCapabilities()`

### Phi-fractal-codec.js (~412 lines)
- **Class**: `GoldenRatioFractalCodec`
- Data compression using φ self-similarity and Fibonacci scaling
- Fractal pattern detection and recursive correlation
- Error analysis (MSE, PSNR)
- **Entry point**: `new GoldenRatioFractalCodec()` then call demo methods

## Running the Code

```bash
# Core prosthetic system demo
node Prosthetic-CNC-system.js

# Enhanced CNC capabilities demo
node Enhanced-golden-CNC-system.js

# Fractal codec demo
node Phi-fractal-codec.js
```

All scripts produce console output demonstrating their capabilities. No arguments required.

## Key Conventions

### Code Style
- ES6+ class-based architecture, one main class per file
- No module imports/exports between files — each file is self-contained
- Mathematical constants defined at the top of each class (PHI, PHI_INV, GOLDEN_ANGLE, FIBONACCI)
- Console.log-based output with formatted section headers
- Methods return structured objects with computed results

### Mathematical Constants Used Throughout
- `PHI` = 1.6180339887... (golden ratio)
- `PHI_INV` = 0.6180339887... (1/φ)
- `GOLDEN_ANGLE` = 137.5077... degrees
- Fibonacci sequences for scaling and spacing

### Naming
- PascalCase for class names
- camelCase for methods and variables
- Descriptive method names (e.g., `generateGoldenSpiralToolpath`, `optimizeEMGSensorLayout`)

## Development Notes

- **No package.json** — no npm dependencies to install
- **No tests** — validation is done through demo output
- **No linting/formatting** tools configured
- **No CI/CD** pipeline
- **No module system** — files are standalone scripts, not ES modules or CommonJS
- **Prototype project** — designed for personal use and proof-of-concept, not production

## Design Philosophy

This project prioritizes fit-for-purpose sufficiency and personal autonomy over production polish. When contributing:
- Keep files self-contained — avoid introducing dependency chains
- Maintain the golden ratio / Fibonacci mathematical theme
- Console output is the primary interface — no web UI or CLI framework
- Simplicity over abstraction
