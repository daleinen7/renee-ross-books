export function splitTitle(title: string): { name: string; series: string | null } {
  const idx = title.lastIndexOf(', ');
  if (idx === -1) return { name: title, series: null };
  return { name: title.slice(0, idx), series: title.slice(idx + 2) };
}

export function hasPurchaseUrl(url: string | null | undefined): url is string {
  return typeof url === 'string' && url.trim().length > 0;
}
