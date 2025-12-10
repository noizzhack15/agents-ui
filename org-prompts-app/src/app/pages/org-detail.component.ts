import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrganizationService, Organization } from '../services/organization.service';

@Component({
  selector: 'app-org-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
],
  templateUrl: './org-detail.component.html',
  styleUrl: './org-detail.component.css'
})
export class OrgDetailComponent implements OnInit {
  organization: Organization | null = null;
  originalPrompt: string = '';
  loading = true;
  error = false;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private orgService: OrganizationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadOrganization(id);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  get isModified(): boolean {
    return this.organization?.prompt !== this.originalPrompt;
  }

  private loadOrganization(id: string): void {
    this.loading = true;
    this.error = false;

    this.orgService.getOrganizations().subscribe(orgs => {
      // If organizations list is empty, wait for service to load data
      if (orgs.length === 0) {
        // Service is still loading, wait for next emission
        return;
      }

      const found = orgs.find(o => o._id === id || o.id === id);
      
      if (found) {
        this.organization = { ...found };
        this.originalPrompt = found.prompt;
        this.loading = false;
      } else {
        // Data is loaded but org not found
        this.error = true;
        this.loading = false;
      }
    });
  }

  async save(): Promise<void> {
    if (!this.organization || this.saving) return;
    
    const id = this.organization._id || this.organization.id;
    if (!id) return;

    this.saving = true;
    try {
      await this.orgService.updateOrganization(id, this.organization);
      this.originalPrompt = this.organization.prompt;
      this.showSuccess('נשמר בהצלחה');
    } catch (err) {
      this.showError('שגיאה בשמירה - נסה שוב');
    } finally {
      this.saving = false;
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'סגור', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'סגור', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
}
