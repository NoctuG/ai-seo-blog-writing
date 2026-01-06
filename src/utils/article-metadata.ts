/**
 * Format publish date for display
 */
export function formatDate(dateString: string): string {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Estimate reading time (minutes) based on content length
 */
export function estimateReadingTime(content: string): number {
  if (!content) {
    return 1;
  }

  const words = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  const minutes = Math.ceil(words.length / 200);
  return Math.max(1, minutes);
}
