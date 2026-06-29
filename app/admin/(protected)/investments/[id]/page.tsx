'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../../lib/supabaseClient';
import { uploadFileWithProgress, makeProgressTracker } from '../../../../../lib/supabaseStorage';
import { partitionValidFiles } from '../../../../../lib/mediaValidation';
import { normalizeStatus, type PropertyStatus } from '../../../../../lib/statusUtils';
import { urlsToGalleryItems, readFileAsDataURL, type SortableGalleryItem } from '../../../../../lib/galleryUtils';
import AdminImageGallery from '../../../../../components/admin/AdminImageGallery';
import MapPicker from '../../../../../components/MapPicker';
import LocationInput from '../../../../../components/LocationInput';
import { useAdminLang } from '../../../../../lib/adminI18n';

type VideoItem = {
  id: string;
  previewSrc: string;
  file?: File;
  name: string;
  isExisting?: boolean;
};

export default function EditInvestmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useAdminLang();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [investment, setInvestment] = useState<any>(null);
  const [assetType, setAssetType] = useState<'property' | 'land'>('property');
  const [reference, setReference] = useState('');

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [builtArea, setBuiltArea] = useState('');
  const [landArea, setLandArea] = useState('');
  const [pool, setPool] = useState(false);
  const [garden, setGarden] = useState(false);
  const [furnished, setFurnished] = useState(true);
  const [seaView, setSeaView] = useState(false);
  const [hasWater, setHasWater] = useState(false);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [hasRoad, setHasRoad] = useState(false);

  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('USD');
  const [tenure, setTenure] = useState<'freehold' | 'leasehold'>('freehold');
  const [leaseDuration, setLeaseDuration] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [legalChecked, setLegalChecked] = useState(false);
  const [managementAvailable, setManagementAvailable] = useState(true);
  const [status, setStatus] = useState<PropertyStatus>('draft');

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [galleryItems, setGalleryItems] = useState<SortableGalleryItem[]>([]);
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);

  // Single accurate save-progress: byte-weighted across ALL new media (photos + videos).
  const [uploadPct, setUploadPct] = useState(0);
  const [savePhase, setSavePhase] = useState<'idle' | 'uploading' | 'finalizing'>('idle');
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: inv, error: invErr } = await supabase.from('investments').select('*').eq('id', id).single();
      if (invErr || !inv) { setError(t.notFound); setLoading(false); return; }

      setInvestment(inv);
      setAssetType(inv.asset_type);
      setReference(inv.reference || '');
      setExpectedYield(String(inv.expected_yield || ''));
      setLegalChecked(inv.legal_checked || false);
      setManagementAvailable(inv.management_available || false);

      if (inv.asset_type === 'property') {
        const { data: prop } = await supabase.from('properties').select('*').eq('id', inv.asset_id).single();
        if (prop) {
          setTitle(prop.title || ''); setLocation(prop.location || ''); setDescription(prop.description || ''); setWhatsapp(prop.whatsapp || '');
          setBedrooms(String(prop.bedrooms || '')); setBathrooms(String(prop.bathrooms || ''));
          setBuiltArea(String(prop.built_area || '')); setLandArea(String(prop.land_area || ''));
          setPool(prop.pool || false); setGarden(prop.garden || false); setFurnished(prop.furnished ?? true);
          setSeaView(prop.sea_view || false);
          setPrice(prop.price ? String((prop.currency || 'USD') === 'IDR' ? Number(prop.price) / 1_000_000 : prop.price) : '');
          setCurrency(prop.currency || 'USD');
          setTenure(prop.tenure || 'freehold'); setLeaseDuration(String(prop.lease_years || ''));
          setStatus((prop.status as PropertyStatus) || 'draft');
          if (prop.latitude != null) setLat(Number(prop.latitude));
          if (prop.longitude != null) setLng(Number(prop.longitude));
          setGalleryItems(urlsToGalleryItems(prop.images || []));
          if (prop.videos && Array.isArray(prop.videos)) {
            setVideoItems(prop.videos.map((url: string, i: number) => ({
              id: `existing-${i}-${url.slice(-16)}`,
              previewSrc: url,
              name: url.split('/').pop() || `video_${i + 1}`,
              isExisting: true,
            })));
          }
        }
      } else {
        const { data: land } = await supabase.from('lands').select('*').eq('id', inv.asset_id).single();
        if (land) {
          setTitle(land.title || ''); setLocation(land.location || ''); setDescription(land.description || ''); setWhatsapp(land.whatsapp || '');
          setLandArea(String(land.land_size || ''));
          setPrice(land.price_per_are ? String((land.currency || 'IDR') === 'IDR' ? Number(land.price_per_are) / 1_000_000 : land.price_per_are) : '');
          setCurrency(land.currency || 'IDR'); setTenure(land.tenure || 'freehold');
          setLeaseDuration(String(land.lease_years || ''));
          setStatus((land.status as PropertyStatus) || 'draft');
          setHasWater(land.has_water || false);
          setHasElectricity(land.has_electricity || false);
          setHasRoad(land.has_road || false);
          setSeaView(land.sea_view || false);
          if (land.latitude != null) setLat(Number(land.latitude));
          if (land.longitude != null) setLng(Number(land.longitude));
          setGalleryItems(urlsToGalleryItems(land.images || []));
          if (land.videos && Array.isArray(land.videos)) {
            setVideoItems(land.videos.map((url: string, i: number) => ({
              id: `existing-${i}-${url.slice(-16)}`,
              previewSrc: url,
              name: url.split('/').pop() || `video_${i + 1}`,
              isExisting: true,
            })));
          }
        }
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const { valid, error: rejectMsg } = partitionValidFiles(files, 'image');
    setImageError(rejectMsg);
    const added: SortableGalleryItem[] = [];
    for (const file of valid) {
      const previewSrc = await readFileAsDataURL(file);
      added.push({ id: crypto.randomUUID(), previewSrc, file, mediaType: 'image' as const });
    }
    if (added.length > 0) setGalleryItems(prev => [...prev, ...added]);
    e.target.value = '';
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const { valid, error: rejectMsg } = partitionValidFiles(files, 'video');
    setVideoError(rejectMsg);
    const added: VideoItem[] = valid.map(file => ({
      id: crypto.randomUUID(),
      previewSrc: URL.createObjectURL(file),
      file,
      name: file.name,
      isExisting: false,
    }));
    if (added.length > 0) setVideoItems(prev => [...prev, ...added]);
    e.target.value = '';
  };

  const removeVideo = (id: string) => {
    setVideoItems(prev => {
      const item = prev.find(v => v.id === id);
      if (item && !item.isExisting) URL.revokeObjectURL(item.previewSrc);
      return prev.filter(v => v.id !== id);
    });
  };

  // Uploads new photos + videos with REAL byte progress (existing URLs pass through,
  // order preserved). The bar only reaches 100% once every byte is on the server.
  const uploadOrderedMedia = async (): Promise<{ allImages: string[]; allVideos: string[] }> => {
    if (!investment?.asset_id) return { allImages: [], allVideos: [] };
    const bucket = assetType === 'property' ? 'properties' : 'lands';

    const newImageBytes = galleryItems.reduce((sum, g) => sum + (g.file?.size || 0), 0);
    const newVideoBytes = videoItems.reduce((sum, v) => sum + (!v.isExisting && v.file ? v.file.size : 0), 0);
    const tracker = makeProgressTracker(newImageBytes + newVideoBytes, setUploadPct);

    const allImages: string[] = [];
    for (let i = 0; i < galleryItems.length; i++) {
      const item = galleryItems[i];
      if (item.file) {
        const ext = item.file.name.split('.').pop();
        const path = `investments/${investment.asset_id}/${Date.now()}_${i}.${ext}`;
        const t = tracker.track(item.file.size);
        const url = await uploadFileWithProgress(bucket, path, item.file, t.onProgress);
        t.done();
        allImages.push(url);
      } else {
        allImages.push(item.previewSrc);
      }
    }

    const allVideos: string[] = [];
    for (let i = 0; i < videoItems.length; i++) {
      const item = videoItems[i];
      if (item.isExisting) {
        allVideos.push(item.previewSrc);
      } else if (item.file) {
        const ext = item.name.split('.').pop();
        const path = `investments/${investment.asset_id}/videos/${Date.now()}_${i}.${ext}`;
        const t = tracker.track(item.file.size);
        const url = await uploadFileWithProgress(bucket, path, item.file, t.onProgress);
        t.done();
        allVideos.push(url);
      }
    }

    return { allImages, allVideos };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setUploadPct(0);
    setSavePhase('uploading');

    try {
      const { allImages, allVideos } = await uploadOrderedMedia();
      setSavePhase('finalizing');

      if (assetType === 'property') {
        const { error: propErr } = await supabase.from('properties').update({
          title, location, description, whatsapp,
          bedrooms: bedrooms ? Number(bedrooms) : null,
          bathrooms: bathrooms ? Number(bathrooms) : null,
          built_area: builtArea ? Number(builtArea) : null,
          land_area: landArea ? Number(landArea) : null,
          pool, garden, furnished,
          sea_view: seaView,
          price: currency === 'IDR' ? Number(price) * 1_000_000 : Number(price),
          currency, tenure,
          lease_years: tenure === 'leasehold' ? Number(leaseDuration) : null,
          images: allImages, videos: allVideos,
          status: normalizeStatus(status),
          latitude: lat, longitude: lng,
        }).eq('id', investment.asset_id);
        if (propErr) throw propErr;
      } else {
        const { error: landErr } = await supabase.from('lands').update({
          title, location, description, whatsapp,
          land_size: landArea ? Number(landArea) : null,
          price_per_are: currency === 'IDR' ? Number(price) * 1_000_000 : Number(price),
          currency, tenure,
          lease_years: tenure === 'leasehold' ? Number(leaseDuration) : null,
          images: allImages, videos: allVideos,
          status: normalizeStatus(status),
          sea_view: seaView,
          has_water: hasWater,
          has_electricity: hasElectricity,
          has_road: hasRoad,
          latitude: lat, longitude: lng,
        }).eq('id', investment.asset_id);
        if (landErr) throw landErr;
      }

      await supabase.from('investments').update({
        expected_yield: expectedYield ? Number(expectedYield) : null,
        legal_checked: legalChecked,
        management_available: assetType === 'property' ? managementAvailable : false,
      }).eq('id', id);

      router.push('/admin/investments');
    } catch (err: any) {
      setError(err.message || t.saveFail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
      setSavePhase('idle');
    }
  };

  const handleDelete = async () => {
    if (!confirm(t.deleteConfirm)) return;
    setSaving(true);
    try {
      await supabase.from('investments').delete().eq('id', id);
      router.push('/admin/investments');
    } catch (err: any) {
      setError(err.message || t.deleteFail);
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>{t.loadingShort}</div>;

  return (
    <main className="adm-wrap">
      <div style={s.header}>
        <h1 style={s.title}>{t.editTitle}</h1>
        <Link href="/admin/investments" style={s.backLink}>{t.backToList}</Link>
      </div>
      {error && <div style={s.error}>{error}</div>}

      <form onSubmit={handleSave} style={s.form}>
        {/* ── Asset type display ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>{t.assetTypeH}</h2>
          <div style={s.assetTypeDisplay}>{assetType === 'property' ? `🏠 ${t.villa}` : `🌴 ${t.land}`}</div>
        </section>

        {/* ── Property/Land info ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>{assetType === 'property' ? t.villaInfoH : t.landInfoH}</h2>
          <div className="adm-g2">
            <div style={s.field}><label style={s.label}>{t.titleL}</label><input style={s.input} value={title} onChange={e => setTitle(e.target.value)} required /></div>
            <div style={s.field}><label style={s.label}>{t.locationFieldL}</label><LocationInput value={location} onChange={setLocation} required /></div>
          </div>
          {reference && (
            <div style={s.field}>
              <label style={s.label}>{t.referenceAuto}</label>
              <div style={{ padding: '10px 14px', background: '#f5eedc', border: '1px solid #DDD6C8', borderRadius: 10, fontSize: 15, fontWeight: 700, color: '#7A6030', letterSpacing: '0.05em' }}>
                🔖 {reference}
              </div>
            </div>
          )}
          <div style={s.field}><label style={s.label}>{t.descriptionL}</label><textarea style={s.textarea} value={description} onChange={e => setDescription(e.target.value)} rows={4} /></div>
          <div style={s.field}>
            <label style={s.label}>{t.whatsappL}</label>
            <input style={s.input} type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+62 812 3456 7890" required />
            <span style={{ fontSize: 12, color: '#6b7280' }}>{t.whatsappHint}</span>
          </div>
          {assetType === 'property' && (
            <>
              <div className="adm-g4">
                <div style={s.field}><label style={s.label}>{t.bedrooms}</label><input style={s.input} type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} /></div>
                <div style={s.field}><label style={s.label}>{t.bathrooms}</label><input style={s.input} type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} /></div>
                <div style={s.field}><label style={s.label}>{t.builtArea}</label><input style={s.input} type="number" value={builtArea} onChange={e => setBuiltArea(e.target.value)} /></div>
                <div style={s.field}><label style={s.label}>{t.landAreShort}</label><input style={s.input} type="number" step="0.1" value={landArea} onChange={e => setLandArea(e.target.value)} /></div>
              </div>
              <div style={s.amenities}>
                <label style={s.checkbox}><input type="checkbox" checked={pool} onChange={e => setPool(e.target.checked)} /><span>{t.pool}</span></label>
                <label style={s.checkbox}><input type="checkbox" checked={garden} onChange={e => setGarden(e.target.checked)} /><span>{t.garden}</span></label>
                <label style={s.checkbox}><input type="checkbox" checked={furnished} onChange={e => setFurnished(e.target.checked)} /><span>{t.furnished}</span></label>
                <label style={s.checkbox}><input type="checkbox" checked={seaView} onChange={e => setSeaView(e.target.checked)} /><span>{t.seaView}</span></label>
              </div>
            </>
          )}
          {assetType === 'land' && (
            <>
              <div style={s.field}><label style={s.label}>{t.landAreaL}</label><input style={s.input} type="number" step="0.1" value={landArea} onChange={e => setLandArea(e.target.value)} /></div>
              <div style={s.amenities}>
                <label style={s.checkbox}><input type="checkbox" checked={hasWater} onChange={e => setHasWater(e.target.checked)} /><span>{t.waterAccess}</span></label>
                <label style={s.checkbox}><input type="checkbox" checked={hasElectricity} onChange={e => setHasElectricity(e.target.checked)} /><span>{t.electricity}</span></label>
                <label style={s.checkbox}><input type="checkbox" checked={hasRoad} onChange={e => setHasRoad(e.target.checked)} /><span>{t.roadAccess}</span></label>
                <label style={s.checkbox}><input type="checkbox" checked={seaView} onChange={e => setSeaView(e.target.checked)} /><span>{t.seaView}</span></label>
              </div>
            </>
          )}
        </section>

        {/* ── Investment conditions ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>{t.conditionsH}</h2>
          <div className="adm-g2">
            <div style={s.field}>
              <label style={s.label}>{(currency === 'IDR' ? t.priceIdr : t.priceUsd).replace('{per}', assetType === 'land' ? t.perAre : '').replace('  ', ' ')}</label>
              <div style={s.priceInput}>
                <input style={{ ...s.input, borderTopRightRadius: 0, borderBottomRightRadius: 0 }} type="number" step={currency === 'IDR' ? '0.5' : '1'} value={price} onChange={e => setPrice(e.target.value)} required />
                <select style={s.currencySelect} value={currency} onChange={e => setCurrency(e.target.value as any)}>
                  <option value="USD">USD</option>
                  <option value="IDR">IDR (M)</option>
                </select>
              </div>
            </div>
            <div style={s.field}><label style={s.label}>{t.yieldL}</label><input style={s.input} type="number" step="0.1" value={expectedYield} onChange={e => setExpectedYield(e.target.value)} /></div>
          </div>
          <div style={s.field}>
            <label style={s.label}>{t.propertyTypeFieldL}</label>
            <div style={s.tenureSelector}>
              <button type="button" onClick={() => setTenure('freehold')} style={{ ...s.tenureBtn, ...(tenure === 'freehold' ? s.tenureBtnActive : {}) }}>
                <span style={{ fontSize: 24 }}>🔑</span>
                <span style={s.tenureLabel}>{t.freehold}</span>
                <span style={s.tenureDesc}>{t.freeholdDesc}</span>
              </button>
              <button type="button" onClick={() => setTenure('leasehold')} style={{ ...s.tenureBtn, ...(tenure === 'leasehold' ? s.tenureBtnActive : {}) }}>
                <span style={{ fontSize: 24 }}>📋</span>
                <span style={s.tenureLabel}>{t.leasehold}</span>
                <span style={s.tenureDesc}>{t.leaseholdDesc}</span>
              </button>
            </div>
          </div>
          {tenure === 'leasehold' && (
            <div style={s.field}><label style={s.label}>{t.leaseDurationL}</label><input style={s.input} type="number" value={leaseDuration} onChange={e => setLeaseDuration(e.target.value)} /></div>
          )}
          <div style={s.field}>
            <label style={s.label}>{t.statusFieldL}</label>
            <select style={s.input} value={status} onChange={e => setStatus(e.target.value as PropertyStatus)} required>
              <option value="draft">{t.statusDraft}</option>
              <option value="published">{t.statusPublished}</option>
              <option value="paused">{t.statusPaused}</option>
            </select>
          </div>
          <div style={s.checkboxRow}>
            <label style={s.checkbox}><input type="checkbox" checked={legalChecked} onChange={e => setLegalChecked(e.target.checked)} /><span>{t.legalVerified}</span></label>
            {assetType === 'property' && (
              <label style={s.checkbox}><input type="checkbox" checked={managementAvailable} onChange={e => setManagementAvailable(e.target.checked)} /><span>{t.mgmtAvailable}</span></label>
            )}
          </div>
        </section>

        {/* ── Location ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>{t.locationH}</h2>
          <p style={s.sectionHint}>{t.locationHint}</p>
          <MapPicker lat={lat} lng={lng} onChange={(la, lo) => { setLat(la); setLng(lo); }} onClear={() => { setLat(null); setLng(null); }} />
        </section>

        {/* ── Photos ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>{t.photosH}</h2>
          <div style={s.dropzone}>
            <input type="file" accept="image/*" multiple onChange={handleImageSelect} style={s.fileInput} id="image-upload" />
            <label htmlFor="image-upload" style={s.dropzoneLabel}>
              <span style={{ fontSize: 40 }}>📷</span>
              <span>{t.addImages}</span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>{t.photoHint}</span>
            </label>
          </div>
          {imageError && (
            <div style={s.mediaError} role="alert">
              ⚠️ {imageError.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
          <AdminImageGallery items={galleryItems} onChange={setGalleryItems} />
        </section>

        {/* ── Videos ── */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>{t.videosH}</h2>
          <p style={s.sectionHint}>{t.videosEditHint}</p>
          <div style={{ ...s.dropzone, borderColor: '#a5b4fc', background: '#f5f3ff' }}>
            <input type="file" accept="video/mp4,video/mov,video/quicktime,video/webm,video/avi" multiple onChange={handleVideoSelect} style={s.fileInput} id="video-upload" />
            <label htmlFor="video-upload" style={s.dropzoneLabel}>
              <span style={{ fontSize: 40 }}>🎥</span>
              <span>{t.videoDrop}</span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>{t.videoHint}</span>
            </label>
          </div>
          {videoError && (
            <div style={s.mediaError} role="alert">
              ⚠️ {videoError.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
          {videoItems.length > 0 && (
            <div style={s.videoGrid}>
              {videoItems.map(item => (
                <div key={item.id} style={s.videoWrapper}>
                  <video src={item.previewSrc} style={s.videoPreview} controls preload="metadata" />
                  <div style={s.videoMeta}>
                    <span style={s.videoName}>{item.name}</span>
                    {item.isExisting && <span style={s.existingBadge}>{t.savedBadge}</span>}
                  </div>
                  <button type="button" onClick={() => removeVideo(item.id)} style={s.removeBtn} title={t.remove}>✕</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Save progress ── */}
        {saving && (
          <div style={s.saveProgressBox}>
            <div style={s.saveProgressHead}>
              <span style={s.saveProgressLabel}>
                {savePhase === 'finalizing' ? t.finalizingMedia : t.uploadingMedia}
              </span>
              {savePhase === 'uploading' && <span style={s.saveProgressPct}>{uploadPct}%</span>}
            </div>
            <div style={s.progressBar}>
              <div style={{ ...s.progressFill, width: savePhase === 'finalizing' ? '100%' : `${uploadPct}%` }} />
            </div>
            <p style={s.saveProgressHint}>{t.keepOpen}</p>
          </div>
        )}

        {/* ── Actions ── */}
        {error && <div style={s.error}>{error}</div>}
        <div className="adm-actions">
          <button type="button" onClick={handleDelete} disabled={saving} style={s.btnDanger}>{t.deleteBtn}</button>
          <div style={{ flex: 1 }} />
          <button type="button" onClick={() => router.back()} style={s.btnSecondary}>{t.cancel}</button>
          <button type="submit" disabled={saving} style={{ ...s.btnPrimary, opacity: saving ? 0.7 : 1 }}>
            {saving
              ? (savePhase === 'finalizing' ? t.finalizing : `${t.uploading} ${uploadPct}%`)
              : t.saveBtn}
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
  assetTypeDisplay: { padding: 20, background: '#fef3c7', borderRadius: 12, fontSize: 18, fontWeight: 700, textAlign: 'center' as const },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#4b5563' },
  input: { padding: '12px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 16, outline: 'none' },
  textarea: { padding: '12px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 16, resize: 'vertical' as const, fontFamily: 'inherit' },
  priceInput: { display: 'flex' },
  currencySelect: { padding: '12px 14px', borderRadius: '0 10px 10px 0', border: '2px solid #e5e7eb', borderLeft: 'none', fontSize: 16, background: '#f9fafb', fontWeight: 600 },
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
  videoMeta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#1f2937', gap: 8 },
  videoName: { fontSize: 12, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, flex: 1 },
  existingBadge: { fontSize: 10, fontWeight: 700, color: '#34d399', background: 'rgba(52,211,153,0.15)', padding: '2px 8px', borderRadius: 999, flexShrink: 0 },
  removeBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  progressBar: { height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#f59e0b,#d97706)', transition: 'width 0.3s' },
  mediaError: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: 10, marginTop: 12, fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-line' as const },
  saveProgressBox: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column' as const, gap: 8 },
  saveProgressHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  saveProgressLabel: { fontSize: 14, fontWeight: 600, color: '#92400e' },
  saveProgressPct: { fontSize: 14, fontWeight: 800, color: '#b45309', fontVariantNumeric: 'tabular-nums' as const },
  saveProgressHint: { fontSize: 12, color: '#a16207', margin: 0 },
  actions: { display: 'flex', gap: 12, marginTop: 8 },
  btnPrimary: { padding: '14px 28px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' },
  btnSecondary: { padding: '14px 28px', background: '#f3f4f6', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  btnDanger: { padding: '14px 20px', background: '#fef2f2', color: '#b91c1c', border: '2px solid #fca5a5', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};
