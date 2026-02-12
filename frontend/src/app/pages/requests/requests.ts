import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AdoptionRequestsService } from '../../services/adoption-requests';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './requests.html',
  styleUrls: ['./requests.scss']
})
export class RequestsComponent implements OnInit {

  requests: any[] = [];
  loading = true;
  error = '';
  showForm = false;
  editingId: string | null = null;
  
  formData = {
    petId: '',
    adopterId: '',
    status: 'Pending',
    comments: ''
  };

  constructor(private reqSvc: AdoptionRequestsService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.reqSvc.getAll().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error cargando requests';
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
      petId: '',
      adopterId: '',
      status: 'Pending',
      comments: ''
    };
    this.editingId = null;
  }

  saveRequest() {
    if (this.editingId) {
      this.reqSvc.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.loadRequests();
          this.toggleForm();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error actualizando request';
        }
      });
    } else {
      this.reqSvc.create(this.formData).subscribe({
        next: () => {
          this.loadRequests();
          this.toggleForm();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error creando request';
        }
      });
    }
  }

  editRequest(request: any) {
    this.editingId = request._id;
    this.formData = { ...request };
    this.showForm = true;
  }

  deleteRequest(id: string) {
    if (confirm('¿Estás seguro de eliminar esta solicitud?')) {
      this.reqSvc.delete(id).subscribe({
        next: () => {
          this.loadRequests();
        },
        error: (err) => {
          this.error = err?.error?.message ?? 'Error eliminando request';
        }
      });
    }
  }
}
