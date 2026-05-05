/**
 * Convert image URL to absolute URL for backend assets
 * @param {string} url - The image URL (can be relative or absolute)
 * @returns {string} - Absolute URL to the image
 */
export function getImageUrl(url) {
  if (!url) return 'https://placehold.co/50x50?text=J';
  
  // Already absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Relative URL - prepend backend base URL
  const backendUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
  if (backendUrl) {
    return `${backendUrl}${url}`;
  }
  
  // Fallback for local development
  return url;
}