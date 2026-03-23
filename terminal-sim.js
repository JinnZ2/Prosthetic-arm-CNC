/* ============================================================
 *  Golden Ratio Prosthetic Arm — Terminal Simulation
 *  Step-by-step walkthrough for learning how the system works
 *  Run: node terminal-sim.js
 * ============================================================ */

class TerminalSim {
  constructor() {
    this.PHI = (1 + Math.sqrt(5)) / 2;
    this.PHI_INV = 1 / this.PHI;
    this.GOLDEN_ANGLE = 137.5077640844;
    this.step = 0;
  }

  pause(label) {
    this.step++;
    console.log('\n' + '─'.repeat(60));
    console.log(`  Step ${this.step}: ${label}`);
    console.log('─'.repeat(60));
  }

  bar(value, max, width) {
    var filled = Math.round((value / max) * width);
    return '█'.repeat(filled) + '░'.repeat(width - filled);
  }

  /* ── Full simulation walkthrough ── */
  run() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   φ  GOLDEN RATIO PROSTHETIC ARM — SIMULATION        ║');
    console.log('║      Step-by-step walkthrough of the design system    ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('\nThe golden ratio (φ = 1.618...) appears throughout nature');
    console.log('in shells, flowers, and bones. This system uses φ to');
    console.log('generate prosthetic sockets that feel natural.\n');

    this.stepGoldenRatio();
    this.stepSocketDesign();
    this.stepWallThickness();
    this.stepSensorLayout();
    this.stepComfortChannels();
    this.stepToolpath();
    this.stepMaterials();
    this.stepCostEstimate();
    this.stepPatterns();
    this.stepSummary();
  }

  stepGoldenRatio() {
    this.pause('Understanding the Golden Ratio');
    console.log('\n  φ (phi) = (1 + √5) / 2 = ' + this.PHI.toFixed(10));
    console.log('  1/φ     = φ - 1         = ' + this.PHI_INV.toFixed(10));
    console.log('\n  Fibonacci sequence (each number ÷ previous → φ):');
    var fib = [1, 1];
    for (var i = 2; i < 12; i++) fib.push(fib[i - 1] + fib[i - 2]);
    console.log('  ' + fib.join(', '));
    console.log('  Ratios: ' + fib.slice(1).map(function(v, i) { return (v / fib[i]).toFixed(3); }).join(', '));
    console.log('\n  Golden angle = 360° × (1 - 1/φ) = ' + this.GOLDEN_ANGLE.toFixed(4) + '°');
    console.log('  → This is how sunflower seeds pack optimally.');
  }

  stepSocketDesign() {
    this.pause('Socket Geometry Design');
    var circ = 280;
    var residualLength = 200;
    var proxD = circ / Math.PI;
    var distD = proxD * this.PHI_INV;
    var len = Math.min(residualLength * 0.85, proxD * this.PHI);

    console.log('\n  Input: circumference = ' + circ + 'mm, residual length = ' + residualLength + 'mm');
    console.log('\n  Proximal diameter = circ / π = ' + proxD.toFixed(1) + 'mm');
    console.log('  Distal diameter   = proximal × φ⁻¹ = ' + distD.toFixed(1) + 'mm');
    console.log('  Socket length     = min(length×0.85, proxD×φ) = ' + len.toFixed(1) + 'mm');
    console.log('\n  Cross-section taper (proximal → distal):');
    for (var i = 0; i <= 10; i++) {
      var t = i / 10;
      var d = proxD + (distD - proxD) * Math.pow(t, this.PHI_INV);
      var half = Math.max(1, Math.min(18, Math.round(d / 5)));
      console.log('  ' + (t * 100).toFixed(0).padStart(4) + '%  ' + ' '.repeat(18 - half) + '│' + '█'.repeat(half) + '  ' + '█'.repeat(half) + '│  ' + d.toFixed(1) + 'mm');
    }
  }

  stepWallThickness() {
    this.pause('Wall Thickness (φ-scaled)');
    var layers = [
      { name: 'Proximal (top)', t: 4.0 },
      { name: 'Middle', t: 4.0 * this.PHI_INV },
      { name: 'Distal (bottom)', t: 4.0 * this.PHI_INV * this.PHI_INV }
    ];
    console.log('\n  Each layer is φ⁻¹ × the previous (natural thinning):');
    for (var i = 0; i < layers.length; i++) {
      var l = layers[i];
      console.log('  ' + l.name.padEnd(20) + this.bar(l.t, 5, 30) + '  ' + l.t.toFixed(3) + 'mm');
    }
    console.log('\n  Why? Bones thin naturally toward extremities at ~φ⁻¹ ratio.');
    console.log('  Thicker proximal = more support where forces are highest.');
  }

  stepSensorLayout() {
    this.pause('EMG Sensor Placement (Golden Angle)');
    var count = 8;
    var circ = 280;
    var proxD = circ / Math.PI;
    var len = 145;
    console.log('\n  ' + count + ' sensors placed at golden angle (137.5°) intervals.');
    console.log('  This ensures maximum angular spacing — no clusters.\n');
    console.log('  Sensor  Angle      X        Y        Z       Type');
    console.log('  ' + '─'.repeat(55));
    for (var i = 0; i < count; i++) {
      var angle = (i * this.GOLDEN_ANGLE) % 360;
      var rad = angle * Math.PI / 180;
      var r = proxD / 2 * 0.85;
      var x = r * Math.cos(rad);
      var y = r * Math.sin(rad);
      var z = len * (i + 1) / (count + 1) * this.PHI_INV;
      var type = i < 2 ? 'PRIMARY' : 'secondary';
      console.log('  EMG_' + (i + 1) + '   ' +
        angle.toFixed(1).padStart(6) + '°  ' +
        x.toFixed(1).padStart(7) + '  ' +
        y.toFixed(1).padStart(7) + '  ' +
        z.toFixed(1).padStart(7) + '   ' + type);
    }
    console.log('\n  Top-down view (. = empty, # = sensor):');
    var grid = [];
    for (var r = 0; r < 15; r++) { grid[r] = []; for (var c = 0; c < 30; c++) grid[r][c] = ' '; }
    // Draw circle
    for (var a = 0; a < 360; a += 5) {
      var gx = Math.round(15 + 12 * Math.cos(a * Math.PI / 180));
      var gy = Math.round(7 + 6 * Math.sin(a * Math.PI / 180));
      if (gy >= 0 && gy < 15 && gx >= 0 && gx < 30) grid[gy][gx] = '·';
    }
    // Place sensors
    for (var i = 0; i < count; i++) {
      var angle = i * this.GOLDEN_ANGLE * Math.PI / 180;
      var gx = Math.round(15 + 10 * Math.cos(angle));
      var gy = Math.round(7 + 5 * Math.sin(angle));
      if (gy >= 0 && gy < 15 && gx >= 0 && gx < 30) grid[gy][gx] = '#';
    }
    for (var r = 0; r < 15; r++) console.log('  ' + grid[r].join(''));
  }

  stepComfortChannels() {
    this.pause('Comfort Channels (Golden Spiral)');
    console.log('\n  48 ventilation channels arranged in a 3-turn golden spiral.');
    console.log('  Depth varies by turn: deeper channels near proximal end.\n');
    var turns = [
      { name: 'Turn 1 (proximal)', depth: 1.5, count: 16 },
      { name: 'Turn 2 (middle)', depth: 1.5 * this.PHI_INV, count: 16 },
      { name: 'Turn 3 (distal)', depth: 1.5 * this.PHI_INV * this.PHI_INV, count: 16 }
    ];
    for (var i = 0; i < turns.length; i++) {
      var t = turns[i];
      console.log('  ' + t.name.padEnd(22) + t.count + ' channels, depth = ' + t.depth.toFixed(3) + 'mm');
      console.log('  ' + ' '.repeat(22) + this.bar(t.depth, 2, 25));
    }
    console.log('\n  All channel widths = 2.0mm. Pattern prevents pressure sores');
    console.log('  and allows airflow — critical for long-term socket comfort.');
  }

  stepToolpath() {
    this.pause('CNC Toolpath Generation');
    console.log('\n  Two-pass strategy:');
    console.log('\n  ROUGHING PASS (bulk material removal)');
    console.log('  ├─ Helical descent around socket exterior');
    console.log('  ├─ Depth per pass: 2.0mm');
    console.log('  ├─ Stepover: tool diameter × φ⁻¹ (optimal chip load)');
    console.log('  └─ Feed: 800 mm/min\n');
    console.log('  FINISHING PASS (surface quality)');
    console.log('  ├─ Tight spiral with φ-scaled stepover');
    console.log('  ├─ Depth per pass: 0.5mm');
    console.log('  ├─ Surface finish: Ra ≈ 0.8μm');
    console.log('  └─ Feed: 400 mm/min\n');
    console.log('  Simulated toolpath (side view):');
    for (var y = 0; y < 12; y++) {
      var line = '  ';
      for (var x = 0; x < 50; x++) {
        var t = y / 12;
        var wave = Math.sin(x * 0.3 + y * 0.5) * (3 - t * 2);
        var pos = 25 + wave;
        line += Math.abs(x - pos) < 1.5 ? (y < 6 ? '▓' : '░') : ' ';
      }
      console.log(line);
    }
    console.log('  ' + '▓'.repeat(3) + ' = roughing   ' + '░'.repeat(3) + ' = finishing');
  }

  stepMaterials() {
    this.pause('Material Selection');
    var materials = [
      { part: 'Socket Shell', mat: 'Carbon Fiber', cost: 180, machine: 0.7, bio: true },
      { part: 'Structural Frame', mat: 'Titanium Ti-6Al-4V', cost: 320, machine: 0.6, bio: true },
      { part: 'Sensor Housing', mat: 'Medical PEEK', cost: 85, machine: 0.8, bio: true }
    ];
    console.log('\n  Component          Material            Cost    Machinability  Biocompat');
    console.log('  ' + '─'.repeat(72));
    for (var i = 0; i < materials.length; i++) {
      var m = materials[i];
      console.log('  ' + m.part.padEnd(20) + m.mat.padEnd(20) +
        ('$' + m.cost).padEnd(8) +
        this.bar(m.machine, 1, 12) + '  ' + (m.bio ? '✓ Yes' : '✗ No'));
    }
    console.log('\n  All materials are medical-grade and biocompatible.');
    console.log('  Machinability affects CNC feed rates and tool wear.');
  }

  stepCostEstimate() {
    this.pause('Cost & Time Estimate');
    var matCost = 180 + 320 + 85;
    var cuttingMoves = 180;
    var rapidMoves = 45;
    var cuttingTime = cuttingMoves * 0.5;
    var rapidTime = rapidMoves * 0.1;
    var totalTime = cuttingTime + rapidTime;
    var machineCost = totalTime * 0.80;
    var setupCost = 45;
    var totalCost = matCost + machineCost + setupCost;

    console.log('\n  Time Breakdown:');
    console.log('  Cutting time:  ' + this.bar(cuttingTime, totalTime, 30) + '  ' + cuttingTime.toFixed(0) + ' min');
    console.log('  Rapid moves:   ' + this.bar(rapidTime, totalTime, 30) + '  ' + rapidTime.toFixed(1) + ' min');
    console.log('  Total:         ' + totalTime.toFixed(1) + ' min');
    console.log('  Efficiency:    ' + (cuttingTime / totalTime * 100).toFixed(1) + '% (cutting vs total)');
    console.log('\n  Cost Breakdown:');
    console.log('  Materials:   $' + matCost.toFixed(2).padStart(8) + '  ' + this.bar(matCost, totalCost, 25));
    console.log('  Machining:   $' + machineCost.toFixed(2).padStart(8) + '  ' + this.bar(machineCost, totalCost, 25));
    console.log('  Setup:       $' + setupCost.toFixed(2).padStart(8) + '  ' + this.bar(setupCost, totalCost, 25));
    console.log('  ─────────────────────');
    console.log('  TOTAL:       $' + totalCost.toFixed(2).padStart(8));
  }

  stepPatterns() {
    this.pause('Bio-Inspired Patterns');
    console.log('\n  The system generates 4 nature-inspired CNC patterns:\n');
    console.log('  1. HONEYCOMB — hexagonal cells with φ-scaled inner cavities');
    console.log('     Strength-to-weight ratio optimized for structural support.\n');
    console.log('  2. LEAF VENATION — branching network at golden angles');
    console.log('     Models how leaves distribute nutrients (= stress paths).\n');
    console.log('  3. FRACTAL TREE — recursive branches at ±(golden angle/2)');
    console.log('     Each level shrinks by φ⁻¹. Self-similar at every scale.\n');
    console.log('  4. VORONOI ORGANIC — cells seeded at golden angle positions');
    console.log('     Creates natural-looking boundaries for stress distribution.\n');

    // ASCII fractal tree
    console.log('  Mini fractal tree (ASCII):');
    var grid = [];
    for (var r = 0; r < 16; r++) { grid[r] = []; for (var c = 0; c < 50; c++) grid[r][c] = ' '; }
    this.asciiBranch(grid, 25, 15, -Math.PI / 2, 6, 4);
    for (var r = 0; r < 16; r++) console.log('  ' + grid[r].join(''));
  }

  asciiBranch(grid, x, y, angle, len, depth) {
    if (depth === 0 || len < 1) return;
    var x2 = x + len * Math.cos(angle);
    var y2 = y + len * Math.sin(angle);
    // Draw line
    var steps = Math.ceil(len);
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var gx = Math.round(x + (x2 - x) * t);
      var gy = Math.round(y + (y2 - y) * t);
      if (gy >= 0 && gy < 16 && gx >= 0 && gx < 50) {
        grid[gy][gx] = depth > 2 ? '│' : '·';
      }
    }
    var ba = this.GOLDEN_ANGLE * Math.PI / 180 / 2;
    this.asciiBranch(grid, x2, y2, angle - ba, len * this.PHI_INV, depth - 1);
    this.asciiBranch(grid, x2, y2, angle + ba * this.PHI_INV, len * this.PHI_INV, depth - 1);
  }

  stepSummary() {
    this.pause('Summary');
    console.log('\n  The Golden Ratio Prosthetic System uses φ at every level:');
    console.log('  ┌──────────────────────────────────────────────────┐');
    console.log('  │  Socket taper     → φ⁻¹ diameter scaling        │');
    console.log('  │  Wall thickness   → φ⁻¹ per layer               │');
    console.log('  │  Sensor spacing   → 137.5° golden angle         │');
    console.log('  │  Comfort channels → φ-spiral with φ⁻¹ depth     │');
    console.log('  │  CNC stepover     → tool dia × φ⁻¹              │');
    console.log('  │  Bio patterns     → φ-branching & φ-cells       │');
    console.log('  │  Fractal encoding → φ self-similarity           │');
    console.log('  └──────────────────────────────────────────────────┘');
    console.log('\n  To explore further:');
    console.log('    node prosthetic-cnc-system.js       → full system demo');
    console.log('    node enhanced-golden-cnc-system.js   → bio patterns');
    console.log('    node phi-fractal-codec.js            → data compression');
    console.log('    open prosthetic-sim.html             → browser visual');
    console.log('    node model-exporter.js               → export SVG/STL/G-code');
    console.log('    node junk-to-use-helper.js           → build from scrap\n');
  }
}

new TerminalSim().run();
