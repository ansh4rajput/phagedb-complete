import React,{useEffect,useMemo,useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, SlidersHorizontal, X, GitCompareArrows } from 'lucide-react';
import { getPhages } from '../api.js';
import PhageCard from '../components/PhageCard.jsx';

export default function Database(){
  const [data,setData]=useState({items:[],filters:{types:[],genomes:[],institutes:[]}}); const [loading,setLoading]=useState(true); const [selected,setSelected]=useState([]); const nav=useNavigate();
  const [f,setF]=useState({q:'',type:'',genome:'',status:'',institute:'',sort:'newest'});
  const qs=useMemo(()=>'?'+new URLSearchParams(Object.fromEntries(Object.entries(f).filter(([,v])=>v))).toString(),[f]);
  useEffect(()=>{const t=setTimeout(()=>{setLoading(true);getPhages(qs).then(setData).finally(()=>setLoading(false));},180);return()=>clearTimeout(t)},[qs]);
  const toggle=id=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):s.length>=3?s:[...s,id]);
  const clear=()=>setF({q:'',type:'',genome:'',status:'',institute:'',sort:'newest'});
  return <div className="page-width database-page">
    <div className="page-title-row"><div><h1>PHAGE DATABASE</h1><p>{data.total??data.items.length} phages documented</p></div><Link to="/add" className="primary-button"><Plus/> ADD NEW PHAGE</Link></div>
    <div className="search-panel">
      <label className="search-box"><Search/><input value={f.q} onChange={e=>setF({...f,q:e.target.value})} placeholder="Search phages by name, host, type, institute, accession..."/></label>
      <div className="filter-row">
        <span><SlidersHorizontal/> FILTERS</span>
        <Select label="Phage type" value={f.type} onChange={v=>setF({...f,type:v})} options={data.filters.types}/>
        <Select label="Genome" value={f.genome} onChange={v=>setF({...f,genome:v})} options={data.filters.genomes}/>
        <Select label="Institute" value={f.institute} onChange={v=>setF({...f,institute:v})} options={data.filters.institutes}/>
        <Select label="Status" value={f.status} onChange={v=>setF({...f,status:v})} options={['Verified','Pending Review','Draft','Embargoed']}/>
        <Select label="Sort" value={f.sort} onChange={v=>setF({...f,sort:v})} options={['newest','oldest','name']} labels={{newest:'Newest',oldest:'Oldest',name:'Name A–Z'}} blank={false}/>
        {Object.entries(f).some(([k,v])=>k!=='sort'&&v)&&<button className="clear-filter" onClick={clear}><X/> Clear</button>}
      </div>
    </div>
    {loading?<div className="loading-grid">{[1,2,3,4,5,6].map(x=><div className="skeleton card-skeleton" key={x}/>)}</div>:data.items.length?<div className="phage-grid">{data.items.map(p=><PhageCard key={p.id} phage={p} compareSelected={selected.includes(p.id)} onToggleCompare={toggle}/>)}</div>:<div className="empty-state"><Search/><h2>No phages match those filters</h2><p>Try a broader search or clear the filters.</p><button className="outline-button" onClick={clear}>CLEAR FILTERS</button></div>}
    {selected.length>0&&<div className="compare-bar"><span><GitCompareArrows/> {selected.length}/3 selected for comparison</span><button className="primary-button" disabled={selected.length<2} onClick={()=>nav(`/compare?ids=${selected.join(',')}`)}>COMPARE PHAGES</button><button className="icon-button" onClick={()=>setSelected([])}><X/></button></div>}
  </div>
}
function Select({label,value,onChange,options=[],labels={},blank=true}){return <select value={value} onChange={e=>onChange(e.target.value)} aria-label={label}>{blank&&<option value="">{label}</option>}{options.map(o=><option key={o} value={o}>{labels[o]||o}</option>)}</select>}
