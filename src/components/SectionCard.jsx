import React from 'react';
export default function SectionCard({number,title,icon:Icon,children,className=''}){
  return <section className={`section-card ${className}`}>
    <header><span>{number ? `${number}. `:''}{title}</span>{Icon&&<Icon size={18}/>}</header>
    <div className="section-body">{children}</div>
  </section>
}
export function KV({label,value}){return <div className="kv"><span>{label}</span><strong>{value===undefined||value===null||value===''?'—':String(value)}</strong></div>}
