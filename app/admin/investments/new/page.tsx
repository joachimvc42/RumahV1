'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';

export default function NewInvestmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Asset type
  const [assetType, setAssetType] = useState<'villa' | 'land'>('villa');

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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (assetId: string): Promise<string[]> => {
    const urls: string[] = [];
    const bucket = assetType === 'villa' ? 'properties' : 'lands';
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const ext = file.name.split('.').pop();
      const path = `investments/${assetId}/${Date.now()}_${i}.${ext}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      urls.push(data.publicUrl);

      setUploadProgress(Math.round(((i + 1) / images.length) * 100));
    }

    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      let assetId: string;

      if (assetType === 'villa') {
        // Create property
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .insert({
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
            status: 'available',
            property_type: 'investment',
          })
          .select('id')
          .single();

        if (propertyError) throw propertyError;
        assetId = propertyData.id;

        // Upload images
        if (images.length > 0) {
          const imageUrls = await uploadImages(assetId);
          await supabase
            .from('properties')
            .update({ images: imageUrls })
            .eq('id', assetId);
        }
      } else {
        // Create land
        const { data: landData, error: landError } = await supabase
          .from('lands')
          .insert({
            title,
            location,
            description,
            land_size: landArea ? Number(landArea) : null,
            price_per_are: Number(price),
            currency,
            tenure,
            lease_years: tenure === 'leasehold' ? Number(leaseDuration) : null,
            zoning: 'investment',
          })
          .select('id')
          .single();

        if (landError) throw landError;
        assetId = landData.id;

        // Upload images
        if (images.length > 0) {
          const imageUrls = await uploadImages(assetId);
          await supabase
            .from('lands')
            .update({ images: imageUrls })
            .eq('id', assetId);
        }
      }

      // Create investment entry
      const { error: investmentError } = await supabase
        .from('investments')
        .insert({
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
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Ajouter un investissement</h1>
        <Link href="/admin/investments" style={styles.backLink}>
          ← Retour
        </Link>
      </div>
      
      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Asset Type Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🏷️ Type d'actif</h2>
          
          <div style={styles.typeSelector}>
            <button
              type="button"
              onClick={() => setAssetType('villa')}
              style={{
                ...styles.typeBtn,
                ...(assetType === 'villa' ? styles.typeBtnActive : {}),
              }}
            >
              🏠 Villa
            </button>
            <button
              type="button"
              onClick={() => setAssetType('land')}
              style={{
                ...styles.typeBtn,
                ...(assetType === 'land' ? styles.typeBtnActive : {}),
              }}
            >
              🌴 Terrain
            </button>
          </div>
        </section>

        {/* Property/Land Information */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            📍 Informations {assetType === 'villa' ? 'de la villa' : 'du terrain'}
          </h2>
          
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Titre *</label>
              <input
                style={styles.input}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={assetType === 'villa' ? 'Ex: Villa de luxe vue mer' : 'Ex: Terrain constructible Kuta'}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Localisation *</label>
              <input
                style={styles.input}
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ex: Senggigi, Lombok"
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
              placeholder="Description détaillée du bien..."
              rows={4}
            />
          </div>

          {assetType === 'villa' && (
            <div style={styles.grid4}>
              <div style={styles.field}>
                <label style={styles.label}>Chambres</label>
                <input
                  style={styles.input}
                  type="number"
                  value={bedrooms}
                  onChange={e => setBedrooms(e.target.value)}
                  placeholder="3"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Salles de bain</label>
                <input
                  style={styles.input}
                  type="number"
                  value={bathrooms}
                  onChange={e => setBathrooms(e.target.value)}
                  placeholder="2"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Surface (m²)</label>
                <input
                  style={styles.input}
                  type="number"
                  value={builtArea}
                  onChange={e => setBuiltArea(e.target.value)}
                  placeholder="200"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Terrain (are)</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.1"
                  value={landArea}
                  onChange={e => setLandArea(e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>
          )}

          {assetType === 'land' && (
            <div style={styles.field}>
              <label style={styles.label}>Surface du terrain (are) *</label>
              <input
                style={styles.input}
                type="number"
                step="0.1"
                value={landArea}
                onChange={e => setLandArea(e.target.value)}
                placeholder="15"
                required
              />
            </div>
          )}

          {assetType === 'villa' && (
            <div style={styles.amenities}>
              <label style={styles.checkbox}>
                <input type="checkbox" checked={pool} onChange={e => setPool(e.target.checked)} />
                <span>🏊 Piscine</span>
              </label>
              <label style={styles.checkbox}>
                <input type="checkbox" checked={garden} onChange={e => setGarden(e.target.checked)} />
                <span>🌳 Jardin</span>
              </label>
              <label style={styles.checkbox}>
                <input type="checkbox" checked={furnished} onChange={e => setFurnished(e.target.checked)} />
                <span>🛋️ Meublé</span>
              </label>
            </div>
          )}
        </section>

        {/* Investment Terms */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>💰 Conditions d'investissement</h2>
          
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>
                Prix {assetType === 'land' ? '(par are)' : ''} *
              </label>
              <div style={styles.priceInput}>
                <input
                  style={{ ...styles.input, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder={assetType === 'villa' ? '350000' : '50000000'}
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
              <label style={styles.label}>Rendement estimé (%/an)</label>
              <input
                style={styles.input}
                type="number"
                step="0.1"
                value={expectedYield}
                onChange={e => setExpectedYield(e.target.value)}
                placeholder="8.5"
              />
            </div>
          </div>

          {/* Tenure Type */}
          <div style={styles.field}>
            <label style={styles.label}>Type de propriété *</label>
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
                <span style={styles.tenureDesc}>Propriété pleine</span>
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
                <span style={styles.tenureDesc}>Bail longue durée</span>
              </button>
            </div>
          </div>

          {tenure === 'leasehold' && (
            <div style={styles.field}>
              <label style={styles.label}>Durée du bail (années) *</label>
              <input
                style={styles.input}
                type="number"
                value={leaseDuration}
                onChange={e => setLeaseDuration(e.target.value)}
                placeholder="25"
                required
              />
            </div>
          )}

          <div style={styles.checkboxRow}>
            <label style={styles.checkbox}>
              <input type="checkbox" checked={legalChecked} onChange={e => setLegalChecked(e.target.checked)} />
              <span>✅ Documents légaux vérifiés</span>
            </label>
            <label style={styles.checkbox}>
              <input type="checkbox" checked={managementAvailable} onChange={e => setManagementAvailable(e.target.checked)} />
              <span>🏢 Gestion locative disponible</span>
            </label>
          </div>
        </section>

        {/* Image Gallery */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📸 Galerie photos</h2>
          
          <div style={styles.dropzone}>
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
              <span>Cliquez ou glissez vos images ici</span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>PNG, JPG jusqu'à 10MB chacune</span>
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div style={styles.gallery}>
              {imagePreviews.map((preview, index) => (
                <div key={index} style={styles.imageWrapper}>
                  <img src={preview} alt={`Preview ${index + 1}`} style={styles.preview} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={styles.removeBtn}
                  >
                    ✕
                  </button>
                  {index === 0 && <span style={styles.mainBadge}>Photo principale</span>}
                </div>
              ))}
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
            </div>
          )}
        </section>

        {/* Submit */}
        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => router.back()}
            style={styles.btnSecondary}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            style={styles.btnPrimary}
          >
            {loading ? 'Création en cours...' : '✓ Créer l\'investissement'}
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
  typeSelector: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  typeBtn: {
    padding: 24,
    borderRadius: 12,
    border: '2px solid #e5e7eb',
    background: '#f9fafb',
    cursor: 'pointer',
    fontSize: 18,
    fontWeight: 700,
    transition: 'all 0.2s',
  },
  typeBtnActive: {
    borderColor: '#2563eb',
    background: '#eff6ff',
    color: '#2563eb',
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
    marginTop: 20,
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
    justifyContent: 'flex-end',
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
};
