import { Injectable } from '@angular/core';
import { Demand } from '../model/demand.model';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class DemandService {
  private readonly STORAGE_KEY = 'demands';
  private readonly POINTS_RATES = {
    'plastic': 2,
    'glass': 1,
    'paper': 1,
    'metal': 5
  };

  constructor() {
    console.log('DemandService constructor');
    this.initializeTestDemands();
    console.log('Test demands initialized:', this.getAllDemands());
  }

  createDemand(demand: Demand): void {
    const demands = this.getAllDemands();
    
    // Vérifier le nombre de demandes en attente
    const pendingDemands = demands.filter(d => 
      d.userId === demand.userId && 
      ['pending', 'occupied'].includes(d.status)
    );

    if (pendingDemands.length >= 3) {
      throw new Error('Vous avez déjà 3 demandes en attente');
    }

    // Vérifier le poids total
    if (demand.totalWeight < 1 || demand.totalWeight > 10) {
      throw new Error('Le poids total doit être entre 1kg et 10kg');
    }

    demands.push(demand);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demands));
  }

  getAllDemands(): Demand[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  getUserDemands(userId: string): Demand[] {
    const demands = this.getAllDemands();
    return demands.filter(d => d.userId === userId);
  }

  updateDemandStatus(demandId: string, status: Demand['status'], collectorId?: string): void {
    const demands = this.getAllDemands();
    const index = demands.findIndex(d => d.id === demandId);
    if (index !== -1) {
      demands[index].status = status;
      if (collectorId) {
        demands[index].collectorId = collectorId;
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demands));
    }
  }

  deleteDemand(demandId: string): void {
    const demands = this.getAllDemands();
    const filteredDemands = demands.filter(d => d.id !== demandId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredDemands));
  }

  updateDemand(demand: Demand): void {
    const demands = this.getAllDemands();
    const index = demands.findIndex(d => d.id === demand.id);
    
    if (index !== -1 && demands[index].status === 'pending') {
      demands[index] = demand;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demands));
    } else {
      throw new Error('Cette demande ne peut plus être modifiée');
    }
  }

  getDemandsByCity(city: string): Demand[] {
    return this.getAllDemands().filter(d => 
      d.city.toLowerCase() === city.toLowerCase() || 
      this.normalizeCity(d.city) === this.normalizeCity(city)
    );
  }

  private normalizeCity(city: string): string {
    return city.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlève les accents
      .trim();
  }

  getCollectorDemands(collectorId: string): Demand[] {
    return this.getAllDemands().filter(d => d.collectorId === collectorId);
  }

  validateCollection(demandId: string, validation: {
    realWeight: number,
    verificationPhotos: string[],
    collectorId: string
  }): void {
    const demands = this.getAllDemands();
    const index = demands.findIndex(d => d.id === demandId);
    
    if (index !== -1) {
      const demand = demands[index];
      demand.status = 'completed';
      demand.realWeight = validation.realWeight;
      demand.verificationPhotos = validation.verificationPhotos;
      demand.collectorId = validation.collectorId;
      
      // Calculer et attribuer les points
      const earnedPoints = demand.materials.reduce((total, material) => {
        return total + (this.POINTS_RATES[material.type] * material.weight);
      }, 0);

      // Mettre à jour les points de l'utilisateur
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === demand.userId);
      if (userIndex !== -1) {
        users[userIndex].points = (users[userIndex].points || 0) + earnedPoints;
        localStorage.setItem('users', JSON.stringify(users));
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demands));
    }
  }

  rejectCollection(demandId: string, reason: string): void {
    const demands = this.getAllDemands();
    const index = demands.findIndex(d => d.id === demandId);
    
    if (index !== -1) {
      demands[index].status = 'rejected';
      demands[index].rejectionReason = reason;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demands));
    }
  }

  private initializeTestDemands(): void {
    const currentDemands = localStorage.getItem(this.STORAGE_KEY);
    console.log('Current demands in storage:', currentDemands);
    
    if (!currentDemands || JSON.parse(currentDemands).length === 0) {
      console.log('Initializing test demands...');
      const testDemands: Demand[] = [
        {
          id: 'DEM001',
          userId: 'USER001',
          materials: [
            { type: 'plastic', weight: 5 },
            { type: 'paper', weight: 3 }
          ],
          totalWeight: 8,
          address: '123 rue du Test, Agadir',
          city: 'agadir',  // Mis en minuscules pour correspondre
          collectionDate: new Date('2024-03-25'),
          timeSlot: '10:00-11:00',
          status: 'pending',
          createdAt: new Date()
        },
        {
          id: 'DEM002',
          userId: 'USER002',
          materials: [
            { type: 'glass', weight: 4 }
          ],
          totalWeight: 4,
          address: '456 avenue du Test, Safi',
          city: 'Safi',
          collectionDate: new Date('2024-03-26'),
          timeSlot: '14:00-15:00',
          status: 'pending',
          createdAt: new Date(),
          notes: 'Test demand 2'
        }
      ];

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(testDemands));
      console.log('Test demands saved:', testDemands);
    }
  }
} 