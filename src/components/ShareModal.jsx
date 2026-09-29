import React, {useEffect, useState} from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Download, Copy, Check, Share2 } from 'lucide-react';

export default function ShareModal({phage,onClose}){
  const [qr,setQr]=useState(''); const [copied,setCopied]=useState(false);
  const url=`${window.location.origin}/phage/${phage.id}`;
  useEffect(()=>{QRCode.toDataURL(url,{width:420,margin:2,color:{dark:'#17dfff',light:'#111a2a'}}).then(setQr);},[url]);
  const copy=async()=>{await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1200);};
  const download=()=>{if(!qr)return; const a=document.createElement('a');a.href=qr;a.download=`${phage.name}-QR.png`;a.click();};
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <div className="share-modal">
      <button className="modal-close" onClick={onClose}><X/></button>
      <h2><QrCode/> Share {phage.name}</h2>
      <p className="muted">Use the QR code on labels, posters, lab notebooks or sample boxes to open this record instantly.</p>
      <div className="qr-shell">{qr?<img src={qr} alt={`QR code for ${phage.name}`}/>:<div className="skeleton qr-skeleton"/>}</div>
      <button className="outline-button wide" onClick={download}><Download size={18}/> DOWNLOAD QR CODE</button>
      <label className="field-label share-label"><Share2 size={17}/> Share link</label>
      <div className="copy-row"><input value={url} readOnly/><button onClick={copy}>{copied?<Check/>:<Copy/>}</button></div>
    </div>
  </div>
}
