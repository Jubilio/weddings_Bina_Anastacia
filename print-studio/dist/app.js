const $ = (id) => document.getElementById(id);
const W = 740, H = 1050, PX_W = 1748, PX_H = 2480;
const C = {paper:'#fffdf8', ivory:'#f6f1e8', ink:'#2f352e', sage:'#43503f', gold:'#b69658', muted:'#6f756d'};
const wedding = {date:'19 de dezembro de 2026', deadline:'30 de novembro de 2026', bride:'Anastácia Hermínio Alberto', groom:'Bina Miguel Hilário'};
const images = {};
const cards = Object.fromEntries(['cover','invitation','programme'].map(key => {const canvas=document.createElement('canvas');canvas.width=PX_W;canvas.height=PX_H;return [key,canvas];}));
let active = 'invitation', ready = false;
const normalize = value => value.replace(/\s+/g,' ').trim();
function state() {
 const names=[$('guest-one').value,$('guest-two').value].map(normalize).filter(Boolean);
 const lines=$('programme').value.split('\n').map(line=>line.trim()).filter(Boolean);
 const events=lines.map(line=>line.split('|').map(normalize));
 const validProgramme=events.length>0&&events.length<=6&&events.every(e=>e.length===3&&e.every(Boolean)&&e[0].length<=12&&e[1].length<=70&&e[2].length<=140);
 return {names,phone:normalize($('phone').value),events,validProgramme};
}
function text(ctx, value, x, y, size=20, color=C.ink, family='Georgia', align='center', style='') {
 ctx.font=`${style} ${size}px ${family}`.trim();ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='top';ctx.fillText(value,x,y);
}
function wrap(ctx,value,width) {
 const lines=[];let line='';
 for(const word of value.split(/\s+/)) {
  if(ctx.measureText(word).width>width){if(line){lines.push(line);line='';}for(const char of word){if(ctx.measureText(line+char).width>width){lines.push(line);line='';}line+=char;}continue;}
  const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>width&&line){lines.push(line);line=word;}else{line=next;}
 }
 if(line)lines.push(line);return lines;
}
function paragraph(ctx,value,x,y,width,{size=20,min=15,maxHeight=100,color=C.ink,family='Georgia',style='',align='center',leading=1.4}={}) {
 let lines=[];
 do {ctx.font=`${style} ${size}px ${family}`.trim();lines=wrap(ctx,value,width);if(lines.length*size*leading<=maxHeight||size<=min)break;size--;}while(size>=min);
 if(lines.length*size*leading>maxHeight)throw new Error('Há texto demasiado longo para o cartão. Encurte os nomes ou o programa.');
 lines.forEach((line,i)=>text(ctx,line,x,y+i*size*leading,size,color,family,align,style));
 return lines.length*size*leading;
}
function line(ctx,y,x=115,end=625,color=C.gold){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(end,y);ctx.strokeStyle=color;ctx.lineWidth=.8;ctx.stroke();}
function ornament(ctx,y){line(ctx,y,270,348);line(ctx,y,392,470);text(ctx,'✦',370,y-8,16,C.gold);}
function base(canvas){const ctx=canvas.getContext('2d');ctx.setTransform(PX_W/W,0,0,PX_H/H,0,0);ctx.fillStyle=C.paper;ctx.fillRect(0,0,W,H);
 // Reuse the original botanical artwork only at the edges; retain a clean reading surface.
 ctx.drawImage(images.botanical,0,0,W,H);ctx.fillStyle=C.paper;ctx.fillRect(79,55,582,940);
 ctx.strokeStyle=C.gold;ctx.lineWidth=1;ctx.strokeRect(28,28,684,994);ctx.strokeStyle='#d9c89f';ctx.strokeRect(36,36,668,978);return ctx;}
function monogram(ctx,y){text(ctx,'A',346,y,41,C.sage);text(ctx,'&',375,y+7,24,C.gold,'Georgia','center','italic');text(ctx,'B',405,y,41,C.sage);}
function guests(ctx,s,y){text(ctx,s.names.length===2?'CONVITE EXCLUSIVO PARA':'CONVITE ESPECIAL PARA',370,y,11,C.muted,'Arial');paragraph(ctx,s.names.length?s.names.join(' e '):'Nome do convidado',370,y+25,500,{size:27,min:17,maxHeight:100,color:C.sage});}
function cover(s){const ctx=base(cards.cover);text(ctx,'FAMÍLIA HILÁRIO',370,80,13,C.sage,'Arial');ornament(ctx,125);text(ctx,'Anastácia',370,160,62,C.sage,'Georgia','center','italic');text(ctx,'&',370,230,32,C.gold,'Georgia','center','italic');text(ctx,'Bina',370,267,62,C.sage,'Georgia','center','italic');
 // Centred crop of the supplied portrait; never modify the original asset.
 const img=images.photo,x=156,y=365,w=428,h=350,ratio=Math.max(w/img.width,h/img.height),sw=w/ratio,sh=h/ratio;
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(img,(img.width-sw)/2,(img.height-sh)/2,sw,sh,x,y,w,h);ctx.restore();ctx.strokeStyle=C.gold;ctx.strokeRect(x-6,y-6,w+12,h+12);
 text(ctx,'DOIS CAMINHOS. UMA PROMESSA.',370,749,11,C.muted,'Arial');guests(ctx,s,787);line(ctx,932,200,540);text(ctx,'19 · DEZEMBRO · 2026',370,950,15,C.sage,'Georgia');}
function invitation(s){const ctx=base(cards.invitation);monogram(ctx,72);text(ctx,'FAMÍLIA HILÁRIO',370,132,13,C.sage,'Arial');text(ctx,'tem a honra de convidar para o casamento de',370,158,16,C.muted);text(ctx,'Anastácia & Bina',370,205,47,C.sage,'Georgia','center','italic');text(ctx,wedding.bride,370,268,17,C.ink);text(ctx,wedding.groom,370,294,17,C.ink);ornament(ctx,340);guests(ctx,s,368);
 line(ctx,500);text(ctx,'SÁBADO',225,526,13,C.muted,'Arial');text(ctx,'19',370,506,66,C.sage);text(ctx,'DEZEMBRO',516,526,13,C.muted,'Arial');text(ctx,'2026',516,550,19,C.sage);line(ctx,593);
 text(ctx,'10h00',162,619,28,C.sage);text(ctx,'Cerimónia civil',250,618,23,C.sage,'Georgia','left');paragraph(ctx,'Conservatório, Cidade de Nampula',250,651,370,{size:17,maxHeight:56,align:'left'});
 line(ctx,715);text(ctx,'14h00',162,738,28,C.sage);text(ctx,'Almoço e celebração',250,737,23,C.sage,'Georgia','left');paragraph(ctx,'Salão de Eventos da Academia Militar, Cidade de Nampula',250,770,370,{size:17,maxHeight:66,align:'left'});
 line(ctx,852);text(ctx,`Confirme a presença até ${wedding.deadline}`,370,875,15,C.ink);text(ctx,`Por chamada: ${s.phone||'Indique um contacto'}`,370,901,19,C.sage);paragraph(ctx,'Convite nominal e intransmissível, válido apenas para as pessoas indicadas. Não se estende a crianças.',370,948,510,{size:13,min:12,maxHeight:40,color:C.muted,family:'Arial'});}
function programme(s){const ctx=base(cards.programme);monogram(ctx,77);text(ctx,'O NOSSO DIA',370,149,12,C.muted,'Arial');text(ctx,'Programa',370,186,58,C.sage,'Georgia','center','italic');text(ctx,wedding.date+' · Nampula',370,262,18,C.sage);ornament(ctx,311);
 const events=s.validProgramme?s.events:[];const spacing=events.length>4?91:events.length>2?125:177;const start=350;
 if(events.length){ctx.beginPath();ctx.moveTo(166,start+8);ctx.lineTo(166,start+(events.length-1)*spacing+10);ctx.strokeStyle=C.gold;ctx.lineWidth=1;ctx.stroke();}
 events.forEach(([time,title,place],i)=>{const y=start+i*spacing;ctx.beginPath();ctx.arc(166,y+10,5,0,2*Math.PI);ctx.fillStyle=C.gold;ctx.fill();text(ctx,time,145,y-2,19,C.sage,'Georgia','right');const height=paragraph(ctx,title,194,y-4,408,{size:25,min:17,maxHeight:39,align:'left',color:C.sage,leading:1.15});paragraph(ctx,place,194,y+height+4,408,{size:17,min:13,maxHeight:42,align:'left',color:C.muted,leading:1.2});});
 if(!s.validProgramme)paragraph(ctx,'Complete o programa no painel de edição.',370,400,470,{size:22});
 ornament(ctx,930);text(ctx,'Com carinho, Anastácia & Bina',370,953,21,C.sage,'Georgia','center','italic');}
function paint(){if(!ready)return;const s=state();try{cover(s);invitation(s);programme(s);const preview=$('preview-canvas');preview.getContext('2d').drawImage(cards[active],0,0);preview.setAttribute('aria-label',`${{cover:'Capa',invitation:'Convite',programme:'Programa'}[active]} de Anastácia e Bina, ${wedding.date}. ${s.names.join(' e ')||'Preencha o nome do convidado'}. Cerimónia às 10h00 no Conservatório e almoço às 14h00 na Academia Militar, Nampula.`);
 const error=!normalize($('guest-one').value)?'Preencha o nome para descarregar ou imprimir.':!s.phone?'Indique o contacto para confirmação.':!s.validProgramme?'Programa inválido: use até 6 linhas, com hora | actividade | local.':'';
 $('status').textContent=error||'Pronto para imprimir. Pode rever cada cartão acima.';$('status').classList.toggle('error',Boolean(error)&&!!s.names.length);$('download').disabled=!!error;$('print').disabled=!!error||!document.querySelector('input[name=printPage]:checked');preparePrint();
 }catch(error){$('status').textContent=error.message;$('status').classList.add('error');$('download').disabled=true;$('print').disabled=true;}}
function preparePrint(){const holder=$('print-pages');holder.replaceChildren();document.querySelectorAll('input[name=printPage]:checked').forEach(input=>{const sheet=document.createElement('div');sheet.className='print-sheet';const canvas=document.createElement('canvas');canvas.width=PX_W;canvas.height=PX_H;canvas.getContext('2d').drawImage(cards[input.value],0,0);sheet.append(canvas);holder.append(sheet);});}
// pHYs metadata makes the PNG's intended print size explicit (300 pixels per inch).
function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
async function png300(canvas){const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('Não foi possível gerar a imagem.');const raw=new Uint8Array(await blob.arrayBuffer());const data=new Uint8Array(9);const view=new DataView(data.buffer);view.setUint32(0,11811);view.setUint32(4,11811);data[8]=1;const type=new TextEncoder().encode('pHYs');const chunk=new Uint8Array(21);new DataView(chunk.buffer).setUint32(0,9);chunk.set(type,4);chunk.set(data,8);new DataView(chunk.buffer).setUint32(17,crc32(chunk.subarray(4,17)));const pieces=[raw.slice(0,33),chunk];for(let pos=33;pos<raw.length;){const len=new DataView(raw.buffer).getUint32(pos);const end=pos+12+len;if(new TextDecoder().decode(raw.slice(pos+4,pos+8))!=='pHYs')pieces.push(raw.slice(pos,end));pos=end;}return new Blob(pieces,{type:'image/png'});}
$('editor').addEventListener('submit',e=>e.preventDefault());$('editor').addEventListener('input',paint);
document.querySelectorAll('[data-page]').forEach(button=>button.addEventListener('click',()=>{active=button.dataset.page;document.querySelectorAll('[data-page]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));paint();}));
$('download').addEventListener('click',async()=>{const button=$('download');button.disabled=true;try{const blob=await png300(cards[active]);const url=URL.createObjectURL(blob);const anchor=document.createElement('a');const name=normalize($('guest-one').value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').slice(0,60);anchor.href=url;anchor.download=`anastacia-bina-${active}-${name}-A5.png`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),10000);$('status').textContent='Imagem preparada. Veja os downloads do navegador.';}catch(error){$('status').textContent=error.message;}finally{button.disabled=false;}});
$('print').addEventListener('click',()=>{preparePrint();window.print();});
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Não foi possível carregar as fotografias. Actualize a página para tentar novamente.'));img.src=src;});}
try{[images.photo,images.botanical]=await Promise.all([loadImage('./assets/noivos.png'),loadImage('./assets/botanical.webp')]);await document.fonts.ready;ready=true;paint();}catch(error){$('status').textContent=error.message;$('status').classList.add('error');}

if(document.modelContext?.registerTool){
 const lifetime=new AbortController();
 try{Promise.resolve(document.modelContext.registerTool({
  name:'configure_print_invitation',title:'Preparar convite para impressão',
  description:'Preenche os nomes e o telefone no gerador e actualiza a pré-visualização. Não imprime, descarrega, envia mensagens nem altera o convite digital.',
  inputSchema:{type:'object',properties:{guestOne:{type:'string',minLength:1,maxLength:120},guestTwo:{type:'string',maxLength:120},phone:{type:'string',minLength:1,maxLength:45}},required:['guestOne'],additionalProperties:false},
  annotations:{readOnlyHint:false,untrustedContentHint:false},
  execute(input){
   if(!ready)throw new Error('O gerador ainda está a carregar.');
   if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['guestOne','guestTwo','phone'].includes(k)))throw new Error('Dados inválidos.');
   for(const [key,max] of [['guestOne',120],['guestTwo',120],['phone',45]]){
    if(input[key]!==undefined&&(typeof input[key]!=='string'||input[key].length>max))throw new Error('Campo inválido: '+key);
   }
   if(typeof input.guestOne!=='string'||!normalize(input.guestOne)||input.phone!==undefined&&!normalize(input.phone))throw new Error('Preencha o nome e um contacto válido.');
   $('guest-one').value=input.guestOne;$('guest-two').value=input.guestTwo??'';if(input.phone!==undefined)$('phone').value=input.phone;paint();
   return {names:state().names,phone:state().phone,readyToPrint:!$('print').disabled,status:$('status').textContent};
  }
 },{signal:lifetime.signal})).catch(()=>{});}catch{/* Optional browser capability. */}
 window.addEventListener('pagehide',()=>lifetime.abort(),{once:true});
}
