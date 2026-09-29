import React, {useEffect, useState} from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Plus, UserRound, LogOut, Menu, X, Home, LayoutDashboard, BookOpen, LibraryBig, Mail } from 'lucide-react';
import Brand from './Brand.jsx';
import { me } from '../api.js';

export default function Navbar(){
  const [user,setUser]=useState(null); const [open,setOpen]=useState(false); const nav=useNavigate();
  useEffect(()=>{ if(localStorage.getItem('phagedb_token')) me().then(r=>setUser(r.user)).catch(()=>localStorage.removeItem('phagedb_token')); },[]);
  const logout=()=>{localStorage.removeItem('phagedb_token');setUser(null);nav('/');};
  return <header className="navbar">
    <Link to="/" className="brand-link"><Brand/></Link>
    <button className="mobile-menu" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button>
    <nav className={`nav-links ${open?'open':''}`} onClick={()=>setOpen(false)}>
      <NavLink to="/"><Home size={17}/> HOME</NavLink>
      <NavLink to="/database"><Search size={17}/> BROWSE</NavLink>
      <NavLink to="/resources"><LibraryBig size={17}/> RESOURCES</NavLink>
      <NavLink to="/publications"><BookOpen size={17}/> PUBLICATIONS</NavLink>
      <NavLink to="/contact"><Mail size={17}/> CONTACT</NavLink>
      <NavLink to="/add" className="nav-add"><Plus size={17}/> ADD PHAGE</NavLink>
      {user && <NavLink to="/dashboard"><LayoutDashboard size={17}/> DASHBOARD</NavLink>}
      {user ? <>
        <span className="user-chip"><UserRound size={16}/>{user.name}<small>{user.role}</small></span>
        <button className="icon-button" onClick={logout} title="Sign out"><LogOut size={19}/></button>
      </> : <Link to="/login" className="login-link"><UserRound size={17}/> LOGIN</Link>}
    </nav>
  </header>
}
