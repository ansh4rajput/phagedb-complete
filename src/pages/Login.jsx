import React,{useState} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { login } from '../api.js';
import Brand from '../components/Brand.jsx';

export default function Login(){
  const [identifier,setIdentifier]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false); const nav=useNavigate(); const loc=useLocation();
  const submit=async e=>{e.preventDefault();setBusy(true);setError('');try{const r=await login(identifier,password);localStorage.setItem('phagedb_token',r.token);window.dispatchEvent(new CustomEvent('phagedb-auth-change',{detail:r.user}));nav(loc.state?.from||'/dashboard',{replace:true});}catch(e){setError(e.message)}finally{setBusy(false)}};
  return <div className="login-page"><div className="login-card"><Brand/><h1>REPOSITORY ACCESS</h1><p>Sign in with your issued account ID or institutional email.</p>{error&&<div className="alert error"><AlertCircle/>{error}</div>}<form onSubmit={submit}><label>Account ID or email<input value={identifier} onChange={e=>setIdentifier(e.target.value)} autoComplete="username" required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label><button className="primary-button wide" disabled={busy}><LogIn/> {busy?'SIGNING IN...':'SIGN IN'}</button></form><div className="account-security"><ShieldCheck/><div><strong>Role-based secure access</strong><span>Researcher, curator and administrator permissions are enforced by the repository API.</span></div></div><small className="security-note">Access credentials are issued by the repository administrator.</small></div></div>
}
