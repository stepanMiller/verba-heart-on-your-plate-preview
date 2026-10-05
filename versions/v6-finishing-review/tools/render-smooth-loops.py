"""Offline eased cycles from approved 0–2 / 0–3 second science clips only.
No new anatomy, interpolation model, paid call or source modification.
"""
from pathlib import Path
import subprocess, math, numpy as np
ROOT=Path(__file__).resolve().parents[1]
W,H,FPS=1280,720,24
for stem,seconds in [('s03-lipoprotein',6),('s06-hepatic',8)]:
    source=ROOT.parent/'v5-astra/assets'/f'{stem}-motion-web.mp4'
    # Remove only S06's baked caption on the empty lower-left backdrop.
    # The readable HTML conceptual-image caveat remains on the scene.
    clean=['-vf','delogo=x=35:y=635:w=480:h=65'] if stem=='s06-hepatic' else []
    raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(source),*clean,'-f','rawvideo','-pix_fmt','rgb24','-'])
    frames=np.frombuffer(raw,dtype=np.uint8).reshape((-1,H,W,3))
    out=ROOT/'assets'/f'{stem}-smooth-loop.mp4'
    proc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(out)],stdin=subprocess.PIPE)
    for j in range(seconds*FPS):
        # Cosine travel gives zero velocity at both turnarounds and loop boundary.
        pos=(1-math.cos(2*math.pi*j/(seconds*FPS)))/2*(len(frames)-1)
        a=int(pos);b=min(a+1,len(frames)-1);mix=pos-a
        frame=frames[a] if mix<.001 else np.rint(frames[a]*(1-mix)+frames[b]*mix).astype(np.uint8)
        proc.stdin.write(frame.tobytes())
    proc.stdin.close();assert proc.wait()==0
    print(out)
