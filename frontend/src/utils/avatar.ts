/**
 * Generate a consistent avatar URL using Picsum Photos API
 * @param userId - The user ID to use as seed for consistent avatar
 * @param size - The size of the avatar (default: 48)
 * @returns URL for the avatar image
 */
export const getAvatarUrl = (userId: string, size: number = 48): string => {
  // Use user ID as random seed for consistent avatar
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://picsum.photos/${size}/${size}?random=${seed}`;
  // return `https://placekitten.com/${size}/${size}`;
};


/**
 * Generate initials from a name for fallback avatar
 * @param name - The name to generate initials from
 * @returns String of initials (max 2 characters)
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}; 