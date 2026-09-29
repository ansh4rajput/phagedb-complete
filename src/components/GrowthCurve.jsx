import React from 'react';
export default function GrowthCurve({values=[]}){
  const vals=values.length?values:[2,2.2,2.5,3,4,7,9,10,10.2,10.1,10];
  const w=520,h=220,p=32,max=Math.max(...vals)+1,min=Math.min(...vals)-1;
  const pts=vals.map((v,i)=>`${p+(i/(vals.length-1))*(w-2*p)},${h-p-((v-min)/(max-min))*(h-2*p)}`).join(' ');
  return <svg viewBox={`0 0 ${w} ${h}`} className="growth-chart" role="img" aria-label="One-step growth curve">
    {[0,1,2,3,4].map(i=><line key={i} x1={p} x2={w-p} y1={p+i*(h-2*p)/4} y2={p+i*(h-2*p)/4} className="chart-grid"/>)}
    <line x1={p} y1={h-p} x2={w-p} y2={h-p} className="chart-axis"/><line x1={p} y1={p} x2={p} y2={h-p} className="chart-axis"/>
    <polyline points={pts} className="chart-line"/>
    {pts.split(' ').map((q,i)=>{const [x,y]=q.split(',');return <circle key={i} cx={x} cy={y} r="4" className="chart-dot"/>})}
    <text x={w/2} y={h-5} className="chart-label">Time (min)</text><text transform={`translate(12 ${h/2}) rotate(-90)`} className="chart-label">PFU/ml (log scale)</text>
  </svg>
}
