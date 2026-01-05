export type VillaInvestment = {
  id: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  priceUSD: string;
  yield: string;
  leaseType: string;
  description: string;
  features: string[];
  images: string[];
};

export const villaInvestments: VillaInvestment[] = [
  {
    id: '1',
    title: 'Luxury Beachfront Villa',
    location: 'Kuta, Lombok',
    bedrooms: 3,
    bathrooms: 3,
    price: '450,000',
    priceUSD: '450,000 USD',
    yield: '8–10%',
    leaseType: 'Long-term lease',
    description:
      'Stunning beachfront villa with direct ocean access, ideal for investment with high rental yield potential. The property features modern architecture with traditional Lombok influences and can be structured under a long-term lease with optional property management handled locally.',
    features: [
      'Private infinity pool',
      'Direct beach access',
      'Fully furnished',
      'Air conditioning throughout',
      'High rental demand area',
      'Professional property management available',
    ],
    images: ['/assets/lombok.jpg'],
  },
  {
    id: '2',
    title: 'Hillside Investment Villa',
    location: 'Selong Belanak',
    bedrooms: 2,
    bathrooms: 2,
    price: '320,000',
    priceUSD: '320,000 USD',
    yield: '7–9%',
    leaseType: 'Long-term lease',
    description:
      'Elevated hillside villa with panoramic views over Selong Belanak bay. Perfect for investors seeking a quieter location with strong appreciation potential and consistent rental demand from surf tourism.',
    features: [
      'Panoramic ocean views',
      'Private garden',
      'Traditional architecture',
      'Air conditioning',
      'Proximity to surf beaches',
      'Rental management included',
    ],
    images: ['/assets/lombok.jpg'],
  },
];

export function getVillaById(id: string): VillaInvestment | null {
  return villaInvestments.find((v) => v.id === id) || null;
}

