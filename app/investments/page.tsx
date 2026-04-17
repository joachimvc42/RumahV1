'use client';

import React from 'react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { dualPrice } from '../../lib/priceUtils';
import MapThumb from '../../components/MapThumb';

const WA = '6287873487940';

type Item = {
  id: string; type: 'villa'|'land'; title: string; location: string;
  price: number; currency: string; tenure: 'freehold'|'leasehold'; leaseYears?: number;
  expectedYield: number|null; images: string[]; href: string;
  bedrooms?: number|null; bathrooms?: number|null;
  pool?: boolean; garden?: boolean; furnished?: boolean;
  condition?: string; landSize?: number|null;
  hasWater?: boolean; hasElectricity?: boolean; hasRoad?: boolean;
  latitude?: number | null; longitude?: number | null;
  description?: string | null;
};

type Search = { type:'all'|'villa'|'land'; tenure:'all'|'freehold'|'leasehold'; location:string };
type VillaSidebar = { pool:boolean; garden:boolean; furnished:boolean; minBedrooms:string; minBathrooms:string; };
type LandSidebar  = { hasWater:boolean; hasElectricity:boolean; hasRoad:boolean; minArea:string; maxPrice:string; };


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
            {/* Badges + location row */}
            <div style={C.metaRow}>
              <span style={{ ...C.metaBadge, background: item.type==='villa' ? '#E8F4F2' : '#EDF7F0', color: item.type==='villa' ? '#1F4E5F' : '#1F5F3A' }}>
                {item.type==='villa' ? 'Villa' : 'Land'}
              </span>
              <span style={{ ...C.metaBadge, background: item.tenure==='freehold' ? '#d4f0ec' : '#f5eedc', color: item.tenure==='freehold' ? '#1F4E5F' : '#7A6030' }}>
                {item.tenure==='freehold' ? 'Freehold' : item.leaseYears ? `Lease ${item.leaseYears}y` : 'Leasehold'}
              </span>
              <span style={C.locBadge}>📍 {item.location}</span>
            </div>
            <h3 style={C.title}>{item.title}</h3>
            {item.type==='villa' && (
              <div style={C.chips}>
                {item.bedrooms && <span style={C.chip}>{item.bedrooms} bed{item.bedrooms!==1?'s':''}</span>}
                {item.bathrooms && <span style={C.chip}>{item.bathrooms} bath{item.bathrooms!==1?'s':''}</span>}
                {item.pool && <span style={C.chip}>Pool</span>}
                {item.garden && <span style={C.chip}>Garden</span>}
              </div>
            )}
            {item.description && <p style={C.desc}>{item.description}</p>}
          </div>
          {item.latitude != null && item.longitude != null && (
            <div style={{ marginTop: 10 }}>
              <MapThumb lat={Number(item.latitude)} lng={Number(item.longitude)} />
            </div>
          )}
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
  const [search, setSearch] = useState<Search>({ type:'all', tenure:'all', location:'' });
  const [villa, setVilla] = useState<VillaSidebar>({ pool:false, garden:false, furnished:false, minBedrooms:'', minBathrooms:'' });
  const [land, setLand] = useState<LandSidebar>({ hasWater:false, hasElectricity:false, hasRoad:false, minArea:'', maxPrice:'' });

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
          if (p && p.status==='published') merged.push({ id:inv.id, type:'villa', title:p.title, location:p.location||'Lombok', price:p.price||0, currency:p.currency||'USD', tenure:p.tenure||'freehold', leaseYears:p.lease_years, expectedYield:inv.expected_yield, images:p.images||[], href:`/investments/${inv.id}`, bedrooms:p.bedrooms, bathrooms:p.bathrooms, pool:p.pool, garden:p.garden, furnished:p.furnished, condition:p.condition, latitude:p.latitude, longitude:p.longitude, description:p.description });
        }
        if (inv.asset_type==='land') {
          const l = (lands as any[])?.find(x=>x.id===inv.asset_id);
          if (l && l.status==='published') merged.push({ id:inv.id, type:'land', title:l.title, location:l.location||'Lombok', price:l.price_per_are_idr??l.price_per_are??0, currency:l.currency||'IDR', tenure:l.tenure||'freehold', leaseYears:l.lease_years, expectedYield:inv.expected_yield, images:l.images||[], href:`/investments/${inv.id}`, landSize:l.land_size ? Number(l.land_size) : null, condition:l.condition, hasWater:l.has_water, hasElectricity:l.has_electricity, hasRoad:l.has_road, latitude:l.latitude, longitude:l.longitude, description:l.description });
        }
      }
      setItems(merged); setLoading(false);
    };
    load();
  }, []);

  const locations = [...new Set(items.map(i=>i.location))].sort();

  const filtered = items.filter(item => {
    if (search.type!=='all' && item.type!==search.type) return false;
    if (search.tenure!=='all' && item.tenure!==search.tenure) return false;
    if (search.location && item.location!==search.location) return false;
    if (item.type==='villa') {
      if (villa.pool && !item.pool) return false;
      if (villa.garden && !item.garden) return false;
      if (villa.furnished && !item.furnished) return false;
      if (villa.minBedrooms && (item.bedrooms??0) < Number(villa.minBedrooms)) return false;
      if (villa.minBathrooms && (item.bathrooms??0) < Number(villa.minBathrooms)) return false;
    }
    if (item.type==='land') {
      if (land.hasWater && !item.hasWater) return false;
      if (land.hasElectricity && !item.hasElectricity) return false;
      if (land.hasRoad && !item.hasRoad) return false;
      if (land.minArea && (item.landSize??0) < Number(land.minArea)) return false;
      if (land.maxPrice && item.price > Number(land.maxPrice)) return false;
    }
    return true;
  });

  const resetFilters = () => {
    setVilla({ pool:false, garden:false, furnished:false, minBedrooms:'', minBathrooms:'' });
    setLand({ hasWater:false, hasElectricity:false, hasRoad:false, minArea:'', maxPrice:'' });
  };
  const hasActiveFilters = villa.pool||villa.garden||villa.furnished||!!villa.minBedrooms||!!villa.minBathrooms||land.hasWater||land.hasElectricity||land.hasRoad||!!land.minArea||!!land.maxPrice;

  if (loading) return (
    <main style={P.page}><div style={P.loading}><div style={P.spinner}/><span style={{fontSize:16,color:'#6F6A64'}}>Loading opportunities…</span></div></main>
  );

  return (
    <main style={P.page}>
      <section style={P.hero}>
        <h1 style={P.h1}>Invest in Lombok</h1>
      </section>

      {/* ── Search bar ── */}
      <div style={P.searchBar}>
        {([
          ['ASSET TYPE', search.type, (v:string)=>setSearch(s=>({...s,type:v as any})), [['all','All'],['villa','Villas'],['land','Land']] as [string,string][]],
          ['PROPERTY TYPE', search.tenure, (v:string)=>setSearch(s=>({...s,tenure:v as any})), [['all','All'],['freehold','Freehold'],['leasehold','Leasehold']] as [string,string][]],
          ['LOCATION', search.location, (v:string)=>setSearch(s=>({...s,location:v})), [['','All areas'],...locations.map(l=>[l,l] as [string,string])] as [string,string][]],
        ] as [string,string,(v:string)=>void,[string,string][]][]).map(([label, val, setter, opts], i, arr) => (
          <React.Fragment key={label}>
            <div style={P.seg}>
              <span style={P.segLabel}>{label}</span>
              <select style={P.segSel} value={val} onChange={e=>setter(e.target.value)}>
                {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            {i < arr.length-1 && <div style={P.divider}/>}
          </React.Fragment>
        ))}
      </div>

      {/* ── Layout ── */}
      <div style={P.layout}>
        {/* Sidebar */}
        <aside style={P.sidebar}>
          {/* Villa filters */}
          {(search.type==='villa'||search.type==='all') && (<>
            <p style={P.sHead}>AMENITIES</p>
            {([['pool','🏊 Pool'],['garden','🌳 Garden'],['furnished','🛋️ Furnished']] as [keyof VillaSidebar,string][]).map(([key,label])=>(
              <label key={key} style={P.checkRow}>
                <input type="checkbox" checked={villa[key] as boolean} onChange={e=>setVilla(s=>({...s,[key]:e.target.checked}))} style={{accentColor:'#2FB7A6',width:16,height:16,cursor:'pointer'}}/>
                <span style={P.checkLabel}>{label}</span>
              </label>
            ))}
            <p style={{...P.sHead,marginTop:18}}>BEDROOMS</p>
            {[['1','1+'],['2','2+'],['3','3+'],['4','4+']].map(([v,l])=>(
              <label key={v} style={P.checkRow}>
                <input type="checkbox" checked={villa.minBedrooms===v} onChange={e=>setVilla(s=>({...s,minBedrooms:e.target.checked?v:''}))} style={{accentColor:'#2FB7A6',width:16,height:16,cursor:'pointer'}}/>
                <span style={P.checkLabel}>{l} beds</span>
              </label>
            ))}
            <p style={{...P.sHead,marginTop:18}}>BATHROOMS</p>
            {[['1','1+'],['2','2+'],['3','3+']].map(([v,l])=>(
              <label key={v} style={P.checkRow}>
                <input type="checkbox" checked={villa.minBathrooms===v} onChange={e=>setVilla(s=>({...s,minBathrooms:e.target.checked?v:''}))} style={{accentColor:'#2FB7A6',width:16,height:16,cursor:'pointer'}}/>
                <span style={P.checkLabel}>{l} baths</span>
              </label>
            ))}
          </>)}

          {/* Land filters */}
          {(search.type==='land'||search.type==='all') && (<>
            <p style={{...P.sHead,marginTop:search.type==='all'?24:0}}>UTILITIES</p>
            {([['hasWater','💧 Water access'],['hasElectricity','⚡ Electricity'],['hasRoad','🛤️ Road access']] as [keyof LandSidebar,string][]).map(([key,label])=>(
              <label key={key} style={P.checkRow}>
                <input type="checkbox" checked={land[key] as boolean} onChange={e=>setLand(s=>({...s,[key]:e.target.checked}))} style={{accentColor:'#2FB7A6',width:16,height:16,cursor:'pointer'}}/>
                <span style={P.checkLabel}>{label}</span>
              </label>
            ))}
            <p style={{...P.sHead,marginTop:18}}>MIN AREA (are)</p>
            {[['5','5+'],['10','10+'],['20','20+'],['50','50+']].map(([v,l])=>(
              <label key={v} style={P.checkRow}>
                <input type="checkbox" checked={land.minArea===v} onChange={e=>setLand(s=>({...s,minArea:e.target.checked?v:''}))} style={{accentColor:'#2FB7A6',width:16,height:16,cursor:'pointer'}}/>
                <span style={P.checkLabel}>{l} are</span>
              </label>
            ))}
            <p style={{...P.sHead,marginTop:18}}>MAX PRICE/ARE</p>
            {[['100000000','100 M IDR'],['200000000','200 M IDR'],['300000000','300 M IDR']].map(([v,l])=>(
              <label key={v} style={P.checkRow}>
                <input type="checkbox" checked={land.maxPrice===v} onChange={e=>setLand(s=>({...s,maxPrice:e.target.checked?v:''}))} style={{accentColor:'#2FB7A6',width:16,height:16,cursor:'pointer'}}/>
                <span style={P.checkLabel}>{l}</span>
              </label>
            ))}
          </>)}

          {hasActiveFilters && (
            <button onClick={resetFilters} style={{marginTop:20,width:'100%',padding:'9px 0',background:'#F6F1E9',border:'none',borderRadius:8,fontSize:13,fontWeight:600,color:'#6F6A64',cursor:'pointer'}}>
              Reset filters
            </button>
          )}
        </aside>

        {/* Grid */}
        <div style={{flex:1,minWidth:0}}>
          <div style={P.resultRow}>
            <p style={{fontSize:14,color:'#6F6A64',margin:0}}>{filtered.length} opportunit{filtered.length!==1?'ies':'y'} available</p>
          </div>
          {filtered.length===0 ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:60,background:'#F6F1E9',borderRadius:16}}>
              <p style={{color:'#6F6A64',fontSize:15}}>No opportunities match your criteria.</p>
              <button onClick={resetFilters} style={{padding:'10px 22px',background:'#C9A96A',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer'}}>Reset filters</button>
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
  card: { background:'#FDFAF5', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 16px rgba(47,42,38,0.08)', border:'1px solid #DDD6C8', display:'flex', flexDirection:'column' },
  imgWrap: { position:'relative', width:'100%', height:180, flexShrink:0, background:'#DDD6C8', overflow:'hidden' },
  img: { position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'opacity 0.35s ease', pointerEvents:'none', userSelect:'none' },
  noImg: { position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:56, color:'#DDD6C8' },
  metaRow: { display:'flex', gap:5, flexWrap:'wrap', alignItems:'center', marginBottom:8 },
  metaBadge: { fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:6 },
  locBadge: { fontSize:12, color:'#2F2A26', fontWeight:500 },
  arrow: { position:'absolute', top:'50%', transform:'translateY(-50%)', width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.92)', border:'none', fontSize:20, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.18)', zIndex:3, color:'#111', padding:0, lineHeight:1 },
  dots: { position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', display:'flex', gap:5, zIndex:3 },
  dot: { width:6, height:6, borderRadius:'50%', border:'none', padding:0, cursor:'pointer', transition:'background 0.2s' },
  link: { textDecoration:'none', color:'inherit', display:'flex', flexDirection:'column', flex:1 },
  body: { padding:'18px 20px 20px', display:'flex', flexDirection:'column', justifyContent:'space-between', flex:1 },
  title: { fontSize:16, fontWeight:700, color:'#2F2A26', margin:'0 0 4px', lineHeight:1.35 },
  loc: { fontSize:13, color:'#2F2A26', margin:'0 0 10px' },
  chips: { display:'flex', flexWrap:'wrap', gap:5, marginTop:6 },
  chip: { fontSize:12, color:'#2F2A26', background:'#F6F1E9', padding:'3px 9px', borderRadius:5, fontWeight:600, border:'1px solid #DDD6C8' },
  priceBlock: { marginTop:16, paddingTop:14, borderTop:'1px solid #F0E8DC' },
  price: { fontSize:20, fontWeight:800, color:'#2F2A26', margin:'0 0 3px' },
  approx: { fontSize:13, color:'#6F6A64', margin:0, marginTop:2 },
  yield: { fontSize:12, color:'#059669', fontWeight:600, margin:0 },
  desc: { fontSize:13, color:'#6F6A64', margin:'8px 0 0', lineHeight:1.55, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' },
};

const P: { [k: string]: React.CSSProperties } = {
  page: { maxWidth:1400, margin:'0 auto', padding:'0 24px 80px' },
  loading: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:16 },
  spinner: { width:44, height:44, border:'4px solid #DDD6C8', borderTopColor:'#C9A96A', borderRadius:'50%' },
  hero: { textAlign:'center', padding:'36px 0 28px' },
  h1: { fontSize:46, fontWeight:800, color:'#2F2A26', marginBottom:14, lineHeight:1.15 },
  sub: { fontSize:18, color:'#6F6A64', maxWidth:520, margin:'0 auto' },
  searchBar: { display:'flex', background:'#FDFAF5', borderRadius:14, border:'1px solid #DDD6C8', overflow:'hidden', marginBottom:32, boxShadow:'0 2px 12px rgba(47,42,38,0.06)', alignItems:'stretch' },
  seg: { flex:1, padding:'16px 20px', display:'flex', flexDirection:'column', gap:5 },
  segLabel: { fontSize:11, fontWeight:800, letterSpacing:'0.1em', color:'#6F6A64' },
  segSel: { border:'none', outline:'none', fontSize:15, fontWeight:600, color:'#2F2A26', background:'transparent', cursor:'pointer', padding:0 },
  divider: { width:1, background:'#F0E8DC', margin:'10px 0' },
  layout: { display:'flex', gap:28, alignItems:'flex-start' },
  sidebar: { width:230, flexShrink:0, background:'#FDFAF5', borderRadius:16, border:'1px solid #DDD6C8', padding:'22px 18px', position:'sticky', top:24, boxShadow:'0 2px 12px rgba(47,42,38,0.06)' },
  sHead: { fontSize:11, fontWeight:800, letterSpacing:'0.13em', color:'#C9A96A', margin:'0 0 14px', textTransform:'uppercase' },
  checkRow: { display:'flex', alignItems:'center', gap:11, padding:'10px 0', borderBottom:'1px solid #F0E8DC', cursor:'pointer' },
  checkLabel: { fontSize:15, fontWeight:500, color:'#2F2A26' },
  resultRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:24 },
};
