import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { LayoutComponent } from './layout/layout';
import { PetsComponent } from './pages/pets/pets';
import { SheltersComponent } from './pages/shelters/shelters';
import { AdoptersComponent } from './pages/adopters/adopters';
import { RequestsComponent } from './pages/requests/requests';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'pets', component: PetsComponent },
      { path: 'shelters', component: SheltersComponent },
      { path: 'adopters', component: AdoptersComponent },
      { path: 'requests', component: RequestsComponent },
      { path: '', redirectTo: 'pets', pathMatch: 'full' }
    ]
  }
];
