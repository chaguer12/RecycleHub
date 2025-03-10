import { Component, OnInit } from '@angular/core';
import { DemandService } from '../services/demand.service';
import { CollectorService } from '../services/collector.service';
import { Demand } from '../model/demand.model';
import { User } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collector-dashboard',
  templateUrl: './collector-dashboard.component.html',
  styleUrls: ['./collector-dashboard.component.css'],
  standalone: false
})
export class CollectorDashboardComponent implements OnInit {
  collector: User | null = null;
  availableDemands: Demand[] = [];
  currentDemands: Demand[] = [];
  selectedDemand: Demand | null = null;
  verificationPhotos: File[] = [];

  constructor(
    private demandService: DemandService,
    private collectorService: CollectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.collector = JSON.parse(currentUser);
      this.loadDemands();
    }
  }

  private loadDemands(): void {
    if (this.collector) {
      console.log('Collector:', this.collector);
      console.log('Collector city:', this.collector.city);
      console.log('Collector zones:', this.collector.collectionZones);

      // Récupérer toutes les demandes d'abord
      const allDemands = this.demandService.getAllDemands();
      console.log('All demands:', allDemands);

      // Filtrer par ville
      const cityDemands = this.demandService.getDemandsByCity(this.collector.city);
      console.log('City demands:', cityDemands);

      // Appliquer les filtres un par un pour voir lequel pose problème
      this.availableDemands = allDemands.filter(d => {
        const cityMatch = d.city.toLowerCase() === this.collector?.city.toLowerCase();
        const isPending = d.status === 'pending';
        const isInZone = this.collector?.collectionZones?.includes(d.city);

        console.log('Demand:', d.id);
        console.log('- City match:', cityMatch, '(demand:', d.city, 'collector:', this.collector?.city, ')');
        console.log('- Is pending:', isPending);
        console.log('- Is in zone:', isInZone);

        return cityMatch && isPending && isInZone;
      });

      console.log('Final available demands:', this.availableDemands);
      this.currentDemands = this.demandService.getCollectorDemands(this.collector.id);
    } else {
      console.log('No collector found in loadDemands');
    }
  }

  acceptDemand(demand: Demand): void {
    if (this.collector) {
      this.demandService.updateDemandStatus(demand.id, 'occupied', this.collector.id);
      this.loadDemands();
    }
  }

  startCollection(demand: Demand): void {
    this.demandService.updateDemandStatus(demand.id, 'in_progress');
    this.selectedDemand = demand;
    this.loadDemands();
  }

  onVerificationPhotoSelect(event: any): void {
    this.verificationPhotos = Array.from(event.target.files || []);
  }

  validateCollection(demand: Demand, realWeight: number): void {
    if (this.collector) {
      const weightDifference = Math.abs(realWeight - demand.totalWeight);
      const isWeightValid = weightDifference <= demand.totalWeight * 0.1; // 10% de tolérance

      if (isWeightValid) {
        this.demandService.validateCollection(demand.id, {
          realWeight,
          verificationPhotos: this.verificationPhotos.map(file => URL.createObjectURL(file)),
          collectorId: this.collector.id
        });
        this.selectedDemand = null;
        this.verificationPhotos = [];
      } else {
        this.rejectCollection(demand, 'Poids réel trop différent du poids déclaré');
      }
      this.loadDemands();
    }
  }

  rejectCollection(demand: Demand, reason: string): void {
    this.demandService.rejectCollection(demand.id, reason);
    this.selectedDemand = null;
    this.verificationPhotos = [];
    this.loadDemands();
  }

  onLogout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/collector/login']);
  }
} 