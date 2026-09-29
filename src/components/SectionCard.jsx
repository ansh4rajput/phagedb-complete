import React from 'react';
export default function SectionCard({number,title,icon:Icon,children,className=''}){
  return <section className={`section-card ${className}`}>
    <header><span>{number ? `${number}. `:''}{title}</span>{Icon&&<Icon size={18}/>}</header>
    <div className="section-body">{children}</div>
  </section>
}
export function KV({label,value}){const missing=value===undefined||value===null||value===''||value==='—';return <div className="kv"><span>{label}</span><strong className={missing?'not-recorded':''}>{missing?'Not recorded':String(value)}</strong></div>}
