import React, {useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Microscope, ShieldPlus, Target, Database, Dna, Snowflake, Globe2, Handshake, FlaskConical, BadgeCheck, Users, Building2 } from 'lucide-react';
import PhageArt from '../components/PhageArt.jsx';
import { getStats, getPhages } from '../api.js';
import PhageCard from '../components/PhageCard.jsx';

export default function Landing(){
  const [stats,setStats]=useState({total:16,verified:0,hosts:0,institutes:0}); const [featured,setFeatured]=useState([]);
  useEffect(()=>{getStats().then(setStats).catch(()=>{});getPhages('?sort=newest').then(r=>setFeatured(r.items.slice(0,3))).catch(()=>{});},[]);
  return <div className="landing">
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">GUJARAT BACTERIOPHAGE REPOSITORY</span>
        <h1>DOCUMENT. DISCOVER.<br/><em>SHARE PHAGES.</em></h1>
        <p>A collaborative bacteriophage repository for structured discovery records, biological characterization, genomic metadata, preservation details and reusable research data.</p>
        <div className="hero-actions"><Link className="primary-button" to="/database"><Search/> EXPLORE PHAGES</Link><Link className="outline-button" to="/add"><FlaskConical/> CONTRIBUTE A PHAGE</Link></div>
        <div className="hero-mini-stats"><span><strong>{stats.total}</strong> records</span><span><strong>{stats.hosts}</strong> hosts</span><span><strong>{stats.institutes}</strong> institutes</span><span><strong>{stats.verified}</strong> verified</span></div>
      </div>
      <div className="hero-visual"><div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/><PhageArt large/><div className="amr-card"><span className="eyebrow">ABOUT AMR</span><p>Antimicrobial resistance makes bacterial infections harder to treat. Phages offer a highly specific biological route for investigating and targeting bacterial hosts.</p><div><ShieldPlus/> Research-ready phage records</div></div></div>
    </section>

    <section className="intro-grid page-width" id="about">
      <Info icon={Building2} title="About the Repository" text="A structured platform for cataloguing phages, their hosts, isolation context, characterization, genomic data, protocols and provenance."/>
      <Info icon={Microscope} title="What are Bacteriophages?" text="Bacteriophages are viruses that infect bacteria. Their host specificity, diversity and biology make them important research tools."/>
      <Info icon={ShieldPlus} title="Why Phages for AMR?" text="Phage research can support investigation of drug-resistant bacterial pathogens, biofilms, diagnostics and phage-based interventions."/>
      <Info icon={Target} title="Our Mission" text="Make phage records findable, comparable, citable and reusable while preserving the laboratory context needed to reproduce and extend research."/>
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
