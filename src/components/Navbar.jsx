import React, {useEffect, useState} from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Plus, UserRound, LogOut, Menu, X, LayoutDashboard, BookOpen, LibraryBig, Mail, Info, FlaskConical } from 'lucide-react';
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
      <NavLink to="/">Home</NavLink>
      <a href="/#about"><Info size={16}/> About Us</a>
      <NavLink to="/database"><FlaskConical size={16}/> Phages</NavLink>
      <Link to="/database#search"><Search size={16}/> Search</Link>
      <NavLink to="/resources"><LibraryBig size={16}/> Resources</NavLink>
      <NavLink to="/publications"><BookOpen size={16}/> Publications</NavLink>
      <NavLink to="/contact"><Mail size={16}/> Contact</NavLink>
      <NavLink to="/add" className="nav-add"><Plus size={16}/> Add Phage</NavLink>
      {user && <NavLink to="/dashboard"><LayoutDashboard size={17}/> DASHBOARD</NavLink>}
      {user ? <>
        <span className="user-chip"><UserRound size={16}/>{user.name}<small>{user.role}</small></span>
        <button className="icon-button" onClick={logout} title="Sign out"><LogOut size={19}/></button>
      </> : <Link to="/login" className="login-link"><UserRound size={18}/> Login</Link>}
    </nav>
  </header>
}
