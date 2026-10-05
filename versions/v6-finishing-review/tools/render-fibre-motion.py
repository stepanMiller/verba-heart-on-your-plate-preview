"""Subtle optical gel deformation of approved fibre still, not physiological simulation.
Oats and lower surface stay still. No LDL or artery is added to the intestinal metaphor.
"""
from pathlib import Path
from PIL import Image
import math,subprocess
ROOT=Path(__file__).resolve().parents[1];W,H=1280,720;N=192
im=Image.open(ROOT.parent/'v5-astra/assets/s05-fibre.webp').convert('RGB').resize((W,H),Image.Resampling.LANCZOS)
out=ROOT/'assets/s05-viscosity-loop.mp4'
p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r','24','-i','-','-an','-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(out)],stdin=subprocess.PIPE)
for j in range(N):
    phase=2*math.pi*j/N
    def point(x,y):
        weight=math.exp(-((x-920)/320)**2-((y-230)/230)**2)*max(0,min(1,(480-y)/110))
        return (x+4*weight*math.sin(phase+y/170),y+2.2*weight*math.sin(phase+x/240))
    mesh=[]
    for y in range(0,H,40):
        for x in range(0,W,40):
            r=min(W,x+40);b=min(H,y+40)
            mesh.append(((x,y,r,b),sum((point(*pt) for pt in [(x,y),(x,b),(r,b),(r,y)]),())))
    frame=im.transform((W,H),Image.Transform.MESH,mesh,Image.Resampling.BICUBIC)
    p.stdin.write(frame.tobytes())
p.stdin.close();assert p.wait()==0
print(out)
