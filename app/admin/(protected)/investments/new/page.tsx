'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../../lib/supabaseClient';
import { normalizeStatus, type PropertyStatus } from '../../../../../lib/statusUtils';
import { readFileAsDataURL, type SortableGalleryItem } from '../../../../../lib/galleryUtils';
import AdminImageGallery from '../../../../../components/admin/AdminImageGallery';

type VideoItem = {
  id: string;
  previewSrc: string;
  file: File;
  name: string;
};

export default function NewInvestmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [assetType, setAssetType] = useState<'villa' | 'land'>('villa');
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

  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('USD');
  const [tenure, setTenure] = useState<'freehold' | 'leasehold'>('freehold');
  const [leaseDuration, setLeaseDuration] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [legalChecked, setLegalChecked] = useState(false);
  const [managementAvailable, setManagementAvailable] = useState(true);
  const [status, setStatus] = useState<PropertyStatus>('draft');

  const [galleryItems, setGalleryItems] = useState<SortableGalleryItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [videoProgress, setVideoProgress] = useState(0);

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
    }));
    setVideoItems(prev => [...prev, ...added]);
    e.target.value = '';
  };

  const removeVideo = (id: string) => {
    setVideoItems(prev => {
      const item = prev.find(v => v.id === id);
      if (item) URL.revokeObjectURL(item.previewSrc);
      return prev.filter(v => v.id !== id);
    });
  };

  const uploadImages = async (assetId: string): Promise<string[]> => {
    const bucket = assetType === 'villa' ? 'properties' : 'lands';
    const urls: string[] = [];
    for (let i = 0; i < galleryItems.length; i++) {
      const file = galleryItems[i].file;
      if (!file) continue;
      const ext = file.name.split('.').pop();
      const path = `investments/${assetId}/${Date.now()}_${i}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) { console.error(error); continue; }
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      urls.push(data.publicUrl);
      setUploadProgress(Math.round(((i + 1) / galleryItems.length) * 100));
    }
    return urls;
  };

  const uploadVideos = async (assetId: string): Promise<string[]> => {
    const bucket = assetType === 'villa' ? 'properties' : 'lands';
    const urls: string[] = [];
    for (let i = 0; i < videoItems.length; i++) {
      const { file, name } = videoItems[i];
      const ext = name.split('.').pop();
      const path = `investments/${assetId}/videos/${Date.now()}_${i}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, contentType: file.type });
      if (error) { console.error(error); continue; }
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      urls.push(data.publicUrl);
      setVideoProgress(Math.round(((i + 1) / videoItems.length) * 100));
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    setVideoProgress(0);

    try {
      let assetId: string;

      if (assetType === 'villa') {
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .insert({
            title, location, description,
            bedrooms: bedrooms ? Number(bedrooms) : null,
            bathrooms: bathrooms ? Number(bathrooms) : null,
            built_area: builtArea ? Number(builtArea) : null,
            land_area: landArea ? Number(landArea) : null,
            pool, garden, furnished,
            price: Number(price), currency, tenure,
            lease_years: tenure === 'leasehold' ? Number(leaseDuration) : null,
            status: normalizeStatus(status),
            property_type: 'investment',
          })
          .select('id')
          .single();

        if (propertyError) throw propertyError;
        assetId = propertyData.id;

        const imageUrls = galleryItems.length > 0 ? await uploadImages(assetId) : [];
        const videoUrls = videoItems.length > 0 ? await uploadVideos(assetId) : [];
        const updatePayload: Record<string, any> = {};
        if (imageUrls.length > 0) updatePayload.images = imageUrls;
        if (videoUrls.length > 0) updatePayload.videos = videoUrls;
        if (Object.keys(updatePayload).length > 0) {
          await supabase.from('properties').update(updatePayload).eq('id', assetId);
        }
      } else {
        const { data: landData, error: landError } = await supabase
          .from('lands')
          .insert({
            title, location, description,
            land_size: landArea ? Number(landArea) : null,
            price_per_are: Number(price), currency, tenure,
            lease_years: tenure === 'leasehold' ? Number(leaseDuration) : null,
            status: normalizeStatus(status),
            zoning: 'investment',
          })
          .select('id')
          .single();

        if (landError) throw landError;
        assetId = landData.id;

        const imageUrls = galleryItems.length > 0 ? await uploadImages(assetId) : [];
        const videoUrls = videoItems.length > 0 ? await uploadVideos(assetId) : [];
        const updatePayload: Record<string, any> = {};
        if (imageUrls.length > 0) updatePayload.images = imageUrls;
        if (videoUrls.length > 0) updatePayload.videos = videoUrls;
        if (Object.keys(updatePayload).length > 0) {
          const { error: updateErr } = await supabase.from('lands').update(updatePayload).eq('id', assetId);
          if (updateErr) throw updateErr;
        }
      }

      const { error: investmentError } = await supabase.from('investments').insert({
        asset_type: assetType === 'villa' ? 'property' : 'land',
        asset_id: assetId,
        expected_yield: expectedYield ? Number(expectedYield) : null,
        legal_checked: legalChecked,
        management_available: managementAvailable,
      });

      if (investmentError) throw investmentError;

      router.push('/admin/investments');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Add investment</h1>
        <Link href="/admin/investments" style={s.backLink}>← Back</Link>
      </div>
      {error && <div style={s.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={s.form}>
        {/* ── Asset type ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>🏷️ Asset type</h2>
          <div style={s.typeSelector}>
            <button type="button" onClick={() => setAssetType('villa')} style={{ ...s.typeBtn, ...(assetType === 'villa' ? s.typeBtnActive : {}) }}>🏠 Villa</button>
            <button type="button" onClick={() => setAssetType('land')} style={{ ...s.typeBtn, ...(assetType === 'land' ? s.typeBtnActive : {}) }}>🌴 Land</button>
          </div>
        </section>

        {/* ── Property/Land info ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>📍 {assetType === 'villa' ? 'Villa' : 'Land'} information</h2>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Title *</label><input style={s.input} value={title} onChange={e => setTitle(e.target.value)} placeholder={assetType === 'villa' ? 'Ex: Luxury seafront villa' : 'Ex: Buildable land Kuta'} required /></div>
            <div style={s.field}><label style={s.label}>Location *</label><input style={s.input} value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Senggigi, Lombok" required /></div>
          </div>
          <div style={s.field}><label style={s.label}>Description</label><textarea style={s.textarea} value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed description..." rows={4} /></div>
          {assetType === 'villa' && (
            <>
              <div style={s.grid4}>
                <div style={s.field}><label style={s.label}>Bedrooms</label><input style={s.input} type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} placeholder="3" /></div>
                <div style={s.field}><label style={s.label}>Bathrooms</label><input style={s.input} type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} placeholder="2" /></div>
                <div style={s.field}><label style={s.label}>Built area (m²)</label><input style={s.input} type="number" value={builtArea} onChange={e => setBuiltArea(e.target.value)} placeholder="200" /></div>
                <div style={s.field}><label style={s.label}>Land (are)</label><input style={s.input} type="number" step="0.1" value={landArea} onChange={e => setLandArea(e.target.value)} placeholder="10" /></div>
              </div>
              <div style={s.amenities}>
                <label style={s.checkbox}><input type="checkbox" checked={pool} onChange={e => setPool(e.target.checked)} /><span>🏊 Pool</span></label>
                <label style={s.checkbox}><input type="checkbox" checked={garden} onChange={e => setGarden(e.target.checked)} /><span>🌳 Garden</span></label>
                <label style={s.checkbox}><input type="checkbox" checked={furnished} onChange={e => setFurnished(e.target.checked)} /><span>🛋️ Furnished</span></label>
              </div>
            </>
          )}
          {assetType === 'land' && (
            <div style={s.field}><label style={s.label}>Land area (are) *</label><input style={s.input} type="number" step="0.1" value={landArea} onChange={e => setLandArea(e.target.value)} placeholder="15" required /></div>
          )}
        </section>

        {/* ── Investment conditions ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>💰 Investment conditions</h2>
          <div style={s.grid2}>
            <div style={s.field}>
              <label style={s.label}>Price {assetType === 'land' ? '(per are)' : ''} *</label>
              <div style={s.priceInput}>
                <input style={{ ...s.input, borderTopRightRadius: 0, borderBottomRightRadius: 0 }} type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder={assetType === 'villa' ? '350000' : '50000000'} required />
                <select style={s.currencySelect} value={currency} onChange={e => setCurrency(e.target.value as any)}>
                  <option value="USD">USD</option>
                  <option value="IDR">IDR</option>
                </select>
              </div>
            </div>
            <div style={s.field}><label style={s.label}>Estimated yield (%/year)</label><input style={s.input} type="number" step="0.1" value={expectedYield} onChange={e => setExpectedYield(e.target.value)} placeholder="8.5" /></div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Property type *</label>
            <div style={s.tenureSelector}>
              <button type="button" onClick={() => setTenure('freehold')} style={{ ...s.tenureBtn, ...(tenure === 'freehold' ? s.tenureBtnActive : {}) }}>
                <span style={{ fontSize: 24 }}>🔑</span>
                <span style={s.tenureLabel}>Freehold</span>
                <span style={s.tenureDesc}>Full ownership</span>
              </button>
              <button type="button" onClick={() => setTenure('leasehold')} style={{ ...s.tenureBtn, ...(tenure === 'leasehold' ? s.tenureBtnActive : {}) }}>
                <span style={{ fontSize: 24 }}>📋</span>
                <span style={s.tenureLabel}>Leasehold</span>
                <span style={s.tenureDesc}>Long-term lease</span>
              </button>
            </div>
          </div>
          {tenure === 'leasehold' && (
            <div style={s.field}><label style={s.label}>Lease duration (years) *</label><input style={s.input} type="number" value={leaseDuration} onChange={e => setLeaseDuration(e.target.value)} placeholder="25" required /></div>
          )}
          <div style={s.field}>
            <label style={s.label}>Status *</label>
            <select style={s.input} value={status} onChange={e => setStatus(e.target.value as PropertyStatus)} required>
              <option value="draft">Draft (not visible to public)</option>
              <option value="published">Published (visible to public)</option>
              <option value="paused">Paused (not visible to public)</option>
            </select>
          </div>
          <div style={s.checkboxRow}>
            <label style={s.checkbox}><input type="checkbox" checked={legalChecked} onChange={e => setLegalChecked(e.target.checked)} /><span>✅ Legal documents verified</span></label>
            <label style={s.checkbox}><input type="checkbox" checked={managementAvailable} onChange={e => setManagementAvailable(e.target.checked)} /><span>🏢 Rental management available</span></label>
          </div>
        </section>

        {/* ── Photos ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>📸 Photo gallery</h2>
          <div style={s.dropzone}>
            <input type="file" accept="image/*" multiple onChange={handleImageSelect} style={s.fileInput} id="image-upload" />
            <label htmlFor="image-upload" style={s.dropzoneLabel}>
              <span style={{ fontSize: 40 }}>📷</span>
              <span>Click or drag your images here</span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>PNG, JPG up to 10MB each</span>
            </label>
          </div>
          <AdminImageGallery items={galleryItems} onChange={setGalleryItems} />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={s.progressBar}><div style={{ ...s.progressFill, width: `${uploadProgress}%` }} /></div>
          )}
        </section>

        {/* ── Videos ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>🎬 Video gallery</h2>
          <p style={s.sectionHint}>Add video tours of the property. Accepted formats: MP4, MOV, WebM.</p>
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
                  <div style={s.videoMeta}><span style={s.videoName}>{item.name}</span></div>
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
          <button type="button" onClick={() => router.back()} style={s.btnSecondary}>Cancel</button>
          <button type="submit" disabled={loading} style={s.btnPrimary}>
            {loading ? `Creating… (${Math.max(uploadProgress, videoProgress)}%)` : '✓ Create investment'}
          </button>
        </div>
      </form>
    </main>
  );
}

const s: { [key: string]: React.CSSProperties } = {
  container: { padding: 24, maxWidth: 900, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 },
  backLink: { color: '#6b7280', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 24 },
  section: { background: '#ffffff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', overflow: 'hidden' },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #f3f4f6', color: '#374151' },
  sectionHint: { fontSize: 13, color: '#6b7280', marginTop: -12, marginBottom: 16 },
  typeSelector: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  typeBtn: { padding: 24, borderRadius: 12, border: '2px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontSize: 18, fontWeight: 700, transition: 'all 0.2s' },
  typeBtnActive: { borderColor: '#2563eb', background: '#eff6ff', color: '#2563eb' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#4b5563' },
  input: { padding: '12px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15, outline: 'none' },
  textarea: { padding: '12px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 15, resize: 'vertical' as const, fontFamily: 'inherit' },
  priceInput: { display: 'flex' },
  currencySelect: { padding: '12px 14px', borderRadius: '0 10px 10px 0', border: '2px solid #e5e7eb', borderLeft: 'none', fontSize: 15, background: '#f9fafb', fontWeight: 600 },
  tenureSelector: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 },
  tenureBtn: { padding: 20, borderRadius: 12, border: '2px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.2s' },
  tenureBtnActive: { borderColor: '#059669', background: '#ecfdf5' },
  tenureLabel: { fontSize: 16, fontWeight: 700, color: '#111827' },
  tenureDesc: { fontSize: 12, color: '#6b7280' },
  amenities: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  checkbox: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f9fafb', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500 },
  checkboxRow: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  dropzone: { position: 'relative', border: '2px dashed #d1d5db', borderRadius: 16, padding: 40, textAlign: 'center', background: '#fafafa', cursor: 'pointer' },
  fileInput: { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' },
  dropzoneLabel: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#6b7280', fontWeight: 500, pointerEvents: 'none' },
  videoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 20 },
  videoWrapper: { position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#111827', border: '1px solid #374151' },
  videoPreview: { width: '100%', height: 160, objectFit: 'cover' as const, display: 'block' },
  videoMeta: { display: 'flex', alignItems: 'center', padding: '8px 12px', background: '#1f2937' },
  videoName: { fontSize: 12, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, flex: 1 },
  removeBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  progressBar: { height: 6, background: '#e5e7eb', borderRadius: 3, marginTop: 16, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#f59e0b,#d97706)', transition: 'width 0.3s' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  btnPrimary: { padding: '14px 28px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' },
  btnSecondary: { padding: '14px 28px', background: '#f3f4f6', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};
