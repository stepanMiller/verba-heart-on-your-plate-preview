#!/usr/bin/env python3
"""5-second optical cutout motion study, not 3D or generative image-to-video.
Uses only approved source image. No paid calls; no membrane/cargo deformation.
"""
from pathlib import Path
import math,json,subprocess,hashlib
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageEnhance
ROOT=Path(__file__).resolve().parents[3]
VER=ROOT/'versions/v5-astra';ASSETS=VER/'assets';QC=VER/'renders/s03-motion-qc';QC.mkdir(parents=True,exist_ok=True)
W,H,FPS,N=1280,720,24,120
SOURCE=ASSETS/'s03-lipoprotein-cutaway.webp'
SRC=Image.open(SOURCE).convert('RGB')
FONT='/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf'
def font(n):return ImageFont.truetype(FONT,n)
def smooth(v):v=max(0,min(1,v));return v*v*(3-2*v)
# Manual contour follows the approved image silhouette. This is a 2D matte,
# not an inferred mesh or anatomically claimed reconstruction.
points=[(683,453),(696,382),(721,319),(752,252),(794,191),(846,138),(900,91),
        (947,68),(1003,44),(1065,40),(1124,35),(1195,40),(1255,57),(1325,83),
        (1390,131),(1439,187),(1478,250),(1510,321),(1545,407),(1565,493),
        (1565,572),(1554,629),(1526,692),(1492,745),(1437,798),(1367,842),
        (1288,874),(1205,896),(1124,898),(1036,883),(960,855),(887,816),
        (824,770),(774,712),(736,650),(706,581),(688,518)]
mask=Image.new('L',SRC.size,0);ImageDraw.Draw(mask).polygon(points,fill=255)
mask=mask.filter(ImageFilter.GaussianBlur(5))
particle=SRC.convert('RGBA');particle.putalpha(mask)
# Crop away unused source margins, preserving all visible lipoprotein pixels.
particle=particle.crop((655,12,1591,926))
# The source's unoccupied left field supplies the soft environmental plate.
# A reflected copy avoids importing any external anatomy/content.
left=SRC.crop((0,0,642,941))
plate=Image.new('RGB',(1284,941));plate.paste(left,(0,0));plate.paste(left.transpose(Image.Transpose.FLIP_LEFT_RIGHT),(642,0))
plate=plate.resize((1400,815),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(6))
px,py=particle.size
Y,X=np.mgrid[0:py,0:px]
orig=np.asarray(particle).astype(np.float32)
core=np.exp(-((X-570)/220)**2-((Y-467)/310)**2)
# Caption is embedded in independent preview: meaning travels with the movie.
def caption(im):
    layer=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(layer)
    for y in range(557,H):d.line((0,y,W,y),fill=(27,26,16,int(90*((y-557)/(H-557))**1.3)))
    d.text((44,638),'Концептуальный разрез ЛПНП',font=font(23),fill=(255,254,245,255))
    d.text((44,670),'Цвет, форма и масштаб условны',font=font(18),fill=(255,254,245,255))
    return Image.alpha_composite(im,layer)
def frame(i):
    t=i/N;phase=t*2*math.pi
    # Differential optical movement between background and the source-image cutout.
    ox=60+8*math.sin(phase);oy=47+6*math.cos(phase)
    bg=plate.transform((W,H),Image.Transform.EXTENT,(ox,oy,ox+W,oy+H),Image.Resampling.BICUBIC).convert('RGBA')
    # Moving broad light over existing texture. It does not animate or eject cargo.
    lx=475+150*math.sin(phase-.5);ly=345+115*math.cos(phase)
    glint=np.exp(-((X-lx)/235)**2-((Y-ly)/245)**2)
    corelight=.027*(.5+.5*math.sin(phase-.5))*core
    arr=orig.copy();gain=(.974+.065*glint+corelight)[...,None]
    arr[:,:,:3]=np.clip(arr[:,:,:3]*gain,0,255)
    obj=Image.fromarray(arr.astype('uint8'),'RGBA')
    # Subpixel-sized focus modulation, preserving anatomy and texture identity.
    obj=obj.filter(ImageFilter.GaussianBlur(.08+.17*(1+math.sin(phase+.8))/2))
    size=(642,627);obj=obj.resize(size,Image.Resampling.LANCZOS)
    angle=2.3*math.sin(phase+.2)
    obj=obj.rotate(angle,resample=Image.Resampling.BICUBIC,expand=True)
    cx=840+19*math.sin(phase);cy=350-15*math.cos(phase)
    bg.alpha_composite(obj,(round(cx-obj.width/2),round(cy-obj.height/2)))
    # Cargo attention via an explanatory callout, not apparent molecular motion.
    sec=i/FPS;alpha=smooth((sec-1.25)/.45)*smooth((4.45-sec)/.45)
    if alpha>0:
        label=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(label)
        col=(76,73,48,round(235*alpha))
        d.text((56,322),'Липидное ядро',font=font(25),fill=col)
        d.text((56,359),'эфиры холестерина и ТГ',font=font(18),fill=col)
        # Quiet leader ends at the existing core: not an external particle/pathway.
        d.line([(57,404),(344,404),(515,369),(674,369)],fill=(110,107,69,round(90*alpha)),width=1)
        bg=Image.alpha_composite(bg,label)
    return caption(bg).convert('RGB')
OUT=ASSETS/'s03-motion-study.mp4';TMP=ASSETS/'s03-motion-study.rendering.mp4'
cmd=['ffmpeg','-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r','24','-i','-',
     '-an','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',
     '-metadata','title=VERBA S03 — optical motion study',
     '-metadata','comment=2D photo cutout float/roll with procedural relighting; not 3D reconstruction or generative image-to-video. Silent.',str(TMP)]
p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
for i in range(N):
    im=frame(i);p.stdin.write(im.tobytes())
    if i in [0,24,48,72,96,119]:im.save(QC/f'frame-{i:03}.jpg',quality=96)
p.stdin.close();assert p.wait()==0;TMP.replace(OUT)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(OUT)]))
assert float(probe['format']['duration'])==5.0
assert probe['streams'][0]['codec_name']=='h264'
assert int(probe['streams'][0]['nb_frames'])==N
(QC/'ffprobe.json').write_text(json.dumps(probe,ensure_ascii=False,indent=2)+'\n')
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',str(OUT),'-f','null','-'],check=True)
contact=Image.new('RGB',(1280,3*382),'#f0ede0');d=ImageDraw.Draw(contact)
for k,i in enumerate([0,24,48,72,96,119]):
    im=Image.open(QC/f'frame-{i:03}.jpg').resize((640,360),Image.Resampling.LANCZOS)
    x=(k%2)*640;y=(k//2)*382;contact.paste(im,(x,y));d.text((x+12,y+361),f'{i/FPS:.2f} s',font=font(14),fill='#55533a')
contact.save(QC/'contact-sheet.jpg',quality=94)
report={'master':str(OUT.relative_to(ROOT)),'seconds':5.0,'frames':120,'fps':24,'resolution':'1280x720','codec':'H.264/yuv420p','audio':'none',
        'source':str(SOURCE.relative_to(ROOT)),'technique':'Manual 2D photo matte; sinusoidal buoyant translation (19 px x / 15 px y), 2.3-degree planar roll; independent background drift; broad moving exposure light and slight focus modulation. No mesh, depth reconstruction or paid image-to-video.',
        'science':'No shell opening, deformation, cargo escape or new particles. Original conceptual cutaway stays fixed. Visible conceptual caption plus lipid-core contents callout.',
        'full_decode':'pass, ffmpeg exit 0','sha256':hashlib.sha256(OUT.read_bytes()).hexdigest()}
(QC/'QA.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
