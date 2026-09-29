import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Database from './pages/Database.jsx';
import PhageDetail from './pages/PhageDetail.jsx';
import AddPhage from './pages/AddPhage.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Compare from './pages/Compare.jsx';
import Resources from './pages/Resources.jsx';
import Publications from './pages/Publications.jsx';
import Contact from './pages/Contact.jsx';

export default function App(){
  return <div className="app-shell">
    <Navbar/>
    <main><Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/database" element={<Database/>}/>
      <Route path="/phage/:id" element={<PhageDetail/>}/>
      <Route path="/add" element={<AddPhage/>}/>
      <Route path="/edit/:id" element={<AddPhage editMode/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/compare" element={<Compare/>}/>
      <Route path="/resources" element={<Resources/>}/>
      <Route path="/publications" element={<Publications/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes></main>
  </div>
}
