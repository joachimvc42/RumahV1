import type { Metadata } from 'next';
import LocationPage, { locationMetadata, locationStaticParams } from '../../../../lib/locationPage';
import type { Locale } from '../../../../lib/locations';

export function generateStaticParams() {
  return locationStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ zone: string }> }): Promise<Metadata> {
  const { zone } = await params;
  return locationMetadata('fr', zone);
}

export default async function Page({ params }: { params: Promise<{ zone: string }> }) {
  const { zone } = await params;
  return <LocationPage locale={'fr' as Locale} zone={zone} />;
}
