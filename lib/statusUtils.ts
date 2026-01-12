/**
 * Centralized status mapping and validation
 * Only supports: draft, published, paused
 */

export type PropertyStatus = 'draft' | 'published' | 'paused';

/**
 * Maps database status to display label
 * Returns 'Draft' as fallback for unknown statuses (never 'Pending')
 */
export function getStatusLabel(status: string | null | undefined): string {
  const normalized = (status || '').toLowerCase().trim();
  
  switch (normalized) {
    case 'draft':
      return 'Draft';
    case 'published':
      return 'Published';
    case 'paused':
      return 'Paused';
    default:
      // Fallback to Draft for unknown statuses, never Pending
      return 'Draft';
  }
}

/**
 * Validates if a status is one of the allowed values
 */
export function isValidStatus(status: string | null | undefined): status is PropertyStatus {
  const normalized = (status || '').toLowerCase().trim();
  return normalized === 'draft' || normalized === 'published' || normalized === 'paused';
}

/**
 * Normalizes a status value to one of the allowed values
 * Returns 'draft' for invalid/unknown statuses
 */
export function normalizeStatus(status: string | null | undefined): PropertyStatus {
  if (isValidStatus(status)) {
    return status.toLowerCase().trim() as PropertyStatus;
  }
  return 'draft';
}

/**
 * Gets the color for a status badge
 */
export function getStatusColor(status: PropertyStatus): string {
  switch (status) {
    case 'published':
      return '#059669'; // green
    case 'paused':
      return '#f59e0b'; // amber
    case 'draft':
    default:
      return '#6b7280'; // gray
  }
}
