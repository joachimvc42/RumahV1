'use client';

/**
 * Admin (seller) area is bilingual EN / ID only — many Lombok sellers post in
 * Bahasa Indonesia. The choice is stored in localStorage (no URL locale in the
 * admin), read via useAdminLang(). Public-site i18n lives in lib/i18n.ts.
 */
import { useEffect, useState } from 'react';

export type AdminLang = 'en' | 'id';
const STORAGE_KEY = 'rumahya:admin-lang';

export const en = {
  // shared / nav
  listings: 'Listings',
  langName: 'EN',
  // login
  loginTitle: 'Admin login',
  email: 'Email',
  password: 'Password',
  login: 'Login',
  signingIn: 'Signing in…',
  invalidCreds: 'Invalid credentials',
  notAuthorized: 'Not authorized',
  // list page
  portfolioTitle: 'Investment Portfolio',
  registeredOne: 'listing registered',
  registeredMany: 'listings registered',
  addInvestment: '+ Add listing',
  assetType: 'ASSET TYPE',
  propertyTypeLabel: 'PROPERTY TYPE',
  statusLabel: 'STATUS',
  locationLabel: 'LOCATION',
  all: 'All',
  villa: 'Villa',
  land: 'Land',
  freehold: 'Freehold',
  leasehold: 'Leasehold',
  published: 'Published',
  draft: 'Draft',
  paused: 'Paused',
  allAreas: 'All areas',
  clear: '✕ Clear',
  noneYet: 'No listings yet',
  noResults: 'No results for these filters',
  createFirst: 'Create my first listing',
  edit: '✏️ Edit',
  deleteConfirm: 'Delete this listing? This action is irreversible.',
  deleteFail: 'Failed to delete',
  loadFail: 'Failed to load listings',
  loading: 'Loading listings...',
  noImage: 'No image',
  photos: 'photos',
  verified: '✅ Verified',
  management: '🏢 Management',
  estYield: 'est. yield',
  untitled: 'Untitled',
  // form — headings & sections
  addTitle: 'Add listing',
  editTitle: 'Edit listing',
  back: '← Back',
  assetTypeH: '🏷️ Asset type',
  villaInfoH: '📍 Villa information',
  landInfoH: '📍 Land information',
  conditionsH: '💰 Listing conditions',
  locationH: '🗺️ Location',
  photosH: '📸 Photo gallery',
  videosH: '🎬 Video gallery',
  // form — fields
  titleL: 'Title *',
  titlePhVilla: 'Ex: Luxury seafront villa',
  titlePhLand: 'Ex: Buildable land Kuta',
  locationFieldL: 'Location *',
  locationPh: 'Ex: Kuta, Senggigi…',
  refNote: 'ℹ️ A reference (I#####) will be automatically assigned when this listing is created.',
  descriptionL: 'Description',
  descriptionPh: 'Detailed description...',
  whatsappL: 'WhatsApp — buyer contact *',
  whatsappHint: 'Shown on your listing — interested buyers contact you directly here.',
  waCountryHint: 'Start with your country code, e.g. +62 812 3456 7890',
  bedrooms: 'Bedrooms',
  bathrooms: 'Bathrooms',
  builtArea: 'Built area (m²)',
  landAreShort: 'Land (are)',
  pool: '🏊 Pool',
  garden: '🌳 Garden',
  furnished: '🛋️ Furnished',
  seaView: '🌊 Sea view',
  landAreaL: 'Land area (are) *',
  waterAccess: '💧 Water access',
  electricity: '⚡ Electricity',
  roadAccess: '🛣️ Road access',
  priceUsd: 'Price {per} (USD) *',
  priceIdr: 'Price {per} (IDR millions) *',
  perAre: '(per are)',
  yieldL: 'Estimated yield (%/year)',
  propertyTypeFieldL: 'Property type *',
  freeholdDesc: 'Full ownership',
  leaseholdDesc: 'Long-term lease',
  leaseDurationL: 'Lease duration (years) *',
  statusFieldL: 'Status *',
  statusDraft: 'Draft (not visible to public)',
  statusPublished: 'Published (visible to public)',
  statusPaused: 'Paused (not visible to public)',
  legalVerified: '✅ Legal documents verified',
  mgmtAvailable: '🏢 Rental management available',
  locationHint: 'Click on the map or search an address to pin the exact location.',
  photoDrop: 'Click or drag your images here',
  photoHint: 'PNG, JPG up to 10MB each',
  videosHint: 'Add video tours of the property. Accepted formats: MP4, MOV, WebM.',
  videoDrop: 'Add videos',
  videoHint: 'MP4, MOV, WebM — max 200MB each',
  remove: 'Remove',
  uploadingMedia: 'Uploading media…',
  finalizingMedia: '✓ Media uploaded — finalizing…',
  keepOpen: 'Keep this page open until the save completes.',
  cancel: 'Cancel',
  createBtn: '✓ Create listing',
  saveBtn: '✓ Save',
  finalizing: 'Finalizing…',
  uploading: 'Uploading…',
  createFail: 'Failed to create listing',
  saveFail: 'Failed to save listing',
  // edit-only
  notFound: 'Listing not found',
  backToList: '← Back to listings',
  loadingShort: 'Loading...',
  referenceAuto: 'Reference (auto-generated)',
  addImages: 'Add images',
  videosEditHint: 'Add or remove video tours. Existing videos are preserved unless removed.',
  savedBadge: 'Saved',
  deleteBtn: '🗑️ Delete',
};

export type AdminStrings = typeof en;

export const id: AdminStrings = {
  listings: 'Daftar',
  langName: 'ID',
  loginTitle: 'Masuk admin',
  email: 'Email',
  password: 'Kata sandi',
  login: 'Masuk',
  signingIn: 'Sedang masuk…',
  invalidCreds: 'Kredensial tidak valid',
  notAuthorized: 'Tidak diizinkan',
  portfolioTitle: 'Daftar Properti',
  registeredOne: 'iklan terdaftar',
  registeredMany: 'iklan terdaftar',
  addInvestment: '+ Tambah iklan',
  assetType: 'JENIS ASET',
  propertyTypeLabel: 'JENIS KEPEMILIKAN',
  statusLabel: 'STATUS',
  locationLabel: 'LOKASI',
  all: 'Semua',
  villa: 'Vila',
  land: 'Tanah',
  freehold: 'Hak Milik',
  leasehold: 'Hak Sewa',
  published: 'Terbit',
  draft: 'Draf',
  paused: 'Dijeda',
  allAreas: 'Semua area',
  clear: '✕ Hapus filter',
  noneYet: 'Belum ada iklan',
  noResults: 'Tidak ada hasil untuk filter ini',
  createFirst: 'Buat iklan pertama saya',
  edit: '✏️ Ubah',
  deleteConfirm: 'Hapus iklan ini? Tindakan ini tidak dapat dibatalkan.',
  deleteFail: 'Gagal menghapus',
  loadFail: 'Gagal memuat iklan',
  loading: 'Memuat iklan...',
  noImage: 'Tidak ada gambar',
  photos: 'foto',
  verified: '✅ Terverifikasi',
  management: '🏢 Manajemen',
  estYield: 'perkiraan imbal hasil',
  untitled: 'Tanpa judul',
  addTitle: 'Tambah iklan',
  editTitle: 'Ubah iklan',
  back: '← Kembali',
  assetTypeH: '🏷️ Jenis aset',
  villaInfoH: '📍 Informasi vila',
  landInfoH: '📍 Informasi tanah',
  conditionsH: '💰 Ketentuan iklan',
  locationH: '🗺️ Lokasi',
  photosH: '📸 Galeri foto',
  videosH: '🎬 Galeri video',
  titleL: 'Judul *',
  titlePhVilla: 'Mis: Vila mewah tepi laut',
  titlePhLand: 'Mis: Tanah siap bangun Kuta',
  locationFieldL: 'Lokasi *',
  locationPh: 'Mis: Kuta, Senggigi…',
  refNote: 'ℹ️ Referensi (I#####) akan otomatis diberikan saat iklan ini dibuat.',
  descriptionL: 'Deskripsi',
  descriptionPh: 'Deskripsi lengkap...',
  whatsappL: 'WhatsApp — kontak pembeli *',
  whatsappHint: 'Ditampilkan di iklan Anda — pembeli yang tertarik menghubungi Anda langsung di sini.',
  waCountryHint: 'Mulai dengan kode negara Anda, mis. +62 812 3456 7890',
  bedrooms: 'Kamar tidur',
  bathrooms: 'Kamar mandi',
  builtArea: 'Luas bangunan (m²)',
  landAreShort: 'Tanah (are)',
  pool: '🏊 Kolam renang',
  garden: '🌳 Taman',
  furnished: '🛋️ Berperabot',
  seaView: '🌊 Pemandangan laut',
  landAreaL: 'Luas tanah (are) *',
  waterAccess: '💧 Akses air',
  electricity: '⚡ Listrik',
  roadAccess: '🛣️ Akses jalan',
  priceUsd: 'Harga {per} (USD) *',
  priceIdr: 'Harga {per} (jutaan IDR) *',
  perAre: '(per are)',
  yieldL: 'Perkiraan imbal hasil (%/tahun)',
  propertyTypeFieldL: 'Jenis kepemilikan *',
  freeholdDesc: 'Kepemilikan penuh',
  leaseholdDesc: 'Sewa jangka panjang',
  leaseDurationL: 'Durasi sewa (tahun) *',
  statusFieldL: 'Status *',
  statusDraft: 'Draf (tidak terlihat oleh publik)',
  statusPublished: 'Terbit (terlihat oleh publik)',
  statusPaused: 'Dijeda (tidak terlihat oleh publik)',
  legalVerified: '✅ Dokumen legal terverifikasi',
  mgmtAvailable: '🏢 Manajemen sewa tersedia',
  locationHint: 'Klik pada peta atau cari alamat untuk menandai lokasi yang tepat.',
  photoDrop: 'Klik atau seret gambar Anda ke sini',
  photoHint: 'PNG, JPG maks 10MB per file',
  videosHint: 'Tambahkan video tur properti. Format yang didukung: MP4, MOV, WebM.',
  videoDrop: 'Tambah video',
  videoHint: 'MP4, MOV, WebM — maks 200MB per file',
  remove: 'Hapus',
  uploadingMedia: 'Mengunggah media…',
  finalizingMedia: '✓ Media terunggah — menyelesaikan…',
  keepOpen: 'Biarkan halaman ini terbuka sampai penyimpanan selesai.',
  cancel: 'Batal',
  createBtn: '✓ Buat iklan',
  saveBtn: '✓ Simpan',
  finalizing: 'Menyelesaikan…',
  uploading: 'Mengunggah…',
  createFail: 'Gagal membuat iklan',
  saveFail: 'Gagal menyimpan iklan',
  notFound: 'Iklan tidak ditemukan',
  backToList: '← Kembali ke daftar',
  loadingShort: 'Memuat...',
  referenceAuto: 'Referensi (dibuat otomatis)',
  addImages: 'Tambah gambar',
  videosEditHint: 'Tambah atau hapus video tur. Video yang ada tetap disimpan kecuali dihapus.',
  savedBadge: 'Tersimpan',
  deleteBtn: '🗑️ Hapus',
};

const dicts: Record<AdminLang, AdminStrings> = { en, id };

export function getAdminDict(lang: AdminLang): AdminStrings {
  return dicts[lang] ?? en;
}

const LANG_EVENT = 'admin-lang-change';

/** Read + persist the admin language. Defaults to English. A toggle anywhere in
 *  the admin updates every page instantly via a window event (no URL locale). */
export function useAdminLang() {
  const [lang, setLangState] = useState<AdminLang>('en');

  useEffect(() => {
    const read = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'id') setLangState(stored);
    };
    read();
    window.addEventListener(LANG_EVENT, read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener(LANG_EVENT, read);
      window.removeEventListener('storage', read);
    };
  }, []);

  const setLang = (l: AdminLang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(LANG_EVENT));
  };

  return { lang, setLang, t: getAdminDict(lang) };
}
