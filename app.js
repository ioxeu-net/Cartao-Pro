/* Cartão Pro Studio — editor local-first */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const fields=['name','role','tagline','phone','email','instagram','website','address','introText','profession','bgColor','textColor','accentColor','fontStyle','backTitle','backMessage','backExtra','backLayout','backBg','backText','backAccent'];
const profiles={
geral:{label:'Modelo versátil',role:'Atendimento profissional',tag:'Qualidade e compromisso em cada detalhe.',colors:['#20202a','#ffffff','#c9a66b'],mark:'CP'},
pastor:{label:'Comunicação pastoral',role:'Pastor | Ministério',tag:'Fé, acolhimento e propósito.',colors:['#211b2c','#fffaf0','#c7a56b'],mark:'✦'},
entregador:{label:'Serviço de entregas',role:'Moto entregador',tag:'Agilidade, cuidado e pontualidade.',colors:['#18252b','#ffffff','#e0a52d'],mark:'MOTO'},
costureira:{label:'Ateliê e confecção',role:'Costura e ajustes',tag:'Cuidado em cada ponto, atenção em cada detalhe.',colors:['#342536','#fff8f4','#d9a5ae'],mark:'ATELIÊ'},
barbeiro:{label:'Barbearia contemporânea',role:'Barbeiro profissional',tag:'Estilo, técnica e personalidade.',colors:['#17191d','#f5f2eb','#c39b5b'],mark:'BARBER'},
manicure:{label:'Beleza e nail design',role:'Manicure | Nail designer',tag:'Detalhes que valorizam seu estilo.',colors:['#392632','#fff8fa','#d79aaa'],mark:'NAIL'},
cabeleireiro:{label:'Salão e beleza',role:'Cabeleireiro profissional',tag:'Beleza com identidade e cuidado.',colors:['#30212c','#fff8f5','#cba07a'],mark:'STUDIO'},
fotografo:{label:'Fotografia autoral',role:'Fotógrafo',tag:'Histórias contadas em imagens.',colors:['#17191e','#ffffff','#c8b89b'],mark:'PHOTO'},
advogado:{label:'Escritório jurídico',role:'Advocacia',tag:'Atuação ética, técnica e responsável.',colors:['#172536','#ffffff','#bda77e'],mark:'OAB'},
medico:{label:'Saúde e atendimento',role:'Profissional de saúde',tag:'Cuidado, atenção e compromisso.',colors:['#e9f1f1','#243c43','#3d8c88'],mark:'CARE'},
eletricista:{label:'Serviços técnicos',role:'Eletricista',tag:'Instalação, manutenção e segurança.',colors:['#1d2833','#ffffff','#e6ad36'],mark:'ENERGIA'},
pedreiro:{label:'Construção e reformas',role:'Pedreiro | Reformas',tag:'Serviço bem feito do início ao acabamento.',colors:['#252a30','#ffffff','#d99a46'],mark:'OBRAS'},
professor:{label:'Educação e conhecimento',role:'Professor | Instrutor',tag:'Conhecimento que transforma.',colors:['#1d2b35','#ffffff','#83b3b0'],mark:'EDU'},
mecanico:{label:'Oficina e manutenção',role:'Mecânico',tag:'Diagnóstico preciso e serviço de confiança.',colors:['#20242b','#ffffff','#d27c45'],mark:'GARAGE'},
limpeza:{label:'Limpeza profissional',role:'Limpeza e conservação',tag:'Ambientes cuidados com excelência.',colors:['#18333a','#ffffff','#79b7b0'],mark:'CLEAN'},
personal:{label:'Treinamento e performance',role:'Personal trainer',tag:'Evolução com orientação e consistência.',colors:['#17251e','#ffffff','#a8c56b'],mark:'FIT'},
loja:{label:'Comércio e varejo',role:'Atendimento e vendas',tag:'Produtos e atendimento de qualidade.',colors:['#25202b','#ffffff','#c8a4d5'],mark:'STORE'},
designer:{label:'Estúdio criativo',role:'Design e comunicação',tag:'Ideias com estratégia e identidade.',colors:['#25223b','#ffffff','#a69ce0'],mark:'CREATIVE'}
};
const state={profession:'geral',photo:'',voice:'',music:'',position:'left',shape:'horizontal',mode:'digital',recording:false};
let stream=null,recorder=null,chunks=[],history=[],future=[],saveTimer=null;
const card=$('businessCard');
function val(id){return $(id).value.trim()}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function snapshot(){const s={};fields.forEach(k=>s[k]=$(k).value);s.photo=state.photo;s.position=state.position;s.shape=state.shape;return JSON.stringify(s)}
function pushHistory(){const s=snapshot();if(history[history.length-1]!==s){history.push(s);if(history.length>40)history.shift();future=[]}updateHistoryButtons()}
function restore(s){const d=JSON.parse(s);fields.forEach(k=>{if(d[k]!==undefined)$(k).value=d[k]});state.photo=d.photo||'';state.position=d.position||'left';state.shape=d.shape||'horizontal';syncChoices();render()}
function updateHistoryButtons(){$('undoBtn').disabled=history.length<2;$('redoBtn').disabled=!future.length}
function save(){try{const data={};fields.forEach(k=>data[k]=$(k).value);data.photo=state.photo;data.position=state.position;data.shape=state.shape;localStorage.setItem('cartaoProStudio',JSON.stringify(data));$('saveStatus').textContent='Salvo neste aparelho'}catch(e){$('saveStatus').textContent='Imagem grande: exporte para guardar'} }
function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,250)}
function applyProfile(key){const p=profiles[key]||profiles.geral;state.profession=key;$('profession').value=key;$('role').value=p.role;$('tagline').value=p.tag;$('bgColor').value=p.colors[0];$('textColor').value=p.colors[1];$('accentColor').value=p.colors[2];$('templateNote').textContent=p.label+' — '+p.tag;render();pushHistory();scheduleSave()}
function syncChoices(){document.querySelectorAll('[data-position]').forEach(b=>b.classList.toggle('active',b.dataset.position===state.position));document.querySelectorAll('[data-shape]').forEach(b=>b.classList.toggle('active',b.dataset.shape===state.shape));document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode))}
function render(){
 const p=profiles[$('profession').value]||profiles.geral;
 card.style.setProperty('--card-bg',val('bgColor')||p.colors[0]);card.style.setProperty('--card-text',val('textColor')||'#fff');card.style.setProperty('--card-accent',val('accentColor')||p.colors[2]);
 card.className='business-card shape-'+state.shape+' photo-'+state.position+' profession-'+$('profession').value;
 if(val('fontStyle')==='classic')card.querySelector('.card-copy h2').style.fontFamily='Georgia,serif';else if(val('fontStyle')==='editorial')card.querySelector('.card-copy h2').style.fontFamily='"Playfair Display",Georgia,serif';else card.querySelector('.card-copy h2').style.fontFamily='"DM Sans",Arial,sans-serif';
 $('previewName').textContent=val('name')||'Seu Nome';$('previewRole').textContent=val('role')||p.role;$('previewTagline').textContent=val('tagline')||p.tag;
 $('cardMark').textContent=p.mark;
 const img=$('previewImage'),wrap=$('imageWrap');if(state.photo){img.src=state.photo;img.hidden=false;wrap.style.display='block'}else{img.removeAttribute('src');img.hidden=true;wrap.style.display='none'}
 const links=[];if(val('phone'))links.push('WhatsApp: '+val('phone'));if(val('email'))links.push(val('email'));if(val('instagram'))links.push(val('instagram'));if(val('website'))links.push(val('website'));
 $('previewLinks').innerHTML=links.map(x=>'<span>'+escapeHtml(x)+'</span>').join('');$('previewAddress').textContent=val('address');
 const back=$('printBack'),bp=profiles[$('profession').value]||profiles.geral;back.className='business-card print-back back-layout-'+(val('backLayout')||'editorial')+' profession-'+$('profession').value;back.style.setProperty('--card-bg',val('backBg')||'#171321');back.style.setProperty('--card-text',val('backText')||'#fff');back.style.setProperty('--card-accent',val('backAccent')||bp.colors[2]);$('backName').textContent=val('backTitle')||val('name')||'Seu Nome';$('backKicker').textContent=bp.label;$('backMessagePreview').textContent=val('backMessage');$('backExtraPreview').textContent=val('backExtra');$('backMonogram').textContent=bp.mark;$('backLinks').innerHTML=links.map(x=>'<span>'+escapeHtml(x)+'</span>').join('');$('backAddress').textContent=val('address');
 $('audioLink').hidden=!(state.voice||state.music);
 $('previewCaption').textContent=state.mode==='print'?'Frente e verso — use Imprimir / PDF para gerar as duas faces.':state.mode==='verso'?'Editando o verso — os campos do editor controlam somente esta face.':'Prévia da frente digital — o verso é preparado para impressão.';
 $('previewStage').classList.toggle('print-mode',state.mode==='print');$('previewStage').classList.toggle('back-mode',state.mode==='verso');
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function normalizePhone(){return val('phone').replace(/\D/g,'')}
function waUrl(){const n=normalizePhone();if(!n)return'';return 'https://wa.me/'+(n.startsWith('55')?n:'55'+n)}
function normalizeUrl(s){if(!s)return'';return /^https?:\/\//i.test(s)?s:'https://'+s}
function standalone(){
 const name=escapeHtml(val('name')||'Profissional'),role=escapeHtml(val('role')),tag=escapeHtml(val('tagline')),address=escapeHtml(val('address'));
 const bg=val('bgColor'),fg=val('textColor'),ac=val('accentColor'),font=val('fontStyle')==='classic'?'Georgia,serif':'Arial,sans-serif';
 const backBg=val('backBg')||'#171321',backFg=val('backText')||'#fff',backAc=val('backAccent')||ac,backTitle=escapeHtml(val('backTitle')||val('name')||'Seu Nome'),backMessage=escapeHtml(val('backMessage')),backExtra=escapeHtml(val('backExtra')),backLayout=val('backLayout')||'editorial';
 const img=state.photo?'<img class="photo" src="'+state.photo+'" alt="Foto ou logotipo">':'';
 const contact=[];
 if(waUrl())contact.push('<a href="'+waUrl()+'" target="_blank" rel="noopener">WhatsApp</a>');
 if(val('email'))contact.push('<a href="mailto:'+encodeURIComponent(val('email'))+'">E-mail</a>');
 if(val('instagram')){let x=val('instagram');contact.push('<a href="'+normalizeUrl(x[0]==='@'?'instagram.com/'+x.slice(1):x)+'" target="_blank" rel="noopener">Instagram</a>')}
 if(val('website'))contact.push('<a href="'+normalizeUrl(val('website'))+'" target="_blank" rel="noopener">Site</a>');
 const audio=(state.voice||state.music)?'<details class="audio"><summary>▶ Ouvir apresentação</summary>'+(state.voice?'<audio controls preload="none" src="'+state.voice+'"></audio>':'')+(state.music?'<audio controls preload="none" src="'+state.music+'"></audio>':'')+(val('introText')?'<p>'+escapeHtml(val('introText'))+'</p>':'')+'</details>':'';
 const shape=state.shape==='triangle'?'clip-path:polygon(50% 0,100% 100%,0 100%);border-radius:0;':state.shape==='hexagon'?'clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);border-radius:0;':state.shape==='free'?'border-radius:38px 8px 38px 8px;':'';
 const backHtml='<section class="back"><small>'+escapeHtml((profiles[$('profession').value]||profiles.geral).label)+'</small><h2>'+backTitle+'</h2><p>'+backMessage+'</p><hr><nav>'+contact.join('')+'</nav><p>'+address+'</p><b>'+backExtra+'</b></section>';
 return '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="'+bg+'"><title>'+name+' — Cartão profissional</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#efedf1;font-family:'+font+';padding:24px}.card{position:relative;overflow:hidden;width:min(720px,100%);min-height:360px;background:'+bg+';color:'+fg+';padding:58px;display:flex;align-items:center;gap:30px;box-shadow:0 22px 60px #17132130;'+shape+'}.card:before{content:"";position:absolute;left:0;top:0;bottom:0;width:8px;background:'+ac+'}.photo{width:150px;height:190px;object-fit:cover;border-radius:10px}.content{position:relative;z-index:1}.role{color:'+ac+';font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:bold}.name{font-size:clamp(28px,6vw,48px);margin:12px 0 8px}.tag{opacity:.8;line-height:1.5}.rule{height:1px;background:'+fg+'55;margin:22px 0}.links{display:flex;flex-wrap:wrap;gap:12px 20px}.links a{color:'+fg+';text-decoration:none;border-bottom:1px solid '+ac+';padding-bottom:3px}.address{font-size:12px;opacity:.7;margin-top:15px}.audio{margin-top:20px;color:'+ac+'}.audio audio{display:block;max-width:100%;margin-top:12px}.audio summary{cursor:pointer} .back{position:relative;overflow:hidden;width:min(720px,100%);min-height:250px;margin:28px auto 0;padding:42px;background:'+backBg+';color:'+backFg+';border-left:8px solid '+backAc+';box-shadow:0 22px 60px #17132130}.back small{color:'+backAc+';letter-spacing:.16em;text-transform:uppercase}.back h2{font-size:32px;margin:12px 0}.back p{line-height:1.5}.back hr{border:0;border-top:1px solid '+backFg+'55;margin:20px 0}.back nav{display:flex;flex-wrap:wrap;gap:12px}.back a{color:'+backFg+'}.back b{color:'+backAc+'}@media(max-width:560px){.card{padding:32px 24px;flex-direction:column;align-items:flex-start}.photo{width:110px;height:110px;border-radius:50%}.back{padding:28px 24px}}</style><main class="card">'+img+'<section class="content"><div class="role">'+role+'</div><h1 class="name">'+name+'</h1><p class="tag">'+tag+'</p><div class="rule"></div><nav class="links">'+contact.join('')+'</nav><div class="address">'+address+'</div>'+audio+'</section></main>'+backHtml+'</html>';
}
function download(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
function vcard(){const lines=['BEGIN:VCARD','VERSION:3.0','FN:'+val('name'),'TITLE:'+val('role')];if(normalizePhone())lines.push('TEL;TYPE=CELL:'+normalizePhone());if(val('email'))lines.push('EMAIL:'+val('email'));if(val('website'))lines.push('URL:'+normalizeUrl(val('website')));if(val('address'))lines.push('ADR;TYPE=WORK:;;'+val('address'));lines.push('END:VCARD');download('contato-'+(val('name')||'profissional').replace(/[^a-z0-9]/gi,'-')+'.vcf',lines.join('\r\n'),'text/vcard;charset=utf-8')}
async function fileToData(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
$('profession').addEventListener('change',e=>applyProfile(e.target.value));
fields.forEach(id=>$(id).addEventListener('input',()=>{render();scheduleSave()}));
$('photo').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;if(!f.type.startsWith('image/'))return toast('Selecione uma imagem.');state.photo=await fileToData(f);render();pushHistory();scheduleSave()});
$('removePhoto').onclick=()=>{state.photo='';$('photo').value='';render();pushHistory();scheduleSave()};
$('photoPositions').onclick=e=>{const b=e.target.closest('[data-position]');if(!b)return;state.position=b.dataset.position;syncChoices();render();pushHistory();scheduleSave()};
$('shapes').onclick=e=>{const b=e.target.closest('[data-shape]');if(!b)return;state.shape=b.dataset.shape;syncChoices();render();pushHistory();scheduleSave()};
document.querySelector('.tabs').onclick=e=>{const b=e.target.closest('[data-mode]');if(!b)return;state.mode=b.dataset.mode;syncChoices();render()};
['bgColor','textColor','accentColor','fontStyle'].forEach(id=>$(id).addEventListener('input',()=>{render();scheduleSave()}));
$('cameraBtn').onclick=async()=>{try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});$('camera').srcObject=stream;$('camera').hidden=false;$('captureBtn').hidden=false}catch(e){toast('Não foi possível acessar a câmera. Verifique a permissão do navegador.')}};
$('captureBtn').onclick=()=>{const v=$('camera'),c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);state.photo=c.toDataURL('image/jpeg',.88);stopCamera();render();pushHistory();scheduleSave()};
function stopCamera(){if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$('camera').hidden=true;$('captureBtn').hidden=true}
$('recordBtn').onclick=async()=>{try{if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw Error();const s=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(s);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});const reader=new FileReader();reader.onload=()=>{state.voice=reader.result;$('voicePreview').src=state.voice;$('voicePreview').hidden=false;render();toast('Gravação pronta para incluir no cartão exportado.')};reader.readAsDataURL(blob);s.getTracks().forEach(t=>t.stop())};recorder.start();$('recordBtn').disabled=true;$('stopRecordBtn').disabled=false;toast('Gravando. Fale sua apresentação.') }catch(e){toast('Gravação indisponível neste navegador ou sem permissão de microfone.')}};
$('stopRecordBtn').onclick=()=>{if(recorder&&recorder.state!=='inactive')recorder.stop();$('recordBtn').disabled=false;$('stopRecordBtn').disabled=true};
$('musicFile').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;if(!f.type.startsWith('audio/'))return toast('Selecione um arquivo de áudio.');state.music=await fileToData(f);render();toast('Trilha adicionada ao cartão exportado.')});
$('downloadHtml').onclick=()=>download('cartao-'+(val('name')||'profissional').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.html',standalone(),'text/html;charset=utf-8');
$('downloadVcf').onclick=vcard;
$('printBtn').onclick=()=>{state.mode='print';syncChoices();render();window.print()};
$('shareBtn').onclick=async()=>{const html=standalone();if(navigator.share&&navigator.canShare){const file=new File([html],'cartao.html',{type:'text/html'});try{await navigator.share({title:val('name')||'Meu cartão profissional',files:[file]});return}catch(e){}}download('cartao.html',html,'text/html;charset=utf-8');toast('Arquivo pronto. Anexe o HTML para compartilhar.')};
$('undoBtn').onclick=()=>{if(history.length<2)return;future.push(history.pop());restore(history[history.length-1]);updateHistoryButtons();scheduleSave()};
$('redoBtn').onclick=()=>{if(!future.length)return;const s=future.pop();history.push(s);restore(s);updateHistoryButtons();scheduleSave()};
const saved=localStorage.getItem('cartaoProStudio');if(saved){try{const d=JSON.parse(saved);fields.forEach(k=>{if(d[k]!==undefined)$(k).value=d[k]});state.photo=d.photo||'';state.position=d.position||'left';state.shape=d.shape||'horizontal'}catch(e){}}
syncChoices();render();pushHistory();
window.addEventListener('beforeunload',stopCamera);
})();