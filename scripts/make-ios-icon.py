#!/usr/bin/env python3
import math, struct, sys, zlib

out = sys.argv[1] if len(sys.argv) > 1 else 'AppIcon-512@2x.png'
W = H = 1024

def capsule(px, py, ax, ay, bx, by, radius):
    abx, aby = bx-ax, by-ay
    apx, apy = px-ax, py-ay
    denom = abx*abx + aby*aby
    t = 0 if denom == 0 else max(0.0, min(1.0, (apx*abx + apy*aby)/denom))
    qx, qy = ax + t*abx, ay + t*aby
    return (px-qx)**2 + (py-qy)**2 <= radius*radius

raw = bytearray()
for y in range(H):
    raw.append(0)
    for x in range(W):
        # Deep indigo -> violet -> cyan edge glow.
        dx, dy = x-330, y-260
        glow = max(0.0, 1.0 - math.sqrt(dx*dx + dy*dy)/900)
        edge = max(0.0, 1.0 - math.sqrt((x-900)**2 + (y-900)**2)/780)
        r = int(min(255, 32 + 95*glow + 12*edge))
        g = int(min(255, 24 + 55*glow + 90*edge))
        b = int(min(255, 62 + 150*glow + 145*edge))

        # Two crisp slashes, matching the SwipeStart mark.
        if capsule(x, y, 285, 360, 690, 185, 72) or capsule(x, y, 330, 825, 735, 650, 72):
            r, g, b = 248, 249, 255
        raw.extend((r, g, b))

def chunk(kind, data):
    return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data) & 0xffffffff)

png = b'\x89PNG\r\n\x1a\n'
png += chunk(b'IHDR', struct.pack('>IIBBBBB', W, H, 8, 2, 0, 0, 0))
png += chunk(b'IDAT', zlib.compress(bytes(raw), 9))
png += chunk(b'IEND', b'')
with open(out, 'wb') as f:
    f.write(png)
print(f'Wrote {out}')
