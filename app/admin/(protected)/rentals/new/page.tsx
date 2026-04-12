'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient';
import { normalizeStatus } from '../../../../../lib/statusUtils';
import UnifiedMediaUpload, { type MediaGalleryItem } from '../../../../../components/admin/UnifiedMediaUpload';

export default function NewRentalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [builtArea, setBuiltArea] = useState('');
  const [landArea, setLandArea] = useState('');
  const [pool, setPool] = useState(false);
  const [garden, setGarden] = useState(false);
  const [furnished, setFurnished] = useState(true);
  const [aircon, setAircon] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [parking, setParking] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published' | 'paused'>('draft');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [minDuration, setMinDuration] = useState('1');
  const [maxDuration, setMaxDuration] = useState('12');
  const [upfrontMonths, setUpfrontMonths] = useState('0');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [legalChecked, setLegalChecked] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaGalleryItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadAll = async (propertyId: string) => {
    const imageUrls: string[] = [];
    const videoUrls: string[] = [];
    const newItems = mediaItems.filter(i => i.file);
    for (let idx = 0; idx < mediaItems.length; idx++) {
      const item = mediaItems[idx];
      if (!item.file) { item.mediaType === 'video' ? videoUrls.push(item.previewSrc) : imageUrls.push(item.previewSrc); continue; }
      const ext = item.name.split('.').pop();
      const path = `rentals/${propertyId}/${item.mediaType === 'video' ? 'videos' : 'images'}/${Date.now()}_${idx}.${ext}`;
      const { error: upErr } = await supabase.storage.from('properties').upload(path, item.file, { upsert: true, contentType: item.file.type });
      if (upErr) { console.error(upErr); continue; }
      const { data } = supabase.storage.from('properties').getPublicUrl(path);
      item.mediaType === 'video' ? videoUrls.push(data.publicUrl) : imageUrls.push(data.publicUrl);
      setUploadProgress(Math.round(((idx + 1) / Math.max(newItems.length, 1)) * 100));
    }
    return { imageUrls, videoUrls };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setError(null); setUploadProgress(0);
    try {
      const { data: prop, error: propErr } = await supabase.from('properties').insert({
        title, location, description: description || null,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        built_area: builtArea ? Number(builtArea) : null,
        land_area: landArea ? Number(landArea) : null,
        pool, garden, furnished, aircon, wifi, parking,
        status: normalizeStatus(status), property_type: 'rental',
      }).select().single();
      if (propErr || !prop) { setError(propErr?.message || 'Failed to create'); setLoading(false); return; }

      const { imageUrls, videoUrls } = await uploadAll(prop.id);
      if (imageUrls.length || videoUrls.length) {
        await supabase.from('properties').update({ images: imageUrls, videos: videoUrls }).eq('id', prop.id);
      }

      const { error: rErr } = await supabase.from('long_term_rentals').insert({
        property_id: prop.id,
        monthly_price_idr: Number(monthlyPrice),
        min_duration_months: Number(minDuration),
        max_duration_months: Number(maxDuration),
        upfront_months: Number(upfrontMonths),
        available_from: availableFrom || null,
        available_to: availableTo || null,
        legal_checked: legalChecked,
      });
      if (rErr) { setError(rErr.message); setLoading(false); return; }
      router.push('/admin');
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  return (
    <main style={s.container}>
      <h1 style={s.title}>Add rental property</h1>
      {error && <div style={s.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={s.form}>
        <section style={s.section}>
          <h2 style={s.sectionTitle}>📍 Property information</h2>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Title *</label><input style={s.input} value={title} onChange={e => setTitle(e.target.value)} required /></div>
            <div style={s.field}><label style={s.label}>Location *</label><input style={s.input} value={location} onChange={e => setLocation(e.target.value)} required /></div>
          </div>
          <div style={s.field}><label style={s.label}>Description</label><textarea style={s.textarea} value={description} onChange={e => setDescription(e.target.value)} rows={4} /></div>
          <div style={s.grid4}>
            <div style={s.field}><label style={s.label}>Bedrooms</label><input style={s.input} type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} /></div>
            <div style={s.field}><label style={s.label}>Bathrooms</label><input style={s.input} type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} /></div>
            <div style={s.field}><label style={s.label}>Built (m²)</label><input style={s.input} type="number" value={builtArea} onChange={e => setBuiltArea(e.target.value)} /></div>
            <div style={s.field}><label style={s.label}>Land (are)</label><input style={s.input} type="number" step="0.1" value={landArea} onChange={e => setLandArea(e.target.value)} /></div>
          </div>
          <div style={s.amenities}>
            {(['pool','garden','furnished','aircon','wifi','parking'] as const).map((key, i) => {
              const stateMap = { pool, garden, furnished, aircon, wifi, parking };
              const setMap = { pool: setPool, garden: setGarden, furnished: setFurnished, aircon: setAircon, wifi: setWifi, parking: setParking };
              const iconMap = { pool: '🏊', garden: '🌳', furnished: '🛋️', aircon: '❄️', wifi: '📶', parking: '🚗' };
              const labelMap = { pool: 'Pool', garden: 'Garden', furnished: 'Furnished', aircon: 'Air conditioning', wifi: 'WiFi', parking: 'Parking' };
              return (
                <label key={key} style={s.checkbox}>
                  <input type="checkbox" checked={stateMap[key]} onChange={e => setMap[key](e.target.checked)} />
                  <span>{iconMap[key]} {labelMap[key]}</span>
                </label>
              );
            })}
          </div>
        </section>

        <section style={s.section}>
          <h2 style={s.sectionTitle}>💰 Rental conditions</h2>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Monthly price (IDR) *</label><input style={s.input} type="number" value={monthlyPrice} onChange={e => setMonthlyPrice(e.target.value)} required /></div>
            <div style={s.field}><label style={s.label}>Upfront months</label><input style={s.input} type="number" value={upfrontMonths} onChange={e => setUpfrontMonths(e.target.value)} min="0" /></div>
          </div>
          <div style={s.field}><label style={s.label}>Status *</label>
            <select style={s.input} value={status} onChange={e => setStatus(e.target.value as any)}>
              <option value="draft">Draft</option><option value="published">Published</option><option value="paused">Paused</option>
            </select>
          </div>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Min duration (months)</label><input style={s.input} type="number" value={minDuration} onChange={e => setMinDuration(e.target.value)} min="1" /></div>
            <div style={s.field}><label style={s.label}>Max duration (months)</label><input style={s.input} type="number" value={maxDuration} onChange={e => setMaxDuration(e.target.value)} min="1" /></div>
          </div>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Available from</label><input style={s.input} type="date" value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} /></div>
            <div style={s.field}>
              <label style={s.label}>Available until <span style={s.optional}>optional</span></label>
              <input style={s.input} type="date" value={availableTo} onChange={e => setAvailableTo(e.target.value)} min={availableFrom || undefined} />
            </div>
          </div>
          <label style={s.checkbox}><input type="checkbox" checked={legalChecked} onChange={e => setLegalChecked(e.target.checked)} /><span>✅ Legal documents verified</span></label>
        </section>

        <section style={s.section}>
          <h2 style={s.sectionTitle}>📸 Photos & Videos</h2>
          <UnifiedMediaUpload items={mediaItems} onChange={setMediaItems} />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={s.progressBar}><div style={{ ...s.progressFill, width: `${uploadProgress}%` }} /></div>
          )}
        </section>

        <div style={s.actions}>
          <button type="button" onClick={() => router.back()} style={s.btnSecondary}>Cancel</button>
          <button type="submit" disabled={loading} style={s.btnPrimary}>
            {loading ? `Creating… ${uploadProgress > 0 ? `(${uploadProgress}%)` : ''}` : '✓ Create rental property'}
          </button>
        </div>
      </form>
    </main>
  );
}

const s: { [key: string]: React.CSSProperties } = {
  container: { padding: 24, maxWidth: 900, margin: '0 auto' },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 24, color: '#111827' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 24 },
  section: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #f3f4f6', color: '#374151' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginBottom: 16 },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 16, marginBottom: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#4b5563' },
  optional: { fontSize: 11, fontWeight: 500, color: '#9ca3af', background: '#f3f4f6', borderRadius: 4, padding: '1px 6px', marginLeft: 6 },
  input: { padding: '12px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15, outline: 'none' },
  textarea: { padding: '12px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15, resize: 'vertical' as const, fontFamily: 'inherit' },
  amenities: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  checkbox: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f9fafb', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500 },
  progressBar: { height: 6, background: '#e5e7eb', borderRadius: 3, marginTop: 16, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#2563eb,#059669)', transition: 'width 0.3s' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 12 },
  btnPrimary: { padding: '14px 28px', background: 'linear-gradient(135deg,#2563eb,#059669)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  btnSecondary: { padding: '14px 28px', background: '#f3f4f6', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};
