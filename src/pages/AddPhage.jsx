import React,{useEffect,useMemo,useState} from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Save, Send, FlaskConical, MapPin, Microscope, Dna, Archive, AlertCircle } from 'lucide-react';
import { createPhage, getPhage, updatePhage } from '../api.js';

const blank={name:'',repositoryId:'',accession:'',alternativeName:'',phageType:'Lytic',host:'',hostStrain:'',genomeType:'',institute:'',contact:'',isolationSite:'',isolationDate:'',latitude:'',longitude:'',sampleType:'',environmentalSource:'',collectedBy:'',isolationMethod:'',hostUsedForIsolation:'',hostOrigin:'',atcc:'',gramStain:'',clinicalImportance:'',antibioticResistance:'',order:'',family:'',subfamily:'',genus:'',species:'',ictvStatus:'',plaqueMorphology:'',plaqueDiameter:'',plaqueAppearance:'',halo:'',margin:'',elevation:'',capsidShape:'',tailType:'',capsidDiameter:'',tailLength:'',tailWidth:'',collar:'',basePlate:'',tailFibers:'',morphotype:'',adsorptionTime:'',adsorptionRate:'',latentPeriod:'',eclipsePeriod:'',risePeriod:'',burstSize:'',optimalMoi:'',lifeCycle:'',sequencingPlatform:'',genomeSize:'',gcContent:'',genomeEnds:'',assembly:'',coverage:'',genbank:'',growthTemperature:'',growthPh:'',growthHostDensity:'',maximumPfu:'',growthCurve:'',hostRangeText:'',temperatureStabilityText:'',phStabilityText:'',totalOrfs:'',codingDensity:'',trna:'',rrna:'',integrase:'',repressor:'',virulence:'',amr:'',lysogeny:'',lifestylePrediction:'',proteinsText:'',stockTiter:'',storageBuffer:'',storageTemperature:'',cryoprotectant:'',freezeThaw:'',freezer:'',rack:'',box:'',position:'',protocolsText:'',imagesText:'',downloadsText:'',applicationsText:'',publicationsText:'',relatedToolsText:'',visibility:'Public'};
const steps=[{title:'Identity',icon:FlaskConical},{title:'Isolation & Host',icon:MapPin},{title:'Characterization',icon:Microscope},{title:'Genome & Storage',icon:Dna},{title:'Evidence & Outputs',icon:Archive},{title:'Review',icon:Check}];
const list=v=>String(v||'').split('\n').map(x=>x.trim()).filter(Boolean);
const pairs=v=>list(v).map(x=>x.split('|').map(y=>y.trim())).filter(x=>x.length>1);
const hostRows=v=>pairs(v).map(([host,strain,result])=>({host,strain,result:/^(yes|true|susceptible|positive|lysis)$/i.test(result)}));

export default function AddPhage({editMode=false}){
  const [step,setStep]=useState(0); const [form,setForm]=useState(blank); const [error,setError]=useState(''); const [saving,setSaving]=useState(false); const nav=useNavigate(); const {id}=useParams();
  useEffect(()=>{if(editMode&&id)getPhage(id).then(r=>{const p=r.item;setForm({...blank,...p,growthTemperature:p.growth?.temperature||'',growthPh:p.growth?.ph||'',growthHostDensity:p.growth?.hostDensity||'',maximumPfu:p.growth?.maximumPfu||'',growthCurve:(p.growth?.curve||[]).join(', '),hostRangeText:(p.hostRange||[]).map(x=>`${x.host} | ${x.strain} | ${x.result?'yes':'no'}`).join('\n'),temperatureStabilityText:(p.temperatureStability||[]).map(x=>x.join(' | ')).join('\n'),phStabilityText:(p.phStability||[]).map(x=>x.join(' | ')).join('\n'),totalOrfs:p.annotation?.totalOrfs||'',codingDensity:p.annotation?.codingDensity||'',trna:p.annotation?.trna||'',rrna:p.annotation?.rrna||'',integrase:p.annotation?.integrase||'',repressor:p.annotation?.repressor||'',virulence:p.annotation?.virulence||'',amr:p.annotation?.amr||'',lysogeny:p.annotation?.lysogeny||'',lifestylePrediction:p.annotation?.lifestyle||'',proteinsText:(p.proteins||[]).map(x=>x.join(' | ')).join('\n'),stockTiter:p.lab?.stockTiter||'',storageBuffer:p.lab?.buffer||'',storageTemperature:p.lab?.storageTemperature||'',cryoprotectant:p.lab?.cryoprotectant||'',freezeThaw:p.lab?.freezeThaw||'',freezer:p.lab?.freezer||'',rack:p.lab?.rack||'',box:p.lab?.box||'',position:p.lab?.position||'',protocolsText:(p.protocols||[]).join('\n'),imagesText:(p.images||[]).map(x=>`${x.label} | ${x.kind||'image'}`).join('\n'),downloadsText:(p.downloads||[]).join('\n'),applicationsText:(p.applications||[]).join('\n'),publicationsText:(p.publications||[]).join('\n'),relatedToolsText:(p.relatedTools||[]).join('\n')})}).catch(e=>setError(e.message));},[editMode,id]);
  const requiredOk=useMemo(()=>form.name&&form.host&&form.phageType&&form.institute,[form]);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const payload=(status)=>({...form,status,growth:{temperature:form.growthTemperature,ph:form.growthPh,hostDensity:form.growthHostDensity,maximumPfu:form.maximumPfu,curve:String(form.growthCurve||'').split(',').map(Number).filter(Number.isFinite)},hostRange:hostRows(form.hostRangeText),temperatureStability:pairs(form.temperatureStabilityText),phStability:pairs(form.phStabilityText),annotation:{totalOrfs:form.totalOrfs,codingDensity:form.codingDensity,trna:form.trna,rrna:form.rrna,integrase:form.integrase,repressor:form.repressor,virulence:form.virulence,amr:form.amr,lysogeny:form.lysogeny,lifestyle:form.lifestylePrediction},proteins:pairs(form.proteinsText),lab:{stockTiter:form.stockTiter,buffer:form.storageBuffer,storageTemperature:form.storageTemperature,cryoprotectant:form.cryoprotectant,freezeThaw:form.freezeThaw,freezer:form.freezer,rack:form.rack,box:form.box,position:form.position},protocols:list(form.protocolsText),images:pairs(form.imagesText).map(([label,kind])=>({label,kind})),downloads:list(form.downloadsText),applications:list(form.applicationsText),publications:list(form.publicationsText),relatedTools:list(form.relatedToolsText)});
  const save=async(status)=>{setError('');if(!localStorage.getItem('phagedb_token')){nav('/login',{state:{from:editMode?`/edit/${id}`:'/add'}});return;}if(status==='Pending Review'&&!requiredOk){setError('Phage name, host, phage type and institute are required before submission.');setStep(0);return;}setSaving(true);try{const r=editMode?await updatePhage(id,payload(status)):await createPhage(payload(status));nav(`/phage/${r.item.id}`);}catch(e){setError(e.message)}finally{setSaving(false)}};
  return <div className="page-width form-page">
    <Link to={editMode?`/phage/${id}`:'/database'} className="back-link"><ArrowLeft/> {editMode?'Back to record':'Back to Database'}</Link>
    <div className="page-title-row"><div><h1>{editMode?'EDIT PHAGE RECORD':'ADD NEW PHAGE'}</h1><p>{editMode?'Update the scientific record with version tracking.':'Document a new bacteriophage discovery in structured stages.'}</p></div></div>
    <div className="stepper">{steps.map((s,i)=>{const Icon=s.icon;return <button key={s.title} className={`${i===step?'active':''} ${i<step?'done':''}`} onClick={()=>setStep(i)}><span>{i<step?<Check/>:<Icon/>}</span><small>{i+1}. {s.title}</small></button>})}</div>
    {error&&<div className="alert error"><AlertCircle/>{error}</div>}
    <div className="form-card">
      {step===0&&<Step title="1. Phage Identity" subtitle="The minimum identity and provenance needed to create a repository record.">
        <Field label="Phage Name" required value={form.name} onChange={v=>set('name',v)} placeholder="e.g., GTU-P002"/>
        <Field label="Repository ID" value={form.repositoryId} onChange={v=>set('repositoryId',v)} placeholder="Auto-generated if blank" disabled={editMode}/>
        <Field label="Accession Number" value={form.accession} onChange={v=>set('accession',v)} placeholder="e.g., GSPR-0002" disabled={editMode}/>
        <Field label="Alternative Name" value={form.alternativeName} onChange={v=>set('alternativeName',v)} placeholder="Optional aliases"/>
        <SelectField label="Phage Type" required value={form.phageType} onChange={v=>set('phageType',v)} options={['Lytic','Temperate','Lysogenic','Chronic','Other']}/>
        <SelectField label="Genome Type" value={form.genomeType} onChange={v=>set('genomeType',v)} options={['dsDNA linear','dsDNA circular','ssDNA circular','ssDNA linear','dsRNA','ssRNA linear','Other']}/>
        <Field label="Institute" required value={form.institute} onChange={v=>set('institute',v)} placeholder="Gujarat Technological University"/>
        <Field label="Contact Email" value={form.contact} onChange={v=>set('contact',v)} type="email" placeholder="researcher@institute.edu"/>
        <SelectField label="Visibility" value={form.visibility} onChange={v=>set('visibility',v)} options={['Public','Embargoed','Private']}/>
      </Step>}
      {step===1&&<Step title="2. Isolation & Host Information" subtitle="Capture where the phage came from and the bacterial host used to isolate it.">
        <Field label="Primary Host" required value={form.host} onChange={v=>set('host',v)} placeholder="e.g., Pseudomonas aeruginosa"/>
        <Field label="Host Strain" value={form.hostStrain} onChange={v=>set('hostStrain',v)} placeholder="e.g., PAO1"/>
        <Field label="ATCC / Culture Collection ID" value={form.atcc} onChange={v=>set('atcc',v)} placeholder="e.g., ATCC 27853"/>
        <Field label="Host Origin" value={form.hostOrigin} onChange={v=>set('hostOrigin',v)} placeholder="e.g., Clinical isolate"/>
        <SelectField label="Gram Stain" value={form.gramStain} onChange={v=>set('gramStain',v)} options={['Gram-negative','Gram-positive','Variable','Not recorded']}/>
        <Field label="Clinical Importance" value={form.clinicalImportance} onChange={v=>set('clinicalImportance',v)} placeholder="e.g., ESKAPE pathogen"/>
        <Field label="Antibiotic Resistance Profile" value={form.antibioticResistance} onChange={v=>set('antibioticResistance',v)} placeholder="e.g., MDR"/>
        <Field label="Isolation Site" value={form.isolationSite} onChange={v=>set('isolationSite',v)} placeholder="Pirana Pumping Yard, Ahmedabad"/>
        <Field label="Isolation Date" value={form.isolationDate} onChange={v=>set('isolationDate',v)} type="date"/>
        <Field label="Latitude" value={form.latitude} onChange={v=>set('latitude',v)} type="number" step="any" placeholder="23.0305"/>
        <Field label="Longitude" value={form.longitude} onChange={v=>set('longitude',v)} type="number" step="any" placeholder="72.5800"/>
        <Field label="Sample Type" value={form.sampleType} onChange={v=>set('sampleType',v)} placeholder="e.g., Sewage"/>
        <Field label="Environmental Source" value={form.environmentalSource} onChange={v=>set('environmentalSource',v)} placeholder="Municipal wastewater"/>
        <Field label="Collected By" value={form.collectedBy} onChange={v=>set('collectedBy',v)} placeholder="Researcher name"/>
        <Field label="Isolation Method" value={form.isolationMethod} onChange={v=>set('isolationMethod',v)} placeholder="Enrichment method"/>
        <Field label="Host Used for Isolation" value={form.hostUsedForIsolation} onChange={v=>set('hostUsedForIsolation',v)} placeholder="Pseudomonas aeruginosa PAO1"/>
      </Step>}
      {step===2&&<Step title="3. Characterization" subtitle="Morphology, taxonomy, plaque phenotype and core biological measurements.">
        <Field label="Order" value={form.order} onChange={v=>set('order',v)} placeholder="Taxonomic order"/>
        <Field label="Family" value={form.family} onChange={v=>set('family',v)} placeholder="Taxonomic family"/>
        <Field label="Subfamily" value={form.subfamily} onChange={v=>set('subfamily',v)} placeholder="Optional"/>
        <Field label="Genus" value={form.genus} onChange={v=>set('genus',v)} placeholder="Optional"/>
        <Field label="Species" value={form.species} onChange={v=>set('species',v)} placeholder="Optional"/>
        <Field label="ICTV Status" value={form.ictvStatus} onChange={v=>set('ictvStatus',v)} placeholder="Pending / Classified"/>
        <Field label="Capsid Shape" value={form.capsidShape} onChange={v=>set('capsidShape',v)} placeholder="Icosahedral"/>
        <Field label="Tail Type" value={form.tailType} onChange={v=>set('tailType',v)} placeholder="Contractile"/>
        <Field label="Capsid Diameter" value={form.capsidDiameter} onChange={v=>set('capsidDiameter',v)} placeholder="144 nm"/>
        <Field label="Tail Length" value={form.tailLength} onChange={v=>set('tailLength',v)} placeholder="152 nm"/>
        <Field label="Tail Width" value={form.tailWidth} onChange={v=>set('tailWidth',v)} placeholder="18 nm"/>
        <Field label="Collar" value={form.collar} onChange={v=>set('collar',v)} placeholder="Present / absent"/>
        <Field label="Base Plate" value={form.basePlate} onChange={v=>set('basePlate',v)} placeholder="Present / absent"/>
        <Field label="Tail Fibers" value={form.tailFibers} onChange={v=>set('tailFibers',v)} placeholder="Present / absent"/>
        <Field label="Morphotype" value={form.morphotype} onChange={v=>set('morphotype',v)} placeholder="A1"/>
        <Field label="Plaque Diameter" value={form.plaqueDiameter} onChange={v=>set('plaqueDiameter',v)} placeholder="2 mm"/>
        <Field label="Plaque Appearance" value={form.plaqueAppearance} onChange={v=>set('plaqueAppearance',v)} placeholder="Clear"/>
        <Field label="Halo" value={form.halo} onChange={v=>set('halo',v)} placeholder="Present / absent"/>
        <Field label="Plaque Margin" value={form.margin} onChange={v=>set('margin',v)} placeholder="Smooth"/>
        <Field label="Plaque Elevation" value={form.elevation} onChange={v=>set('elevation',v)} placeholder="Flat"/>
        <Textarea label="Plaque Morphology" value={form.plaqueMorphology} onChange={v=>set('plaqueMorphology',v)} placeholder="Clear circular plaques, ~2 mm, smooth margins..."/>
        <Field label="Adsorption Time" value={form.adsorptionTime} onChange={v=>set('adsorptionTime',v)} placeholder="20 minutes"/>
        <Field label="Adsorption Rate Constant" value={form.adsorptionRate} onChange={v=>set('adsorptionRate',v)} placeholder="1.48 × 10⁻¹¹ ml/min"/>
        <Field label="Latent Period" value={form.latentPeriod} onChange={v=>set('latentPeriod',v)} placeholder="30 minutes"/>
        <Field label="Eclipse Period" value={form.eclipsePeriod} onChange={v=>set('eclipsePeriod',v)} placeholder="20 minutes"/>
        <Field label="Rise Period" value={form.risePeriod} onChange={v=>set('risePeriod',v)} placeholder="50 minutes"/>
        <Field label="Burst Size" value={form.burstSize} onChange={v=>set('burstSize',v)} placeholder="18 PFU/infected cell"/>
        <Field label="Optimal MOI" value={form.optimalMoi} onChange={v=>set('optimalMoi',v)} placeholder="0.01"/>
        <Field label="Life Cycle" value={form.lifeCycle} onChange={v=>set('lifeCycle',v)} placeholder="Strictly lytic"/>
        <Field label="Optimal Growth Temperature" value={form.growthTemperature} onChange={v=>set('growthTemperature',v)} placeholder="37°C"/>
        <Field label="Optimal pH" value={form.growthPh} onChange={v=>set('growthPh',v)} placeholder="7"/>
        <Field label="Optimal Host Density" value={form.growthHostDensity} onChange={v=>set('growthHostDensity',v)} placeholder="OD600 = 0.22"/>
        <Field label="Maximum PFU" value={form.maximumPfu} onChange={v=>set('maximumPfu',v)} placeholder="2.86 × 10¹⁰ PFU/ml"/>
        <Textarea label="Growth Curve Values" value={form.growthCurve} onChange={v=>set('growthCurve',v)} placeholder="Comma-separated log PFU values: 2, 2.2, 3, 6.5, 9.8"/>
        <Textarea label="Host Range" value={form.hostRangeText} onChange={v=>set('hostRangeText',v)} placeholder={'One per line: Host | Strain | yes/no'}/>
        <Textarea label="Temperature Stability" value={form.temperatureStabilityText} onChange={v=>set('temperatureStabilityText',v)} placeholder={'One per line: -80 | Stable'}/>
        <Textarea label="pH Stability" value={form.phStabilityText} onChange={v=>set('phStabilityText',v)} placeholder={'One per line: 7 | Excellent'}/>
      </Step>}
      {step===3&&<Step title="4. Genome & Laboratory Storage" subtitle="Link sequence characterization with preservation and physical inventory metadata.">
        <Field label="Sequencing Platform" value={form.sequencingPlatform} onChange={v=>set('sequencingPlatform',v)} placeholder="Oxford Nanopore / Illumina"/>
        <Field label="Genome Size" value={form.genomeSize} onChange={v=>set('genomeSize',v)} placeholder="163,245 bp"/>
        <Field label="GC Content" value={form.gcContent} onChange={v=>set('gcContent',v)} placeholder="56.2%"/>
        <Field label="Genome Ends" value={form.genomeEnds} onChange={v=>set('genomeEnds',v)} placeholder="Terminal repeat"/>
        <Field label="Assembly" value={form.assembly} onChange={v=>set('assembly',v)} placeholder="Complete / draft"/>
        <Field label="Coverage" value={form.coverage} onChange={v=>set('coverage',v)} placeholder="120×"/>
        <Field label="GenBank Accession" value={form.genbank} onChange={v=>set('genbank',v)} placeholder="ON123456"/>
        <Field label="Total ORFs" value={form.totalOrfs} onChange={v=>set('totalOrfs',v)} placeholder="231"/>
        <Field label="Coding Density" value={form.codingDensity} onChange={v=>set('codingDensity',v)} placeholder="95%"/>
        <Field label="tRNA Genes" value={form.trna} onChange={v=>set('trna',v)} placeholder="2"/>
        <Field label="rRNA Genes" value={form.rrna} onChange={v=>set('rrna',v)} placeholder="None"/>
        <Field label="Integrase" value={form.integrase} onChange={v=>set('integrase',v)} placeholder="Absent"/>
        <Field label="Repressor Protein" value={form.repressor} onChange={v=>set('repressor',v)} placeholder="Absent"/>
        <Field label="Virulence Genes" value={form.virulence} onChange={v=>set('virulence',v)} placeholder="Not detected"/>
        <Field label="AMR Genes" value={form.amr} onChange={v=>set('amr',v)} placeholder="Not detected"/>
        <Field label="Lysogeny Genes" value={form.lysogeny} onChange={v=>set('lysogeny',v)} placeholder="Absent"/>
        <Field label="Lifestyle Prediction" value={form.lifestylePrediction} onChange={v=>set('lifestylePrediction',v)} placeholder="Lytic"/>
        <Textarea label="Functional Proteins" value={form.proteinsText} onChange={v=>set('proteinsText',v)} placeholder={'One per line: Major capsid protein | Structural'}/>
        <Field label="Current Stock Titer" value={form.stockTiter} onChange={v=>set('stockTiter',v)} placeholder="2.8 × 10¹⁰ PFU/ml"/>
        <Field label="Storage Buffer" value={form.storageBuffer} onChange={v=>set('storageBuffer',v)} placeholder="SM buffer"/>
        <Field label="Storage Temperature" value={form.storageTemperature} onChange={v=>set('storageTemperature',v)} placeholder="-80°C"/>
        <Field label="Cryoprotectant" value={form.cryoprotectant} onChange={v=>set('cryoprotectant',v)} placeholder="20% glycerol"/>
        <Field label="Freeze-Thaw Cycles" value={form.freezeThaw} onChange={v=>set('freezeThaw',v)} placeholder="< 3"/>
        <Field label="Freezer" value={form.freezer} onChange={v=>set('freezer',v)} placeholder="GTU Freezer 2"/>
        <Field label="Rack" value={form.rack} onChange={v=>set('rack',v)} placeholder="B"/>
        <Field label="Box" value={form.box} onChange={v=>set('box',v)} placeholder="7"/>
        <Field label="Position" value={form.position} onChange={v=>set('position',v)} placeholder="D4"/>
      </Step>}
      {step===4&&<Step title="5. Evidence, Outputs & Research Context" subtitle="Record the protocols, images, downloadable files, applications and publications that support the profile.">
        <Textarea label="Experimental Protocols (SOPs)" value={form.protocolsText} onChange={v=>set('protocolsText',v)} placeholder={'One protocol per line'}/>
        <Textarea label="Images" value={form.imagesText} onChange={v=>set('imagesText',v)} placeholder={'One per line: TEM image | tem'}/>
        <Textarea label="Downloads / Files" value={form.downloadsText} onChange={v=>set('downloadsText',v)} placeholder={'One item per line: Genome (FASTA)'}/>
        <Textarea label="Applications" value={form.applicationsText} onChange={v=>set('applicationsText',v)} placeholder={'One application per line'}/>
        <Textarea label="Publications" value={form.publicationsText} onChange={v=>set('publicationsText',v)} placeholder={'One citation per line'}/>
        <Textarea label="Additional Research Tools" value={form.relatedToolsText} onChange={v=>set('relatedToolsText',v)} placeholder={'One tool per line'}/>
        <div className="upload-placeholder"><Archive/><div><strong>File storage integration point</strong><span>The record captures file manifests now. Production deployment should connect FASTA, FASTQ, GBK, microscopy images and SOP PDFs to managed object storage with checksums.</span></div></div>
      </Step>}
      {step===5&&<Review form={form} requiredOk={requiredOk}/>} 
      <div className="form-footer"><button className="outline-button" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}><ArrowLeft/> PREVIOUS</button><div className="form-footer-right"><button className="outline-button" disabled={saving} onClick={()=>save('Draft')}><Save/> SAVE DRAFT</button>{step<steps.length-1?<button className="primary-button" onClick={()=>setStep(s=>s+1)}>NEXT <ArrowRight/></button>:<button className="primary-button" disabled={saving||!requiredOk} onClick={()=>save('Pending Review')}><Send/> {saving?'SAVING...':editMode?'SAVE & SUBMIT':'SUBMIT FOR REVIEW'}</button>}</div></div>
    </div>
  </div>
}
function Step({title,subtitle,children}){return <><div className="form-heading"><h2>{title}</h2><p>{subtitle}</p></div><div className="form-grid">{children}</div></>}
function Field({label,value,onChange,required=false,type='text',placeholder='',disabled=false,step}){return <label className="form-field"><span>{label}{required&&<b>*</b>}</span><input type={type} step={step} value={value??''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled}/></label>}
function Textarea({label,value,onChange,placeholder}){return <label className="form-field full"><span>{label}</span><textarea rows="4" value={value??''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>}
function SelectField({label,value,onChange,required=false,options}){return <label className="form-field"><span>{label}{required&&<b>*</b>}</span><select value={value??''} onChange={e=>onChange(e.target.value)}><option value="">Select...</option>{options.map(x=><option key={x}>{x}</option>)}</select></label>}
function Review({form,requiredOk}){const groups=[['Identity',[['Phage',form.name],['Repository ID',form.repositoryId||'Auto-generate'],['Type',form.phageType],['Genome',form.genomeType],['Institute',form.institute],['Visibility',form.visibility]]],['Host & isolation',[['Host',form.host],['Strain',form.hostStrain],['Site',form.isolationSite],['Date',form.isolationDate],['Sample',form.sampleType]]],['Characterization',[['Family',form.family],['Plaque',form.plaqueMorphology],['Life cycle',form.lifeCycle],['Burst size',form.burstSize]]],['Genome & lab',[['Genome size',form.genomeSize],['GC content',form.gcContent],['GenBank',form.genbank],['Storage',form.storageTemperature],['Freezer position',[form.freezer,form.rack,form.box,form.position].filter(Boolean).join(' / ')]]]];return <div className="review-step"><div className={`review-status ${requiredOk?'ok':'bad'}`}>{requiredOk?<Check/>:<AlertCircle/>}<div><strong>{requiredOk?'Minimum required metadata complete':'Required metadata incomplete'}</strong><span>{requiredOk?'Ready to submit for curator review.':'Complete phage name, host, phage type and institute.'}</span></div></div>{groups.map(([g,rows])=><section key={g}><h3>{g}</h3>{rows.map(([k,v])=><div className="review-row" key={k}><span>{k}</span><strong>{v||'—'}</strong></div>)}</section>)}</div>}
