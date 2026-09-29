import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { users as seedUsers, phages as seedPhages } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
// Vercel Functions have a read-only deployment filesystem. /tmp keeps the demo
// API writable during a warm function instance; connect Supabase for durable data.
const dataFile = process.env.VERCEL ? '/tmp/phagedb-data.json' : path.join(__dirname, 'data.json');
const app = express();
const PORT = Number(process.env.PORT || 8787);
const sessionSecret = process.env.SESSION_SECRET || 'phagedb-demo-session-secret-change-in-production';

app.use(cors());
app.use(express.json({ limit:'12mb' }));

function ensureDb() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ users:seedUsers, phages:seedPhages, audit:[] }, null, 2));
  }
}
function readDb(){ ensureDb(); return JSON.parse(fs.readFileSync(dataFile,'utf8')); }
function writeDb(db){ fs.writeFileSync(dataFile, JSON.stringify(db,null,2)); }
function safeUser(u){ const {password,...rest}=u; return rest; }
function createToken(userId){
  const payload=Buffer.from(JSON.stringify({userId,issuedAt:Date.now()})).toString('base64url');
  const signature=crypto.createHmac('sha256',sessionSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}
function tokenUserId(token){
  try{
    const [payload,signature]=String(token||'').split('.');
    if(!payload||!signature)return null;
    const expected=crypto.createHmac('sha256',sessionSecret).update(payload).digest('base64url');
    if(signature.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return null;
    const session=JSON.parse(Buffer.from(payload,'base64url').toString('utf8'));
    if(!session.issuedAt||Date.now()-session.issuedAt>7*24*60*60*1000)return null;
    return session.userId||null;
  }catch{return null;}
}
function auth(req,res,next){
  const token=(req.headers.authorization||'').replace(/^Bearer\s+/,'');
  const userId=tokenUserId(token);
  if(!userId) return res.status(401).json({message:'Please sign in to continue.'});
  const db=readDb(); const user=db.users.find(u=>u.id===userId);
  if(!user) return res.status(401).json({message:'Session expired.'});
  req.user=user; next();
}
function curator(req,res,next){
  if(!['curator','admin'].includes(req.user.role)) return res.status(403).json({message:'Curator permission required.'});
  next();
}
function slugify(v){return String(v||'phage').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
function enrich(p){
  return {
    alternativeName:'—', status:'Draft', visibility:'Public', accession:'Pending', repositoryId:'Pending', hostStrain:'—', genomeType:'Unknown', institute:'—',
    taxonomy:{}, growth:{}, hostRange:[], temperatureStability:[], phStability:[], annotation:{}, proteins:[], lab:{}, protocols:[], images:[], downloads:[], applications:[], publications:[], relatedTools:[],
    ...p
  };
}
function audit(db, user, action, phageId, details={}){
  db.audit.unshift({ id:crypto.randomUUID(), at:new Date().toISOString(), userId:user?.id||null, userName:user?.name||'system', action, phageId, details });
  db.audit=db.audit.slice(0,500);
}

app.get('/api/health',(req,res)=>res.json({ok:true,service:'PhageDB API',time:new Date().toISOString()}));
app.get('/api',(req,res)=>res.redirect(process.env.NODE_ENV==='production'?'/':'http://localhost:5173/'));
function loginHandler(req,res){
  const {email,password}=req.body||{}; const db=readDb();
  const user=db.users.find(u=>u.email.toLowerCase()===String(email||'').toLowerCase()&&u.password===password);
  if(!user) return res.status(401).json({message:'Invalid email or password.'});
  const token=createToken(user.id);
  res.json({token,user:safeUser(user)});
}
app.post('/api/session/login',loginHandler);
app.post('/api/auth/login',loginHandler);
app.post('/api/session/logout',auth,(req,res)=>res.json({ok:true}));
app.post('/api/auth/logout',auth,(req,res)=>res.json({ok:true}));
app.get('/api/me',auth,(req,res)=>res.json({user:safeUser(req.user)}));

app.get('/api/stats',(req,res)=>{
  const {phages}=readDb(); const publicPhages=phages.filter(p=>p.visibility!=='Private');
  res.json({
    total:publicPhages.length,
    verified:publicPhages.filter(p=>p.status==='Verified').length,
    hosts:new Set(publicPhages.map(p=>p.host).filter(Boolean)).size,
    institutes:new Set(publicPhages.map(p=>p.institute).filter(Boolean)).size,
    lytic:publicPhages.filter(p=>p.phageType==='Lytic').length,
    pending:phages.filter(p=>p.status==='Pending Review').length
  });
});
app.get('/api/phages',(req,res)=>{
  const db=readDb(); let rows=db.phages.filter(p=>p.visibility!=='Private');
  const {q='',type='',genome='',status='',institute='',host='',sort='newest'}=req.query;
  if(q){ const s=q.toLowerCase(); rows=rows.filter(p=>[p.name,p.repositoryId,p.accession,p.host,p.hostStrain,p.institute,p.isolationSite,p.phageType,p.genomeType].some(v=>String(v||'').toLowerCase().includes(s))); }
  if(type) rows=rows.filter(p=>p.phageType===type);
  if(genome) rows=rows.filter(p=>p.genomeType===genome);
  if(status) rows=rows.filter(p=>p.status===status);
  if(institute) rows=rows.filter(p=>p.institute===institute);
  if(host) rows=rows.filter(p=>String(p.host).toLowerCase().includes(String(host).toLowerCase()));
  rows.sort((a,b)=> sort==='name' ? String(a.name).localeCompare(String(b.name)) : sort==='oldest' ? String(a.createdAt).localeCompare(String(b.createdAt)) : String(b.createdAt).localeCompare(String(a.createdAt)) );
  res.json({items:rows.map(enrich),total:rows.length,filters:{types:[...new Set(db.phages.map(p=>p.phageType).filter(Boolean))],genomes:[...new Set(db.phages.map(p=>p.genomeType).filter(Boolean))],institutes:[...new Set(db.phages.map(p=>p.institute).filter(Boolean))]}});
});
app.get('/api/phages/:id',(req,res)=>{
  const db=readDb(); const p=db.phages.find(x=>x.id===req.params.id||x.repositoryId===req.params.id||x.accession===req.params.id);
  if(!p||p.visibility==='Private') return res.status(404).json({message:'Phage record not found.'});
  res.json({item:enrich(p)});
});
app.post('/api/phages',auth,(req,res)=>{
  const db=readDb(); const idBase=slugify(req.body.name||req.body.repositoryId); let id=idBase||crypto.randomUUID(); let n=2;
  while(db.phages.some(p=>p.id===id)) id=`${idBase}-${n++}`;
  const now=new Date().toISOString(); const p={...req.body,id,repositoryId:req.body.repositoryId||`PHDB-${String(db.phages.length+1).padStart(4,'0')}`,accession:req.body.accession||'Pending',status:req.body.status||'Pending Review',qualityStatus:'Pending',contributorId:req.user.id,createdAt:now,updatedAt:now,version:'1.0'};
  db.phages.unshift(p); audit(db,req.user,'CREATE',p.id,{name:p.name}); writeDb(db); res.status(201).json({item:enrich(p)});
});
app.put('/api/phages/:id',auth,(req,res)=>{
  const db=readDb(); const idx=db.phages.findIndex(p=>p.id===req.params.id); if(idx<0)return res.status(404).json({message:'Phage record not found.'});
  const old=db.phages[idx]; if(req.user.role==='researcher'&&old.contributorId!==req.user.id)return res.status(403).json({message:'You can edit only your own submissions.'});
  const updated={...old,...req.body,id:old.id,repositoryId:old.repositoryId,updatedAt:new Date().toISOString(),version:String((parseFloat(old.version||'1')+0.1).toFixed(1))};
  db.phages[idx]=updated; audit(db,req.user,'UPDATE',updated.id,{version:updated.version}); writeDb(db); res.json({item:enrich(updated)});
});
app.post('/api/phages/:id/status',auth,curator,(req,res)=>{
  const allowed=['Draft','Pending Review','Verified','Rejected','Embargoed']; if(!allowed.includes(req.body.status))return res.status(400).json({message:'Unsupported status.'});
  const db=readDb(); const p=db.phages.find(x=>x.id===req.params.id); if(!p)return res.status(404).json({message:'Phage record not found.'});
  p.status=req.body.status; p.qualityStatus=req.body.status==='Verified'?'Verified':req.body.status; p.verifiedBy=req.body.status==='Verified'?req.user.name:p.verifiedBy; p.updatedAt=new Date().toISOString();
  audit(db,req.user,'STATUS',p.id,{status:p.status}); writeDb(db); res.json({item:enrich(p)});
});
app.get('/api/dashboard',auth,(req,res)=>{
  const db=readDb(); const own=db.phages.filter(p=>p.contributorId===req.user.id); const pending=db.phages.filter(p=>p.status==='Pending Review');
  res.json({user:safeUser(req.user),own,pending:['curator','admin'].includes(req.user.role)?pending:[],audit:['curator','admin'].includes(req.user.role)?db.audit.slice(0,30):db.audit.filter(a=>a.userId===req.user.id).slice(0,20)});
});
app.post('/api/contact',(req,res)=>{
  const {name,email,subject,message}=req.body||{};
  if(!name||!email||!subject||!message) return res.status(400).json({message:'All contact fields are required.'});
  const db=readDb(); db.messages=db.messages||[]; db.messages.unshift({id:crypto.randomUUID(),name,email,subject,message,createdAt:new Date().toISOString()}); db.messages=db.messages.slice(0,500); writeDb(db);
  res.status(201).json({ok:true});
});

app.get('/api/phages/:id/download/:format',(req,res)=>{
  const db=readDb(); const p=db.phages.find(x=>x.id===req.params.id); if(!p)return res.status(404).json({message:'Not found'});
  const format=req.params.format.toLowerCase();
  if(format==='json'){res.setHeader('Content-Disposition',`attachment; filename="${p.id}.json"`);return res.json(p);}
  if(format==='fasta'){
    const seq='ATGC'.repeat(250); res.type('text/plain').set('Content-Disposition',`attachment; filename="${p.id}.fasta"`).send(`>${p.repositoryId}|${p.name}|demo_sequence\n${seq.match(/.{1,80}/g).join('\n')}\n`); return;
  }
  const headers=['repositoryId','name','phageType','host','hostStrain','genomeType','institute','isolationSite','isolationDate','status'];
  const row=headers.map(h=>`"${String(p[h]??'').replaceAll('"','""')}"`).join(',');
  res.type('text/csv').set('Content-Disposition',`attachment; filename="${p.id}.csv"`).send(`${headers.join(',')}\n${row}\n`);
});

const dist=path.join(rootDir,'dist');
if(fs.existsSync(dist)){
  app.use(express.static(dist));
  app.get('*',(req,res,next)=>{ if(req.path.startsWith('/api')) return next(); res.sendFile(path.join(dist,'index.html')); });
}
if (!process.env.VERCEL) app.listen(PORT,()=>console.log(`PhageDB API running on http://localhost:${PORT}`));

export default app;
