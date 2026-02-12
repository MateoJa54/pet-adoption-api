import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SheltersService } from '../../services/shelters';

@Component({
  selector: 'app-shelters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './shelters.html',
  styleUrls: ['./shelters.scss']
})
export class SheltersComponent {
  shelters: any[] = [];
  loading = true;
  error = '';
  showForm = false;
  editingId: string | null = null;
  
  formData = {
    name: '',
    address: '',
    phone: '',
    email: ''
  };

  constructor(private sheltersSvc: SheltersService) {}

  ngOnInit() {
    this.loadShelters();
  }

  loadShelters() {
    this.loading = true;
    this.sheltersSvc.getAll().subscribe({
      next: (data) => {
        this.shelters = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error cargando shelters';
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
      name: '',
      address: '',
      phone: '',
      email: ''
    };
    this.editingId = null;
  }

  saveShelter() {
    if (this.editingId) {
      this.sheltersSvc.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.loadShelters();
          this.toggleForm();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error actualizando shelter';
        }
      });
    } else {
      this.sheltersSvc.create(this.formData).subscribe({
        next: () => {
          this.loadShelters();
          this.toggleForm();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error creando shelter';
        }
      });
    }
  }

  editShelter(shelter: any) {
    this.editingId = shelter._id;
    this.formData = { ...shelter };
    this.showForm = true;
  }

  deleteShelter(id: string) {
    if (confirm('¿Estás seguro de eliminar este refugio?')) {
      this.sheltersSvc.delete(id).subscribe({
        next: () => {
          this.loadShelters();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error eliminando shelter';
        }
      });
    }
  }
}
