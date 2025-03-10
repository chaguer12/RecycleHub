import { Injectable } from '@angular/core';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {
  private readonly COLLECTORS_KEY = 'collectors';

  constructor() {
    this.initializeCollectors();
  }

  private initializeCollectors(): void {
    if (!localStorage.getItem(this.COLLECTORS_KEY)) {
      const defaultCollectors: User[] = [
        {
          id: 'COL001',
          fullName: 'Ahmed Alami',
          email: 'ahmed.alami@recyclehub.com',
          password: '12341234',
          city: 'Agadir',
          address: '123 rue des Orangers, Agadir',
          birthday: '1985-06-15',
          role: 'collecteur',
          profilePicture: '',
          collectionZones: ['Agadir', 'Anza', 'Dcheira'],
          rating: 4.5,
          completedCollections: 12
        },
        {
          id: 'COL002',
          fullName: 'Karim Benani',
          email: 'karim.benani@recyclehub.com',
          password: '12341234',
          city: 'Agadir',
          address: '45 avenue Hassan II, Agadir',
          birthday: '1990-03-22',
          role: 'collecteur',
          profilePicture: '',
          collectionZones: ['Agadir', 'Inezgane', 'Aït Melloul'],
          rating: 4.8,
          completedCollections: 8
        },
        {
          id: 'COL003',
          fullName: 'Fatima Zahra',
          email: 'fatima.zahra@recyclehub.com',
          password: '12341234',
          city: 'Safi',
          address: '78 rue de la Médina, Safi',
          birthday: '1988-11-30',
          role: 'collecteur',
          profilePicture: '',
          collectionZones: ['Safi', 'Souiria', 'Sebt Gzoula'],
          rating: 4.6,
          completedCollections: 15
        },
        {
          id: 'COL004',
          fullName: 'Omar Radi',
          email: 'omar.radi@recyclehub.com',
          password: '12341234',
          city: 'Safi',
          address: '156 quartier Industriel, Safi',
          birthday: '1992-08-14',
          role: 'collecteur',
          profilePicture: '',
          collectionZones: ['Safi', 'Youssoufia', 'Chemaia'],
          rating: 4.3,
          completedCollections: 6
        },
        {
          id: 'COL005',
          fullName: 'Samira Idrissi',
          email: 'samira.idrissi@recyclehub.com',
          password: '12341234',
          city: 'Casablanca',
          address: '234 boulevard Mohammed V, Casablanca',
          birthday: '1987-04-25',
          role: 'collecteur',
          profilePicture: '',
          collectionZones: ['Casablanca', 'Ain Sebaa', 'Sidi Bernoussi'],
          rating: 4.9,
          completedCollections: 20
        }
      ];

      localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(defaultCollectors));
    }
  }

  getAllCollectors(): User[] {
    return JSON.parse(localStorage.getItem(this.COLLECTORS_KEY) || '[]');
  }

  getCollectorsByCity(city: string): User[] {
    const collectors = this.getAllCollectors();
    return collectors.filter(c => c.collectionZones?.includes(city) || false);
  }

  getCollectorById(id: string): User | null {
    const collectors = this.getAllCollectors();
    return collectors.find(c => c.id === id) || null;
  }

  updateCollectorStats(collectorId: string, rating: number): void {
    const collectors = this.getAllCollectors();
    const index = collectors.findIndex(c => c.id === collectorId);
    if (index !== -1) {
      collectors[index].completedCollections = (collectors[index].completedCollections || 0) + 1;
      collectors[index].rating = ((collectors[index].rating || 0) + rating) / 2;
      localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(collectors));
    }
  }
} 