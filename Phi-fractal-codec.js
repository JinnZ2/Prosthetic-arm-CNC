Golden Ratio Fractal Coding System

 * A compression algorithm based on golden ratio self-similarity
 */

class GoldenRatioFractalCodec {
    constructor() {
        this.PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio
        this.PHI_INV = 1 / this.PHI;       // 1/φ ≈ 0.618
        this.GOLDEN_ANGLE = 137.5077640844; // 360° * (2 - φ)
        this.MAX_DEPTH = 12; // Maximum recursion depth
        this.THRESHOLD = 0.01; // Similarity threshold
    }

    /**
     * Generate Fibonacci sequence up to n terms
     */
    fibonacci(n) {
        if (n <= 0) return [];
        if (n === 1) return [1];
        
        const fib = [1, 1];
        for (let i = 2; i < n; i++) {
            fib[i] = fib[i-1] + fib[i-2];
        }
        return fib;
    }

    /**
     * Create golden spiral coordinates
     */
    goldenSpiral(points, radius = 1) {
        const coords = [];
        const angleStep = this.GOLDEN_ANGLE * Math.PI / 180;
        
        for (let i = 0; i < points; i++) {
            const angle = i * angleStep;
            const r = radius * Math.pow(this.PHI_INV, i / 10);
            coords.push({
                x: r * Math.cos(angle),
                y: r * Math.sin(angle),
                index: i
            });
        }
        return coords;
    }

    /**
     * Fractal pattern detection using golden ratio scaling
     */
    detectFractalPatterns(data) {
        const patterns = [];
        const dataLength = data.length;
        
        // Look for patterns at different golden ratio scales
        for (let scale = 1; scale <= 8; scale++) {
            const segmentSize = Math.floor(dataLength * Math.pow(this.PHI_INV, scale));
            if (segmentSize < 4) break;
            
            const segments = this.segmentData(data, segmentSize);
            const similarities = this.findSimilarSegments(segments);
            
            if (similarities.length > 0) {
                patterns.push({
                    scale: scale,
                    segmentSize: segmentSize,
                    patterns: similarities,
                    compressionRatio: this.calculateCompressionRatio(similarities, segmentSize)
                });
            }
        }
        
        return patterns.sort((a, b) => b.compressionRatio - a.compressionRatio);
    }

    /**
     * Segment data into chunks of specified size
     */
    segmentData(data, segmentSize) {
        const segments = [];
        for (let i = 0; i < data.length - segmentSize + 1; i += Math.floor(segmentSize * this.PHI_INV)) {
            segments.push({
                data: data.slice(i, i + segmentSize),
                position: i
            });
        }
        return segments;
    }

    /**
     * Find similar segments using correlation analysis
     */
    findSimilarSegments(segments) {
        const similarities = [];
        
        for (let i = 0; i < segments.length; i++) {
            const matches = [];
            for (let j = i + 1; j < segments.length; j++) {
                const correlation = this.calculateCorrelation(segments[i].data, segments[j].data);
                if (correlation > (1 - this.THRESHOLD)) {
                    matches.push({
                        index: j,
                        position: segments[j].position,
                        correlation: correlation
                    });
                }
            }
            
            if (matches.length > 0) {
                similarities.push({
                    masterIndex: i,
                    masterPosition: segments[i].position,
                    masterData: segments[i].data,
                    matches: matches
                });
            }
        }
        
        return similarities;
    }

    /**
     * Calculate Pearson correlation coefficient
     */
    calculateCorrelation(arr1, arr2) {
        if (arr1.length !== arr2.length) return 0;
        
        const n = arr1.length;
        const sum1 = arr1.reduce((a, b) => a + b, 0);
        const sum2 = arr2.reduce((a, b) => a + b, 0);
        const sum1Sq = arr1.reduce((a, b) => a + b * b, 0);
        const sum2Sq = arr2.reduce((a, b) => a + b * b, 0);
        const pSum = arr1.reduce((sum, a, i) => sum + a * arr2[i], 0);
        
        const num = pSum - (sum1 * sum2 / n);
        const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
        
        return den === 0 ? 0 : num / den;
    }

    /**
     * Calculate compression ratio for a pattern set
     */
    calculateCompressionRatio(similarities, segmentSize) {
        let totalSaved = 0;
        let totalOriginal = 0;
        
        similarities.forEach(sim => {
            const originalSize = segmentSize * (1 + sim.matches.length);
            const compressedSize = segmentSize + sim.matches.length * 8; // 8 bytes for position reference
            totalSaved += originalSize - compressedSize;
            totalOriginal += originalSize;
        });
        
        return totalOriginal > 0 ? totalSaved / totalOriginal : 0;
    }

    /**
     * Encode data using golden ratio fractal compression
     */
    encode(data) {
        const startTime = performance.now();
        
        // Detect fractal patterns
        const patterns = this.detectFractalPatterns(data);
        
        if (patterns.length === 0) {
            return {
                success: false,
                message: "No suitable fractal patterns found",
                originalSize: data.length,
                compressedSize: data.length,
                compressionRatio: 0
            };
        }
        
        // Use the best pattern for encoding
        const bestPattern = patterns[0];
        const encoded = this.createEncodedStructure(data, bestPattern);
        
        const endTime = performance.now();
        
        return {
            success: true,
            encoded: encoded,
            originalSize: data.length,
            compressedSize: this.calculateEncodedSize(encoded),
            compressionRatio: bestPattern.compressionRatio,
            processingTime: endTime - startTime,
            patterns: patterns.length,
            goldenRatioScale: bestPattern.scale
        };
    }

    /**
     * Create encoded structure from detected patterns
     */
    createEncodedStructure(data, pattern) {
        const structure = {
            header: {
                phi: this.PHI,
                scale: pattern.scale,
                segmentSize: pattern.segmentSize,
                originalLength: data.length
            },
            masterSegments: [],
            references: [],
            residual: []
        };
        
        const usedPositions = new Set();
        
        // Store master segments and their references
        pattern.patterns.forEach(sim => {
            structure.masterSegments.push({
                position: sim.masterPosition,
                data: sim.masterData
            });
            
            usedPositions.add(sim.masterPosition);
            
            sim.matches.forEach(match => {
                structure.references.push({
                    masterIndex: structure.masterSegments.length - 1,
                    position: match.position,
                    correlation: match.correlation
                });
                usedPositions.add(match.position);
            });
        });
        
        // Store residual data (non-pattern data)
        for (let i = 0; i < data.length; i++) {
            if (!usedPositions.has(i)) {
                structure.residual.push({
                    position: i,
                    value: data[i]
                });
            }
        }
        
        return structure;
    }

    /**
     * Decode fractal-encoded data
     */
    decode(encoded) {
        if (!encoded.success) {
            throw new Error("Cannot decode failed encoding");
        }
        
        const structure = encoded.encoded;
        const reconstructed = new Array(structure.header.originalLength);
        
        // Reconstruct from master segments
        structure.masterSegments.forEach((master, masterIndex) => {
            // Place master segment
            for (let i = 0; i < master.data.length; i++) {
                if (master.position + i < reconstructed.length) {
                    reconstructed[master.position + i] = master.data[i];
                }
            }
            
            // Place referenced segments
            structure.references
                .filter(ref => ref.masterIndex === masterIndex)
                .forEach(ref => {
                    for (let i = 0; i < master.data.length; i++) {
                        if (ref.position + i < reconstructed.length) {
                            reconstructed[ref.position + i] = master.data[i];
                        }
                    }
                });
        });
        
        // Fill in residual data
        structure.residual.forEach(residual => {
            if (residual.position < reconstructed.length) {
                reconstructed[residual.position] = residual.value;
            }
        });
        
        return reconstructed;
    }

    /**
     * Calculate encoded size estimation
     */
    calculateEncodedSize(structure) {
        let size = 32; // Header
        size += structure.masterSegments.length * structure.header.segmentSize * 4; // Master data
        size += structure.references.length * 12; // References (3 integers)
        size += structure.residual.length * 8; // Residual data
        return size;
    }

    /**
     * Generate test data with fractal properties
     */
    generateFractalTestData(length = 1000) {
        const data = [];
        const basePattern = [1, 1, 2, 3, 5, 8, 13, 21]; // Fibonacci sequence
        
        for (let i = 0; i < length; i++) {
            const scale1 = Math.sin(i * 0.1) * basePattern[i % basePattern.length];
            const scale2 = Math.cos(i * 0.05) * basePattern[(i * 2) % basePattern.length] * this.PHI_INV;
            const scale3 = Math.sin(i * 0.02) * basePattern[(i * 3) % basePattern.length] * Math.pow(this.PHI_INV, 2);
            
            data.push(scale1 + scale2 + scale3 + Math.random() * 0.1);
        }
        
        return data;
    }

    /**
     * Analyze compression effectiveness
     */
    analyzeCompression(originalData, encodedResult) {
        const decoded = this.decode(encodedResult);
        
        // Calculate error metrics
        const mse = this.calculateMSE(originalData, decoded);
        const psnr = this.calculatePSNR(originalData, decoded);
        
        return {
            compressionRatio: encodedResult.compressionRatio,
            sizeSaving: ((encodedResult.originalSize - encodedResult.compressedSize) / encodedResult.originalSize * 100).toFixed(2) + '%',
            meanSquaredError: mse,
            peakSignalToNoiseRatio: psnr,
            goldenRatioUtilization: encodedResult.goldenRatioScale,
            processingTime: encodedResult.processingTime.toFixed(2) + 'ms',
            patternsFound: encodedResult.patterns
        };
    }

    /**
     * Calculate Mean Squared Error
     */
    calculateMSE(original, decoded) {
        if (original.length !== decoded.length) return Infinity;
        
        let sum = 0;
        for (let i = 0; i < original.length; i++) {
            const diff = original[i] - (decoded[i] || 0);
            sum += diff * diff;
        }
        return sum / original.length;
    }

    /**
     * Calculate Peak Signal-to-Noise Ratio
     */
    calculatePSNR(original, decoded) {
        const mse = this.calculateMSE(original, decoded);
        if (mse === 0) return Infinity;
        
        const maxValue = Math.max(...original);
        return 20 * Math.log10(maxValue / Math.sqrt(mse));
    }
}

// Example usage and demonstration
const codec = new GoldenRatioFractalCodec();

// Generate test data with fractal properties
console.log("=== Golden Ratio Fractal Codec Demo ===\n");

const testData = codec.generateFractalTestData(500);
console.log(`Generated test data: ${testData.length} samples`);

// Encode the data
const encoded = codec.encode(testData);
console.log("\nEncoding Results:");
console.log(`Success: ${encoded.success}`);
if (encoded.success) {
    console.log(`Original size: ${encoded.originalSize} samples`);
    console.log(`Compressed size: ${encoded.compressedSize} bytes`);
    console.log(`Compression ratio: ${(encoded.compressionRatio * 100).toFixed(2)}%`);
    console.log(`Golden ratio scale used: ${encoded.goldenRatioScale}`);
    console.log(`Processing time: ${encoded.processingTime.toFixed(2)}ms`);
    console.log(`Patterns detected: ${encoded.patterns}`);
}

// Analyze compression quality
if (encoded.success) {
    const analysis = codec.analyzeCompression(testData, encoded);
    console.log("\nCompression Analysis:");
    console.log(`Size saving: ${analysis.sizeSaving}`);
    console.log(`Mean Squared Error: ${analysis.meanSquaredError.toFixed(6)}`);
    console.log(`PSNR: ${analysis.peakSignalToNoiseRatio.toFixed(2)} dB`);
    console.log(`Golden ratio utilization: Scale ${analysis.goldenRatioUtilization}`);
}

// Demonstrate golden spiral coordinates
console.log("\n=== Golden Spiral Coordinates ===");
const spiralPoints = codec.goldenSpiral(10);
spiralPoints.forEach((point, i) => {
    console.log(`Point ${i}: (${point.x.toFixed(3)}, ${point.y.toFixed(3)})`);
});

// Show Fibonacci sequence
console.log("\n=== Fibonacci Sequence (Golden Ratio Related) ===");
const fibSeq = codec.fibonacci(15);
console.log(fibSeq.join(', '));

// Calculate golden ratio approximations from Fibonacci
console.log("\nGolden Ratio Approximations from Fibonacci:");
for (let i = 1; i < Math.min(10, fibSeq.length - 1); i++) {
    const ratio = fibSeq[i + 1] / fibSeq[i];
    console.log(`F(${i+2})/F(${i+1}) = ${ratio.toFixed(6)} (φ ≈ ${codec.PHI.toFixed(6)})`);
}
