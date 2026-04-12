'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { uploadFile } from '../../../../../lib/supabaseStorage';
import AdminMediaGallery from '../../../../../components/admin/AdminMediaGallery';
import MediaUploader from '../../../../../components/admin/MediaUploader';
import type { SortableGalleryItem } from '../../../../../lib/galleryUtils';
import { urlsToGalleryItems, splitGalleryItems } from '../../../../../lib/galleryUtils';

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
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'paused'>('draft');
  const [pool, setPool] = useState(false);
  const [garden, setGarden] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [aircon, setAircon] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);

  const [mediaItems, setMediaItems] = useState<SortableGalleryItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Property not found');
        setLoading(false);
        return;
      }

      setTitle(data.title ?? '');
      setLocation(data.location ?? '');
      setPrice(String(data.price ?? ''));
      setBedrooms(String(data.bedrooms ?? ''));
      setBathrooms(String(data.bathrooms ?? ''));
      setBuiltArea(String(data.built_area ?? ''));
      setLandArea(String(data.land_area ?? ''));
      setTenure(data.tenure ?? 'leasehold');
      setDescription(data.description ?? '');
      setStatus(data.status ?? 'draft');
      setPool(data.pool ?? false);
      setGarden(data.garden ?? false);
      setFurnished(data.furnished ?? false);
      setAircon(data.aircon ?? false);
      setWifi(data.wifi ?? false);
      setParking(data.parking ?? false);

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
      // Upload any new files
      const uploaded = await Promise.all(
        mediaItems.map(async (item) => {
          if (!item.file) return item;
          const ext = item.file.name.split('.').pop();
          const folder = item.mediaType === 'video' ? 'videos' : 'images';
          const path = `properties/${id}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const url = await uploadFile('properties', path, item.file);
          return { ...item, previewSrc: url, file: undefined };
        })
      );

      setMediaItems(uploaded);

      const { imageUrls, videoUrls } = splitGalleryItems(uploaded);

      const { error: updateError } = await supabase
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
          description,
          status,
          pool,
          garden,
          furnished,
          aircon,
          wifi,
          parking,
          images: imageUrls,
          videos: videoUrls,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      router.push('/admin/properties');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this property permanently?')) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      router.push('/admin/properties');
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete property');
      setSaving(false);
    }
  };

  if (loading) return <p className="muted">Loading…</p>;

  return (
    <main className="admin-page">
      <h1>Edit property</h1>

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
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="paused">Paused</option>
          </select>
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
          <input type="number" step="0.1" value={builtArea} onChange={(e) => setBuiltArea(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Land area (are)</label>
          <input type="number" step="0.1" value={landArea} onChange={(e) => setLandArea(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Tenure</label>
          <select value={tenure} onChange={(e) => setTenure(e.target.value as any)}>
            <option value="leasehold">Leasehold</option>
            <option value="freehold">Freehold</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {[
            ['pool', 'Pool', pool, setPool],
            ['garden', 'Garden', garden, setGarden],
            ['furnished', 'Furnished', furnished, setFurnished],
            ['aircon', 'Air conditioning', aircon, setAircon],
            ['wifi', 'WiFi', wifi, setWifi],
            ['parking', 'Parking', parking, setParking],
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
            Delete property
          </button>
        </div>
      </form>
    </main>
  );
}