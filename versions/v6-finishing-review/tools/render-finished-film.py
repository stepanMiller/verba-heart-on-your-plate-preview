"""Rebuild only opening/closing composites of the approved 26s sequence.
Original intermediate film frames are retained; no generation or upscaling.
Run: python tools/render-finished-film.py /path/to/approved/s14-salad-motion.mp4 /path/to/approved/foyer-film.mp4
"""
from pathlib import Path
import ast, math, subprocess, sys
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[1];V5=ROOT.parent/'v5-astra';REPO=ROOT.parents[1]
W,H,FPS=1280,720,24
FONT='/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf'
def font(n):return ImageFont.truetype(FONT,n)
def smooth(t):t=max(0,min(1,t));return t*t*(3-2*t)
# Keep original title timing, placement, color and wording verbatim.
module=ast.parse((V5/'tools/render-foyer-loop.py').read_text())
for node in module.body:
    if isinstance(node,ast.FunctionDef) and node.name in ('title','caption','decode_frames'):
        exec(compile(ast.Module(body=[node],type_ignores=[]),'approved-renderer','exec'))
def brand(im,a=1):
    if a<=0:return im
    layer=Image.new('RGBA',(W,H));d=ImageDraw.Draw(layer)
    for x in range(620):d.line((x,0,x,H),fill=(242,236,219,round(185*a*(1-x/620)**.5)))
    v=Image.open(REPO/'verba-wordmark.png').convert('RGBA');v.thumbnail((353,72),Image.Resampling.LANCZOS);v.putalpha(v.getchannel('A').point(lambda z:round(z*a)));layer.alpha_composite(v,(45,245))
    d.text((47,340),'Медицинский курорт',font=font(27),fill=(43,53,33,round(255*a)))
    m=Image.open(V5/'assets/miller-authentic-logo.png').convert('RGBA');m.thumbnail((94,26),Image.Resampling.LANCZOS);m.putalpha(m.getchannel('A').point(lambda z:round(z*a*.72)));layer.alpha_composite(m,(W-m.width-30,H-m.height-26))
    return Image.alpha_composite(im.convert('RGBA'),layer).convert('RGB')
source=Path(sys.argv[2]);out=ROOT/'assets/foyer-film.finished.mp4'
enc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r','24','-i','-','-an','-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart','-metadata','title=VERBA Heart — Внутри обычного дня','-metadata','comment=Approved 26-second sequence. Calm still opening; rebuilt VERBA ending with discreet MILLER corner credit. Native 720p; no upscale or new generation.',str(out)],stdin=subprocess.PIPE)
first=next(decode_frames(V5/'assets/s01-hero-motion-web.mp4',0,1))
salad=decode_frames(Path(sys.argv[1]),0,120)
hero={'id':'s01-human','frames':120,'title':['Здоровье','в обычной жизни'],'title_color':'light'}
serving={'id':'s14-serving','frames':120,'title':['Работает то,','что повторяется'],'title_color':'dark'}
vessel=decode_frames(ROOT/'assets/s11-original-clean.mp4',1.5,84)
vessel_shot={'id':'s11-vessel','frames':84,'title':['Решение —','вместе с врачом'],'title_color':'light'}
last_salad=None;last_brand=None
for j,frame in enumerate(decode_frames(source,0,624)):
    if j<120:
        # High-quality accepted calm frame: no artificial mouthing or reverse action.
        frame=title(first.copy(),hero,j)
    elif 384<=j<468:
        frame=caption(title(next(vessel),vessel_shot,j-384),['Концептуальная визуализация кровотока'])
    elif 468<=j<588:
        i=j-468;raw=next(salad);last_salad=raw.copy()
        frame=brand(title(raw,serving,i),smooth((i/24-2.9)/.55))
    elif j>=588:
        i=min(j-588,23)
        base=Image.blend(last_salad,Image.new('RGB',(W,H),'#e6dec8'),.80*smooth(i/18))
        frame=brand(base,1)
    enc.stdin.write(frame.tobytes())
    if j in (0,48,540,575,611,623):frame.save(ROOT/'review/finishing'/f'film-frame-{j:03}.jpg',quality=95)
enc.stdin.close();assert enc.wait()==0;out.replace(ROOT/'assets/foyer-film.mp4')
print(ROOT/'assets/foyer-film.mp4')
