'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient';
import { normalizeStatus } from '../../../../../lib/statusUtils';
import { urlsToGalleryItems, readFileAsDataURL, type SortableGalleryItem } from '../../../../../lib/galleryUtils';
import AdminImageGallery from '../../../../../components/admin/AdminImageGallery';
import MapPicker from '../../../../../components/MapPicker';
import LocationInput from '../../../../../components/LocationInput';

type VideoItem = {
  id: string;
  previewSrc: string;
  file?: File;
  name: string;
  isExisting?: boolean;
};

export default function EditRentalPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [propertyId, setPropertyId] = useState('');
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
  const [kitchen, setKitchen] = useState(false);
  const [privateSpace, setPrivateSpace] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published' | 'paused'>('draft');

  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [yearlyPrice, setYearlyPrice] = useState('');
  const [internalRef, setInternalRef] = useState('');
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [legalChecked, setLegalChecked] = useState(false);

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [galleryItems, setGalleryItems] = useState<SortableGalleryItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('long_term_rentals')
        .select('*, properties (*)')
        .eq('id', id)
        .single();

      if (error || !data) { setError('Rental not found'); setLoading(false); return; }

      setMonthlyPrice(String(data.monthly_price_idr || ''));
      setYearlyPrice(String(data.yearly_price_idr || ''));
      setMinDuration(String(data.min_duration_months || ''));
      setMaxDuration(String(data.max_duration_months || ''));
      setPaymentTerms(data.payment_terms || '');
      setAvailableFrom(data.available_from || '');
      setAvailableTo(data.available_to || '');
      setLegalChecked(data.legal_checked || false);

      if (data.properties) {
        const p = data.properties;
        setPropertyId(p.id);
        setTitle(p.title || '');
        setLocation(p.location || '');
        setDescription(p.description || '');
        setBedrooms(String(p.bedrooms || ''));
        setBathrooms(String(p.bathrooms || ''));
        setBuiltArea(String(p.built_area || ''));
        setLandArea(String(p.land_area || ''));
        setPool(p.pool || false);
        setGarden(p.garden || false);
        setFurnished(p.furnished ?? true);
        setAircon(p.aircon ?? true);
        setWifi(p.wifi ?? true);
        setParking(p.parking || false);
        setKitchen(p.kitchen || false);
        setPrivateSpace(p.private_space || false);
        setGalleryItems(urlsToGalleryItems(p.images || []));
        setStatus((p.status as any) || 'draft');
        setLat(p.latitude ?? null);
        setLng(p.longitude ?? null);
        setInternalRef(p.internal_ref || '');

        // Load existing videos
        if (p.videos && Array.isArray(p.videos)) {
          setVideoItems(p.videos.map((url: string, i: number) => ({
            id: `existing-${i}-${url.slice(-16)}`,
            previewSrc: url,
            name: url.split('/').pop() || `video_${i + 1}`,
            isExisting: true,
          })));
        }
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const added: SortableGalleryItem[] = [];
    for (const file of files) {
      const previewSrc = await readFileAsDataURL(file);
      added.push({ id: crypto.randomUUID(), previewSrc, file, mediaType: 'image' as const });
    }
    setGalleryItems(prev => [...prev, ...added]);
    e.target.value = '';
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const added: VideoItem[] = files.map(file => ({
      id: crypto.randomUUID(),
      previewSrc: URL.createObjectURL(file),
      file,
      name: file.name,
      isExisting: false,
    }));
    setVideoItems(prev => [...prev, ...added]);
    e.target.value = '';
  };

  const removeVideo = (id: string) => {
    setVideoItems(prev => {
      const item = prev.find(v => v.id === id);
      if (item && !item.isExisting) URL.revokeObjectURL(item.previewSrc);
      return prev.filter(v => v.id !== id);
    });
  };

  const buildOrderedImages = async (): Promise<string[]> => {
    if (!propertyId) return [];
    const totalFiles = galleryItems.filter(g => g.file).length;
    let uploaded = 0;
    const out: string[] = [];

    for (let i = 0; i < galleryItems.length; i++) {
      const item = galleryItems[i];
      if (item.file) {
        const ext = item.file.name.split('.').pop();
        const path = `rentals/${propertyId}/${Date.now()}_${i}.${ext}`;
        const { error } = await supabase.storage.from('properties').upload(path, item.file, { upsert: true });
        if (error) { console.error(error); continue; }
        const { data } = supabase.storage.from('properties').getPublicUrl(path);
        out.push(data.publicUrl);
        uploaded++;
        setUploadProgress(Math.round((uploaded / Math.max(totalFiles, 1)) * 100));
      } else {
        out.push(item.previewSrc);
      }
    }
    return out;
  };

  const buildOrderedVideos = async (): Promise<string[]> => {
    if (!propertyId) return [];
    const newVideos = videoItems.filter(v => !v.isExisting && v.file);
    let uploaded = 0;
    const out: string[] = [];

    for (let i = 0; i < videoItems.length; i++) {
      const item = videoItems[i];
      if (item.isExisting) {
        out.push(item.previewSrc);
      } else if (item.file) {
        const ext = item.name.split('.').pop();
        const path = `rentals/${propertyId}/videos/${Date.now()}_${i}.${ext}`;
        const { error } = await supabase.storage.from('properties').upload(path, item.file, { upsert: true, contentType: item.file.type });
        if (error) { console.error(error); continue; }
        const { data } = supabase.storage.from('properties').getPublicUrl(path);
        out.push(data.publicUrl);
        uploaded++;
        setVideoProgress(Math.round((uploaded / Math.max(newVideos.length, 1)) * 100));
      }
    }
    return out;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setUploadProgress(0);
    setVideoProgress(0);

    try {
      const allImages = await buildOrderedImages();
      const allVideos = await buildOrderedVideos();

      await supabase.from('properties').update({
        title, location, description,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        built_area: builtArea ? Number(builtArea) : null,
        land_area: landArea ? Number(landArea) : null,
        pool, garden, furnished, aircon, wifi, parking,
        kitchen, private_space: privateSpace,
        images: allImages,
        videos: allVideos,
        status: normalizeStatus(status),
        latitude: lat,
        longitude: lng,
        internal_ref: internalRef || null,
      }).eq('id', propertyId);

      const rentalUpdate: Record<string, any> = {
        monthly_price_idr: monthlyPrice ? Number(monthlyPrice) : null,
        yearly_price_idr: yearlyPrice ? Number(yearlyPrice) : null,
        min_duration_months: minDuration ? Number(minDuration) : null,
        max_duration_months: maxDuration ? Number(maxDuration) : null,
        payment_terms: paymentTerms.trim() || null,
        available_from: availableFrom || null,
        available_to: availableTo || null,
        legal_checked: legalChecked,
      };
      let { error: updErr } = await supabase.from('long_term_rentals').update(rentalUpdate).eq('id', id);
      if (updErr && /payment_terms/i.test(updErr.message || '')) {
        delete rentalUpdate.payment_terms;
        await supabase.from('long_term_rentals').update(rentalUpdate).eq('id', id);
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this rental property? This action is irreversible.')) return;
    setSaving(true);
    try {
      await supabase.from('long_term_rentals').delete().eq('id', id);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <main style={s.container}>
      <h1 style={s.title}>Edit rental property</h1>
      {error && <div style={s.error}>{error}</div>}

      <form onSubmit={handleSave} style={s.form}>
        {/* ── Property info ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>📍 Property information</h2>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Property title *</label><input style={s.input} value={title} onChange={e => setTitle(e.target.value)} required /></div>
            <div style={s.field}><label style={s.label}>Location *</label><LocationInput value={location} onChange={setLocation} required /></div>
          </div>
          <div style={s.field}><label style={s.label}>Internal reference</label><input style={s.input} value={internalRef} onChange={e => setInternalRef(e.target.value)} placeholder="Ex: RY-001" /></div>
          <div style={s.field}><label style={s.label}>Description</label><textarea style={s.textarea} value={description} onChange={e => setDescription(e.target.value)} rows={4} /></div>
          <div style={s.grid4}>
            <div style={s.field}><label style={s.label}>Bedrooms</label><input style={s.input} type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} /></div>
            <div style={s.field}><label style={s.label}>Bathrooms</label><input style={s.input} type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} /></div>
            <div style={s.field}><label style={s.label}>Built area (m²)</label><input style={s.input} type="number" value={builtArea} onChange={e => setBuiltArea(e.target.value)} /></div>
            <div style={s.field}><label style={s.label}>Land (are)</label><input style={s.input} type="number" step="0.1" value={landArea} onChange={e => setLandArea(e.target.value)} /></div>
          </div>
          <div style={s.amenities}>
            {([['pool', pool, setPool, '🏊', 'Pool'], ['garden', garden, setGarden, '🌳', 'Garden'], ['furnished', furnished, setFurnished, '🛋️', 'Furnished'], ['aircon', aircon, setAircon, '❄️', 'Air conditioning'], ['wifi', wifi, setWifi, '📶', 'WiFi'], ['parking', parking, setParking, '🚗', 'Parking'], ['kitchen', kitchen, setKitchen, '🍳', 'Kitchen'], ['privateSpace', privateSpace, setPrivateSpace, '🚪', 'Private space']] as const).map(([key, state, setter, icon, label]) => (
              <label key={key} style={s.checkbox}><input type="checkbox" checked={state} onChange={e => (setter as any)(e.target.checked)} /><span>{icon} {label}</span></label>
            ))}
          </div>
        </section>

        {/* ── Rental terms ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>💰 Rental conditions</h2>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Monthly price (IDR)</label><input style={s.input} type="number" value={monthlyPrice} onChange={e => setMonthlyPrice(e.target.value)} placeholder="Optional if yearly set" /></div>
            <div style={s.field}><label style={s.label}>Yearly price (IDR)</label><input style={s.input} type="number" value={yearlyPrice} onChange={e => setYearlyPrice(e.target.value)} placeholder="Optional if monthly set" /></div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Payment terms (free text)</label>
            <textarea
              style={s.textarea}
              value={paymentTerms}
              onChange={e => setPaymentTerms(e.target.value)}
              rows={3}
              placeholder="Ex: 5-year lease — 2 years paid upfront, then annual · or: 1 month upfront · leave empty if standard"
            />
            <span style={s.hint}>Free text describing how and when the tenant must pay. Leave empty to hide this line on the listing.</span>
          </div>
          <div style={s.grid3}>
            <div style={s.field}><label style={s.label}>Min duration (months) <span style={s.optional}>— optional</span></label><input style={s.input} type="number" value={minDuration} onChange={e => setMinDuration(e.target.value)} placeholder="Leave empty to hide" /></div>
            <div style={s.field}><label style={s.label}>Max duration (months) <span style={s.optional}>— optional</span></label><input style={s.input} type="number" value={maxDuration} onChange={e => setMaxDuration(e.target.value)} placeholder="Leave empty to hide" /></div>
            <div style={s.field}><label style={s.label}>Available from</label><input style={s.input} type="date" value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} /></div>
          </div>
          <div style={s.grid3}>
            <div style={s.field}><label style={s.label}>Available until</label><input style={s.input} type="date" value={availableTo} onChange={e => setAvailableTo(e.target.value)} /></div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Status *</label>
            <select style={s.input} value={status} onChange={e => setStatus(e.target.value as any)} required>
              <option value="draft">Draft (not visible to public)</option>
              <option value="published">Published (visible to public)</option>
              <option value="paused">Paused (not visible to public)</option>
            </select>
          </div>
          <label style={s.checkbox}><input type="checkbox" checked={legalChecked} onChange={e => setLegalChecked(e.target.checked)} /><span>✅ Legal documents verified</span></label>
        </section>

        {/* ── Location ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>🗺️ Location</h2>
          <MapPicker
            lat={lat} lng={lng}
            onChange={(la, lo) => { setLat(la); setLng(lo); }}
            onClear={() => { setLat(null); setLng(null); }}
          />
        </section>

        {/* ── Photos ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>📸 Photo gallery</h2>
          <div style={{ ...s.dropzone, marginTop: 0 }}>
            <input type="file" accept="image/*" multiple onChange={handleImageSelect} style={s.fileInput} id="image-upload" />
            <label htmlFor="image-upload" style={s.dropzoneLabel}>
              <span style={{ fontSize: 40 }}>📷</span>
              <span>Add images</span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>PNG, JPG up to 10MB each</span>
            </label>
          </div>
          <AdminImageGallery items={galleryItems} onChange={setGalleryItems} mainBadgeVariant="blue" />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={s.progressBar}><div style={{ ...s.progressFill, width: `${uploadProgress}%` }} /></div>
          )}
        </section>

        {/* ── Videos ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>🎬 Video gallery</h2>
          <p style={s.sectionHint}>Add or remove video tours. Existing videos are preserved unless removed.</p>
          <div style={{ ...s.dropzone, borderColor: '#a5b4fc', background: '#f5f3ff' }}>
            <input type="file" accept="video/mp4,video/mov,video/quicktime,video/webm,video/avi" multiple onChange={handleVideoSelect} style={s.fileInput} id="video-upload" />
            <label htmlFor="video-upload" style={s.dropzoneLabel}>
              <span style={{ fontSize: 40 }}>🎥</span>
              <span>Add videos</span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>MP4, MOV, WebM — max 200MB each</span>
            </label>
          </div>
          {videoItems.length > 0 && (
            <div style={s.videoGrid}>
              {videoItems.map(item => (
                <div key={item.id} style={s.videoWrapper}>
                  <video src={item.previewSrc} style={s.videoPreview} controls preload="metadata" />
                  <div style={s.videoMeta}>
                    <span style={s.videoName}>{item.name}</span>
                    {item.isExisting && <span style={s.existingBadge}>Saved</span>}
                  </div>
                  <button type="button" onClick={() => removeVideo(item.id)} style={s.removeBtn} title="Remove">✕</button>
                </div>
              ))}
            </div>
          )}
          {videoProgress > 0 && videoProgress < 100 && (
            <div style={s.progressBar}><div style={{ ...s.progressFill, width: `${videoProgress}%`, background: 'linear-gradient(90deg,#7c3aed,#a855f7)' }} /></div>
          )}
        </section>

        {/* ── Actions ── */}
        <div style={s.actions}>
          <button type="button" onClick={handleDelete} disabled={saving} style={s.btnDanger}>🗑️ Delete</button>
          <div style={{ flex: 1 }} />
          <button type="button" onClick={() => router.back()} style={s.btnSecondary}>Cancel</button>
          <button type="submit" disabled={saving} style={s.btnPrimary}>
            {saving ? `Saving… (${Math.max(uploadProgress, videoProgress)}%)` : '✓ Save'}
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
  section: { background: '#ffffff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #f3f4f6', color: '#374151' },
  sectionHint: { fontSize: 13, color: '#6b7280', marginTop: -12, marginBottom: 16 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#4b5563' },
  optional: { fontWeight: 400, color: '#9ca3af', fontSize: 12 },
  hint: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  input: { padding: '12px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15, outline: 'none' },
  textarea: { padding: '12px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15, resize: 'vertical' as const, fontFamily: 'inherit' },
  amenities: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  checkbox: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f9fafb', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500 },
  dropzone: { position: 'relative', border: '2px dashed #d1d5db', borderRadius: 16, padding: 40, textAlign: 'center', background: '#fafafa', cursor: 'pointer' },
  fileInput: { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' },
  dropzoneLabel: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#6b7280', fontWeight: 500, pointerEvents: 'none' },
  videoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 20 },
  videoWrapper: { position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#111827', border: '1px solid #374151' },
  videoPreview: { width: '100%', height: 160, objectFit: 'cover' as const, display: 'block' },
  videoMeta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#1f2937', gap: 8 },
  videoName: { fontSize: 12, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, flex: 1 },
  existingBadge: { fontSize: 10, fontWeight: 700, color: '#34d399', background: 'rgba(52,211,153,0.15)', padding: '2px 8px', borderRadius: 999, flexShrink: 0 },
  removeBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  progressBar: { height: 6, background: '#e5e7eb', borderRadius: 3, marginTop: 16, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#2563eb,#059669)', transition: 'width 0.3s' },
  actions: { display: 'flex', gap: 12, marginTop: 8 },
  btnPrimary: { padding: '14px 28px', background: 'linear-gradient(135deg,#2563eb,#059669)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' },
  btnSecondary: { padding: '14px 28px', background: '#f3f4f6', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  btnDanger: { padding: '14px 20px', background: '#fef2f2', color: '#b91c1c', border: '2px solid #fca5a5', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};
