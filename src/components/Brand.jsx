import React from 'react';

export default function Brand({compact=false}){
  return <div className={`brand ${compact?'brand-compact':''}`} aria-label="Gujarat Technological University Bacteriophage Repository">
    <img className="brand-mark" src="/gtu-logo.png" alt="" aria-hidden="true"/>
    <span className="brand-words"><strong>GUJARAT TECHNOLOGICAL UNIVERSITY</strong><small>INNOVATION · INTEGRATION · EXCELLENCE</small></span>
  </div>
}
