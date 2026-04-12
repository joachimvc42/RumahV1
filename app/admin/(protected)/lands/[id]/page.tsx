'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { uploadFile } from '../../../../../lib/supabaseStorage';
import AdminMediaGallery from '../../../../../components/admin/AdminMediaGallery';
import MediaUploader from '../../../../../components/admin/MediaUploader';
import type { SortableGalleryItem } from '../../../../../lib/galleryUtils';
import { urlsToGalleryItems, splitGalleryItems } from '../../../../../lib/galleryUtils';

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
  const [description, setDescription] = useState('');
  const [zoning, setZoning] = useState('');
  const [hasWater, setHasWater] = useState(false);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [hasRoad, setHasRoad] = useState(false);
  const [isVirgin, setIsVirgin] = useState(false);

  const [mediaItems, setMediaItems] = useState<SortableGalleryItem[]>([]);

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

      setTitle(data.title ?? '');
      setLocation(data.location ?? '');
      setArea(String(data.area_are ?? data.area ?? ''));
      setPricePerAre(String(data.price_per_are_idr ?? data.price_per_are ?? ''));
      setTenure(data.tenure ?? 'leasehold');
      setDescription(data.description ?? '');
      setZoning(data.zoning ?? '');
      setHasWater(data.has_water ?? false);
      setHasElectricity(data.has_electricity ?? false);
      setHasRoad(data.has_road ?? false);
      setIsVirgin(data.is_virgin ?? false);

      const images: string[] = Array.isArray(data.images) ? data.images : [];
      const videos: string[] = Array.isArray(data.videos) ? data.videos : [];
      setMediaItems(urlsToGalleryItems(images, videos));

      setLoading(false);
    };

    load();
  }, [id]);

  const handleAddMedia = (newItems: SortableGalleryItem[]) => {
    setMediaItems((prev) => [...prev, ...newItems]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const uploaded = await Promise.all(
        mediaItems.map(async (item) => {
          if (!item.file) return item;
          const ext = item.file.name.split('.').pop();
          const folder = item.mediaType === 'video' ? 'videos' : 'images';
          const path = `lands/${id}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const url = await uploadFile('lands', path, item.file);
          return { ...item, previewSrc: url, file: undefined };
        })
      );

      setMediaItems(uploaded);

      const { imageUrls, videoUrls } = splitGalleryItems(uploaded);

      const { error: updateError } = await supabase
        .from('lands')
        .update({
          title,
          location,
          area_are: Number(area),
          price_per_are_idr: Number(pricePerAre),
          tenure,
          description,
          zoning,
          has_water: hasWater,
          has_electricity: hasElectricity,
          has_road: hasRoad,
          is_virgin: isVirgin,
          images: imageUrls,
          videos: videoUrls,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      router.push('/admin/lands');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save land');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this land permanently?')) return;
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

  if (loading) return <p className="muted">Loading…</p>;

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
          <label>Description</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Area (are)</label>
          <input type="number" step="0.1" value={area} onChange={(e) => setArea(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Price per are (M IDR)</label>
          <input type="number" step="0.1" value={pricePerAre} onChange={(e) => setPricePerAre(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Tenure</label>
          <select value={tenure} onChange={(e) => setTenure(e.target.value as any)}>
            <option value="leasehold">Leasehold</option>
            <option value="freehold">Freehold</option>
          </select>
        </div>

        <div className="form-group">
          <label>Zoning</label>
          <input value={zoning} onChange={(e) => setZoning(e.target.value)} placeholder="ex: residential, commercial…" />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {[
            ['hasWater', 'Water access', hasWater, setHasWater],
            ['hasElectricity', 'Electricity', hasElectricity, setHasElectricity],
            ['hasRoad', 'Road access', hasRoad, setHasRoad],
            ['isVirgin', 'Virgin land', isVirgin, setIsVirgin],
          ].map(([key, label, val, setter]) => (
            <div className="form-group checkbox" key={key as string}>
              <label>
                <input
                  type="checkbox"
                  checked={val as boolean}
                  onChange={(e) => (setter as Function)(e.target.checked)}
                />
                {' '}{label as string}
              </label>
            </div>
          ))}
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Photos & Vidéos</label>
          <MediaUploader onAdd={handleAddMedia} />
          <AdminMediaGallery items={mediaItems} onChange={setMediaItems} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={saving}>
            Delete land
          </button>
        </div>
      </form>
    </main>
  );
}