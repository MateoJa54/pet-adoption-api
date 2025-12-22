import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetsService } from '../../services/pets';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pets.html',
  styleUrls: ['./pets.scss']
})
export class PetsComponent {
  pets: any[] = [];
  loading = true;
  error = '';

  constructor(private petsSvc: PetsService) {}

  ngOnInit() {
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
}
