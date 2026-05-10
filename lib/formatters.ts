/** Format raw digit string as IDR with dot separators: "15000000" → "15.000.000" */
export function fmtIDR(raw: string | number): string {
  const digits = String(raw ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Strip dot separators back to raw digits: "15.000.000" → "15000000" */
export function parseIDR(formatted: string): string {
  return formatted.replace(/\./g, '');
}
