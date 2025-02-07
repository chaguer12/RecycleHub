export class Demand {
    constructor(
        public id: string,
        public userId: string,
        public materials: {
            type: 'plastic' | 'glass' | 'paper' | 'metal';
            weight: number;
        }[],
        public totalWeight: number,
        public address: string,
        public city: string,
        public collectionDate: Date,
        public timeSlot: string,
        public status: 'pending' | 'occupied' | 'in_progress' | 'completed' | 'rejected',
        public createdAt: Date,
        public notes?: string,
        public images?: string[],
        public collectorId?: string,
        public realWeight?: number,
        public verificationPhotos?: string[],
        public rejectionReason?: string
    ) {}
} 