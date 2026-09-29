import React,{useEffect,useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, FlaskConical, Clock3, BadgeCheck, Activity, Edit3, Eye, Check, X, AlertCircle } from 'lucide-react';
import { api, changeStatus } from '../api.js';

export default function Dashboard(){
  const [d,setD]=useState(null); const [error,setError]=useState(''); const nav=useNavigate();
  const load=()=>api('/dashboard').then(setD).catch(e=>{setError(e.message);if(e.message.includes('sign'))nav('/login',{state:{from:'/dashboard'}})}); useEffect(()=>{load()},[]);
  const status=async(id,s)=>{await changeStatus(id,s);load();};
  if(!d)return <div className="page-width dashboard-page">{error?<div className="alert error"><AlertCircle/>{error}</div>:<div className="skeleton detail-hero-skeleton"/>}</div>;
  return <div className="page-width dashboard-page"><div className="page-title-row"><div><h1>REPOSITORY DASHBOARD</h1><p>{d.user.name} · {d.user.role} · {d.user.institute}</p></div><Link to="/add" className="primary-button"><Plus/> ADD PHAGE</Link></div>
    <div className="stat-grid"><DashStat icon={FlaskConical} value={d.own.length} label="My submissions"/><DashStat icon={BadgeCheck} value={d.own.filter(x=>x.status==='Verified').length} label="Verified"/><DashStat icon={Clock3} value={d.own.filter(x=>x.status==='Pending Review').length} label="Pending review"/><DashStat icon={Activity} value={d.audit.length} label="Recent actions"/></div>
    <section className="dashboard-section"><div className="section-heading"><div><span className="eyebrow">MY RECORDS</span><h2>Contributions</h2></div></div><RecordTable rows={d.own}/></section>
    {d.pending.length>0&&<section className="dashboard-section curator-panel"><div className="section-heading"><div><span className="eyebrow">CURATOR QUEUE</span><h2>Pending review</h2></div></div><div className="review-queue">{d.pending.map(p=><article key={p.id}><div><strong>{p.name}</strong><span>{p.host} · {p.institute}</span></div><Link className="icon-button" to={`/phage/${p.id}`}><Eye/></Link><button className="approve" onClick={()=>status(p.id,'Verified')}><Check/> Verify</button><button className="reject" onClick={()=>status(p.id,'Rejected')}><X/> Reject</button></article>)}</div></section>}
    <section className="dashboard-section"><div className="section-heading"><div><span className="eyebrow">AUDIT TRAIL</span><h2>Recent record activity</h2></div></div><div className="audit-list">{d.audit.map(a=><div key={a.id}><span>{new Date(a.at).toLocaleString()}</span><strong>{a.userName}</strong><em>{a.action}</em><code>{a.phageId}</code></div>)}</div></section>
  </div>
}
function DashStat({icon:Icon,value,label}){return <div className="stat-card"><Icon/><strong>{value}</strong><span>{label}</span></div>}
function RecordTable({rows}){if(!rows.length)return <div className="empty-inline">No submissions yet.</div>;return <div className="table-wrap"><table className="data-table"><thead><tr><th>Phage</th><th>Host</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>{rows.map(p=><tr key={p.id}><td><strong>{p.name}</strong><small>{p.repositoryId}</small></td><td>{p.host}</td><td><span className="status-mini">{p.status}</span></td><td>{new Date(p.updatedAt).toLocaleDateString()}</td><td className="table-actions"><Link to={`/phage/${p.id}`}><Eye/></Link><Link to={`/edit/${p.id}`}><Edit3/></Link></td></tr>)}</tbody></table></div>}
