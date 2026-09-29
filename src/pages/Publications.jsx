import React from 'react';
import { BookOpen, FileText, ExternalLink } from 'lucide-react';
const pubs=[
  {year:'2024',title:'Isolation and characterization of novel lytic phage P002 against Pseudomonas aeruginosa',authors:'Gupta A. et al.',status:'In preparation',type:'Manuscript'},
  {year:'2024',title:'GSBTM Project Report — Bacteriophage Repository',authors:'GTU Phage Team',status:'Repository report',type:'Report'},
  {year:'2024',title:'Phage Repository Update',authors:'GTU Phage Team',status:'Conference presentation',type:'Poster'}
];
export default function Publications(){return <div className="page-width info-page"><div className="page-title-row"><div><h1>PUBLICATIONS & OUTPUTS</h1><p>Research outputs linked to repository phages and repository development.</p></div></div><div className="publication-page-list">{pubs.map((p,i)=><article key={i}><div className="pub-icon">{p.type==='Manuscript'?<BookOpen/>:<FileText/>}</div><div><span className="eyebrow">{p.year} · {p.type}</span><h2>{p.title}</h2><p>{p.authors}</p><small>{p.status}</small></div><button className="icon-button" title="Add DOI / publication URL when available"><ExternalLink/></button></article>)}</div><div className="resource-callout"><div><BookOpen/><div><h2>Publication linking</h2><p>For production, connect phage records to DOI, PubMed, ORCID and dataset identifiers so contributors receive attribution and readers can move between evidence and repository data.</p></div></div></div></div>}
