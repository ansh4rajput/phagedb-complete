export const users = [
  { id:'u1', accountId:'GTU-RES-001', name:'Repository Researcher', email:'researcher@phagedb.gtu.ac.in', passwordHash:'scrypt$fbd2a631fbb6ebc45c5a25044be0afe1$3fe74bb929a2d5a0347d59aab3ec91da25d55701b1329e92a3091f7dd6b978ce94f48a9c9387b9095418ec7ed4031cf77d26caa23567bd5390ae4440ffb99589', role:'researcher', status:'Active', institute:'Gujarat Technological University' },
  { id:'u2', accountId:'GTU-CUR-001', name:'Repository Curator', email:'curator@phagedb.gtu.ac.in', passwordHash:'scrypt$182f926b6d4b0c948627f49df285195b$88e9ecf5c062f8946ca84a4ded89a2b1c609b9df79326c59327aa19872a3810fbc4db333d3f87df2d4d4bad5d7f9e84862c3cec9c77b723ff4860b40b30d2727', role:'curator', status:'Active', institute:'Gujarat Technological University' },
  { id:'u3', accountId:'GTU-ADM-001', name:'Repository Administrator', email:'admin@phagedb.gtu.ac.in', passwordHash:'scrypt$e22c4368feaa8324cecc0935497bdd01$d7f2ee82ba56c528f94ccf6cb4002039f623334f5db1f48077f8cad0af61746ed53f4d034ff4d69d56caf6f136701d5f5feb6916d23586d69b0032d11025bc90', role:'admin', status:'Active', institute:'Gujarat Technological University' }
];

const common = {
  status: 'Verified',
  visibility: 'Public',
  curator: 'GTU Phage Team',
  version: '1.0',
  qualityStatus: 'Verified',
  createdAt: '2026-09-20T10:30:00.000Z',
  updatedAt: '2026-09-28T12:20:00.000Z'
};

export const phages = [
  {
    ...common,
    id:'gtu-p002', repositoryId:'GTU-P002', accession:'GSPR-0002', name:'P002', alternativeName:'—', phageType:'Lytic',
    host:'Pseudomonas aeruginosa', hostStrain:'PAO1', institute:'Gujarat Technological University', contact:'phage.repository@gtu.ac.in',
    isolationSite:'Pirana Pumping Yard, Ahmedabad, Gujarat, India', isolationDate:'2024-09-22', latitude:23.0305, longitude:72.5800,
    sampleType:'Sewage', environmentalSource:'Municipal wastewater', collectedBy:'Ashutosh Gupta', isolationMethod:'Enrichment method',
    hostUsedForIsolation:'Pseudomonas aeruginosa PAO1', hostOrigin:'Clinical isolate', atcc:'ATCC 27853', gramStain:'Gram-negative',
    clinicalImportance:'ESKAPE pathogen', antibioticResistance:'MDR', order:'Caudovirales', family:'Myoviridae', subfamily:'—', genus:'—', species:'—', ictvStatus:'Pending / Classified',
    genomeType:'Linear dsDNA', capsidShape:'Icosahedral', tailType:'Contractile', capsidDiameter:'144 nm', tailLength:'152 nm', tailWidth:'18 nm', collar:'Present', basePlate:'Present', tailFibers:'Present', morphotype:'A1',
    plaqueDiameter:'2 mm', plaqueAppearance:'Clear', halo:'Present', margin:'Smooth', elevation:'Flat', plaqueMorphology:'Clear circular plaques, approx. 2 mm, smooth margins with halo.',
    adsorptionTime:'20 minutes', adsorptionRate:'1.48 × 10⁻¹¹ ml/min', latentPeriod:'30 minutes', eclipsePeriod:'20 minutes', risePeriod:'50 minutes', burstSize:'18 PFU/infected cell', optimalMoi:'0.01', lifeCycle:'Strictly lytic',
    growth:{ temperature:'37°C', ph:'7', hostDensity:'OD₆₀₀ = 0.22', maximumPfu:'2.86 × 10¹⁰ PFU/ml', curve:[2,2.2,2.3,2.6,3,6.5,8.6,9.4,9.8,10.1,10,9.9,9.8] },
    hostRange:[
      { host:'Pseudomonas aeruginosa', strain:'PAO1', result:true }, { host:'Pseudomonas aeruginosa', strain:'PA21848', result:true },
      { host:'Pseudomonas aeruginosa', strain:'PAS101', result:false }, { host:'Klebsiella pneumoniae', strain:'KP01', result:false },
      { host:'Escherichia coli', strain:'EC01', result:false }, { host:'Acinetobacter baumannii', strain:'AB5075', result:true }
    ],
    temperatureStability:[['-80','Stable'],['-20','Stable'],['4','Stable'],['25','Stable'],['37','Stable'],['45','Stable'],['55','Stable'],['65','Stable'],['75','Stable'],['85','Reduced'],['95','Inactive'],['100','Inactive']],
    phStability:[['1','No'],['2','No'],['3','No'],['4','Low'],['5','Yes'],['6','Yes'],['7','Excellent'],['8','Excellent'],['9','Good'],['10','Moderate'],['11','Low'],['12','No'],['13','No'],['14','No']],
    sequencingPlatform:'Oxford Nanopore', genomeSize:'163,245 bp', gcContent:'56.2%', genomeEnds:'Terminal repeat', assembly:'Complete', coverage:'120×', genbank:'ON123456',
    annotation:{ totalOrfs:231, codingDensity:'95%', trna:2, rrna:'None', integrase:'Absent', repressor:'Absent', virulence:'Not detected', amr:'Not detected', lysogeny:'Absent', lifestyle:'Lytic' },
    proteins:[['Major capsid protein','Structural'],['Portal protein','DNA packaging'],['Terminase large','Packaging'],['Tail fiber','Host recognition'],['Tail sheath','Infection'],['Endolysin','Cell lysis'],['Holin','Cell lysis'],['Spanin','Cell lysis'],['DNA polymerase','Replication']],
    lab:{ stockTiter:'2.8 × 10¹⁰ PFU/ml', buffer:'SM buffer', storageTemperature:'-80°C', cryoprotectant:'20% glycerol', freezeThaw:'< 3', freezer:'GTU Freezer 2', rack:'B', box:'7', position:'D4' },
    protocols:['Isolation Protocol','Propagation Protocol','Purification Protocol','DNA Extraction','Plaque Assay','Spot Assay','TEM Preparation'],
    images:[{label:'TEM image',kind:'tem'},{label:'Plaque image',kind:'plaque'},{label:'Host lawn',kind:'lawn'},{label:'Environmental sample',kind:'sample'}],
    downloads:['Genome (FASTA)','Annotation (GBK)','Proteins (FAA)','Raw Data (FASTQ)','PDF Report'],
    applications:['Phage therapy','Biofilm removal','Food safety','Agriculture','Wastewater treatment','Phage cocktail candidate'],
    publications:[
      'Gupta A. et al. (2024). Isolation and characterization of novel lytic phage P002 against Pseudomonas aeruginosa. (In preparation)',
      'GSBTM Project Report 2024', 'Conference Poster — Phage Repository Update 2024'
    ],
    relatedTools:['Genomic similarity','Phylogenetic tree','Comparative genomics','Receptor prediction','Lifestyle prediction','Cocktail compatibility'],
    verifiedBy:'Dr. XYZ', dateAdded:'2024-10-01', lastUpdated:'2025-05-15', contributorId:'u1'
  },
  { ...common, id:'pbsx', repositoryId:'PHDB-PBSX', accession:'PHDB-0001', name:'PBSX', phageType:'Lysogenic', host:'Bacillus subtilis 168', hostStrain:'168', genomeType:'dsDNA linear', isolationSite:'Laboratory induced', isolationDate:'2023-08-18', institute:'Newcastle University', contact:'defective.phages@ncl.ac.uk', plaqueMorphology:'Defective – no plaques', lab:{storageTemperature:'-80°C',buffer:'Lysogen culture'}, contributorId:'u1' },
  { ...common, id:'phix174', repositoryId:'PHDB-X174', accession:'PHDB-0002', name:'PhiX174', phageType:'Lytic', host:'Escherichia coli C', hostStrain:'C', genomeType:'ssDNA circular', isolationSite:'Sewage treatment plant, Cambridge UK', isolationDate:'2023-03-15', institute:'University of Cambridge', contact:'phage.lab@cam.ac.uk', plaqueMorphology:'Small, clear, 1–2 mm', contributorId:'u1' },
  { ...common, id:'lambda', repositoryId:'PHDB-LAM', accession:'PHDB-0003', name:'Lambda', phageType:'Temperate', host:'Escherichia coli K-12', hostStrain:'K-12', genomeType:'dsDNA linear', isolationSite:'Laboratory strain collection', isolationDate:'2022-08-20', institute:'MIT Microbiology', contact:'repository@mit.example', plaqueMorphology:'Turbid plaques', contributorId:'u1' },
  { ...common, id:'t4', repositoryId:'PHDB-T4', accession:'PHDB-0004', name:'T4', phageType:'Lytic', host:'Escherichia coli B', hostStrain:'B', genomeType:'dsDNA linear', isolationSite:'River water, Boston MA', isolationDate:'2023-06-10', institute:'Harvard Medical School', contact:'phages@harvard.example', plaqueMorphology:'Clear plaques', contributorId:'u1' },
  { ...common, id:'t7', repositoryId:'PHDB-T7', accession:'PHDB-0005', name:'T7', phageType:'Lytic', host:'Escherichia coli BL21', hostStrain:'BL21', genomeType:'dsDNA linear', isolationSite:'Soil sample, California', isolationDate:'2023-01-25', institute:'Stanford University', contact:'phage@stanford.example', plaqueMorphology:'Clear plaques', contributorId:'u1' },
  { ...common, id:'p22', repositoryId:'PHDB-P22', accession:'PHDB-0006', name:'P22', phageType:'Temperate', host:'Salmonella typhimurium', hostStrain:'LT2', genomeType:'dsDNA linear', isolationSite:'Poultry farm, Iowa', isolationDate:'2022-11-30', institute:'Iowa State University', contact:'phage@iastate.example', plaqueMorphology:'Turbid plaques', contributorId:'u1' },
  { ...common, id:'mu', repositoryId:'PHDB-MU', accession:'PHDB-0007', name:'Mu', phageType:'Temperate', host:'Escherichia coli K-12', hostStrain:'K-12', genomeType:'dsDNA linear', isolationSite:'Research collection', isolationDate:'2022-07-11', institute:'University of Wisconsin', contact:'mu@uw.example', plaqueMorphology:'Turbid plaques', contributorId:'u1' },
  { ...common, id:'m13', repositoryId:'PHDB-M13', accession:'PHDB-0008', name:'M13', phageType:'Chronic', host:'Escherichia coli', hostStrain:'F+', genomeType:'ssDNA circular', isolationSite:'Laboratory collection', isolationDate:'2023-04-04', institute:'UC Berkeley', contact:'m13@berkeley.example', plaqueMorphology:'Small turbid plaques', contributorId:'u1' },
  { ...common, id:'ms2', repositoryId:'PHDB-MS2', accession:'PHDB-0009', name:'MS2', phageType:'Lytic', host:'Escherichia coli', hostStrain:'F+', genomeType:'ssRNA linear', isolationSite:'Wastewater sample', isolationDate:'2023-05-19', institute:'ETH Zurich', contact:'ms2@eth.example', plaqueMorphology:'Clear plaques', contributorId:'u1' },
  { ...common, id:'qbeta', repositoryId:'PHDB-QB', accession:'PHDB-0010', name:'Qβ', phageType:'Lytic', host:'Escherichia coli', hostStrain:'F+', genomeType:'ssRNA linear', isolationSite:'Sewage sample', isolationDate:'2022-09-12', institute:'University of Basel', contact:'qb@basel.example', plaqueMorphology:'Clear plaques', contributorId:'u1' },
  { ...common, id:'p1', repositoryId:'PHDB-P1', accession:'PHDB-0011', name:'P1', phageType:'Temperate', host:'Escherichia coli', hostStrain:'K-12', genomeType:'dsDNA circular', isolationSite:'Laboratory collection', isolationDate:'2022-10-03', institute:'Max Planck Institute', contact:'p1@mpi.example', plaqueMorphology:'Turbid plaques', contributorId:'u1' },
  { ...common, id:'n4', repositoryId:'PHDB-N4', accession:'PHDB-0012', name:'N4', phageType:'Lytic', host:'Escherichia coli', hostStrain:'K-12', genomeType:'dsDNA linear', isolationSite:'Environmental collection', isolationDate:'2023-02-08', institute:'University of Chicago', contact:'n4@uchicago.example', plaqueMorphology:'Clear plaques', contributorId:'u1' },
  { ...common, id:'sp6', repositoryId:'PHDB-SP6', accession:'PHDB-0013', name:'SP6', phageType:'Lytic', host:'Salmonella enterica', hostStrain:'Typhimurium', genomeType:'dsDNA linear', isolationSite:'Sewage sample', isolationDate:'2023-03-29', institute:'University of Texas', contact:'sp6@utexas.example', plaqueMorphology:'Clear plaques', contributorId:'u1' },
  { ...common, id:'pr772', repositoryId:'PHDB-PR772', accession:'PHDB-0014', name:'PR772', phageType:'Lytic', host:'Escherichia coli', hostStrain:'K-12', genomeType:'dsDNA linear', isolationSite:'Wastewater', isolationDate:'2023-06-02', institute:'University of Helsinki', contact:'pr772@helsinki.example', plaqueMorphology:'Clear plaques', contributorId:'u1' },
  { ...common, id:'gtu-a17', repositoryId:'GTU-A017', accession:'GSPR-0017', name:'A17', phageType:'Lytic', host:'Acinetobacter baumannii', hostStrain:'AB5075', genomeType:'dsDNA linear', isolationSite:'Municipal wastewater, Ahmedabad', isolationDate:'2025-01-17', institute:'Gujarat Technological University', contact:'phage.repository@gtu.ac.in', plaqueMorphology:'Clear 1–2 mm plaques', status:'Pending Review', qualityStatus:'Pending', contributorId:'u1' }
];
