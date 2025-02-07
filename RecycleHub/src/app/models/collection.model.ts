export interface CollectionRequest {
  id: string;
  userId: string;
  materials: {
    type: 'plastic' | 'glass' | 'paper' | 'metal';
    weight: number;
  }[];
  totalWeight: number;
  images?: string[];
  address: string;
  city: string;
  collectionDate: Date;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'occupied' | 'in_progress' | 'completed' | 'rejected';
  collectorId?: string;
  realWeight?: number;
  verificationPhotos?: string[];
} 