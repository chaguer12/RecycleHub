import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private demandService: DemandService,
    private router: Router,
    private dialog: MatDialog
  ) {}

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
      collectionDate: ['', Validators.required],
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

  onSubmit(): void {
    if (this.demandForm.valid) {
      try {
        const demand = new Demand(
          Date.now().toString(),
          this.user.id,
          this.demandForm.value.materials,
          this.materials.value.reduce((sum: number, m: any) => sum + Number(m.weight), 0),
          this.demandForm.value.address,
          this.demandForm.value.city,
          new Date(this.demandForm.value.collectionDate),
          this.demandForm.value.timeSlot,
          'pending',
          new Date(),
          this.demandForm.value.notes,
          this.selectedFiles.map(file => URL.createObjectURL(file))
        );

        this.demandService.createDemand(demand);
        this.successMessage = 'Demande soumise avec succès!';
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
      const updatedUsers = users.filter((u: any) => u.email !== this.user.email);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.removeItem('currentUser');
      this.router.navigate(['/sign-in']);
    }
  }
}

