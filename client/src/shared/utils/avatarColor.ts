// Deterministic background color from string/id to match cozy coffee palette
const WARM_COLORS = [
  { bg: 'bg-[#8C6D58]', text: 'text-[#FBF6EF]' },
  { bg: 'bg-[#A37B63]', text: 'text-[#FBF6EF]' },
  { bg: 'bg-[#B08968]', text: 'text-[#FBF6EF]' },
  { bg: 'bg-[#7F5539]', text: 'text-[#FBF6EF]' },
  { bg: 'bg-[#9C6644]', text: 'text-[#FBF6EF]' },
  { bg: 'bg-[#6F4E37]', text: 'text-[#FBF6EF]' },
  { bg: 'bg-[#C68B59]', text: 'text-[#2B1D16]' },
  { bg: 'bg-[#DDB892]', text: 'text-[#2B1D16]' },
]

export function getAvatarColor(identifier: string): { bg: string; text: string } {
  if (!identifier) return WARM_COLORS[0]
  let hash = 0
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % WARM_COLORS.length
  return WARM_COLORS[index]
}

export function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
