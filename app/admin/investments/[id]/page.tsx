'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';

export default function EditInvestmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Investment data
  const [investment, setInvestment] = useState<any>(null);
  const [assetType, setAssetType] = useState<'property' | 'land'>('property');

  // Property/Land fields
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

  // Investment fields
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('USD');
  const [tenure, setTenure] = useState<'freehold' | 'leasehold'>('freehold');
  const [leaseDuration, setLeaseDuration] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [legalChecked, setLegalChecked] = useState(false);
  const [managementAvailable, setManagementAvailable] = useState(true);

  // Images
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const load = async () => {
      // Get investment
      const { data: inv, error: invErr } = await supabase
        .from('investments')
        .select('*')
        .eq('id', id)
        .single();

      if (invErr || !inv) {
        setError('Investment not found');
        setLoading(false);
        return;
      }

      setInvestment(inv);
      setAssetType(inv.asset_type);
      setExpectedYield(String(inv.expected_yield || ''));
      setLegalChecked(inv.legal_checked || false);
      setManagementAvailable(inv.management_available || false);

      // Get asset details
      if (inv.asset_type === 'property') {
        const { data: prop } = await supabase
          .from('properties')
          .select('*')
          .eq('id', inv.asset_id)
          .single();

        if (prop) {
          setTitle(prop.title || '');
          setLocation(prop.location || '');
          setDescription(prop.description || '');
          setBedrooms(String(prop.bedrooms || ''));
          setBathrooms(String(prop.bathrooms || ''));
          setBuiltArea(String(prop.built_area || ''));
          setLandArea(String(prop.land_area || ''));
          setPool(prop.pool || false);
          setGarden(prop.garden || false);
          setFurnished(prop.furnished ?? true);
          setPrice(String(prop.price || ''));
          setCurrency(prop.currency || 'USD');
          setTenure(prop.tenure || 'freehold');
          setLeaseDuration(String(prop.lease_years || ''));
          setExistingImages(prop.images || []);
        }
      } else {
        const { data: land } = await supabase
          .from('lands')
          .select('*')
          .eq('id', inv.asset_id)
          .single();

        if (land) {
          setTitle(land.title || '');
          setLocation(land.location || '');
          setDescription(land.description || '');
          setLandArea(String(land.land_size || ''));
          setPrice(String(land.price_per_are || ''));
          setCurrency(land.currency || 'IDR');
          setTenure(land.tenure || 'freehold');
          setLeaseDuration(String(land.lease_years || ''));
          setExistingImages(land.images || []);
        }
      }

      setLoading(false);
    };

    load();
  }, [id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setNewImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewImagePreviews(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    const bucket = assetType === 'property' ? 'properties' : 'lands';
    
    for (let i = 0; i < newImages.length; i++) {
      const file = newImages[i];
      const ext = file.name.split('.').pop();
      const path = `investments/${investment.asset_id}/${Date.now()}_${i}.${ext}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      urls.push(data.publicUrl);

      setUploadProgress(Math.round(((i + 1) / newImages.length) * 100));
    }

    return urls;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Upload new images
      let allImages = [...existingImages];
      if (newImages.length > 0) {
        const uploadedUrls = await uploadImages();
        allImages = [...allImages, ...uploadedUrls];
      }

      // Update asset
      if (assetType === 'property') {
        await supabase
          .from('properties')
          .update({
            title,
            location,
            description,
            bedrooms: bedrooms ? Number(bedrooms) : null,
            bathrooms: bathrooms ? Number(bathrooms) : null,
            built_area: builtArea ? Number(builtArea) : null,
            land_area: landArea ? Number(landArea) : null,
            pool,
            garden,
            furnished,
            price: Number(price),
            currency,
            tenure,
            lease_years: tenure === 'leasehold' ? Number(leaseDuration) : null,
            images: allImages,
          })
          .eq('id', investment.asset_id);
      } else {
        await supabase
          .from('lands')
          .update({
            title,
            location,
            description,
            land_size: landArea ? Number(landArea) : null,
            price_per_are: Number(price),
            currency,
            tenure,
            lease_years: tenure === 'leasehold' ? Number(leaseDuration) : null,
            images: allImages,
          })
          .eq('id', investment.asset_id);
      }

      // Update investment
      await supabase
        .from('investments')
        .update({
          expected_yield: expectedYield ? Number(expectedYield) : null,
          legal_checked: legalChecked,
          management_available: managementAvailable,
        })
        .eq('id', id);

      router.push('/admin/investments');
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this investment? This action is irreversible.')) return;

    setSaving(true);
    try {
      await supabase.from('investments').delete().eq('id', id);
      router.push('/admin/investments');
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Edit investment</h1>
        <Link href="/admin/investments" style={styles.backLink}>
          ← Retour
        </Link>
      </div>
      
      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSave} style={styles.form}>
        {/* Asset Type Display */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🏷️ Asset type</h2>
          <div style={styles.assetTypeDisplay}>
            {assetType === 'property' ? '🏠 Villa' : '🌴 Land'}
          </div>
        </section>

        {/* Property/Land Information */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            📍 {assetType === 'property' ? 'Villa' : 'Land'} information
          </h2>
          
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Title *</label>
              <input
                style={styles.input}
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Location *</label>
              <input
                style={styles.input}
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {assetType === 'property' && (
            <>
              <div style={styles.grid4}>
                <div style={styles.field}>
                  <label style={styles.label}>Bedrooms</label>
                  <input
                    style={styles.input}
                    type="number"
                    value={bedrooms}
                    onChange={e => setBedrooms(e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Bathrooms</label>
                  <input
                    style={styles.input}
                    type="number"
                    value={bathrooms}
                    onChange={e => setBathrooms(e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Surface (m²)</label>
                  <input
                    style={styles.input}
                    type="number"
                    value={builtArea}
                    onChange={e => setBuiltArea(e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Land (are)</label>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.1"
                    value={landArea}
                    onChange={e => setLandArea(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.amenities}>
                <label style={styles.checkbox}>
                  <input type="checkbox" checked={pool} onChange={e => setPool(e.target.checked)} />
                  <span>🏊 Pool</span>
                </label>
                <label style={styles.checkbox}>
                  <input type="checkbox" checked={garden} onChange={e => setGarden(e.target.checked)} />
                  <span>🌳 Garden</span>
                </label>
                <label style={styles.checkbox}>
                  <input type="checkbox" checked={furnished} onChange={e => setFurnished(e.target.checked)} />
                  <span>🛋️ Furnished</span>
                </label>
              </div>
            </>
          )}

          {assetType === 'land' && (
            <div style={styles.field}>
              <label style={styles.label}>Land area (are) *</label>
              <input
                style={styles.input}
                type="number"
                step="0.1"
                value={landArea}
                onChange={e => setLandArea(e.target.value)}
                required
              />
            </div>
          )}
        </section>

        {/* Investment Terms */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>💰 Investment conditions</h2>
          
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>
                Price {assetType === 'land' ? '(per are)' : ''} *
              </label>
              <div style={styles.priceInput}>
                <input
                  style={{ ...styles.input, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                />
                <select
                  style={styles.currencySelect}
                  value={currency}
                  onChange={e => setCurrency(e.target.value as 'USD' | 'IDR')}
                >
                  <option value="USD">USD</option>
                  <option value="IDR">IDR</option>
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Estimated yield (%/year)</label>
              <input
                style={styles.input}
                type="number"
                step="0.1"
                value={expectedYield}
                onChange={e => setExpectedYield(e.target.value)}
              />
            </div>
          </div>

          {/* Tenure Type */}
          <div style={styles.field}>
            <label style={styles.label}>Property type *</label>
            <div style={styles.tenureSelector}>
              <button
                type="button"
                onClick={() => setTenure('freehold')}
                style={{
                  ...styles.tenureBtn,
                  ...(tenure === 'freehold' ? styles.tenureBtnActive : {}),
                }}
              >
                <span style={{ fontSize: 24 }}>🔑</span>
                <span style={styles.tenureLabel}>Freehold</span>
                <span style={styles.tenureDesc}>Full ownership</span>
              </button>
              <button
                type="button"
                onClick={() => setTenure('leasehold')}
                style={{
                  ...styles.tenureBtn,
                  ...(tenure === 'leasehold' ? styles.tenureBtnActive : {}),
                }}
              >
                <span style={{ fontSize: 24 }}>📋</span>
                <span style={styles.tenureLabel}>Leasehold</span>
                <span style={styles.tenureDesc}>Long-term lease</span>
              </button>
            </div>
          </div>

          {tenure === 'leasehold' && (
            <div style={styles.field}>
              <label style={styles.label}>Lease duration (years) *</label>
              <input
                style={styles.input}
                type="number"
                value={leaseDuration}
                onChange={e => setLeaseDuration(e.target.value)}
                required
              />
            </div>
          )}

          <div style={styles.checkboxRow}>
            <label style={styles.checkbox}>
              <input type="checkbox" checked={legalChecked} onChange={e => setLegalChecked(e.target.checked)} />
              <span>✅ Legal documents verified</span>
            </label>
            <label style={styles.checkbox}>
              <input type="checkbox" checked={managementAvailable} onChange={e => setManagementAvailable(e.target.checked)} />
              <span>🏢 Rental management available</span>
            </label>
          </div>
        </section>

        {/* Image Gallery */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📸 Photo gallery</h2>
          
          {/* Existing images */}
          {existingImages.length > 0 && (
            <>
              <p style={{ marginBottom: 12, color: '#6b7280', fontSize: 14 }}>Current images:</p>
              <div style={styles.gallery}>
                {existingImages.map((url, index) => (
                  <div key={url} style={styles.imageWrapper}>
                    <img src={url} alt={`Image ${index + 1}`} style={styles.preview} />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      style={styles.removeBtn}
                    >
                      ✕
                    </button>
                    {index === 0 && <span style={styles.mainBadge}>Main photo</span>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Upload new images */}
          <div style={{ ...styles.dropzone, marginTop: existingImages.length > 0 ? 20 : 0 }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              style={styles.fileInput}
              id="image-upload"
            />
            <label htmlFor="image-upload" style={styles.dropzoneLabel}>
              <span style={{ fontSize: 40 }}>📷</span>
              <span>Add images</span>
            </label>
          </div>

          {/* New images preview */}
          {newImagePreviews.length > 0 && (
            <>
              <p style={{ marginTop: 20, marginBottom: 12, color: '#6b7280', fontSize: 14 }}>New images:</p>
              <div style={styles.gallery}>
                {newImagePreviews.map((preview, index) => (
                  <div key={index} style={styles.imageWrapper}>
                    <img src={preview} alt={`New ${index + 1}`} style={styles.preview} />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      style={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
            </div>
          )}
        </section>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            style={styles.btnDanger}
          >
            🗑️ Delete
          </button>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={() => router.back()}
            style={styles.btnSecondary}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={styles.btnPrimary}
          >
            {saving ? 'Saving...' : '✓ Save'}
          </button>
        </div>
      </form>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 24,
    maxWidth: 900,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#111827',
    margin: 0,
  },
  backLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
    padding: '12px 16px',
    borderRadius: 8,
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  section: {
    background: '#ffffff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '1px solid #e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '2px solid #f3f4f6',
    color: '#374151',
  },
  assetTypeDisplay: {
    padding: 20,
    background: '#fef3c7',
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#4b5563',
  },
  input: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '2px solid #e5e7eb',
    fontSize: 15,
    outline: 'none',
  },
  textarea: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '2px solid #e5e7eb',
    fontSize: 15,
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  priceInput: {
    display: 'flex',
  },
  currencySelect: {
    padding: '12px 14px',
    borderRadius: '0 10px 10px 0',
    border: '2px solid #e5e7eb',
    borderLeft: 'none',
    fontSize: 15,
    background: '#f9fafb',
    fontWeight: 600,
  },
  tenureSelector: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginTop: 8,
  },
  tenureBtn: {
    padding: 20,
    borderRadius: 12,
    border: '2px solid #e5e7eb',
    background: '#f9fafb',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.2s',
  },
  tenureBtnActive: {
    borderColor: '#059669',
    background: '#ecfdf5',
  },
  tenureLabel: {
    fontSize: 16,
    fontWeight: 700,
    color: '#111827',
  },
  tenureDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
  amenities: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: '#f9fafb',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
  },
  checkboxRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  dropzone: {
    position: 'relative',
    border: '2px dashed #d1d5db',
    borderRadius: 16,
    padding: 40,
    textAlign: 'center',
    background: '#fafafa',
    cursor: 'pointer',
  },
  fileInput: {
    position: 'absolute',
    inset: 0,
    opacity: 0,
    cursor: 'pointer',
  },
  dropzoneLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    color: '#6b7280',
    fontWeight: 500,
    pointerEvents: 'none',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: 12,
  },
  imageWrapper: {
    position: 'relative',
    aspectRatio: '4/3',
    borderRadius: 12,
    overflow: 'hidden',
    background: '#f3f4f6',
  },
  preview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
  },
  mainBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center',
    padding: '4px 0',
  },
  progressBar: {
    height: 6,
    background: '#e5e7eb',
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #f59e0b, #d97706)',
    transition: 'width 0.3s',
  },
  actions: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
  },
  btnPrimary: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
  },
  btnSecondary: {
    padding: '14px 28px',
    background: '#f3f4f6',
    color: '#374151',
    border: '2px solid #e5e7eb',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnDanger: {
    padding: '14px 20px',
    background: '#fef2f2',
    color: '#b91c1c',
    border: '2px solid #fca5a5',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
