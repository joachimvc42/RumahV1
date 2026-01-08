'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';

export default function NewRentalPage() {
  const router = {
    push: (path: string) => window.location.href = path,
    back: () => window.history.back()
  };
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Property fields
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

  // Rental specific fields
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [minDuration, setMinDuration] = useState('1');
  const [maxDuration, setMaxDuration] = useState('12');
  const [upfrontMonths, setUpfrontMonths] = useState('0');
  const [availableFrom, setAvailableFrom] = useState('');
  const [legalChecked, setLegalChecked] = useState(false);

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

  const uploadImages = async (propertyId: string): Promise<string[]> => {
    const urls: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('propertyId', propertyId);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          urls.push(data.url);
        }
      } catch (err) {
        console.error('Upload error:', err);
      }

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
      const propertyResponse = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          status: 'available',
          property_type: 'rental',
        })
      });

      if (!propertyResponse.ok) throw new Error('Erreur lors de la création du bien');
      
      const propertyData = await propertyResponse.json();
      const propertyId = propertyData.id;

      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImages(propertyId);
        
        await fetch(`/api/properties/${propertyId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: imageUrls })
        });
      }

      const rentalResponse = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyId,
          monthly_price_idr: Number(monthlyPrice),
          min_duration_months: Number(minDuration),
          max_duration_months: Number(maxDuration),
          upfront_months: Number(upfrontMonths),
          available_from: availableFrom || null,
          legal_checked: legalChecked,
        })
      });

      if (!rentalResponse.ok) throw new Error('Erreur lors de la création de la location');

      router.push('/admin/rentals');
    } catch (err: any) {
      console.error('Error creating rental:', err);
      setError(err.message || 'Une erreur est survenue lors de la création du bien');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Ajouter un bien locatif</h1>
      
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.form}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📍 Informations du bien</h2>
          
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Titre du bien *</label>
              <input
                style={styles.input}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Villa moderne avec piscine"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Localisation *</label>
              <input
                style={styles.input}
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ex: Kuta, Lombok"
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
                placeholder="150"
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
                placeholder="5"
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
                placeholder="25000000"
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
                placeholder="0"
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
            <span>✅ Legal documents verified</span>
          </label>
        </section>

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

        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => router.back()}
            style={styles.btnSecondary}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={styles.btnPrimary}
          >
            {loading ? 'Création en cours...' : '✓ Créer le bien locatif'}
          </button>
        </div>
      </div>
    </div>
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
    transition: 'all 0.2s',
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
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  dropzone: {
    position: 'relative',
    border: '2px dashed #d1d5db',
    borderRadius: 16,
    padding: 40,
    textAlign: 'center',
    background: '#fafafa',
    transition: 'all 0.2s',
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
    justifyContent: 'flex-end',
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
};