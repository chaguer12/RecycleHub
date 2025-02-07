import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { CollectionRequest } from '../models/collection.model';
import * as CollectionActions from '../store/collection/collection.actions';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private store: Store) {}

  createCollectionRequest(request: CollectionRequest): void {
    // Validation du poids total
    if (request.totalWeight < 1 || request.totalWeight > 10) {
      throw new Error('Le poids total doit être entre 1kg et 10kg');
    }

    // Vérification du nombre de demandes en attente
    const pendingRequests = this.getPendingRequestsCount(request.userId);
    if (pendingRequests >= 3) {
      throw new Error('Maximum 3 demandes en attente autorisées');
    }

    // Récupérer les demandes existantes
    const collections = this.getCollectionsFromStorage();
    
    // Ajouter la nouvelle demande
    collections.push(request);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('collections', JSON.stringify(collections));

    // Dispatch pour NgRx
    this.store.dispatch(CollectionActions.createRequest({ request }));
  }

  updateCollectionStatus(collectionId: string, status: string, collectorId?: string): void {
    const collection = this.getCollectionById(collectionId);
    if (collection) {
      collection.status = status as 'pending' | 'occupied' | 'in_progress' | 'completed' | 'rejected';
      if (collectorId) {
        collection.collectorId = collectorId;
      }
      // Mise à jour dans le store
    }
  }

  getUserCollections(userId: string): Observable<CollectionRequest[]> {
    const collections = this.getCollectionsFromStorage();
    return of(collections.filter(c => c.userId === userId));
  }

  getCollectorCollections(city: string): Observable<CollectionRequest[]> {
    const collections = this.getCollectionsFromStorage();
    return of(collections.filter(c => 
      c.status === 'pending' && 
      c.city.toLowerCase() === city.toLowerCase()
    ));
  }

  private getCollectionsFromStorage(): CollectionRequest[] {
    return JSON.parse(localStorage.getItem('collections') || '[]');
  }

  private getPendingRequestsCount(userId: string): number {
    const collections = JSON.parse(localStorage.getItem('collections') || '[]');
    return collections.filter((c: CollectionRequest) => 
      c.userId === userId && 
      ['pending', 'occupied'].includes(c.status)
    ).length;
  }

  private getCollectionById(collectionId: string): CollectionRequest | undefined {
    const collections = this.getCollectionsFromStorage();
    return collections.find(c => c.id === collectionId);
  }
} 