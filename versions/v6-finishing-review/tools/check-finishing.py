from pathlib import Path
from html.parser import HTMLParser
import re,json,subprocess,hashlib
ROOT=Path(__file__).resolve().parents[1];REPO=ROOT.parents[1]
a=(ROOT.parent/'v6-final/index.html').read_text();b=(ROOT/'index.html').read_text()
assert len(re.findall(r'<section id="s\d\d"',b))==14
notes=re.findall(r'<details\b.*?</details>',a,re.S)
assert notes==re.findall(r'<details\b.*?</details>',b,re.S)
for pattern in (r'<h[12]\b.*?</h[12]>',r'<p class="scene-lead".*?</p>'):
 assert re.findall(pattern,a,re.S)==re.findall(pattern,b,re.S)
class Refs(HTMLParser):
 def __init__(self):super().__init__();self.missing=[]
 def handle_starttag(self,tag,attrs):
  for attr,value in attrs:
   if attr in ('src','href','data-src','poster') and value and not value.startswith(('https:','http:','data:','#','mailto:')):
    if not (ROOT/value.split('?')[0].split('#')[0]).resolve().exists():self.missing.append(value)
refs=Refs();refs.feed(b);assert not refs.missing,refs.missing
checks={'base_commit':'31526bd24277c0913dd7d21315c5779296883132','scene_count':14,'headlines_and_leads_unchanged':True,'source_detail_blocks_identical':len(notes),'missing_local_assets':refs.missing,'original_version_git_diff':subprocess.check_output(['git','-C',str(REPO),'diff','--name-only','--','versions/v6-final']).decode().strip(),'browser_qa':'Blocked: Chromium socket() Operation not permitted; no sandbox bypass attempted','mobile_qa':'Not run'}
assert not checks['original_version_git_diff']
(ROOT/'review/finishing/static-checks.json').write_text(json.dumps(checks,indent=2)+'\n');print(json.dumps(checks,indent=2))
media={}
for p in (ROOT/'assets').glob('*.mp4'):
 subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],check=True)
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_name,width,height,r_frame_rate,nb_frames:format=duration,size','-of','json',str(p)]));probe['sha256']=hashlib.sha256(p.read_bytes()).hexdigest();media[p.name]=probe
(ROOT/'review/finishing/media-checks.json').write_text(json.dumps(media,indent=2)+'\n');print('ALL_MEDIA_DECODED')
