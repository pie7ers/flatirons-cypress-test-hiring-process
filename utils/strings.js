export function getStringWithHyphens(inputString) {
  return inputString
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple hyphens with a single one
    .replace(/^-+/, '')       // Trim hyphens from start of text
    .replace(/-+$/, '');      // Trim hyphens from end of text
}