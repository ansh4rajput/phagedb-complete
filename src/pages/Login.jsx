import React,{useState} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { LogIn, UserRound, ShieldCheck, FlaskConical, AlertCircle } from 'lucide-react';
import { login } from '../api.js';
import Brand from '../components/Brand.jsx';

export default function Login(){
  const [email,setEmail]=useState('researcher@phagedb.local'); const [password,setPassword]=useState('phage123'); const [error,setError]=useState(''); const [busy,setBusy]=useState(false); const nav=useNavigate(); const loc=useLocation();
  const submit=async e=>{e.preventDefault();setBusy(true);setError('');try{const r=await login(email,password);localStorage.setItem('phagedb_token',r.token);nav(loc.state?.from||'/dashboard');window.location.reload();}catch(e){setError(e.message)}finally{setBusy(false)}};
  const fill=(role)=>{const m={researcher:['researcher@phagedb.local','phage123'],curator:['curator@phagedb.local','curator123'],admin:['admin@phagedb.local','admin123']};setEmail(m[role][0]);setPassword(m[role][1]);};
  return <div className="login-page"><div className="login-card"><Brand/><h1>RESEARCHER LOGIN</h1><p>Sign in to submit, edit and curate phage records.</p>{error&&<div className="alert error"><AlertCircle/>{error}</div>}<form onSubmit={submit}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="primary-button wide" disabled={busy}><LogIn/> {busy?'SIGNING IN...':'SIGN IN'}</button></form><div className="demo-accounts"><strong>Demo accounts</strong><button onClick={()=>fill('researcher')}><FlaskConical/> Researcher</button><button onClick={()=>fill('curator')}><ShieldCheck/> Curator</button><button onClick={()=>fill('admin')}><UserRound/> Admin</button></div><small className="security-note">Demo authentication is intentionally lightweight. Replace it with institutional SSO/Supabase/Auth0 before production.</small></div></div>
}
