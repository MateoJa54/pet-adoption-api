import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdoptionRequestsService } from '../../services/adoption-requests';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.html',
  styleUrls: ['./requests.scss']
})
export class RequestsComponent implements OnInit {

  requests: any[] = [];
  loading = true;
  error = '';

  constructor(private reqSvc: AdoptionRequestsService) {}

  ngOnInit() {
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
}
