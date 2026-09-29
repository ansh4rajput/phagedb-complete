import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, Building2, Eye, Share2, Dna, BadgeCheck } from 'lucide-react';
import ShareModal from './ShareModal.jsx';

export default function PhageCard({phage,compareSelected=false,onToggleCompare}){
  const [share,setShare]=useState(false);
  return <article className="phage-card">
    <div className="card-top"><div><h3>{phage.name}</h3><p>{phage.host}</p></div><span className={`type-pill type-${String(phage.phageType||'unknown').toLowerCase().replaceAll(' ','-')}`}>{phage.phageType||'Unknown'}</span></div>
    <div className="card-meta">
      <span><MapPin/>{phage.isolationSite||'Not recorded'}</span>
      <span><CalendarDays/>{formatDate(phage.isolationDate)}</span>
      <span><Building2/>{phage.institute||'Not recorded'}</span>
    </div>
    <div className="card-chips"><span><Dna size={13}/>{phage.genomeType||'Genome unknown'}</span>{phage.status==='Verified'&&<span className="verified-chip"><BadgeCheck size={13}/> Verified</span>}</div>
    <div className="card-actions">
      <Link to={`/phage/${phage.id}`} className="outline-button grow"><Eye size={17}/> VIEW DETAILS</Link>
      <button className="icon-button" onClick={()=>setShare(true)} title="Share"><Share2 size={18}/></button>
      {onToggleCompare&&<label className="compare-check"><input type="checkbox" checked={compareSelected} onChange={()=>onToggleCompare(phage.id)}/> Compare</label>}
    </div>
    {share&&<ShareModal phage={phage} onClose={()=>setShare(false)}/>} 
  </article>
}
function formatDate(v){ if(!v)return 'Not recorded'; const d=new Date(v); return Number.isNaN(d.getTime())?v:d.toLocaleDateString('en-GB'); }
