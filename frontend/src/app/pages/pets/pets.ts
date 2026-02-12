import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { PetsService } from '../../services/pets';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pets.html',
  styleUrls: ['./pets.scss']
})
export class PetsComponent {
  pets: any[] = [];
  loading = true;
  error = '';
  showForm = false;
  editingId: string | null = null;
  
  formData = {
    name: '',
    species: '',
    breed: '',
    ageYears: 0,
    sex: '',
    status: 'Available'
  };

  constructor(private petsSvc: PetsService) {}

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.loading = true;
    this.petsSvc.getAll().subscribe({
      next: (data) => {
        this.pets = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error cargando pets';
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
      species: '',
      breed: '',
      ageYears: 0,
      sex: '',
      status: 'Available'
    };
    this.editingId = null;
  }

  savePet() {
    if (this.editingId) {
      this.petsSvc.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.loadPets();
          this.toggleForm();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error actualizando pet';
        }
      });
    } else {
      this.petsSvc.create(this.formData).subscribe({
        next: () => {
          this.loadPets();
          this.toggleForm();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error creando pet';
        }
      });
    }
  }

  editPet(pet: any) {
    this.editingId = pet._id;
    this.formData = { ...pet };
    this.showForm = true;
  }

  deletePet(id: string) {
    if (confirm('¿Estás seguro de eliminar esta mascota?')) {
      this.petsSvc.delete(id).subscribe({
        next: () => {
          this.loadPets();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error eliminando pet';
        }
      });
    }
  }
}
