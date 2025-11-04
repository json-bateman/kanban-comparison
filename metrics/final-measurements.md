# Framework Performance Comparison

*Measured: 2025-11-04T17:40:25.990Z*

## Methodology

- **Runs per page**: 10
- **Measurement type**: Cold-load (cache cleared between runs)
- **Device**: Mobile (Pixel 5 emulation)
- **Network**: 4G throttling (10 Mbps down, 40ms RTT)
- **CPU**: 1x (no throttling, to isolate bundle size impact)
- **Lighthouse version**: 13.0.1
- **Compression**: gzip

## Board Page Performance

Sorted by raw bundle size (smallest first):

| Framework | Raw (kB) | Compressed (kB) | Ratio | Perf Score | FCP (ms) | LCP (ms) |
|-----------|----------|----------------|-------|------------|----------|----------|
| Go-Datastar | 23.6 ±0.0 | 23.8 ±0.0 | -1% | 82 ±0.0 | 18 ±3 | 18 ±3 |
| Hono-Datastar | 23.6 ±0.0 | 23.7 ±0.0 | -1% | 81 ±0.0 | 22 ±3 | 22 ±3 |
| Marko | 88.8 ±0.0 | 28.8 ±0.0 | 68% | 100 ±0.0 | 35 ±1 | 35 ±1 |
| SvelteKit | 121.1 ±0.0 | 52.6 ±0.0 | 57% | 100 ±0.0 | 32 ±1 | 32 ±1 |
| Astro | 127.3 ±0.0 | 34.3 ±0.0 | 73% | 100 ±0.0 | 49 ±1 | 49 ±1 |
| SolidStart | 128.7 ±0.0 | 41.5 ±0.0 | 68% | 100 ±0.0 | 57 ±14 | 57 ±14 |
| TanStack Start + Solid | 180.9 ±0.0 | 59.8 ±0.0 | 67% | 100 ±0.0 | 36 ±4 | 36 ±4 |
| Nuxt | 224.9 ±0.0 | 74.7 ±0.0 | 67% | 100 ±0.0 | 34 ±2 | 34 ±2 |
| TanStack Start | 372.6 ±0.0 | 118.1 ±0.0 | 68% | 100 ±0.0 | 33 ±1 | 33 ±1 |
| Next.js | 549.9 ±0.0 | 170.7 ±0.0 | 69% | 100 ±0.0 | 31 ±2 | 78 ±2 |

**Explanation:**
- **Raw**: Uncompressed bundle size (actual code volume, more consistent for comparison)
- **Compressed**: Bytes transferred over network (what users download)
- **Ratio**: Percentage saved by compression (higher is better compression)
- Values show median ±std dev from 10 measurement runs
- Compression type: none

## Home Page Performance

Sorted by raw bundle size (smallest first):

| Framework | Raw (kB) | Compressed (kB) | Ratio | Perf Score | FCP (ms) | LCP (ms) |
|-----------|----------|----------------|-------|------------|----------|----------|
| Marko | 12.4 ±0.0 | 6.8 ±0.0 | 45% | 100 ±0.0 | 29 ±1 | 29 ±1 |
| Go-Datastar | 23.6 ±0.0 | 23.8 ±0.0 | -1% | 84 ±0.0 | 16 ±1 | 16 ±1 |
| Hono-Datastar | 23.6 ±0.0 | 23.7 ±0.0 | -1% | 84 ±0.0 | 21 ±9 | 21 ±9 |
| SolidStart | 84.0 ±0.0 | 29.8 ±0.0 | 64% | 100 ±0.0 | 34 ±2 | 34 ±2 |
| Astro | 86.9 ±0.0 | 21.5 ±0.0 | 75% | 100 ±0.0 | 38 ±1 | 38 ±1 |
| SvelteKit | 99.4 ±0.0 | 46.2 ±0.0 | 53% | 100 ±0.0 | 36 ±3 | 36 ±3 |
| TanStack Start + Solid | 144.4 ±0.0 | 48.9 ±0.0 | 66% | 100 ±0.0 | 33 ±4 | 33 ±4 |
| Nuxt | 224.9 ±0.0 | 74.7 ±0.0 | 67% | 100 ±0.0 | 28 ±1 | 28 ±1 |
| TanStack Start | 308.3 ±0.0 | 98.2 ±0.0 | 68% | 100 ±0.0 | 32 ±1 | 32 ±1 |
| Next.js | 467.0 ±0.0 | 142.9 ±0.0 | 69% | 100 ±0.0 | 31 ±2 | 72 ±4 |

**Explanation:**
- **Raw**: Uncompressed bundle size (actual code volume, more consistent for comparison)
- **Compressed**: Bytes transferred over network (what users download)
- **Ratio**: Percentage saved by compression (higher is better compression)
- Values show median ±std dev from 10 measurement runs
- Compression type: gzip

## Failed Measurements

The following frameworks failed to measure: Analog, Qwik

