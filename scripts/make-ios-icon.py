#!/usr/bin/env python3
import math,struct,sys,zlib
output=sys.argv[1] if len(sys.argv)>1 else 'AppIcon-512@2x.png'
size=1024
raw=bytearray()
for y in range(size):
 raw.append(0)
 for x in range(size):
  dx,dy=(x-512)/512,(y-512)/512
  glow=max(0,1-math.hypot(dx,dy)/1.6)
  r,g,b=int(5+26*glow),int(10+40*glow),int(25+76*glow)
  angle=.60;u=(x-512)*math.cos(angle)-(y-512)*math.sin(angle);v=(x-512)*math.sin(angle)+(y-512)*math.cos(angle)
  angle=-.75;u2=(x-512)*math.cos(angle)-(y-512)*math.sin(angle);v2=(x-512)*math.sin(angle)+(y-512)*math.cos(angle)
  if abs((u/327)**2+(v/118)**2-1)<.035:r,g,b=119,152,255
  if abs((u2/320)**2+(v2/117)**2-1)<.035:r,g,b=76,231,242
  if math.hypot(x-512,y-512)<39:r,g,b=217,250,255
  raw.extend((r,g,b))
def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',size,size,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(bytes(raw),6))+chunk(b'IEND',b'')
with open(output,'wb') as f:f.write(png)
print('Generated icon at',output)
