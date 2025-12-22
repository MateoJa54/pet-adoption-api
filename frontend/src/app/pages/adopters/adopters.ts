import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdoptersService } from '../../services/adopters';

@Component({
  selector: 'app-adopters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adopters.html',
  styleUrls: ['./adopters.scss']
})
export class AdoptersComponent implements OnInit {

  adopters: any[] = [];
  loading = true;
  error = '';

  constructor(private adoptersSvc: AdoptersService) {}

  ngOnInit() {
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
}
