#!/usr/bin/env python3
"""VERBA 26-second silent foyer film. Four approved generated clips + donors + native carton.
Forward-only editorial loop; no paid/network calls; original animatic left unchanged.
"""
from pathlib import Path
import importlib.util,json,math,subprocess,hashlib
import numpy as np
from PIL import Image,ImageDraw,ImageFont
HERE=Path(__file__).resolve().parent;VER=HERE.parent;ROOT=VER.parent.parent;ASSETS=VER/'assets';QC=VER/'renders/foyer-motion-qa';QC.mkdir(exist_ok=True,parents=True)
spec=importlib.util.spec_from_file_location('animatic_native',HERE/'render-animatic.py');native=importlib.util.module_from_spec(spec);spec.loader.exec_module(native)
W,H,FPS=1280,720,24
SHOTS=[
 {'id':'s01-human','source':'s01-hero-motion.mp4','frames':120,'start':0,'title':['Здоровье','в обычной жизни'],'title_color':'light'},
 {'id':'s03-ldl','source':'s03-lipoprotein-motion.mp4','frames':48,'start':0,'title':['Холестерин','не плавает сам'],'title_color':'dark','caption':['Концептуальный разрез ЛПНП','Цвет, форма и масштаб условны']},
 {'id':'s04-oil','source':'../v4/assets/olive-motion.mp4','frames':36,'start':0},
 {'id':'s06-liver','source':'s06-hepatic-motion.mp4','frames':72,'start':0,'title':['Не всё начинается','с жира'],'title_color':'dark','caption':['Избыток добавленных сахаров может повышать ТГ','Возможный путь, не прогноз анализа. Образ условный']},
 {'id':'s09-package','source':'native-carton','frames':108,'title':['Читайте','этикетку'],'title_color':'dark'},
 {'id':'s11-vessel','source':'../v4/assets/heart-loop.mp4','frames':84,'start':1.5,'title':['Решение —','вместе с врачом'],'title_color':'light','caption':['Концептуальная визуализация кровотока']},
 {'id':'s14-serving','source':'s14-salad-motion.mp4','frames':120,'start':0,'title':['Работает то,','что повторяется'],'title_color':'dark'},
 {'id':'brand-loop-bridge','source':'last-serving-frame + first-hero-frame','frames':36},
]
assert sum(x['frames'] for x in SHOTS)==624
FONT='/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf'
def font(n):return ImageFont.truetype(FONT,n)
def smooth(t):t=max(0,min(1,t));return t*t*(3-2*t)
def path(s):return (VER/s['source']).resolve() if s['source'].startswith('../') else ASSETS/s['source']
def title(im,s,i):
 if not s.get('title'):return im
 sec=i/FPS;dur=s['frames']/FPS
 # Science inset begins quickly; human headline has a quieter reveal.
 alpha=smooth((sec-(.05 if s['id']=='s03-ldl' else .18))/.32)
 if s['id']=='s14-serving':alpha*=1-smooth((sec-2.25)/.45)
 if alpha<=0:return im
 layer=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(layer)
 x=45;y=142;size=45
 if s['id']=='s01-human':y=207
 if s['id']=='s09-package':y=204
 if s['id']=='s14-serving':y=121
 if s['id']=='s11-vessel':y=152
 dark=s.get('title_color')=='dark';col=(54,62,39) if dark else (254,252,243)
 if s['id'] in ['s06-liver','s11-vessel']:
  for xx in range(670):
   a=int(alpha*(.40 if dark else .44)*255*(1-xx/670)**1.4)
   d.line((xx,0,xx,H),fill=((242,237,221) if dark else (15,22,13))+(a,))
 for j,line in enumerate(s['title']):d.text((x,y+j*60),line,font=font(size),fill=(*col,round(255*alpha)))
 return Image.alpha_composite(im.convert('RGBA'),layer).convert('RGB')
def caption(im,lines):
 layer=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(layer)
 for y in range(540,H):d.line((0,y,W,y),fill=(17,25,13,int(150*((y-540)/(H-540))**1.2)))
 base=H-54-(len(lines)-1)*34
 for j,l in enumerate(lines):d.text((42,base+j*34),l,font=font(25 if j==0 else 22),fill=(255,253,242,255))
 return Image.alpha_composite(im.convert('RGBA'),layer).convert('RGB')
def brand(im,a=1):
 if a<=0:return im
 layer=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(layer)
 # A very gentle left veil stabilizes contrast; no invented logo geometry.
 for x in range(620):d.line((x,0,x,H),fill=(242,236,219,round(185*a*(1-x/620)**.5)))
 v=Image.open(ROOT/'verba-wordmark.png').convert('RGBA');v.thumbnail((353,72),Image.Resampling.LANCZOS);v.putalpha(v.getchannel('A').point(lambda z:round(z*a)));layer.alpha_composite(v,(45,245))
 d.text((47,340),'Медицинский курорт',font=font(27),fill=(43,53,33,round(255*a)))
 m=Image.open(ASSETS/'miller-authentic-logo.png').convert('RGBA');m.thumbnail((257,90),Image.Resampling.LANCZOS);m.putalpha(m.getchannel('A').point(lambda z:round(z*a)));layer.alpha_composite(m,(48,485))
 d.text((48,501+m.height),'Visual Production',font=font(23),fill=(27,34,23,round(255*a)))
 return Image.alpha_composite(im.convert('RGBA'),layer).convert('RGB')
def decode_frames(p,start,n):
 cmd=['ffmpeg','-hide_banner','-loglevel','error','-ss',str(start),'-i',str(p),'-frames:v',str(n),'-vf',f'fps=24,scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}','-f','rawvideo','-pix_fmt','rgb24','-']
 proc=subprocess.Popen(cmd,stdout=subprocess.PIPE)
 try:
  for i in range(n):
   data=proc.stdout.read(W*H*3)
   if len(data)!=W*H*3:raise RuntimeError(f'Too few decoded frames in {p}')
   yield Image.frombytes('RGB',(W,H),data)
 finally:
  proc.stdout.close();proc.wait()
  if proc.returncode not in (0,None):raise RuntimeError(f'Decode failure {p}: {proc.returncode}')
for s in SHOTS:
 if s['source'] not in ('native-carton','last-serving-frame + first-hero-frame') and not path(s).exists():raise SystemExit('Missing approved source: '+str(path(s)))
OUT=ASSETS/'foyer-loop.mp4';TMP=ASSETS/'foyer-loop.rendering.mp4'
enc=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r','24','-i','-','-an','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart','-metadata','title=VERBA — silent foyer film','-metadata','comment=Forward-only film with AI-generated reference-based motion, donor footage and native carton; conceptual science imagery.',str(TMP)],stdin=subprocess.PIPE)
first=None;last_salad=None;last=None;at=0;manifest=[];previews=[]
for idx,s in enumerate(SHOTS):
 start=at/FPS;manifest.append({**s,'edit_start':start,'edit_end':start+s['frames']/FPS})
 print(s['id'],start,start+s['frames']/FPS,flush=True)
 frames=None if s['id'] in ('s09-package','brand-loop-bridge') else decode_frames(path(s),s.get('start',0),s['frames'])
 for i in range(s['frames']):
  if s['id']=='s09-package':
   raw=native.package_frame(i/(s['frames']-1))
   # Keep entire readable object; native perspective geometry is unchanged.
  elif s['id']=='brand-loop-bridge':
   # Continue the last resting pose, then a warm graphic hold. No reversed human action.
   warm=Image.new('RGB',(W,H),'#e6dec8')
   base=Image.blend(last_salad,warm,.80*smooth(i/18))
   raw=brand(base,1)
   # Last twelve frames dissolve into the exact raw opening frame.
   if i>=24:raw=Image.blend(raw,first,smooth((i-24)/11))
  else:raw=next(frames)
  if s['id']=='s01-human':
   # Exclude ambiguous newly revealed lower-board props (source y >=615).
   raw=raw.transform((W,H),Image.Transform.EXTENT,(96,0,1168,603),Image.Resampling.BICUBIC)
  if first is None:first=raw.copy()
  if s['id']=='s14-serving':last_salad=raw.copy()
  im=title(raw,s,i)
  if s.get('caption'):im=caption(im,s['caption'])
  if s['id']=='s14-serving':im=brand(im,smooth((i/FPS-2.9)/.55))
  enc.stdin.write(im.tobytes());last=im
  if i==s['frames']//2:
   im.save(QC/f'foyer-shot-{idx+1:02}-{s["id"]}.jpg',quality=95)
   previews.append((im.copy(),f'{start:04.1f}–{start+s["frames"]/FPS:04.1f}s  {s["id"]}'))
  if s['id']=='s03-ldl' and i==s['frames']-1:im.save(QC/'foyer-ldl-trim-end.jpg',quality=95)
  if s['id']=='s06-liver' and i==s['frames']-1:im.save(QC/'foyer-liver-trim-end.jpg',quality=95)
  if s['id']=='brand-loop-bridge' and i in [0,17,24,30,35]:im.save(QC/f'loop-bridge-{i:02}.jpg',quality=95)
 if frames is not None:frames.close()
 at+=s['frames']
assert np.array_equal(np.asarray(first),np.asarray(last)),'Unencoded loop endpoints must match'
first.save(QC/'loop-first-frame.png');last.save(QC/'loop-last-frame.png')
enc.stdin.close();assert enc.wait()==0;TMP.replace(OUT)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(OUT)]))
assert float(probe['format']['duration'])==26
assert int(probe['streams'][0]['nb_frames'])==624
assert len(probe['streams'])==1 and probe['streams'][0]['codec_name']=='h264'
(QC/'foyer-ffprobe.json').write_text(json.dumps(probe,indent=2)+'\n')
(QC/'foyer-shot-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
canvas=Image.new('RGB',(1280,4*395),'#eae6d9');d=ImageDraw.Draw(canvas)
for k,(im,lab) in enumerate(previews):
 x=(k%2)*640;y=(k//2)*395;canvas.paste(im.resize((640,360),Image.Resampling.LANCZOS),(x,y));d.text((x+12,y+366),lab,font=font(17),fill='#343d2b')
canvas.save(QC/'foyer-contact-sheet.jpg',quality=95)
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-stream_loop','1','-i',str(OUT),'-frames:v','1248','-f','null','-'],check=True)
report={'master':str(OUT.relative_to(ROOT)),'seconds':26,'frames':624,'fps':24,'resolution':[1280,720],'codec':'H.264/yuv420p','audio':'none','fast_start':True,'bytes':OUT.stat().st_size,'sha256':hashlib.sha256(OUT.read_bytes()).hexdigest(),'hero_crop':'Exact16:9 source rectangle (96,0)–(1168,603), excludes source y>=615 ambiguous props; same crop across all frames', 'source_motion':'Four approved Gen-4.5 clips, two donor clips, native controlled carton; no reversed human action or additional generation','science_trims':'S03 0–2s keeps cutaway/cargo visible; S06 0–3s avoids strongest late crop','loop':'Last 12 frames of warm brand bridge dissolve to exact raw opening frame. Before encoding first/last frame arrays match. Two complete cycles (52s/1248frames) fully decoded without errors. Individual generated clips are not forced to loop.','titles':'45px primary titles, 25/22px science caveats at720p; marks appear over last2.1s of serving plus1.5s bridge','original_animatic':'unchanged and separate'}
(QC/'foyer-QA.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
