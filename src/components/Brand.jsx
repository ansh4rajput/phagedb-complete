import React from 'react';

export default function Brand({compact=false}){
  return <div className={`brand ${compact?'brand-compact':''}`} aria-label="PhageDB">
    <svg className="brand-mark" viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M32 8 22 14v12l10 6 10-6V14Z" fill="none" stroke="currentColor" strokeWidth="3"/>
      <path d="M32 32v10m-7-5h14M32 42l-8 9m8-9 8 9m-8-9v11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="18" cy="15" r="2" fill="currentColor"/><circle cx="46" cy="49" r="2" fill="currentColor"/>
    </svg>
    <span>PHAGE<span className="brand-purple">DB</span></span>
  </div>
}
