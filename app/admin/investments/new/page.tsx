'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

type AssetOption = {
  id: string;
  label: string;
};

export default function NewInvestmentPage() {
  const router = useRouter();

  const [assetType, setAssetType] = useState<'land' | 'property'>('land');
  const [assetId, setAssetId] = useState('');
  const [legalChecked, setLegalChecked] = useState(false);
  const [managementAvailable, setManagementAvailable] = useState(true);

  const [assets, setAssets] = useState<AssetOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* load assets depending on type */
  useEffect(() => {
    const loadAssets = async () => {
      setAssetId('');
      if (assetType === 'land') {
        const { data } = await supabase
          .from('lands')
          .select('id,title')
          .order('created_at', { ascending: false });

        setAssets(
          (data ?? []).map((l) => ({
            id: l.id,
            label: l.title,
          }))
        );
      } else {
        const { data } = await supabase
          .from('properties')
          .select('id,title')
          .order('created_at', { ascending: false });

        setAssets(
          (data ?? []).map((p) => ({
            id: p.id,
            label: p.title,
          }))
        );
      }
    };

    loadAssets();
  }, [assetType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!assetId) {
        throw new Error('Please select an asset');
      }

      const { error } = await supabase.from('investments').insert({
        asset_type: assetType,
        asset_id: assetId,
        legal_checked: legalChecked,
        management_available: managementAvailable,
      });

      if (error) throw error;

      router.push('/admin/investments');
    } catch (err: any) {
      setError(err.message ?? 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page">
      <h1>Create investment</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label>Asset type</label>
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value as any)}
          >
            <option value="land">Land</option>
            <option value="property">Villa</option>
          </select>
        </div>

        <div className="form-group">
          <label>Asset</label>
          <select
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            required
          >
            <option value="">Select asset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={legalChecked}
              onChange={(e) => setLegalChecked(e.target.checked)}
            />
            Legal checked
          </label>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={managementAvailable}
              onChange={(e) => setManagementAvailable(e.target.checked)}
            />
            Management available
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Create investment'}
          </button>
        </div>
      </form>
    </main>
  );
}
