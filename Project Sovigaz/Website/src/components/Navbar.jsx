import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ onOpenSearch }) {
  const navTabs = [
    { to: '/', label: 'Tổng quan', exact: true },
    { to: '/data-dictionary', label: 'Data Dictionary' },
    { to: '/data-model', label: 'Data Model' },
    { to: '/brd', label: 'BRD' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/testing', label: 'Kiểm thử' },
    { to: '/machine-learning', label: 'Machine Learning' },
    { to: '/chatbot-rag', label: 'Chatbot AI' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8FAFC] border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-start gap-10 lg:gap-16">
        
        {/* Brand & Logo */}
        <NavLink to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 p-0.5 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 duration-200 overflow-hidden">
            <img 
              src="/assets/sovigaz_logo.png" 
              alt="Sovigaz Logo" 
              className="w-full h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#1868DB] font-heading">
                SOVIGAZ
              </span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#E9F2FE] text-[#1868DB] border border-[#8FB8F6]/60 hidden lg:inline-block">
                DWH & BI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none hidden sm:block mt-0.5">
              Project thực tập INDA
            </p>
          </div>
        </NavLink>

        {/* Horizontal Navigation */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5">
          {navTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.exact}
              className={({ isActive }) => `
                px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0
                ${isActive 
                  ? 'text-[#1868DB] bg-white shadow-2xs border border-slate-200/80 font-bold' 
                  : 'text-slate-600 hover:text-[#1868DB] hover:bg-white/60'
                }
              `}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-600 font-medium">
                  {tab.badge}
                </span>
              )}
            </NavLink>
          ))}
          <NavLink
            to="/presentation"
            className="ml-2 px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 bg-[#1868DB] text-white hover:bg-blue-700 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>
            <span>Trình chiếu Slide</span>
          </NavLink>
        </div>

      </div>
    </header>
  );
}
