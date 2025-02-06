import { Component,OnInit } from '@angular/core';


@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html',
  styleUrl: './demand.component.css',
  standalone:false
})
export class DemandComponent implements OnInit {
  user: any = {}; 
  demands: any[] = [];
  newDemand = { type: 'Plastic', quantity: 0 };
  currentSection: string = 'profile'; // Default section

  ngOnInit(): void {
    // Load user profile from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }

    // Load demands from localStorage
    const storedDemands = localStorage.getItem('demands');
    if (storedDemands) {
      this.demands = JSON.parse(storedDemands);
    }
  }

  showSection(section: string): void {
    this.currentSection = section;
  }

  submitDemand(event: Event): void {
    event.preventDefault();
    
    if (this.newDemand.quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const demand = { 
      ...this.newDemand, 
      date: new Date().toLocaleString()
    };

    this.demands.push(demand);
    localStorage.setItem('demands', JSON.stringify(this.demands));
    
    alert('Demand submitted successfully!');
    this.newDemand = { type: 'Plastic', quantity: 0 };
  }

  onLogout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('demands');
    window.location.href = '/log-in'; 
  }
}
