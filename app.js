/* Cartão Pro v2 — tudo roda no aparelho do usuário, nada sai dele */
var canvas = document.getElementById('cartaoCanvas');
var ctx = canvas.getContext('2d');
var W = canvas.width, H = canvas.height;
var LS_KEY = 'cartaoPro_v2';
function $(id) { return document.getElementById(id) }

var STATE = { nome:'', sub:'', tel:'', insta:'', fundo:'#26352d', texto:'#ffffff', destaque:'#806322', icone:'chave', qr:true, niche:'geral' };
try { var raw = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); if (raw && typeof raw === 'object') STATE = Object.assign(STATE, raw); } catch (e) {}
function saveState() { try { localStorage.setItem(LS_KEY, JSON.stringify(STATE)) } catch (e) {} }

/* ---------- ÍCONES PROFISSIONAIS (traço) ---------- */
var ICONS = {
chave:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
casa:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
tesoura:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>',
cafe:'<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/>',
talheres:'<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
pincel:'<path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',
sacola:'<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
folha:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
pata:'<circle cx="4.5" cy="9.5" r="2"/><circle cx="9" cy="5.5" r="2"/><circle cx="15" cy="5.5" r="2"/><circle cx="19.5" cy="9.5" r="2"/><path d="M12 10c-2.5 0-4.6 2-5.6 4-.8 1.6-.2 3.5 1.3 4.3.9.5 2 .5 2.9.1.9-.4 1.9-.4 2.8 0 .9.4 2 .4 2.9-.1 1.5-.8 2.1-2.7 1.3-4.3-1-2-3.1-4-5.6-4z"/>',
estrela:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
raio:'<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
coracao:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
caminhao:'<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
laptop:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/>',
flor:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2.5"/><circle cx="19" cy="9" r="2.5"/><circle cx="17" cy="17" r="2.5"/><circle cx="7" cy="17" r="2.5"/><circle cx="5" cy="9" r="2.5"/>',
telefone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
globo:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'
};
var ICON_NAMES = { chave:'Mecânica', casa:'Construção', tesoura:'Beleza', cafe:'Café', talheres:'Comida', camera:'Foto/Vídeo', pincel:'Pintura/Design', sacola:'Loja', folha:'Natural', pata:'Pet', estrela:'Premium', raio:'Energia', coracao:'Saúde', caminhao:'Transporte', laptop:'Tecnologia', flor:'Floricultura', telefone:'Contato', globo:'Redes' };
function iconSVG(n, c, s) { return '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[n] || '') + '</svg>' }
var ICON_IMG = {};
function getIcon(n, c) { var k = n + '|' + c; if (ICON_IMG[k]) return ICON_IMG[k]; var im = new Image(); ICON_IMG[k] = im; im.onload = function () { desenharCartao() }; im.onerror = function () {}; im.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(iconSVG(n, c, 48)); return im }

/* ---------- QR CODE REAL ---------- */
var QR_IMG = {};
function waLink(z) { var d = String(z).replace(/\D/g, ''); return d.length >= 10 ? 'https://wa.me/55' + d : (d ? 'https://wa.me/' + d : '') }
function getQR(text) { if (!text) return null; if (QR_IMG[text] !== undefined) return QR_IMG[text]; if (typeof qrcode === 'undefined') { QR_IMG[text] = null; return null }
  try { var q = qrcode(0, 'M'); q.addData(text); q.make(); var im = new Image(); QR_IMG[text] = im; im.onload = function () { desenharCartao() }; im.src = q.createDataURL(4, 0); return im } catch (e) { QR_IMG[text] = null; return null } }

/* ---------- UTILIDADES ---------- */
function rgba(hex, a) { var n = parseInt(hex.slice(1), 16); return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')' }
function lum(hex) { var n = parseInt(hex.slice(1), 16); var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }; return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255) }
function ratio(a, b) { var l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) }
function fontStr(w, px) { return (w ? w + ' ' : '') + px + 'px Arial, sans-serif' }
function trunc(t, maxW) { if (ctx.measureText(t).width <= maxW) return t; while (t.length && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1); return t + '…' }
function drawFit(text, X, Y, maxW, px, minPx, weight) {
  ctx.font = fontStr(weight, px);
  if (ctx.measureText(text).width <= maxW) { ctx.fillText(text, X, Y); return }
  var p = px;
  while (p > minPx && ctx.measureText(text).width > maxW) { p -= 2; ctx.font = fontStr(weight, p) }
  if (ctx.measureText(text).width <= maxW) { ctx.fillText(text, X, Y); return }
  var wds = text.split(' '), mid = Math.ceil(wds.length / 2);
  var a = wds.slice(0, mid).join(' '), b = wds.slice(mid).join(' ');
  while (p > minPx && (ctx.measureText(a).width > maxW || ctx.measureText(b).width > maxW)) { p -= 2; ctx.font = fontStr(weight, p) }
  ctx.fillText(trunc(a, maxW), X, Y); ctx.fillText(trunc(b, maxW), X, Y + p + 16);
}
function mascara(v) { var d = String(v).replace(/\D/g, '').slice(0, 11); if (d.length <= 2) return d; if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2); if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6); return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7) }
function slug(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'cartao' }
function toast(m) { var t = $('toast'); t.textContent = m; t.classList.add('on'); setTimeout(function () { t.classList.remove('on') }, 2400) }

/* ---------- PALETAS POR RAMO ---------- */
var NICHES = {
geral: ['#26352d', '#ffffff', '#806322'],
construcao: ['#1f2937', '#f9fafb', '#f59e0b'],
beleza: ['#3f1d38', '#fdf2f8', '#ec4899'],
comida: ['#7f1d1d', '#fff7ed', '#f59e0b'],
tech: ['#0f172a', '#e2e8f0', '#38bdf8'],
fitness: ['#052e16', '#ecfdf5', '#10b981'],
moda: ['#111111', '#fafafa', '#d4af37']
};
var NICHE_LABEL = { geral:'Geral', construcao:'Construção', beleza:'Beleza', comida:'Comida', tech:'Tecnologia', fitness:'Fitness', moda:'Moda' };

/* ---------- DESENHO DO CARTÃO ---------- */
function desenharCartao() {
  var nome = STATE.nome || 'Seu Nome / Empresa';
  var sub = STATE.sub || 'Sua Profissão ou Ramo';
  var tel = STATE.tel || '(00) 00000-0000';
  var insta = STATE.insta;
  var qrText = (STATE.qr && waLink(STATE.tel)) ? waLink(STATE.tel) : null;

  ctx.clearRect(0, 0, W, H);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = STATE.fundo; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = STATE.destaque; ctx.fillRect(0, 0, 48, H); ctx.fillRect(0, H - 32, W, 32);

  var bi = getIcon(STATE.icone, STATE.destaque);
  if (bi && bi.complete && bi.naturalWidth) ctx.drawImage(bi, W - 210, 80, 130, 130);

  ctx.fillStyle = STATE.texto;
  drawFit(nome, 96, 200, W - 96 - 96 - 170, 76, 44, 'bold');
  ctx.fillStyle = STATE.destaque;
  drawFit(sub, 96, 320, W - 96 - 96 - 170, 44, 28, '');

  ctx.strokeStyle = rgba(STATE.texto, 0.35); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(96, 380); ctx.lineTo(W - 96, 380); ctx.stroke();

  var qrImg = qrText ? getQR(qrText) : null;
  var qrOn = !!(qrImg && qrImg.complete && qrImg.naturalWidth);
  var maxCont = qrOn ? W - 164 - 96 - 330 : W - 164 - 96;

  var ti = getIcon('telefone', STATE.texto);
  if (ti && ti.complete && ti.naturalWidth) ctx.drawImage(ti, 96, 458, 46, 46);
  ctx.fillStyle = STATE.texto; ctx.font = fontStr('', 44);
  ctx.fillText(trunc('WhatsApp: ' + tel, maxCont), 164, 500);

  if (insta) {
    var gi = getIcon('globo', STATE.texto);
    if (gi && gi.complete && gi.naturalWidth) ctx.drawImage(gi, 96, 578, 46, 46);
    ctx.fillStyle = STATE.texto; ctx.font = fontStr('', 44);
    ctx.fillText(trunc('Redes: ' + insta, maxCont), 164, 620);
  }

  if (qrOn) {
    var bx = W - 356, by = 470, bs = 260;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(bx, by, bs, bs);
    ctx.drawImage(qrImg, bx + 10, by + 10, bs - 20, bs - 20);
    ctx.fillStyle = rgba(STATE.texto, 0.85); ctx.font = fontStr('', 26); ctx.textAlign = 'center';
    ctx.fillText('Aponte a câmera', bx + bs / 2, by + bs + 42);
    ctx.textAlign = 'left';
  }
}

/* ---------- CONTRASTE INTELIGENTE ---------- */
function checkContrast() {
  var probs = [];
  if (ratio(STATE.texto, STATE.fundo) < 3) probs.push('texto sobre o fundo');
  if (ratio(STATE.destaque, STATE.fundo) < 2.2) probs.push('destaque sobre o fundo');
  var w = $('contrastWarn');
  if (probs.length) { w.style.display = 'block'; w.textContent = '⚠️ Contraste baixo: ' + probs.join(' e ') + '. O cartão pode ficar difícil de ler — ajuste as cores.' }
  else w.style.display = 'none';
}

/* ---------- IDENTIDADE VISUAL ---------- */
function updIdentity() {
  [['sw-fundo', 'fundo'], ['sw-texto', 'texto'], ['sw-destaque', 'destaque']].forEach(function (p) {
    var el = $(p[0]); el.style.background = STATE[p[1]]; el.textContent = STATE[p[1]].toUpperCase();
  });
}
function copyHex(key) {
  var v = STATE[key].toUpperCase();
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(function () { toast('📋 Código ' + v + ' copiado!') }, function () { toast(v) });
  else toast(v);
}

/* ---------- CONTROLES ---------- */
function onField(key, val) { STATE[key] = val; saveState(); desenharCartao() }
function onTel(el) { el.value = mascara(el.value); STATE.tel = el.value; saveState(); desenharCartao() }
function onColor(key, val) { STATE[key] = val; saveState(); desenharCartao(); checkContrast(); updIdentity() }
function onQR(v) { STATE.qr = v; saveState(); desenharCartao() }
function setNiche(k) {
  STATE.niche = k; STATE.fundo = NICHES[k][0]; STATE.texto = NICHES[k][1]; STATE.destaque = NICHES[k][2];
  $('corFundo').value = STATE.fundo; $('corTexto').value = STATE.texto; $('corDestaque').value = STATE.destaque;
  renderChips(); saveState(); desenharCartao(); checkContrast(); updIdentity();
}
function setIcon(k) { STATE.icone = k; renderIcons(); saveState(); desenharCartao() }
function renderChips() {
  var c = $('chips'); c.innerHTML = '';
  Object.keys(NICHES).forEach(function (k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'chip' + (STATE.niche === k ? ' on' : ''); b.textContent = NICHE_LABEL[k];
    b.onclick = function () { setNiche(k) }; c.appendChild(b);
  });
}
function renderIcons() {
  var c = $('iconGrid'); c.innerHTML = '';
  Object.keys(ICONS).forEach(function (k) {
    if (k === 'telefone' || k === 'globo') return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'icobtn' + (STATE.icone === k ? ' on' : ''); b.title = ICON_NAMES[k];
    b.innerHTML = iconSVG(k, '#687568', 22); b.onclick = function () { setIcon(k) }; c.appendChild(b);
  });
}
function baixarCartao() {
  var a = document.createElement('a');
  a.download = 'cartao-' + slug(STATE.nome || 'visita') + '.png';
  a.href = canvas.toDataURL('image/png');
  document.body.appendChild(a); a.click(); a.remove();
  toast('✅ Cartão em alta resolução baixado!');
}

/* ---------- INIT (memória local) ---------- */
(function () {
  $('nome').value = STATE.nome; $('subtitulo').value = STATE.sub; $('telefone').value = STATE.tel; $('instagram').value = STATE.insta;
  $('corFundo').value = STATE.fundo; $('corTexto').value = STATE.texto; $('corDestaque').value = STATE.destaque; $('qrOn').checked = !!STATE.qr;
  renderChips(); renderIcons(); updIdentity(); checkContrast(); desenharCartao();
})();