'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { uploadImage } from '@/lib/supabaseStorage';

export default function NewLandPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [pricePerAre, setPricePerAre] = useState('');
  const [tenure, setTenure] = useState<'freehold' | 'leasehold'>('leasehold');

  const [hasWater, setHasWater] = useState(false);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [hasRoad, setHasRoad] = useState(false);
  const [isVirgin, setIsVirgin] = useState(false);

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
        const path = `lands/${crypto.randomUUID()}`;
        imagePath = await uploadImage('lands', path, imageFile);
      }

      const { error: insertError } = await supabase
        .from('lands')
        .insert({
          title,
          location,
          area: Number(area),
          price_per_are: Number(pricePerAre),
          tenure,
          has_water: hasWater,
          has_electricity: hasElectricity,
          has_road: hasRoad,
          is_virgin: isVirgin,
          image: imagePath,
        });

      if (insertError) {
        throw insertError;
      }

      router.push('/admin/lands');
    } catch (err: any) {
      setError(err.message ?? 'Failed to create land');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page">
      <h1>Create land</h1>

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
          <label>Area (are)</label>
          <input
            type="number"
            step="0.1"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Price per are (M IDR)</label>
          <input
            type="number"
            step="0.1"
            value={pricePerAre}
            onChange={(e) => setPricePerAre(e.target.value)}
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

        <div className="form-group checkbox">
          <label>
            <input type="checkbox" checked={hasWater} onChange={(e) => setHasWater(e.target.checked)} />
            Water access
          </label>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={hasElectricity}
              onChange={(e) => setHasElectricity(e.target.checked)}
            />
            Electricity
          </label>
        </div>

        <div className="form-group checkbox">
          <label>
            <input type="checkbox" checked={hasRoad} onChange={(e) => setHasRoad(e.target.checked)} />
            Road access
          </label>
        </div>

        <div className="form-group checkbox">
          <label>
            <input type="checkbox" checked={isVirgin} onChange={(e) => setIsVirgin(e.target.checked)} />
            Virgin land
          </label>
        </div>

        <div className="form-group">
          <label>Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Create land'}
          </button>
        </div>
      </form>
    </main>
  );
}
