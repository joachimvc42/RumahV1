'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type Investment = {
  id: string;
  asset_type: 'land' | 'property';
  asset_id: string;
  legal_checked: boolean;
  management_available: boolean;
};

type AssetOption = {
  id: string;
  label: string;
};

export default function EditInvestmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [assetType, setAssetType] = useState<'land' | 'property'>('land');
  const [assetId, setAssetId] = useState('');
  const [legalChecked, setLegalChecked] = useState(false);
  const [managementAvailable, setManagementAvailable] = useState(true);

  const [assets, setAssets] = useState<AssetOption[]>([]);

  /* load investment */
  useEffect(() => {
    const loadInvestment = async () => {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('id', id)
        .single<Investment>();

      if (error || !data) {
        setError('Investment not found');
        setLoading(false);
        return;
      }

      setAssetType(data.asset_type);
      setAssetId(data.asset_id);
      setLegalChecked(data.legal_checked);
      setManagementAvailable(data.management_available);

      setLoading(false);
    };

    loadInvestment();
  }, [id]);

  /* load assets for selector */
  useEffect(() => {
    const loadAssets = async () => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!assetId) {
        throw new Error('Please select an asset');
      }

      const { error } = await supabase
        .from('investments')
        .update({
          asset_type: assetType,
          asset_id: assetId,
          legal_checked: legalChecked,
          management_available: managementAvailable,
        })
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/investments');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save investment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Delete this investment permanently? This action cannot be undone.'
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/investments');
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete investment');
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="muted">Loading…</p>;
  }

  return (
    <main className="admin-page">
      <h1>Edit investment</h1>

      <form onSubmit={handleSave} className="admin-form">
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
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={saving}
          >
            Delete investment
          </button>
        </div>
      </form>
    </main>
  );
}
