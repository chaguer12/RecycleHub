import { Injectable } from '@angular/core';
import { Demand } from '../model/demand.model';

@Injectable({
  providedIn: 'root'
})
export class DemandService {
  private readonly STORAGE_KEY = 'demands';

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

  updateDemandStatus(demandId: string, status: Demand['status']): void {
    const demands = this.getAllDemands();
    const index = demands.findIndex(d => d.id === demandId);
    if (index !== -1) {
      demands[index].status = status;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demands));
    }
  }

  deleteDemand(demandId: string): void {
    const demands = this.getAllDemands();
    const filteredDemands = demands.filter(d => d.id !== demandId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredDemands));
  }
} 