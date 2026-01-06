'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '@/lib/supabaseStorage';

export default function EditLandPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [pricePerAre, setPricePerAre] = useState('');
  const [tenure, setTenure] = useState<'freehold' | 'leasehold'>('leasehold');

  const [hasWater, setHasWater] = useState(false);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [hasRoad, setHasRoad] = useState(false);
  const [isVirgin, setIsVirgin] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('lands')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Land not found');
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setLocation(data.location);
      setArea(String(data.area));
      setPricePerAre(String(data.price_per_are));
      setTenure(data.tenure);

      setHasWater(data.has_water);
      setHasElectricity(data.has_electricity);
      setHasRoad(data.has_road);
      setIsVirgin(data.is_virgin);

      setImage(data.image);
      setLoading(false);
    };

    load();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let imagePath = image;

      if (newImageFile) {
        const path = `lands/${crypto.randomUUID()}`;
        imagePath = await uploadImage('lands', path, newImageFile);
      }

      const { error } = await supabase
        .from('lands')
        .update({
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
        })
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/lands');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save land');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Delete this land permanently? This action cannot be undone.'
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('lands').delete().eq('id', id);
      if (error) throw error;
      router.push('/admin/lands');
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete land');
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="muted">Loading…</p>;
  }

  return (
    <main className="admin-page">
      <h1>Edit land</h1>

      <form onSubmit={handleSave} className="admin-form">
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
          {image && <p className="muted">Current image: {image}</p>}
          <input type="file" accept="image/*" onChange={(e) => setNewImageFile(e.target.files?.[0] ?? null)} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={saving}
          >
            Delete land
          </button>
        </div>
      </form>
    </main>
  );
}
