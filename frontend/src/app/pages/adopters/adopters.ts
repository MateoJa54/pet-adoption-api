import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AdoptersService } from '../../services/adopters';

@Component({
  selector: 'app-adopters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './adopters.html',
  styleUrls: ['./adopters.scss']
})
export class AdoptersComponent implements OnInit {

  adopters: any[] = [];
  loading = true;
  error = '';
  showForm = false;
  editingId: string | null = null;
  
  formData = {
    fullName: '',
    nationalId: '',
    phone: '',
    email: ''
  };

  constructor(private adoptersSvc: AdoptersService) {}

  ngOnInit() {
    this.loadAdopters();
  }

  loadAdopters() {
    this.loading = true;
    this.adoptersSvc.getAll().subscribe({
      next: (data) => {
        this.adopters = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error cargando adopters';
        this.loading = false;
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.formData = {
      fullName: '',
      nationalId: '',
      phone: '',
      email: ''
    };
    this.editingId = null;
  }

  saveAdopter() {
    if (this.editingId) {
      this.adoptersSvc.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.loadAdopters();
          this.toggleForm();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error actualizando adopter';
        }
      });
    } else {
      this.adoptersSvc.create(this.formData).subscribe({
        next: () => {
          this.loadAdopters();
          this.toggleForm();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error creando adopter';
        }
      });
    }
  }

  editAdopter(adopter: any) {
    this.editingId = adopter._id;
    this.formData = { ...adopter };
    this.showForm = true;
  }

  deleteAdopter(id: string) {
    if (confirm('¿Estás seguro de eliminar este adoptante?')) {
      this.adoptersSvc.delete(id).subscribe({
        next: () => {
          this.loadAdopters();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error eliminando adopter';
        }
      });
    }
  }
}
