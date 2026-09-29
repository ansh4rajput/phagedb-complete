import React from 'react';
export default function PhageArt({large=false}){
  return <svg className={`phage-art ${large?'large':''}`} viewBox="0 0 300 360" aria-hidden="true">
    <defs><linearGradient id="phg" x1="0" x2="1"><stop stopColor="#42f2ff"/><stop offset="1" stopColor="#7b3ff2"/></linearGradient><filter id="gl"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <g fill="none" stroke="url(#phg)" strokeWidth="5" filter="url(#gl)">
      <polygon points="150,30 95,70 105,135 150,165 195,135 205,70" fill="rgba(28,220,255,.10)"/>
      <path d="M105 70l90 65M195 70l-90 65M95 70h110M150 30v135" opacity=".55"/>
      <path d="M150 165v88m-25-18h50m-50 18h50"/>
      <path d="M150 253l-62 64m62-64 62 64M150 253v74M119 275l-48 25m110-25 48 25" strokeLinecap="round"/>
      <circle cx="150" cy="253" r="10" fill="#0b1422"/><circle cx="88" cy="317" r="5" fill="#0b1422"/><circle cx="212" cy="317" r="5" fill="#0b1422"/>
    </g>
  </svg>
}
