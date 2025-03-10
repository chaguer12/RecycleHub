export interface User {
    id: string;
    fullName: string;
    email: string;
    password?: string;
    city: string;
    address: string;
    birthday: string;
    role: 'particulier' | 'collecteur';
    profilePicture?: string;
    collectionZones?: string[];
    rating?: number;
    completedCollections?: number;
    points?: number;
}

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
    collectorId?: string;
    realWeight?: number;
    verificationPhotos?: string[];
    rejectionReason?: string;
}

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