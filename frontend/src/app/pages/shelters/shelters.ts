import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SheltersService } from '../../services/shelters';

@Component({
  selector: 'app-shelters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shelters.html',
  styleUrls: ['./shelters.scss']
})
export class SheltersComponent {
  shelters: any[] = [];
  loading = true;
  error = '';

  constructor(private sheltersSvc: SheltersService) {}

  ngOnInit() {
    this.sheltersSvc.getAll().subscribe({
      next: (data) => {
        this.shelters = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando shelters';
        this.loading = false;
      }
    });
  }
}
