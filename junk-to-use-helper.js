/* ============================================================
 *  Golden Ratio Prosthetic — Junk-to-Use Helper
 *  Scrap material mapper, BOM cost optimizer, and build guide
 *  Run: node junk-to-use-helper.js
 * ============================================================ */

class JunkToUseHelper {
  constructor() {
    this.PHI = (1 + Math.sqrt(5)) / 2;
    this.PHI_INV = 1 / this.PHI;

    /* ── Scrap material database ── */
    this.SCRAP_MAP = {
      /* Source junk → what it replaces in the prosthetic */
      'PVC pipe': {
        replaces: 'Socket shell (outer)',
        originalMaterial: 'Carbon Fiber ($180)',
        scrapCost: '$2-5',
        where: 'Hardware store cutoffs, plumbing scrap',
        prep: 'Cut to length, heat-form to taper using heat gun. Sand inside smooth.',
        rating: 4,
        notes: 'Use Schedule 40 for strength. 3-4" diameter works for most arms.'
      },
      'Aluminum can / sheet': {
        replaces: 'Structural reinforcement strips',
        originalMaterial: 'Titanium frame ($320)',
        scrapCost: '$0-1',
        where: 'Soda cans, cookie sheets, old baking pans',
        prep: 'Cut strips, fold for rigidity. Layer 3-4 strips with epoxy for strength.',
        rating: 3,
        notes: 'Not as strong as titanium but fine for light-duty prototyping.'
      },
      'Bicycle inner tube': {
        replaces: 'Comfort liner / padding',
        originalMaterial: 'Medical-grade silicone liner',
        scrapCost: '$0-2',
        where: 'Bike shops (punctured tubes are free), garage',
        prep: 'Cut open, clean, line inside of socket. Provides grip and cushioning.',
        rating: 5,
        notes: 'Excellent grip and comfort. Multiple layers = adjustable thickness.'
      },
      'Old mouse / keyboard': {
        replaces: 'EMG sensor switches (simplified)',
        originalMaterial: 'Medical PEEK sensor housing ($85)',
        scrapCost: '$0',
        where: 'E-waste bins, old computers',
        prep: 'Harvest microswitches and wiring. Mount at golden angle positions.',
        rating: 2,
        notes: 'Pressure switches, not true EMG. Good for initial prototyping.'
      },
      'Steel coat hanger': {
        replaces: 'Structural frame / internal skeleton',
        originalMaterial: 'Titanium frame ($320)',
        scrapCost: '$0',
        where: 'Closets, dry cleaners',
        prep: 'Straighten, bend to shape. Good for frame ribs along socket length.',
        rating: 3,
        notes: 'Spring steel is surprisingly strong. File sharp ends smooth.'
      },
      'Plastic cutting board': {
        replaces: 'Flat structural components, mounting plates',
        originalMaterial: 'Medical PEEK ($85)',
        scrapCost: '$1-3',
        where: 'Kitchen, thrift stores',
        prep: 'Cut with jigsaw or hacksaw. HDPE is easy to shape and drill.',
        rating: 4,
        notes: 'HDPE is body-safe. Can be heat-welded with a soldering iron.'
      },
      'Leather belt': {
        replaces: 'Harness straps / suspension system',
        originalMaterial: 'Custom nylon strapping',
        scrapCost: '$0-2',
        where: 'Thrift stores, old belts',
        prep: 'Cut to width. Punch holes for adjustment. Rivet or bolt to socket.',
        rating: 5,
        notes: 'Genuine leather is durable and comfortable. Use belt buckle for quick-release.'
      },
      'Arduino / Raspberry Pi': {
        replaces: 'EMG signal processing unit',
        originalMaterial: 'Custom PCB',
        scrapCost: '$5-15',
        where: 'Maker spaces, old projects, eBay',
        prep: 'Wire to muscle sensors. Run signal processing code.',
        rating: 4,
        notes: 'Arduino Nano is smallest. Can process 8 EMG channels at golden angle layout.'
      },
      'Car antenna / spring': {
        replaces: 'Tension return mechanism',
        originalMaterial: 'Custom springs',
        scrapCost: '$0-1',
        where: 'Junkyard, broken umbrellas, old pens',
        prep: 'Cut to length. Tension-test by hand. Attach at φ-ratio position along arm.',
        rating: 3,
        notes: 'Pen springs for fingers, antenna springs for wrist return.'
      },
      'Wooden dowel / broomstick': {
        replaces: 'Forearm extension / pylon',
        originalMaterial: 'Carbon fiber tube',
        scrapCost: '$0-3',
        where: 'Hardware store, old brooms, closet rods',
        prep: 'Cut to φ-ratio length. Sand smooth. Seal with polyurethane.',
        rating: 4,
        notes: 'Hardwood (oak, maple) preferred. Diameter should match distal socket end.'
      },
      'Zip ties / cable ties': {
        replaces: 'Temporary fasteners, cable routing',
        originalMaterial: 'Machined fasteners',
        scrapCost: '$1-2',
        where: 'Everywhere — hardware, office, packaging',
        prep: 'Use as-is. Trim flush. Replace with bolts for permanent build.',
        rating: 5,
        notes: 'Perfect for prototyping. Cheap, adjustable, strong enough for testing.'
      },
      'Epoxy / hot glue': {
        replaces: 'Structural adhesive',
        originalMaterial: 'Medical-grade adhesive',
        scrapCost: '$3-8',
        where: 'Hardware store, craft supplies',
        prep: '2-part epoxy for permanent bonds. Hot glue for temporary/adjustable joints.',
        rating: 4,
        notes: 'JB Weld for metal-to-metal. Hot glue peels off for repositioning.'
      }
    };

    /* ── BOM for full build ── */
    this.BOM = [
      { part: 'Socket shell', qty: 1, ideal: 'Carbon fiber layup', cost: 180, category: 'structure' },
      { part: 'Structural frame', qty: 1, ideal: 'Titanium Ti-6Al-4V', cost: 320, category: 'structure' },
      { part: 'Sensor housing', qty: 8, ideal: 'Medical PEEK', cost: 85, category: 'electronics' },
      { part: 'EMG sensors', qty: 8, ideal: 'MyoWare 2.0', cost: 120, category: 'electronics' },
      { part: 'Microcontroller', qty: 1, ideal: 'Arduino Nano', cost: 12, category: 'electronics' },
      { part: 'Comfort liner', qty: 1, ideal: 'Silicone gel liner', cost: 45, category: 'comfort' },
      { part: 'Suspension straps', qty: 2, ideal: 'Nylon webbing + buckles', cost: 15, category: 'comfort' },
      { part: 'Fasteners (bolts, nuts)', qty: 1, ideal: 'Stainless steel set', cost: 8, category: 'hardware' },
      { part: 'Wiring harness', qty: 1, ideal: 'Shielded cable', cost: 10, category: 'electronics' },
      { part: 'Padding / foam', qty: 1, ideal: 'EVA foam sheets', cost: 6, category: 'comfort' },
      { part: 'Adhesive', qty: 1, ideal: '2-part epoxy', cost: 8, category: 'hardware' },
      { part: 'Pylon / forearm tube', qty: 1, ideal: 'Carbon fiber tube', cost: 35, category: 'structure' }
    ];
  }

  /* ─── Scrap Material Mapper ─── */
  showScrapMap() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   SCRAP MATERIAL MAPPER — What Junk Can You Use?     ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('  Find these around the house, thrift stores, or junkyards.\n');

    var items = Object.keys(this.SCRAP_MAP);
    for (var i = 0; i < items.length; i++) {
      var name = items[i];
      var s = this.SCRAP_MAP[name];
      var stars = '★'.repeat(s.rating) + '☆'.repeat(5 - s.rating);
      console.log('  ┌─ ' + name.toUpperCase() + '  ' + stars + '  (cost: ' + s.scrapCost + ')');
      console.log('  │  Replaces: ' + s.replaces);
      console.log('  │  Instead of: ' + s.originalMaterial);
      console.log('  │  Find it: ' + s.where);
      console.log('  │  Prep: ' + s.prep);
      console.log('  └  Note: ' + s.notes);
      console.log('');
    }
  }

  /* ─── BOM Cost Optimizer ─── */
  showBOM() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   BILL OF MATERIALS — Cost Comparison                 ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    var totalIdeal = 0;
    var totalScrap = 0;

    console.log('  Part                  Ideal Cost   Scrap Cost   Savings');
    console.log('  ' + '─'.repeat(60));

    for (var i = 0; i < this.BOM.length; i++) {
      var b = this.BOM[i];
      var scrapCost = this.estimateScrapCost(b);
      totalIdeal += b.cost;
      totalScrap += scrapCost;
      var saving = b.cost - scrapCost;
      console.log('  ' + b.part.padEnd(24) +
        ('$' + b.cost.toFixed(0)).padStart(8) +
        ('$' + scrapCost.toFixed(0)).padStart(12) +
        ('$' + saving.toFixed(0) + ' (' + (saving / b.cost * 100).toFixed(0) + '%)').padStart(16));
    }
    console.log('  ' + '─'.repeat(60));
    console.log('  TOTAL'.padEnd(24) +
      ('$' + totalIdeal.toFixed(0)).padStart(8) +
      ('$' + totalScrap.toFixed(0)).padStart(12) +
      ('$' + (totalIdeal - totalScrap).toFixed(0) + ' (' + ((totalIdeal - totalScrap) / totalIdeal * 100).toFixed(0) + '%)').padStart(16));
    console.log('\n  φ-optimized savings: reduce ideal cost by factor of ' + (totalIdeal / totalScrap).toFixed(2) + '×');
  }

  estimateScrapCost(bomItem) {
    var scrapCosts = {
      'Socket shell': 5,
      'Structural frame': 3,
      'Sensor housing': 0,
      'EMG sensors': 15,
      'Microcontroller': 10,
      'Comfort liner': 0,
      'Suspension straps': 2,
      'Fasteners (bolts, nuts)': 3,
      'Wiring harness': 2,
      'Padding / foam': 1,
      'Adhesive': 5,
      'Pylon / forearm tube': 2
    };
    return scrapCosts[bomItem.part] || bomItem.cost * 0.1;
  }

  /* ─── Beginner Build Guide ─── */
  showBuildGuide() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   BEGINNER BUILD GUIDE — Your First Prosthetic       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    var steps = [
      {
        title: 'Measure the Residual Limb',
        time: '10 min',
        tools: 'Measuring tape, pen, paper',
        detail: [
          'Measure circumference at widest point → this is your input.',
          'Measure length of residual limb.',
          'The system will calculate: distal Ø = circumference/π × φ⁻¹',
          'That golden ratio taper is what makes the socket feel natural.'
        ]
      },
      {
        title: 'Form the Socket Shell',
        time: '30-60 min',
        tools: 'PVC pipe (3-4"), heat gun or boiling water, sandpaper',
        detail: [
          'Cut PVC to length = measured_length × 0.85.',
          'Heat one end with heat gun until pliable (careful — gloves!).',
          'Squeeze the heated end to create the φ-taper (narrower distal end).',
          'Target: distal diameter = proximal diameter × 0.618 (φ⁻¹).',
          'Sand inside smooth. Round all edges.'
        ]
      },
      {
        title: 'Add the Comfort Liner',
        time: '15 min',
        tools: 'Bicycle inner tube, scissors, contact cement',
        detail: [
          'Cut inner tube open into a flat sheet.',
          'Line the inside of the socket — start from the bottom.',
          'Use contact cement for permanent bond, or friction-fit for adjustable.',
          'Double-layer at bony prominences for extra padding.'
        ]
      },
      {
        title: 'Build the Frame',
        time: '30 min',
        tools: 'Coat hangers or aluminum strips, pliers, file',
        detail: [
          'Straighten 3-4 coat hangers.',
          'Bend into longitudinal ribs along the socket exterior.',
          'Space ribs at golden angle intervals (137.5° apart).',
          'Attach with zip ties or epoxy.',
          'File all sharp ends completely smooth.'
        ]
      },
      {
        title: 'Mark Sensor Positions',
        time: '10 min',
        tools: 'Marker, protractor (or phone compass)',
        detail: [
          'Place socket on table, mark 12 o\'clock position.',
          'From 12 o\'clock, mark sensor spots at these angles:',
          '  Sensor 1:   0.0° (12 o\'clock) — PRIMARY',
          '  Sensor 2: 137.5° — PRIMARY',
          '  Sensor 3: 275.0°',
          '  Sensor 4:  52.5°',
          '  Sensor 5: 190.0°',
          '  Sensor 6: 327.5°',
          '  Sensor 7: 105.0°',
          '  Sensor 8: 242.5°',
          'Drill small holes for wiring (if using electronic sensors).'
        ]
      },
      {
        title: 'Add Suspension',
        time: '15 min',
        tools: 'Leather belt or nylon strap, rivets or bolts',
        detail: [
          'Cut belt to fit around upper arm / shoulder.',
          'Attach to socket at 2 points (opposite sides).',
          'Add adjustment holes every 1cm.',
          'Test fit: socket should stay on when arm hangs down.'
        ]
      },
      {
        title: 'Attach Pylon (if transradial)',
        time: '15 min',
        tools: 'Wooden dowel, drill, bolt',
        detail: [
          'Cut dowel to desired forearm length × φ⁻¹ (shorter = lighter).',
          'Drill through center of dowel and socket distal end.',
          'Bolt together. Add epoxy for permanence.',
          'Sand smooth and seal wood with polyurethane.'
        ]
      },
      {
        title: 'Wire Sensors (Optional)',
        time: '30-60 min',
        tools: 'Arduino, jumper wires, microswitches or EMG sensors',
        detail: [
          'Mount switches at marked sensor positions.',
          'Run wires along frame ribs (zip-tie to frame).',
          'Connect to Arduino pins. Upload test sketch.',
          'Each sensor triggers on muscle flex / pressure.',
          'See prosthetic-cnc-system.js for the golden angle layout code.'
        ]
      },
      {
        title: 'Test and Adjust',
        time: '15 min',
        tools: 'Patience',
        detail: [
          'Put it on. Check:',
          '  □ Socket stays on without hand support',
          '  □ No sharp pressure points',
          '  □ Sensors contact muscle sites',
          '  □ Pylon is aligned (if applicable)',
          'Adjust liner thickness for pressure points.',
          'Trim straps for fit. This is iterative — keep adjusting.'
        ]
      }
    ];

    var totalTime = 0;
    for (var i = 0; i < steps.length; i++) {
      var s = steps[i];
      console.log('  STEP ' + (i + 1) + ': ' + s.title);
      console.log('  Time: ~' + s.time + '  |  Tools: ' + s.tools);
      for (var j = 0; j < s.detail.length; j++) {
        console.log('    ' + s.detail[j]);
      }
      console.log('');
    }

    console.log('  ─────────────────────────────────────────────────');
    console.log('  TOTAL BUILD TIME: ~3-4 hours for first build');
    console.log('  TOTAL SCRAP COST: ~$15-48 (vs $844 ideal materials)');
    console.log('');
    console.log('  SAFETY NOTES:');
    console.log('    • Sand ALL edges smooth — no sharp points anywhere');
    console.log('    • Test with a towel wrap first, not bare skin');
    console.log('    • This is a PROTOTYPE — not a medical device');
    console.log('    • Consult a prosthetist for clinical use');
    console.log('    • The golden ratio dimensions help, but fit is personal');
    console.log('');
  }

  /* ── Run everything ── */
  run() {
    this.showScrapMap();
    this.showBOM();
    console.log('');
    this.showBuildGuide();
  }
}

new JunkToUseHelper().run();
