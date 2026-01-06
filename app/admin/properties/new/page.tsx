'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '@/lib/supabaseStorage';

export default function NewVillaPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [builtArea, setBuiltArea] = useState('');
  const [landArea, setLandArea] = useState('');
  const [tenure, setTenure] = useState<'freehold' | 'leasehold'>('leasehold');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imagePath: string | null = null;

      if (imageFile) {
        const path = `properties/${crypto.randomUUID()}`;
        imagePath = await uploadImage('properties', path, imageFile);
      }

      const { error: insertError } = await supabase
        .from('properties')
        .insert({
          title,
          location,
          price: Number(price),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          built_area: Number(builtArea),
          land_area: Number(landArea),
          tenure,
          image: imagePath,
        });

      if (insertError) {
        throw insertError;
      }

      router.push('/admin/properties');
    } catch (err: any) {
      setError(err.message ?? 'Failed to create villa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page">
      <h1>Create villa</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Price (USD)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Bedrooms</label>
          <input
            type="number"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Bathrooms</label>
          <input
            type="number"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Built area (sqm)</label>
          <input
            type="number"
            step="0.1"
            value={builtArea}
            onChange={(e) => setBuiltArea(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Land area (are)</label>
          <input
            type="number"
            step="0.1"
            value={landArea}
            onChange={(e) => setLandArea(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Tenure</label>
          <select value={tenure} onChange={(e) => setTenure(e.target.value as any)}>
            <option value="leasehold">Leasehold</option>
            <option value="freehold">Freehold</option>
          </select>
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Create villa'}
          </button>
        </div>
      </form>
    </main>
  );
}
