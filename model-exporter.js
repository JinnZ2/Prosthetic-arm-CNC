/* ============================================================
 *  Golden Ratio Prosthetic — Model Exporter
 *  Generates SVG diagrams, STL 3D models, and G-code files
 *  Run: node model-exporter.js
 * ============================================================ */

const fs = require('fs');

class ModelExporter {
  constructor() {
    this.PHI = (1 + Math.sqrt(5)) / 2;
    this.PHI_INV = 1 / this.PHI;
    this.GOLDEN_ANGLE = 137.5077640844;
  }

  /* ── Socket geometry (shared by all exporters) ── */
  generateSocketGeometry(circumference, residualLength, sensorCount) {
    circumference = circumference || 280;
    residualLength = residualLength || 200;
    sensorCount = sensorCount || 8;

    var proxD = circumference / Math.PI;
    var distD = proxD * this.PHI_INV;
    var len = Math.min(residualLength * 0.85, proxD * this.PHI);

    var profile = [];
    for (var i = 0; i <= 40; i++) {
      var t = i / 40;
      var d = proxD + (distD - proxD) * Math.pow(t, this.PHI_INV);
      profile.push({ t: t, diameter: d, z: t * len });
    }

    var sensors = [];
    for (var i = 0; i < sensorCount; i++) {
      var angle = i * this.GOLDEN_ANGLE;
      var rad = angle * Math.PI / 180;
      var r = proxD / 2 * 0.85;
      var z = len * (i + 1) / (sensorCount + 1) * this.PHI_INV;
      sensors.push({
        id: 'EMG_' + (i + 1),
        angle: angle % 360,
        x: r * Math.cos(rad),
        y: r * Math.sin(rad),
        z: z,
        primary: i < 2
      });
    }

    return {
      proximalDiameter: proxD,
      distalDiameter: distD,
      length: len,
      wallThickness: { proximal: 4, middle: 4 * this.PHI_INV, distal: 4 * this.PHI_INV * this.PHI_INV },
      profile: profile,
      sensors: sensors
    };
  }

  /* ════════════════════════════════════════════════
   *  SVG Export — 2D cross-sections and sensor map
   * ════════════════════════════════════════════════ */
  exportSVG(filename) {
    filename = filename || 'prosthetic-socket.svg';
    var geo = this.generateSocketGeometry();
    var w = 800, h = 600;
    var cx = 400, topY = 40, scale = 3;
    var lines = [];

    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">');
    lines.push('<rect width="100%" height="100%" fill="#0a0a0f"/>');

    // Title
    lines.push('<text x="400" y="25" fill="#f0c040" font-family="monospace" font-size="14" text-anchor="middle">Golden Ratio Prosthetic Socket — φ = ' + this.PHI.toFixed(6) + '</text>');

    // Socket profile (right side)
    var pathR = 'M';
    var pathL = 'M';
    var pathIR = 'M';
    var pathIL = 'M';
    for (var i = 0; i < geo.profile.length; i++) {
      var p = geo.profile[i];
      var x = p.diameter / 2 * scale;
      var y = topY + p.z * scale;
      var wall = geo.wallThickness.proximal + (geo.wallThickness.distal - geo.wallThickness.proximal) * p.t;
      var ix = (p.diameter / 2 - wall) * scale;
      pathR += (i === 0 ? '' : ' L') + ' ' + (cx + x).toFixed(1) + ' ' + y.toFixed(1);
      pathL += (i === 0 ? '' : ' L') + ' ' + (cx - x).toFixed(1) + ' ' + y.toFixed(1);
      pathIR += (i === 0 ? '' : ' L') + ' ' + (cx + ix).toFixed(1) + ' ' + y.toFixed(1);
      pathIL += (i === 0 ? '' : ' L') + ' ' + (cx - ix).toFixed(1) + ' ' + y.toFixed(1);
    }
    lines.push('<path d="' + pathR + '" fill="none" stroke="#f0c040" stroke-width="2"/>');
    lines.push('<path d="' + pathL + '" fill="none" stroke="#f0c040" stroke-width="2"/>');
    lines.push('<path d="' + pathIR + '" fill="none" stroke="#806020" stroke-width="1" stroke-dasharray="4,4"/>');
    lines.push('<path d="' + pathIL + '" fill="none" stroke="#806020" stroke-width="1" stroke-dasharray="4,4"/>');

    // Dimension labels
    var proxR = (geo.proximalDiameter / 2 * scale).toFixed(0);
    lines.push('<text x="' + (cx + +proxR + 15) + '" y="' + (topY + 15) + '" fill="#888" font-family="monospace" font-size="11">Ø' + geo.proximalDiameter.toFixed(1) + 'mm</text>');
    var distR = (geo.distalDiameter / 2 * scale).toFixed(0);
    var bottomY = (topY + geo.length * scale).toFixed(0);
    lines.push('<text x="' + (cx + +distR + 15) + '" y="' + bottomY + '" fill="#888" font-family="monospace" font-size="11">Ø' + geo.distalDiameter.toFixed(1) + 'mm</text>');

    // Sensor positions on profile
    for (var i = 0; i < geo.sensors.length; i++) {
      var s = geo.sensors[i];
      var t = s.z / geo.length;
      var d = geo.proximalDiameter + (geo.distalDiameter - geo.proximalDiameter) * Math.pow(t, this.PHI_INV);
      var sx = cx + d / 2 * scale * 0.85 * Math.cos(s.angle * Math.PI / 180);
      var sy = topY + s.z * scale;
      var color = s.primary ? '#f0c040' : '#4060f0';
      lines.push('<circle cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="' + (s.primary ? 5 : 4) + '" fill="' + color + '"/>');
      lines.push('<text x="' + (sx + 8).toFixed(1) + '" y="' + (sy + 3).toFixed(1) + '" fill="' + color + '" font-family="monospace" font-size="9">' + s.id + '</text>');
    }

    // Phi ratio annotation
    lines.push('<text x="400" y="' + (+bottomY + 30) + '" fill="#f0c040" font-family="monospace" font-size="12" text-anchor="middle">Taper ratio: Ø proximal / Ø distal = φ = ' + (geo.proximalDiameter / geo.distalDiameter).toFixed(6) + '</text>');

    lines.push('</svg>');

    fs.writeFileSync(filename, lines.join('\n'));
    console.log('  SVG exported: ' + filename + ' (' + lines.length + ' lines)');
    return filename;
  }

  /* ════════════════════════════════════════════════
   *  STL Export — 3D socket mesh (ASCII STL)
   * ════════════════════════════════════════════════ */
  exportSTL(filename) {
    filename = filename || 'prosthetic-socket.stl';
    var geo = this.generateSocketGeometry();
    var segments = 32; // angular resolution
    var rings = geo.profile.length;
    var lines = [];

    lines.push('solid GoldenRatioSocket');

    // Generate ring vertices
    var outerRings = [];
    for (var r = 0; r < rings; r++) {
      var ring = [];
      var d = geo.profile[r].diameter;
      var z = geo.profile[r].z;
      for (var s = 0; s < segments; s++) {
        var a = (s / segments) * Math.PI * 2;
        ring.push({
          x: (d / 2) * Math.cos(a),
          y: (d / 2) * Math.sin(a),
          z: z
        });
      }
      outerRings.push(ring);
    }

    // Triangulate between rings
    for (var r = 0; r < rings - 1; r++) {
      for (var s = 0; s < segments; s++) {
        var s2 = (s + 1) % segments;
        var v0 = outerRings[r][s];
        var v1 = outerRings[r][s2];
        var v2 = outerRings[r + 1][s];
        var v3 = outerRings[r + 1][s2];

        // Triangle 1
        var n1 = this.triangleNormal(v0, v1, v2);
        lines.push('  facet normal ' + n1.x.toFixed(6) + ' ' + n1.y.toFixed(6) + ' ' + n1.z.toFixed(6));
        lines.push('    outer loop');
        lines.push('      vertex ' + v0.x.toFixed(6) + ' ' + v0.y.toFixed(6) + ' ' + v0.z.toFixed(6));
        lines.push('      vertex ' + v1.x.toFixed(6) + ' ' + v1.y.toFixed(6) + ' ' + v1.z.toFixed(6));
        lines.push('      vertex ' + v2.x.toFixed(6) + ' ' + v2.y.toFixed(6) + ' ' + v2.z.toFixed(6));
        lines.push('    endloop');
        lines.push('  endfacet');

        // Triangle 2
        var n2 = this.triangleNormal(v1, v3, v2);
        lines.push('  facet normal ' + n2.x.toFixed(6) + ' ' + n2.y.toFixed(6) + ' ' + n2.z.toFixed(6));
        lines.push('    outer loop');
        lines.push('      vertex ' + v1.x.toFixed(6) + ' ' + v1.y.toFixed(6) + ' ' + v1.z.toFixed(6));
        lines.push('      vertex ' + v3.x.toFixed(6) + ' ' + v3.y.toFixed(6) + ' ' + v3.z.toFixed(6));
        lines.push('      vertex ' + v2.x.toFixed(6) + ' ' + v2.y.toFixed(6) + ' ' + v2.z.toFixed(6));
        lines.push('    endloop');
        lines.push('  endfacet');
      }
    }

    lines.push('endsolid GoldenRatioSocket');

    fs.writeFileSync(filename, lines.join('\n'));
    var triangles = (rings - 1) * segments * 2;
    console.log('  STL exported: ' + filename + ' (' + triangles + ' triangles, ' + rings + ' rings × ' + segments + ' segments)');
    return filename;
  }

  triangleNormal(a, b, c) {
    var u = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
    var v = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
    var n = {
      x: u.y * v.z - u.z * v.y,
      y: u.z * v.x - u.x * v.z,
      z: u.x * v.y - u.y * v.x
    };
    var len = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z) || 1;
    return { x: n.x / len, y: n.y / len, z: n.z / len };
  }

  /* ════════════════════════════════════════════════
   *  G-code Export — CNC-ready toolpath file
   * ════════════════════════════════════════════════ */
  exportGCode(filename) {
    filename = filename || 'prosthetic-socket.gcode';
    var geo = this.generateSocketGeometry();
    var lines = [];

    lines.push('( Golden Ratio Prosthetic Socket )');
    lines.push('( Generated by model-exporter.js )');
    lines.push('( Proximal: ' + geo.proximalDiameter.toFixed(1) + 'mm  Distal: ' + geo.distalDiameter.toFixed(1) + 'mm  Length: ' + geo.length.toFixed(1) + 'mm )');
    lines.push('');
    lines.push('G21 ( Metric )');
    lines.push('G90 ( Absolute positioning )');
    lines.push('G17 ( XY plane )');
    lines.push('');

    // Roughing pass — helical descent
    lines.push('( === ROUGHING PASS === )');
    lines.push('M3 S12000 ( Spindle on )');
    lines.push('G4 P2 ( Dwell for spindle )');
    lines.push('G0 Z5.000 ( Safe height )');

    var depthPerPass = 2.0;
    var passes = Math.ceil(geo.length / depthPerPass);
    for (var p = 0; p < passes; p++) {
      var z = -(p + 1) * depthPerPass;
      if (-z > geo.length) z = -geo.length;
      var t = -z / geo.length;
      var d = geo.proximalDiameter + (geo.distalDiameter - geo.proximalDiameter) * Math.pow(t, this.PHI_INV);
      var r = d / 2;

      lines.push('');
      lines.push('( Roughing ring at Z=' + z.toFixed(1) + ' D=' + d.toFixed(1) + ' )');
      lines.push('G0 X' + r.toFixed(3) + ' Y0.000');
      lines.push('G0 Z' + (z + 1).toFixed(3));
      // Helical arc descent
      lines.push('G2 X' + r.toFixed(3) + ' Y0.000 I' + (-r).toFixed(3) + ' J0.000 Z' + z.toFixed(3) + ' F800');
      // Full circle cleanup
      lines.push('G2 X' + r.toFixed(3) + ' Y0.000 I' + (-r).toFixed(3) + ' J0.000 F800');
    }

    lines.push('');
    lines.push('G0 Z5.000 ( Retract )');
    lines.push('');

    // Finishing pass — spiral descent
    lines.push('( === FINISHING PASS === )');
    var finishSteps = 200;
    lines.push('G0 X' + (geo.proximalDiameter / 2).toFixed(3) + ' Y0.000 Z1.000');
    for (var i = 0; i < finishSteps; i++) {
      var t = i / finishSteps;
      var z = -t * geo.length;
      var d = geo.proximalDiameter + (geo.distalDiameter - geo.proximalDiameter) * Math.pow(t, this.PHI_INV);
      var r = d / 2;
      var a = t * Math.PI * 2 * 10; // 10 spiral turns
      var x = r * Math.cos(a);
      var y = r * Math.sin(a);
      lines.push('G1 X' + x.toFixed(3) + ' Y' + y.toFixed(3) + ' Z' + z.toFixed(3) + ' F400');
    }

    lines.push('');
    lines.push('G0 Z10.000 ( Retract )');
    lines.push('M5 ( Spindle off )');
    lines.push('G0 X0.000 Y0.000 ( Return home )');
    lines.push('M30 ( Program end )');

    fs.writeFileSync(filename, lines.join('\n'));
    console.log('  G-code exported: ' + filename + ' (' + lines.length + ' lines, ' + passes + ' roughing rings + ' + finishSteps + ' finish points)');
    return filename;
  }

  /* ── Run all exports ── */
  exportAll() {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║  φ  Golden Ratio Prosthetic — Model Exporter  ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    var geo = this.generateSocketGeometry();
    console.log('  Socket: Ø' + geo.proximalDiameter.toFixed(1) + 'mm → Ø' + geo.distalDiameter.toFixed(1) + 'mm, length ' + geo.length.toFixed(1) + 'mm');
    console.log('  Ratio: proximal/distal = φ = ' + (geo.proximalDiameter / geo.distalDiameter).toFixed(6) + '\n');

    console.log('=== SVG Diagram ===');
    this.exportSVG();

    console.log('\n=== STL 3D Model ===');
    this.exportSTL();

    console.log('\n=== G-code Toolpath ===');
    this.exportGCode();

    console.log('\n  Done! Files ready for:');
    console.log('  • SVG  → open in browser or Inkscape for 2D diagrams');
    console.log('  • STL  → import into slicer (Cura, PrusaSlicer) or CAD (Fusion 360)');
    console.log('  • G-code → load into CNC simulator (CAMotics) or send to machine\n');
  }
}

new ModelExporter().exportAll();
