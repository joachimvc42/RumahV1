'use client';

import React from 'react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { dualPrice } from '../../lib/priceUtils';

const WA = '6287873487940';

type Item = {
  id: string; type: 'villa'|'land'; title: string; location: string;
  price: number; currency: string; tenure: 'freehold'|'leasehold'; leaseYears?: number;
  expectedYield: number|null; images: string[]; href: string;
  bedrooms?: number|null; bathrooms?: number|null;
  pool?: boolean; garden?: boolean; furnished?: boolean;
  condition?: string; landSize?: string|null;
};

type Search = { type:'all'|'villa'|'land'; tenure:'all'|'freehold'|'leasehold'; location:string; searched:boolean };
type Sidebar = { pool:boolean; garden:boolean; furnished:boolean; minBedrooms:string; condition:string };


function InvCard({ item }: { item: Item }) {
  const [idx, setIdx] = useState(0);
  const prev = useCallback((e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i-1+item.images.length)%item.images.length); }, [item.images.length]);
  const next = useCallback((e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i+1)%item.images.length); }, [item.images.length]);

  return (
    <div style={C.card}>
      <div style={C.imgWrap}>
        {item.images.length > 0 ? item.images.map((src, i) => (
          <img key={src} src={src} alt={item.title} loading={i===0?'eager':'lazy'}
            style={{ ...C.img, opacity: i===idx ? 1 : 0 }} />
        )) : (
          <div style={C.noImg}>{item.type==='villa' ? '🏠' : '🌴'}</div>
        )}
        <div style={C.gradient} />
        <div style={{ ...C.typeBadge, background: item.type==='villa' ? '#6d28d9' : '#059669' }}>
          {item.type==='villa' ? 'Villa' : 'Land'}
        </div>
        <div style={{ ...C.tenureBadge, background: item.tenure==='freehold' ? '#1d4ed8' : '#b45309' }}>
          {item.tenure==='freehold' ? 'Freehold' : item.leaseYears ? `Lease ${item.leaseYears}y` : 'Leasehold'}
        </div>
        {item.images.length > 1 && <div style={C.imgCount}>{item.images.length} photos</div>}
        {item.images.length > 1 && (
          <>
            <button onClick={prev} style={{ ...C.arrow, left:12 }} aria-label="Previous">‹</button>
            <button onClick={next} style={{ ...C.arrow, right:12 }} aria-label="Next">›</button>
            <div style={C.dots}>
              {item.images.map((_,i) => (
                <button key={i} aria-label={`Photo ${i+1}`}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
                  style={{ ...C.dot, background: i===idx ? '#fff' : 'rgba(255,255,255,0.4)' }} />
              ))}
            </div>
          </>
        )}
      </div>
      <Link href={item.href} style={C.link}>
        <div style={C.body}>
          <div>
            <h3 style={C.title}>{item.title}</h3>
            <p style={C.loc}>{item.location}</p>
            {item.type==='villa' && (
              <div style={C.chips}>
                {item.bedrooms && <span style={C.chip}>{item.bedrooms} bed{item.bedrooms!==1?'s':''}</span>}
                {item.bathrooms && <span style={C.chip}>{item.bathrooms} bath{item.bathrooms!==1?'s':''}</span>}
                {item.pool && <span style={C.chip}>Pool</span>}
                {item.garden && <span style={C.chip}>Garden</span>}
              </div>
            )}
          </div>
          <div style={C.priceBlock}>
            {(() => { const { main, approx } = dualPrice(item.price, item.currency, item.type === 'land' ? '/are' : ''); return (<><p style={C.price}>{main}</p><p style={C.approx}>{approx}</p></>); })()}
            {item.expectedYield && <p style={C.yield}>{item.expectedYield}% est. yield / year</p>}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function InvestmentsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<Search>({ type:'all', tenure:'all', location:'', searched:false });
  const [sidebar, setSidebar] = useState<Sidebar>({ pool:false, garden:false, furnished:false, minBedrooms:'', condition:'' });

  useEffect(() => {
    const load = async () => {
      const { data: investments } = await supabase.from('investments').select('*');
      if (!investments) { setLoading(false); return; }
      const pIds = investments.filter(i=>i.asset_type==='property').map(i=>i.asset_id);
      const lIds = investments.filter(i=>i.asset_type==='land').map(i=>i.asset_id);
      const [{ data: props }, { data: lands }] = await Promise.all([
        pIds.length ? supabase.from('properties').select('*').in('id',pIds) : Promise.resolve({data:[]}),
        lIds.length ? supabase.from('lands').select('*').in('id',lIds) : Promise.resolve({data:[]}),
      ]);
      const merged: Item[] = [];
      for (const inv of investments) {
        if (inv.asset_type==='property') {
          const p = (props as any[])?.find(x=>x.id===inv.asset_id);
          if (p && p.status==='published') merged.push({ id:inv.id, type:'villa', title:p.title, location:p.location||'Lombok', price:p.price||0, currency:p.currency||'USD', tenure:p.tenure||'freehold', leaseYears:p.lease_years, expectedYield:inv.expected_yield, images:p.images||[], href:`/investments/${inv.id}`, bedrooms:p.bedrooms, bathrooms:p.bathrooms, pool:p.pool, garden:p.garden, furnished:p.furnished, condition:p.condition });
        }
        if (inv.asset_type==='land') {
          const l = (lands as any[])?.find(x=>x.id===inv.asset_id);
          if (l && l.status==='published') merged.push({ id:inv.id, type:'land', title:l.title, location:l.location||'Lombok', price:l.price_per_are_idr??l.price_per_are??0, currency:l.currency||'IDR', tenure:l.tenure||'freehold', leaseYears:l.lease_years, expectedYield:inv.expected_yield, images:l.images||[], href:`/investments/${inv.id}`, landSize:l.land_size, condition:l.condition });
        }
      }
      setItems(merged); setLoading(false);
    };
    load();
  }, []);

  const locations = [...new Set(items.map(i=>i.location))].sort();

  const afterSearch = items.filter(item => {
    if (search.type!=='all' && item.type!==search.type) return false;
    if (search.tenure!=='all' && item.tenure!==search.tenure) return false;
    if (search.location && item.location!==search.location) return false;
    return true;
  });

  const filtered = !search.searched ? afterSearch : afterSearch.filter(item => {
    if (sidebar.pool && !item.pool) return false;
    if (sidebar.garden && !item.garden) return false;
    if (sidebar.furnished && !item.furnished) return false;
    if (sidebar.minBedrooms && (item.bedrooms??0) < Number(sidebar.minBedrooms)) return false;
    if (sidebar.condition && item.condition!==sidebar.condition) return false;
    return true;
  });

  if (loading) return (
    <main style={P.page}><div style={P.loading}><div style={P.spinner}/><span style={{fontSize:16,color:'#6b7280'}}>Loading opportunities…</span></div></main>
  );

  return (
    <main style={P.page}>
      <section style={P.hero}>
        <h1 style={P.h1}>Invest in Lombok</h1>
        <p style={P.sub}>Selected villas and land — curated for serious investors</p>
      </section>

      <div style={P.searchBar}>
        {[
          ['ASSET TYPE', search.type, (v:string)=>setSearch(s=>({...s,type:v as any,searched:false})), [['all','All'],['villa','🏠 Villas'],['land','🌴 Land']]],
          ['PROPERTY TYPE', search.tenure, (v:string)=>setSearch(s=>({...s,tenure:v as any,searched:false})), [['all','All'],['freehold','🔑 Freehold'],['leasehold','📋 Leasehold']]],
          ['LOCATION', search.location, (v:string)=>setSearch(s=>({...s,location:v,searched:false})), [['','All areas'],...locations.map(l=>[l,l])]],
        ].map(([label, val, setter, opts], i, arr) => (
          <React.Fragment key={label as string}>
            <div style={P.seg}>
              <span style={P.segLabel}>{label as string}</span>
              <select style={P.segSel} value={val as string} onChange={e=>(setter as any)(e.target.value)}>
                {(opts as [string,string][]).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            {i < arr.length-1 && <div style={P.divider}/>}
          </React.Fragment>
        ))}
        <div style={P.searchAction}>
          <button onClick={()=>setSearch(s=>({...s,searched:true}))} style={P.searchBtn}>Search</button>
        </div>
      </div>

      <div style={P.layout}>
        {search.searched && (
          <aside style={P.sidebar}>
            {(search.type==='villa'||search.type==='all') && (
              <>
                <p style={P.sHead}>AMENITIES</p>
                {([['pool','🏊 Pool'],['garden','🌳 Garden'],['furnished','🛋️ Furnished']] as [keyof Sidebar,string][]).map(([key,label])=>(
                  <label key={key} style={P.checkRow}>
                    <input type="checkbox" checked={sidebar[key] as boolean} onChange={e=>setSidebar(s=>({...s,[key]:e.target.checked}))} style={{accentColor:'#f59e0b',width:17,height:17}}/>
                    <span style={P.checkLabel}>{label}</span>
                  </label>
                ))}
                <p style={{...P.sHead,marginTop:20}}>BEDROOMS</p>
                {[['1','1+'],['2','2+'],['3','3+']].map(([v,l])=>(
                  <label key={v} style={P.checkRow}>
                    <input type="checkbox" checked={sidebar.minBedrooms===v} onChange={e=>setSidebar(s=>({...s,minBedrooms:e.target.checked?v:''}))} style={{accentColor:'#f59e0b',width:17,height:17}}/>
                    <span style={P.checkLabel}>{l} bedrooms</span>
                  </label>
                ))}
              </>
            )}
            <p style={{...P.sHead,marginTop:20}}>CONDITION</p>
            {[['ready','✅ Ready to live'],['to_finish','🔨 To finish'],['to_renovate','🏚️ To renovate']].map(([v,l])=>(
              <label key={v} style={P.checkRow}>
                <input type="checkbox" checked={sidebar.condition===v} onChange={e=>setSidebar(s=>({...s,condition:e.target.checked?v:''}))} style={{accentColor:'#f59e0b',width:17,height:17}}/>
                <span style={P.checkLabel}>{l}</span>
              </label>
            ))}
          </aside>
        )}
        <div style={{flex:1,minWidth:0}}>
          <div style={P.resultRow}>
            <p style={{fontSize:15,color:'#6b7280',margin:0}}>{filtered.length} opportunit{filtered.length!==1?'ies':'y'} available</p>
            {search.searched && <button onClick={()=>{setSearch(s=>({...s,searched:false}));setSidebar({pool:false,garden:false,furnished:false,minBedrooms:'',condition:''});}} style={{fontSize:14,fontWeight:600,color:'#f59e0b',background:'none',border:'none',cursor:'pointer'}}>Clear filters</button>}
          </div>
          {filtered.length===0 ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:60,background:'#f9fafb',borderRadius:16}}>
              <p style={{color:'#6b7280',fontSize:16}}>No opportunities match your criteria.</p>
            </div>
          ) : (
            <div style={P.grid}>{filtered.map(item=><InvCard key={item.id} item={item}/>)}</div>
          )}
        </div>
      </div>
    </main>
  );
}

const C: { [k: string]: React.CSSProperties } = {
  card: { background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 16px rgba(15,23,42,0.08)', border:'1px solid #e8e8e8', display:'flex', flexDirection:'column' },
  imgWrap: { position:'relative', width:'100%', height:180, flexShrink:0, background:'#e5e7eb', overflow:'hidden' },
  img: { position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'opacity 0.35s ease', pointerEvents:'none', userSelect:'none' },
  noImg: { position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:56, color:'#d1d5db' },
  gradient: { position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 60%,rgba(0,0,0,0.32) 100%)', pointerEvents:'none' },
  typeBadge: { position:'absolute', top:12, left:12, color:'#fff', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:5, letterSpacing:'0.04em', textTransform:'uppercase' },
  tenureBadge: { position:'absolute', top:12, right:12, color:'#fff', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:5, letterSpacing:'0.04em' },
  imgCount: { position:'absolute', bottom:10, right:10, background:'rgba(0,0,0,0.5)', color:'#fff', fontSize:11, fontWeight:600, padding:'4px 9px', borderRadius:5 },
  arrow: { position:'absolute', top:'50%', transform:'translateY(-50%)', width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.92)', border:'none', fontSize:20, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.18)', zIndex:3, color:'#111', padding:0, lineHeight:1 },
  dots: { position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', display:'flex', gap:5, zIndex:3 },
  dot: { width:6, height:6, borderRadius:'50%', border:'none', padding:0, cursor:'pointer', transition:'background 0.2s' },
  link: { textDecoration:'none', color:'inherit', display:'flex', flexDirection:'column', flex:1 },
  body: { padding:'18px 20px 20px', display:'flex', flexDirection:'column', justifyContent:'space-between', flex:1 },
  title: { fontSize:16, fontWeight:700, color:'#111827', margin:'0 0 4px', lineHeight:1.35 },
  loc: { fontSize:13, color:'#9ca3af', margin:'0 0 10px' },
  chips: { display:'flex', flexWrap:'wrap', gap:5, marginTop:6 },
  chip: { fontSize:12, color:'#374151', background:'#f3f4f6', padding:'3px 9px', borderRadius:5, fontWeight:600, border:'1px solid #e5e7eb' },
  priceBlock: { marginTop:16, paddingTop:14, borderTop:'1px solid #f3f4f6' },
  price: { fontSize:20, fontWeight:800, color:'#111827', margin:'0 0 3px' },
  approx: { fontSize:12, color:'#9ca3af', margin:0, marginTop:2 },
  yield: { fontSize:12, color:'#059669', fontWeight:600, margin:0 },
};

const P: { [k: string]: React.CSSProperties } = {
  page: { maxWidth:1400, margin:'0 auto', padding:'0 24px 80px' },
  loading: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:16 },
  spinner: { width:44, height:44, border:'4px solid #e5e7eb', borderTopColor:'#f59e0b', borderRadius:'50%' },
  hero: { textAlign:'center', padding:'64px 0 48px' },
  h1: { fontSize:46, fontWeight:800, color:'#111827', marginBottom:14, lineHeight:1.15 },
  sub: { fontSize:18, color:'#6b7280', maxWidth:520, margin:'0 auto' },
  searchBar: { display:'flex', background:'#fff', borderRadius:14, border:'1px solid #e5e7eb', overflow:'hidden', marginBottom:32, boxShadow:'0 2px 12px rgba(15,23,42,0.06)', alignItems:'stretch' },
  seg: { flex:1, padding:'16px 20px', display:'flex', flexDirection:'column', gap:5 },
  segLabel: { fontSize:11, fontWeight:800, letterSpacing:'0.1em', color:'#9ca3af' },
  segSel: { border:'none', outline:'none', fontSize:15, fontWeight:600, color:'#111827', background:'transparent', cursor:'pointer', padding:0 },
  divider: { width:1, background:'#f3f4f6', margin:'10px 0' },
  searchAction: { display:'flex', alignItems:'center', padding:'0 18px' },
  searchBtn: { padding:'12px 22px', background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer' },
  layout: { display:'flex', gap:28, alignItems:'flex-start' },
  sidebar: { width:230, flexShrink:0, background:'#fff', borderRadius:16, border:'1px solid #e5e7eb', padding:'22px 18px', position:'sticky', top:24, boxShadow:'0 2px 12px rgba(15,23,42,0.06)' },
  sHead: { fontSize:11, fontWeight:800, letterSpacing:'0.13em', color:'#f59e0b', margin:'0 0 14px', textTransform:'uppercase' },
  checkRow: { display:'flex', alignItems:'center', gap:11, padding:'10px 0', borderBottom:'1px solid #f3f4f6', cursor:'pointer' },
  checkLabel: { fontSize:15, fontWeight:500, color:'#374151' },
  resultRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:24 },
};
