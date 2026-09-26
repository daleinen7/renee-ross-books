const long = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

function parse(iso: string): Date {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00Z`) : new Date(iso);
}

export function formatDate(iso: string): string {
  return long.format(parse(iso));
}

export function publishYear(iso: string): string {
  return String(parse(iso).getUTCFullYear());
}
