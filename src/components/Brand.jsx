import React from 'react';

export default function Brand({compact=false}){
  return <div className={`brand ${compact?'brand-compact':''}`} aria-label="Gujarat Technological University Bacteriophage Repository">
    <svg className="brand-mark" viewBox="0 0 64 64" role="img" aria-hidden="true">
      <path d="M32 4 53 12v18c0 14-8 24-21 30C19 54 11 44 11 30V12Z" fill="#073273" stroke="#c53332" strokeWidth="2"/>
      <path d="M17 17h30M20 17v19h24V17M25 17v19M39 17v19M20 27h24" fill="none" stroke="#fff" strokeWidth="2"/>
      <path d="M18 43c8 3 20 3 28 0M24 48c5 2 11 2 16 0" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <span className="brand-words"><strong>GUJARAT TECHNOLOGICAL UNIVERSITY</strong><small>INNOVATION · INTEGRATION · EXCELLENCE</small></span>
  </div>
}
