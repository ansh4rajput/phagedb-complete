import React from 'react';
import { FileText, Database, Dna, ShieldCheck, Download, Code2, BookOpen, ClipboardCheck } from 'lucide-react';

export default function Resources(){
  const template=`repository_id,phage_name,host,host_strain,phage_type,genome_type,isolation_date,isolation_site,institute,contact\n,P002,Pseudomonas aeruginosa,PAO1,Lytic,Linear dsDNA,2024-09-22,Ahmedabad,Gujarat Technological University,researcher@example.edu\n`;
  const download=()=>{const b=new Blob([template],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='phagedb-metadata-template.csv';a.click();URL.revokeObjectURL(a.href)};
  return <div className="page-width info-page"><div className="page-title-row"><div><h1>REPOSITORY RESOURCES</h1><p>Submission guidance, metadata standards, data exports and developer access.</p></div></div>
    <div className="resource-grid">
      <Resource icon={ClipboardCheck} title="Submission Checklist" text="Minimum identity, host, provenance, institute and contact metadata plus recommended characterization fields." items={['Repository identity & accession','Host strain / culture collection ID','Isolation date, site and sample type','Phage lifecycle and plaque phenotype','Genome and storage metadata']}/>
      <Resource icon={Dna} title="Genomic Data" text="Attach sequence and annotation assets to make records computationally reusable." items={['FASTA / FASTQ','GenBank / GFF','Protein FASTA','Assembly and coverage','Checksums & version identifiers']}/>
      <Resource icon={ShieldCheck} title="Curation Standard" text="A verified badge should reflect curator review of metadata completeness and evidence — not just submission." items={['Controlled vocabularies','Accession uniqueness','File integrity checks','Version history','Embargo / public visibility']}/>
      <Resource icon={FileText} title="Protocols & SOPs" text="Link reusable experimental methods to each record." items={['Isolation & enrichment','Propagation','Plaque / spot assays','Purification & DNA extraction','TEM preparation']}/>
    </div>
    <section className="resource-callout"><div><Database/><div><h2>Metadata CSV template</h2><p>Starter columns for bulk preparation before entering full characterization details.</p></div></div><button className="primary-button" onClick={download}><Download/> DOWNLOAD TEMPLATE</button></section>
    <section className="resource-callout"><div><Code2/><div><h2>Repository API</h2><p>Read access is available through the demo REST API. Production deployment should add API keys, rate limits and documented schemas.</p><code>GET /api/phages · GET /api/phages/:id · GET /api/stats</code></div></div></section>
    <section className="resource-callout"><div><BookOpen/><div><h2>Recommended governance before launch</h2><p>Define submission ownership, curator responsibilities, evidence standards, accession policy, takedown/versioning rules, embargo handling, licensing and retention.</p></div></div></section>
  </div>
}
function Resource({icon:Icon,title,text,items}){return <article className="resource-card"><Icon/><h2>{title}</h2><p>{text}</p><ul>{items.map(x=><li key={x}>{x}</li>)}</ul></article>}
