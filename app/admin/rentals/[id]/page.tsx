'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';

export default function EditRentalPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Property fields
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

  // Rental fields
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [upfrontMonths, setUpfrontMonths] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [legalChecked, setLegalChecked] = useState(false);

  // Images
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('long_term_rentals')
        .select(`
          *,
          properties (*)
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Rental not found');
        setLoading(false);
        return;
      }

      // Rental fields
      setMonthlyPrice(String(data.monthly_price_idr || ''));
      setMinDuration(String(data.min_duration_months || ''));
      setMaxDuration(String(data.max_duration_months || ''));
      setUpfrontMonths(String(data.upfront_months || ''));
      setAvailableFrom(data.available_from || '');
      setLegalChecked(data.legal_checked || false);

      // Property fields
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
        setExistingImages(p.images || []);
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
    
    for (let i = 0; i < newImages.length; i++) {
      const file = newImages[i];
      const ext = file.name.split('.').pop();
      const path = `rentals/${propertyId}/${Date.now()}_${i}.${ext}`;

      const { error } = await supabase.storage
        .from('properties')
        .upload(path, file, { upsert: true });

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      const { data } = supabase.storage.from('properties').getPublicUrl(path);
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

      // Update property
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
          aircon,
          wifi,
          parking,
          images: allImages,
        })
        .eq('id', propertyId);

      // Update rental
      await supabase
        .from('long_term_rentals')
        .update({
          monthly_price_idr: Number(monthlyPrice),
          min_duration_months: Number(minDuration),
          max_duration_months: Number(maxDuration),
          upfront_months: Number(upfrontMonths),
          available_from: availableFrom || null,
          legal_checked: legalChecked,
        })
        .eq('id', id);

      router.push('/admin/rentals');
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer ce bien locatif ? Cette action est irréversible.')) return;

    setSaving(true);
    try {
      await supabase.from('long_term_rentals').delete().eq('id', id);
      router.push('/admin/rentals');
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Chargement...</div>;
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Modifier le bien locatif</h1>
      
      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSave} style={styles.form}>
        {/* Property Information */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📍 Informations du bien</h2>
          
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Titre du bien *</label>
              <input
                style={styles.input}
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Localisation *</label>
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

          <div style={styles.grid4}>
            <div style={styles.field}>
              <label style={styles.label}>Chambres</label>
              <input
                style={styles.input}
                type="number"
                value={bedrooms}
                onChange={e => setBedrooms(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Salles de bain</label>
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
              <label style={styles.label}>Terrain (are)</label>
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
            <label style={styles.checkbox}>
              <input type="checkbox" checked={aircon} onChange={e => setAircon(e.target.checked)} />
              <span>❄️ Climatisation</span>
            </label>
            <label style={styles.checkbox}>
              <input type="checkbox" checked={wifi} onChange={e => setWifi(e.target.checked)} />
              <span>📶 WiFi</span>
            </label>
            <label style={styles.checkbox}>
              <input type="checkbox" checked={parking} onChange={e => setParking(e.target.checked)} />
              <span>🚗 Parking</span>
            </label>
          </div>
        </section>

        {/* Rental Terms */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>💰 Conditions de location</h2>
          
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Prix mensuel (IDR) *</label>
              <input
                style={styles.input}
                type="number"
                value={monthlyPrice}
                onChange={e => setMonthlyPrice(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Mois d'avance requis</label>
              <input
                style={styles.input}
                type="number"
                value={upfrontMonths}
                onChange={e => setUpfrontMonths(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.grid3}>
            <div style={styles.field}>
              <label style={styles.label}>Durée min (mois)</label>
              <input
                style={styles.input}
                type="number"
                value={minDuration}
                onChange={e => setMinDuration(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Durée max (mois)</label>
              <input
                style={styles.input}
                type="number"
                value={maxDuration}
                onChange={e => setMaxDuration(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Disponible à partir de</label>
              <input
                style={styles.input}
                type="date"
                value={availableFrom}
                onChange={e => setAvailableFrom(e.target.value)}
              />
            </div>
          </div>

          <label style={styles.checkbox}>
            <input type="checkbox" checked={legalChecked} onChange={e => setLegalChecked(e.target.checked)} />
            <span>✅ Documents légaux vérifiés</span>
          </label>
        </section>

        {/* Image Gallery */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📸 Galerie photos</h2>
          
          {/* Existing images */}
          {existingImages.length > 0 && (
            <>
              <p style={{ marginBottom: 12, color: '#6b7280', fontSize: 14 }}>Images actuelles :</p>
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
                    {index === 0 && <span style={styles.mainBadge}>Photo principale</span>}
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
              <span>Ajouter des images</span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>PNG, JPG jusqu'à 10MB chacune</span>
            </label>
          </div>

          {/* New images preview */}
          {newImagePreviews.length > 0 && (
            <>
              <p style={{ marginTop: 20, marginBottom: 12, color: '#6b7280', fontSize: 14 }}>Nouvelles images à ajouter :</p>
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
            🗑️ Supprimer
          </button>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={() => router.back()}
            style={styles.btnSecondary}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            style={styles.btnPrimary}
          >
            {saving ? 'Enregistrement...' : '✓ Enregistrer'}
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
  title: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 24,
    color: '#111827',
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
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
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
    background: 'linear-gradient(135deg, #2563eb, #059669)',
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
    background: 'linear-gradient(90deg, #2563eb, #059669)',
    transition: 'width 0.3s',
  },
  actions: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
  },
  btnPrimary: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #2563eb, #059669)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
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
