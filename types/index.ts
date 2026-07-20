export type AccessibilityStatus = "green" | "yellow" | "red";
export interface CommunityReport { id: string; placeName: string; review: string; rating: number; imageUrl?: string; authorName: string; createdAt: string; }
export interface Profile { name: string; email: string; phone: string; emergencyContact: string; wheelchairType: string; }
