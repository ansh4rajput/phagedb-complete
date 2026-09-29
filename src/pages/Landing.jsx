import React, {useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Microscope, ShieldPlus, Target, Database, Dna, Snowflake, Globe2, Handshake, FlaskConical, BadgeCheck, Users, Building2 } from 'lucide-react';
import { getStats, getPhages } from '../api.js';
import PhageCard from '../components/PhageCard.jsx';

export default function Landing(){
  const [stats,setStats]=useState({total:16,verified:0,hosts:0,institutes:0}); const [featured,setFeatured]=useState([]);
  useEffect(()=>{getStats().then(setStats).catch(()=>{});getPhages('?sort=newest').then(r=>setFeatured(r.items.slice(0,3))).catch(()=>{});},[]);
  return <div className="landing">
    <section className="hero institutional-hero">
      <div className="hero-copy">
        <span className="hero-gtu">GTU</span>
        <h1>BACTERIOPHAGE<br/>REPOSITORY</h1>
        <h2>Exploring Phages. Combating AMR. Building a Healthier Future.</h2>
        <p>A dedicated repository of bacteriophages isolated from diverse environments across Gujarat and beyond. We discover, characterize, preserve and share phages to accelerate research and develop phage-based solutions against antimicrobial resistance.</p>
        <div className="hero-actions"><Link className="primary-button" to="/database"><Search/> Explore Phages</Link><Link className="outline-button" to="/database"><Search/> Search Repository</Link></div>
      </div>
      <aside className="amr-card"><span className="eyebrow">ABOUT AMR</span><p>Antimicrobial resistance arises when bacteria evolve to survive the medicines designed to kill them.</p><p>AMR is a global health crisis causing infections that are harder to treat, longer illnesses and increasing mortality.</p><p>Bacteriophages offer a natural, specific and effective route for targeting drug-resistant bacteria.</p><div><ShieldPlus/> A promising tool against AMR</div></aside>
    </section>

    <section className="intro-grid page-width" id="about">
      <Info icon={Building2} title="About GTU" text="Gujarat Technological University is committed to quality technical education, cutting-edge research and interdisciplinary innovation addressing real-world challenges including AMR."/>
      <Info icon={Microscope} title="What are Bacteriophages?" text="Bacteriophages are viruses that infect and kill bacteria. They are abundant biological entities with a vital role in microbial ecology and evolution."/>
      <Info icon={ShieldPlus} title="Why Phages for AMR?" text="Phages are highly specific to bacterial hosts and offer a safe, sustainable and targeted route for investigating multidrug-resistant pathogens."/>
      <Info icon={Target} title="Our Mission" text="Build an accessible repository, advance phage research and translate discoveries into solutions that improve public health."/>
    </section>

    <section className="value-strip page-width">
      <Value icon={Search} title="Diverse Collection" text="Environment, host and geography-rich records"/>
      <Value icon={Dna} title="Deep Characterization" text="Morphology, biology and genomic metadata"/>
      <Value icon={Snowflake} title="Preservation" text="Storage, titers and lab inventory context"/>
      <Value icon={Globe2} title="Open Access" text="Public records with citation-ready exports"/>
      <Value icon={Handshake} title="Collaboration" text="Institute, contributor and publication links"/>
    </section>

    <section className="landing-section page-width">
      <div className="section-heading"><div><span className="eyebrow">REPOSITORY AT A GLANCE</span><h2>Built for real phage documentation</h2></div><Link to="/database">Browse all <ArrowRight/></Link></div>
      <div className="stat-grid">
        <Stat icon={Database} value={stats.total} label="Phage records"/><Stat icon={BadgeCheck} value={stats.verified} label="Verified records"/><Stat icon={Users} value={stats.hosts} label="Distinct hosts"/><Stat icon={Building2} value={stats.institutes} label="Institutes"/>
      </div>
    </section>

    <section className="landing-section page-width">
      <div className="section-heading"><div><span className="eyebrow">LATEST RECORDS</span><h2>Recently documented phages</h2></div></div>
      <div className="phage-grid three">{featured.map(p=><PhageCard key={p.id} phage={p}/>)}</div>
    </section>

    <section className="cta-section page-width"><div><span className="eyebrow">CONTRIBUTE TO THE COLLECTION</span><h2>Turn a phage discovery into a reusable scientific record.</h2><p>Submit core identity first, then progressively enrich the record with host range, growth, genomic, laboratory, publication and protocol data.</p></div><Link className="primary-button" to="/add">ADD NEW PHAGE <ArrowRight/></Link></section>
    <footer className="footer"><div>PHAGE<span>DB</span> · Collaborative Bacteriophage Repository</div><p>Demo implementation — institutional content, governance and scientific validation should be configured before production deployment.</p></footer>
  </div>
}
function Info({icon:Icon,title,text}){return <article className="intro-card"><Icon/><h3>{title}</h3><p>{text}</p><span>Learn more <ArrowRight/></span></article>}
function Value({icon:Icon,title,text}){return <div className="value-item"><Icon/><div><strong>{title}</strong><small>{text}</small></div></div>}
function Stat({icon:Icon,value,label}){return <div className="stat-card"><Icon/><strong>{value}</strong><span>{label}</span></div>}
