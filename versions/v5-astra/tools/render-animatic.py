#!/usr/bin/env python3
"""VERBA V5: deterministic offline 26 s / 24 fps editorial animatic.

Requires Python 3, Pillow, NumPy, ffmpeg and ffprobe. No browser, network,
paid generation, slide rendering, face deformation, or synthetic human motion.
Run from anywhere: python versions/v5-astra/tools/render-animatic.py
"""
from pathlib import Path
import argparse, json, math, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

HERE=Path(__file__).resolve().parent
VERSION=HERE.parent
ROOT=VERSION.parent.parent
ASSETS=VERSION/'assets'
QC=VERSION/'renders'/'animatic-qc'
W,H,FPS=1280,720,24
FONT='/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf'
BOLD='/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf'
SERIF='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
# duration sums exactly to 624 frames / 26 s. Every entry is one editorial shot.
SHOTS=[
 dict(id='human-opening', source='s01-master-casting.webp', frames=72,
      start=(.60,.48,1.08), end=(.67,.47,1.20)),
 dict(id='ldl-macro', source='s03-lipoprotein-cutaway.webp', frames=60,
      start=(.67,.50,1.30), end=(.63,.48,1.17),
      caption=('Концептуальный разрез ЛПНП','Цвет, форма и масштаб условны')),
 dict(id='oil-pouring', source='../v4/assets/olive-motion.mp4', frames=36,
      start=(.68,.55,1.18), end=(.68,.55,1.18), video_start=0),
 dict(id='fibre-medium', source='s05-fibre.webp', frames=60,
      start=(.59,.50,1.12), end=(.64,.49,1.22),
      caption=('Вязкая среда в кишечнике · условный образ','Свойства волокон и эффект различаются')),
 dict(id='hepatic-energy', source='s06-hepatic.webp', frames=72,
      start=(.52,.50,1.08), end=(.58,.49,1.13),
      caption=('Печёночный обмен → ТГ в составе ЛПОНП','Возможный путь, не прогноз анализа')),
 dict(id='human-kitchen', source='s08-everyday.webp', frames=60,
      start=(.70,.57,1.30), end=(.67,.54,1.13)),
 dict(id='package-turn', source='native-vector-carton', frames=72),
 dict(id='vessel-cgi', source='../v4/assets/heart-loop.mp4', frames=48,
      start=(.57,.51,1.0), end=(.60,.51,1.04), video_start=2,
      caption=('Концептуальная визуализация кровотока',)),
 dict(id='consultation', source='s12-consultation.webp', frames=72,
      start=(.57,.49,1.14), end=(.58,.49,1.21)),
 dict(id='human-closing', source='s14-closing.webp', frames=72,
      start=(.55,.50,1.05), end=(.57,.49,1.11)),
]

def fnt(n,bold=False,serif=False):
    return ImageFont.truetype(SERIF if serif else BOLD if bold else FONT,n)

def ease(t):
    return t*t*(3-2*t)

def source_path(s):
    return (VERSION/s['source']).resolve() if s['source'].startswith('../') else ASSETS/s['source']

def crop(im, state):
    cx,cy,z=state
    iw,ih=im.size
    cw,ch=(iw,iw*H/W) if iw/ih<W/H else (ih*W/H,ih)
    cw/=z; ch/=z
    x=max(0,min(iw-cw,cx*iw-cw/2)); y=max(0,min(ih-ch,cy*ih-ch/2))
    return im.transform((W,H),Image.Transform.EXTENT,(x,y,x+cw,y+ch),Image.Resampling.BICUBIC)

def caption(im,lines):
    # Readable scene-specific science caveat, on picture; never a presentation footer.
    overlay=Image.new('RGBA',(W,H),(0,0,0,0))
    d=ImageDraw.Draw(overlay)
    base=H-46-30*(len(lines)-1)
    for y in range(H-170,H):
        d.line([(0,y),(W,y)],fill=(14,20,14,int(148*((y-(H-170))/170)**1.15)))
    for j,line in enumerate(lines):
        d.text((44,base+j*30),line,font=fnt(22 if j==0 else 18),fill=(250,248,240,255))
    return Image.alpha_composite(im.convert('RGBA'),overlay).convert('RGB')

def closing_title(im,t):
    opacity=max(0,min(1,(t-.12)/.24))
    if opacity<=0:return im
    layer=Image.new('RGBA',(W,H),(0,0,0,0))
    logo=Image.open(ROOT/'verba-wordmark.png').convert('RGBA')
    # Preserve source logo geometry. White matte extraction only if source has no alpha.
    if logo.getextrema()[3]==(255,255):
        a=255-np.asarray(logo.convert('L'))
        logo=Image.fromarray(np.dstack([np.full_like(a,43),np.full_like(a,52),np.full_like(a,33),a]).astype('uint8'))
    logo.thumbnail((298,62),Image.Resampling.LANCZOS)
    logo.putalpha(logo.getchannel('A').point(lambda a:int(a*opacity)))
    layer.alpha_composite(logo,(62,304))
    d=ImageDraw.Draw(layer)
    d.text((63,396),'Здоровье, встроенное в жизнь',font=fnt(22),fill=(46,54,34,int(255*opacity)))
    return Image.alpha_composite(im.convert('RGBA'),layer).convert('RGB')

# Native object textures: no generative text, no nutritional numbers, no actual product claim.
TW,TH=720,1080

def carton_texture(which,active=-1):
    im=Image.new('RGB',(TW,TH),(232,226,206));d=ImageDraw.Draw(im)
    # quiet paper stock / edge seams; all type created by fonts, not generated pixels
    d.rectangle((20,20,TW-21,TH-21),outline=(208,200,178),width=2)
    if which=='front':
        d.text((68,64),'VERBA',font=fnt(62),fill='#3c482c')
        d.line((70,160,650,160),fill='#b7b99b',width=3)
        d.text((70,216),'ЦЕЛЬНОЕ',font=fnt(60,True),fill='#343d2b')
        d.text((70,300),'ЗЕРНО',font=fnt(82,True),fill='#343d2b')
        # Hand-built botanical vector motif.
        for j in range(5):
            x=200+j*77; y=840-abs(j-2)*35
            d.line((x,910,x+15,y-330),fill='#7d8554',width=5)
            for k in range(5):
                yy=y-55*k
                d.ellipse((x-27,yy-50,x+5,yy+6),fill='#9da36c')
                d.ellipse((x+10,yy-70,x+43,yy-14),fill='#889459')
        d.text((71,963),'ДЕМОНСТРАЦИОННЫЙ МАКЕТ',font=fnt(22),fill='#666c53')
    elif which=='back':
        d.text((64,80),'НА ЭТИКЕТКЕ',font=fnt(54,True),fill='#303c2b')
        d.text((66,159),'Что стоит проверить',font=fnt(27),fill='#66704e')
        labels=[('Насыщенные','жиры'),('Соль / натрий',None),('Добавленные','сахара'),('Размер порции',None)]
        for n,(a,b) in enumerate(labels):
            y=260+n*175
            if active==n:
                d.rounded_rectangle((45,y-25,675,y+125),radius=16,fill='#d0d7ad')
                d.rectangle((45,y-25,55,y+125),fill='#65733e')
            d.text((74,y),a,font=fnt(39,active==n),fill='#35402e')
            if b:d.text((74,y+51),b,font=fnt(39,active==n),fill='#35402e')
            if n<3:d.line((74,y+146,646,y+146),fill='#bebda3',width=2)
        d.text((66,1000),'УЧЕБНЫЙ ОБЪЕКТ · БЕЗ ПИЩЕВЫХ ЗНАЧЕНИЙ',font=fnt(19),fill='#717557')
    else:
        im=Image.new('RGB',(TW,TH),'#87906a');d=ImageDraw.Draw(im)
        for x in range(55,TW,65):d.line((x,60,x,1020),fill='#a0a681',width=2)
    return im

FRONT=carton_texture('front');SIDE=carton_texture('side')
BACKS={i:carton_texture('back',i) for i in range(-1,4)}
# Full-bleed natural studio field; one object and its grounded shadow.
yy,xx=np.mgrid[0:H,0:W]
r=((xx-790)/1150)**2+((yy-250)/950)**2
bg=np.zeros((H,W,3),dtype=np.float32)
for k,(a,b) in enumerate([(237,38),(234,34),(215,29)]):bg[:,:,k]=a-b*r
BACKGROUND=Image.fromarray(np.clip(bg,0,255).astype('uint8'))

# Real 3D geometry with perspective-mapped labels. Face order uses outward normals.
VERTS=np.array([[-150,-245,56],[150,-245,56],[150,245,56],[-150,245,56],
                [-150,-245,-56],[150,-245,-56],[150,245,-56],[-150,245,-56]],dtype=float)
FACES=[([0,1,2,3],[0,0,1],'front'),([5,4,7,6],[0,0,-1],'back'),
       ([1,5,6,2],[1,0,0],'side'),([4,0,3,7],[-1,0,0],'side'),
       ([4,5,1,0],[0,-1,0],'top')]

def coefficients(dst,src):
    a=[];b=[]
    for (x,y),(u,v) in zip(dst,src):
        a.append([x,y,1,0,0,0,-u*x,-u*y]);b.append(u)
        a.append([0,0,0,x,y,1,-v*x,-v*y]);b.append(v)
    return np.linalg.solve(np.array(a),np.array(b))

def package_frame(t):
    # Front readable through 0.4 s; physical turn 0.4–1.5 s; back and scanning 1.5–3 s.
    sec=t*3
    turn=ease(max(0,min(1,(sec-.40)/1.10)))
    angle=math.radians(-17-163*turn)
    ca,sa=math.cos(angle),math.sin(angle)
    rot=np.array([[ca,0,sa],[0,1,0],[-sa,0,ca]])
    xyz=VERTS@rot.T
    # Slight above-object view, giving the carton a visible top plane.
    pitch=math.radians(-5)
    pr=np.array([[1,0,0],[0,math.cos(pitch),-math.sin(pitch)],[0,math.sin(pitch),math.cos(pitch)]])
    xyz=xyz@pr.T
    perspective=1100/(1100-xyz[:,2])
    pts=np.stack([640+xyz[:,0]*perspective,355+xyz[:,1]*perspective],axis=-1)
    im=BACKGROUND.copy().convert('RGBA')
    shadow=Image.new('RGBA',(W,H),(0,0,0,0));sd=ImageDraw.Draw(shadow)
    sd.ellipse((438,586,878,638),fill=(55,58,34,77));shadow=shadow.filter(ImageFilter.GaussianBlur(18))
    im=Image.alpha_composite(im,shadow)
    active=min(3,max(0,int((sec-1.5)/.36))) if sec>=1.5 else -1
    visibles=[]
    for ids,norm,kind in FACES:
        n=np.array(norm)@rot.T@pr.T
        if n[2]>.01:visibles.append((float(np.mean(xyz[ids,2])),ids,n,kind))
    for depth,ids,n,kind in sorted(visibles):
        quad=[tuple(p) for p in pts[ids]]
        tex=FRONT if kind=='front' else BACKS[active] if kind=='back' else SIDE
        if kind=='top':tex=Image.new('RGB',(TW,TH),'#dcd8c0')
        # Lighting is locked to studio, independent from the label surface.
        light=.80+.20*max(0,float(n@np.array([-.35,-.2,.915])))
        tex=ImageEnhance.Brightness(tex).enhance(light).convert('RGBA')
        co=coefficients(quad,[(0,0),(TW,0),(TW,TH),(0,TH)])
        warped=tex.transform((W,H),Image.Transform.PERSPECTIVE,co,Image.Resampling.BICUBIC)
        mask=Image.new('L',(W,H));md=ImageDraw.Draw(mask);md.polygon(quad,fill=255)
        warped.putalpha(mask);im=Image.alpha_composite(im,warped)
        ImageDraw.Draw(im).line(quad+[quad[0]],fill=(129,129,105,175),width=1)
    return im.convert('RGB')

def decode_clip(path,start,count):
    # Decode actual donor frames at original cadence. No repeated/looped still substitution.
    cmd=['ffmpeg','-hide_banner','-loglevel','error','-ss',str(start),'-i',str(path),
         '-frames:v',str(count),'-vf','fps=24','-f','image2pipe','-vcodec','ppm','-']
    p=subprocess.Popen(cmd,stdout=subprocess.PIPE)
    # Pillow cannot stream multiple PPM through seek; parse simple ffmpeg P6 stream.
    for i in range(count):
        assert p.stdout.readline().strip()==b'P6','Unexpected PPM frame'
        dims=p.stdout.readline().strip()
        while dims.startswith(b'#'):dims=p.stdout.readline().strip()
        w,h=map(int,dims.split());assert p.stdout.readline().strip()==b'255'
        data=p.stdout.read(w*h*3)
        if len(data)!=w*h*3:raise RuntimeError('Donor clip ended before requested duration')
        yield Image.frombytes('RGB',(w,h),data)
    p.stdout.close();code=p.wait()
    if code:raise RuntimeError(f'Donor decode failed ({code})')

def frame_for(s,i,clip=None):
    t=i/max(1,s['frames']-1)
    if s['id']=='package-turn':im=package_frame(t)
    else:
        source=next(clip) if clip is not None else Image.open(source_path(s)).convert('RGB')
        q=ease(t)
        state=tuple(a+(b-a)*q for a,b in zip(s['start'],s['end']))
        im=crop(source,state)
    if 'caption'in s:im=caption(im,s['caption'])
    if s['id']=='human-closing':im=closing_title(im,t)
    if s['id']=='human-opening' and i<8:im=ImageEnhance.Brightness(im).enhance(.35+.65*i/7)
    # End holds the single title; final quarter-second closes to dark.
    if s['id']=='human-closing' and i>=s['frames']-6:
        im=ImageEnhance.Brightness(im).enhance((s['frames']-1-i)/5)
    return im

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--preview-only',action='store_true')
    args=parser.parse_args();QC.mkdir(parents=True,exist_ok=True)
    for s in SHOTS:
        if s['id']!='package-turn' and not source_path(s).exists():
            raise SystemExit('Missing approved source: '+str(source_path(s)))
    global_index=0;manifest=[];previews=[]
    out=ASSETS/'animatic.mp4';temp=ASSETS/'animatic.rendering.mp4'
    cmd=['ffmpeg','-hide_banner','-loglevel','warning','-y','-f','rawvideo','-vcodec','rawvideo',
         '-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
         '-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',
         '-movflags','+faststart','-metadata','title=VERBA V5 — Cinematic Animatic',
         '-metadata','comment=Silent 26-second animatic. Optical movement on human reference stills; donor video and native object animation.',str(temp)]
    enc=None if args.preview_only else subprocess.Popen(cmd,stdin=subprocess.PIPE)
    for number,s in enumerate(SHOTS):
        start=global_index/FPS
        manifest.append({**s,'number':number+1,'start_seconds':start,'end_seconds':start+s['frames']/FPS,
                         'source_resolved':str(source_path(s).relative_to(ROOT)) if s['id']!='package-turn' else 'native geometry in tools/render-animatic.py'})
        indices=[s['frames']//2] if args.preview_only else range(s['frames'])
        clip=None
        if s['source'].endswith('.mp4'):
            if args.preview_only:
                clip=decode_clip(source_path(s),s['video_start']+(s['frames']//2)/FPS,1)
            else:clip=decode_clip(source_path(s),s['video_start'],s['frames'])
        print(f'{number+1:02} {s["id"]}: {start:.2f}–{start+s["frames"]/FPS:.2f}s',flush=True)
        for i in indices:
            im=frame_for(s,i,clip)
            if enc:enc.stdin.write(im.tobytes())
            if i==s['frames']//2:
                path=QC/f'shot-{number+1:02}-{s["id"]}.jpg';im.save(path,quality=94)
                previews.append((im.copy(),f'{number+1:02}  {start:04.1f}–{start+s["frames"]/FPS:04.1f}s  {s["id"]}'))
            if s['id']=='package-turn' and i in [0,18,36,51,67]:
                im.save(QC/f'package-frame-{i:02}.jpg',quality=94)
        if clip is not None:clip.close()
        global_index+=s['frames']
    if enc:
        enc.stdin.close();status=enc.wait()
        if status:raise SystemExit('Encoding failed')
        temp.replace(out)
    canvas=Image.new('RGB',(1280,5*396),'#eeeeE4');d=ImageDraw.Draw(canvas)
    for i,(im,label) in enumerate(previews):
        x=(i%2)*640;y=(i//2)*396
        im=im.resize((640,360),Image.Resampling.LANCZOS);canvas.paste(im,(x,y))
        d.text((x+14,y+365),label,font=fnt(17),fill='#303a2b')
    canvas.save(QC/'animatic-contact-sheet.jpg',quality=94)
    (QC/'shot-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    if not args.preview_only:
        probe=subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(out)])
        (QC/'ffprobe.json').write_bytes(probe)
        data=json.loads(probe);stream=data['streams'][0]
        assert float(data['format']['duration'])==26.0,data['format']['duration']
        assert stream['codec_name']=='h264' and stream['pix_fmt']=='yuv420p'
        assert int(stream['nb_frames'])==624
        assert not any(s['codec_type']=='audio' for s in data['streams'])
        print(f'PASS: {out} / 26.000 s / 624 frames / H.264 / {W}×{H} / silent')

if __name__=='__main__':main()
