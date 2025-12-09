import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  suggestion: string | null = null;
  loading = true;
  error = false;
  loadingSuggestion = false;
  saving = false;
  suggestionShown = false; // Track if suggestion was already shown

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  getSuggestion(): void {
    if (!this.organization?.prompt) return;
    
    this.loadingSuggestion = true;
    this.orgService.getSuggestion(this.organization.prompt)
      .subscribe({
        next: (response) => {
          this.suggestion = response.suggestion;
          this.loadingSuggestion = false;
        },
        error: (err) => {
          this.showError('שגיאה בקבלת הצעה');
          this.loadingSuggestion = false;
        }
      });
  }

  acceptSuggestion(): void {
    if (this.suggestion && this.organization) {
      this.organization.prompt = this.suggestion;
      this.suggestion = null;
      this.suggestionShown = true; // Mark as shown to prevent re-fetching
      this.showSuccess('ההצעה אושרה');
      
      // Auto-save after accepting suggestion (but don't fetch suggestion again)
      this.save();
    }
  }

  rejectSuggestion(): void {
    this.suggestion = null;
    this.showSuccess('ההצעה נדחתה');
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
      
      // Auto-trigger suggestion only if not already shown
      if (!this.suggestionShown) {
        this.getSuggestion();
      }
    } catch (err) {
      this.showError('שגיאה בשמירה - נסה שוב');
    } finally {
      this.saving = false;
      this.suggestionShown = false; // Reset for future edits
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
