export function sanitizeUsername(username: string): string {
  return username
    .trim() // Remove leading/trailing spaces
    .replace(/[^a-zA-Z0-9-_]/g, '') // Remove non-alphanumeric and non -/_ characters
    .replace(/_{2,}/g, '_') // Replace multiple underscores with a single one
    .replace(/-{2,}/g, '-') // Replace multiple dashes with a single one
    .replace(/^[-_]+|[-_]+$/g, ''); // Trim dashes and underscores from start and end
}
