export interface Demand {
  id: string;
  userId: string;
  materials: {
    type: 'plastic' | 'glass' | 'paper' | 'metal';
    weight: number;
  }[];
  totalWeight: number;
  address: string;
  city: string;
  collectionDate: Date;
  timeSlot: string;
  notes?: string;
  images?: string[];
  status: 'pending' | 'occupied' | 'in_progress' | 'completed' | 'rejected';
  createdAt: Date;
} 