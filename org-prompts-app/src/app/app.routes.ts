import { Routes } from '@angular/router';
import { OrgListComponent } from './pages/org-list.component';
import { OrgDetailComponent } from './pages/org-detail.component';

export const routes: Routes = [
  { path: '', component: OrgListComponent, title: 'מנהל פרומפטים' },
  { path: 'org/:id', component: OrgDetailComponent, title: 'פרטי ארגון' },
  { path: '**', redirectTo: '' }
];
