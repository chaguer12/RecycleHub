import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProfileModalComponent } from '../update-profile-modal/update-profile-modal.component';
import { Demand } from '../model/demand.model';
import { DemandService } from '../services/demand.service';

@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html',
  styleUrl: './demand.component.css'
})
export class DemandComponent implements OnInit {
  demandForm!: FormGroup;
  materialTypes = ['plastic', 'glass', 'paper', 'metal'];
  timeSlots = Array.from({ length: 10 }, (_, i) => `${i + 9}:00-${i + 10}:00`);
  selectedFiles: File[] = [];
  user: any = {};
  demands: Demand[] = [];
  currentSection = 'demand';
  today = new Date().toISOString().split('T')[0];
  formErrors: { [key: string]: string } = {};
  successMessage = '';
  isSubmitting = false;
  minDate: string;
  maxDate: string;

  constructor(
    private fb: FormBuilder,
    private demandService: DemandService,
    private router: Router,
    private dialog: MatDialog
  ) {
    // Calcul de la date minimale (demain)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    // Calcul de la date maximale (30 jours après)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    this.maxDate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initForm();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
      this.demands = this.demandService.getUserDemands(this.user.id);
    } else {
      this.router.navigate(['/sign-in']);
    }
  }

  private initForm(): void {
    this.demandForm = this.fb.group({
      materials: this.fb.array([]),
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', Validators.required],
      collectionDate: ['', [
        Validators.required,
        (control: AbstractControl) => {
          const date = new Date(control.value);
          const today = new Date();
          const maxDate = new Date(this.maxDate);
          const minDate = new Date(this.minDate);
          
          if (date < minDate) {
            return { dateMin: true };
          }
          if (date > maxDate) {
            return { dateMax: true };
          }
          return null;
        }
      ]],
      timeSlot: ['', Validators.required],
      notes: ['']
    });
    this.addMaterial();
  }

  get materials(): FormArray {
    return this.demandForm.get('materials') as FormArray;
  }

  addMaterial(): void {
    if (this.materials.length < 4) {
      this.materials.push(this.fb.group({
        type: ['', Validators.required],
        weight: ['', [Validators.required, Validators.min(1)]]
      }));
    }
  }

  removeMaterial(index: number): void {
    this.materials.removeAt(index);
  }

  onFileSelect(event: any): void {
    this.selectedFiles = Array.from(event.target.files || []);
  }

  editDemand(demand: Demand): void {
    this.currentSection = 'demand';
    this.demandForm.patchValue({
      address: demand.address,
      city: demand.city,
      collectionDate: new Date(demand.collectionDate).toISOString().split('T')[0],
      timeSlot: demand.timeSlot,
      notes: demand.notes
    });

    // Réinitialiser les matériaux
    while (this.materials.length) {
      this.materials.removeAt(0);
    }
    
    // Ajouter les matériaux existants
    demand.materials.forEach(material => {
      this.materials.push(this.fb.group({
        type: [material.type, Validators.required],
        weight: [material.weight, [Validators.required, Validators.min(1)]]
      }));
    });

    // Stocker l'ID de la demande en cours d'édition
    this.demandForm.addControl('id', this.fb.control(demand.id));
  }

  deleteDemand(demandId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.demandService.deleteDemand(demandId);
      this.demands = this.demandService.getUserDemands(this.user.id);
    }
  }

  onSubmit(): void {
    if (this.demandForm.valid) {
      try {
        const formValue = this.demandForm.value;
        const createdAt = formValue.id ? 
          this.demands.find(d => d.id === formValue.id)?.createdAt || new Date() : 
          new Date();

        const demand = new Demand(
          formValue.id || Date.now().toString(),
          this.user.id,
          formValue.materials,
          this.materials.value.reduce((sum: number, m: any) => sum + Number(m.weight), 0),
          formValue.address,
          formValue.city,
          new Date(formValue.collectionDate),
          formValue.timeSlot,
          'pending',
          createdAt,
          formValue.notes,
          this.selectedFiles.map(file => URL.createObjectURL(file))
        );

        if (formValue.id) {
          this.demandService.updateDemand(demand);
        } else {
          this.demandService.createDemand(demand);
        }

        this.successMessage = formValue.id ? 'Demande modifiée avec succès!' : 'Demande soumise avec succès!';
        this.demandForm.reset();
        this.selectedFiles = [];
        setTimeout(() => this.currentSection = 'history', 2000);
      } catch (error: any) {
        this.formErrors['submit'] = error.message;
      }
    }
  }

  showSection(section: string): void {
    this.currentSection = section;
  }

  onLogout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/sign-in']);
  }

  editProfile(): void {
    const dialogRef = this.dialog.open(UpdateProfileModalComponent, {
      width: '500px',
      data: this.user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user = result;
        localStorage.setItem('currentUser', JSON.stringify(result));
      }
    });
  }

  deleteProfile(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter((u: { email: string }) => u.email !== this.user.email);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.removeItem('currentUser');
      this.router.navigate(['/sign-in']);
    }
  }

  calculateAvailablePoints(): number {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.points || 0;
  }

  convertPoints(pointsToConvert: number): void {
    const conversionRates: { [key: number]: number } = {
      100: 50,
      200: 120,
      500: 350
    };

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentPoints = user.points || 0;

    if (currentPoints >= pointsToConvert && conversionRates[pointsToConvert]) {
      const voucher = conversionRates[pointsToConvert];
      user.points -= pointsToConvert;
      
      // Sauvegarder les points mis à jour
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Mettre à jour aussi dans la liste des utilisateurs
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: { email: string }) => u.email === user.email);
      if (userIndex !== -1) {
        users[userIndex].points = user.points;
        localStorage.setItem('users', JSON.stringify(users));
      }

      alert(`Félicitations ! Vous avez converti ${pointsToConvert} points en bon d'achat de ${voucher} Dh`);
    }
  }
}

