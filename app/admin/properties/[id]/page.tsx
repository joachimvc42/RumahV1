'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { uploadImage } from '../../../../lib/supabaseStorage';

export default function EditVillaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [builtArea, setBuiltArea] = useState('');
  const [landArea, setLandArea] = useState('');
  const [tenure, setTenure] = useState<'freehold' | 'leasehold'>('leasehold');

  const [image, setImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Villa not found');
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setLocation(data.location);
      setPrice(String(data.price));
      setBedrooms(String(data.bedrooms));
      setBathrooms(String(data.bathrooms));
      setBuiltArea(String(data.built_area));
      setLandArea(String(data.land_area));
      setTenure(data.tenure);

      setImage(data.image ?? null);
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
        const path = `properties/${crypto.randomUUID()}`;
        imagePath = await uploadImage('properties', path, newImageFile);
      }

      const { error } = await supabase
        .from('properties')
        .update({
          title,
          location,
          price: Number(price),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          built_area: Number(builtArea),
          land_area: Number(landArea),
          tenure,
          image: imagePath,
        })
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/properties');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save villa');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Delete this villa permanently? This action cannot be undone.'
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/properties');
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete villa');
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="muted">Loading…</p>;
  }

  return (
    <main className="admin-page">
      <h1>Edit villa</h1>

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
          <label>Price (USD)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Bedrooms</label>
          <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Bathrooms</label>
          <input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required />
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
          {image && <p className="muted">Current image: {image}</p>}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImageFile(e.target.files?.[0] ?? null)}
          />
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
            Delete villa
          </button>
        </div>
      </form>
    </main>
  );
}
