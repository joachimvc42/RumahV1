export type Rental = {
  id: string;
  title: string;
  location: string;
  price: string;
  duration: string;
  bedrooms: number;
  bathrooms: number;
  pool: boolean;
  garden: boolean;
  description: string;
  features: string[];
  images: string[];
};

export const rentals: Rental[] = [
  {
    id: '1',
    title: 'Modern Villa with Pool',
    location: 'Kuta, Lombok',
    price: '25',
    duration: '6',
    bedrooms: 3,
    bathrooms: 2,
    pool: true,
    garden: true,
    description:
      'Contemporary villa featuring clean lines and modern amenities, located just minutes from Kuta beach. Perfect for long-term stays with a private pool and spacious living areas.',
    features: [
      'Private swimming pool',
      'Tropical garden',
      'Fully equipped kitchen',
      'Air conditioning',
      'Fast WiFi included',
      'Weekly cleaning service',
    ],
    images: ['/assets/lombok.jpg'],
  },
  {
    id: '2',
    title: 'Beachfront Retreat',
    location: 'Selong Belanak',
    price: '35',
    duration: '12',
    bedrooms: 4,
    bathrooms: 3,
    pool: true,
    garden: true,
    description:
      'Spacious beachfront property with stunning views over Selong Belanak bay. Ideal for families or remote workers seeking a peaceful long-term rental with all modern comforts.',
    features: [
      'Beachfront location',
      'Infinity pool',
      'Large tropical garden',
      'Open-plan living',
      'Home office space',
      'Staff quarters available',
    ],
    images: ['/assets/lombok.jpg'],
  },
];

export function getRentalById(id: string): Rental | null {
  return rentals.find((r) => r.id === id) || null;
}

