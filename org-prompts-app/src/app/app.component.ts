import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrganizationService, Organization } from './services/organization.service';
import { OrgDetailModalComponent } from './components/org-detail-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="app-container">
      <h1>Organization Prompts Manager</h1>
      
      <button mat-raised-button color="primary" (click)="openAddModal()">
        + Add Organization
      </button>

      <table mat-table [dataSource]="organizations" class="org-table">
        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Organization</th>
          <td mat-cell *matCellDef="let element">{{ element.name }}</td>
        </ng-container>

        <!-- Prompt Column -->
        <ng-container matColumnDef="prompt">
          <th mat-header-cell *matHeaderCellDef>Prompt</th>
          <td mat-cell *matCellDef="let element">{{ element.prompt }}</td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button (click)="openEditModal(element)" color="accent" title="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button (click)="confirmDelete(element)" color="warn" title="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
    }
    button {
      margin-bottom: 20px;
    }
    .org-table {
      width: 100%;
      border-collapse: collapse;
    }
    table {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    tr:hover {
      background-color: #f9f9f9;
    }
  `]
})
export class AppComponent implements OnInit {
  organizations: Organization[] = [];
  displayedColumns: string[] = ['name', 'prompt', 'actions'];

  constructor(
    private orgService: OrganizationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.orgService.getOrganizations().subscribe(orgs => {
      this.organizations = orgs;
    });
  }

  openAddModal(): void {
    const dialogRef = this.dialog.open(OrgDetailModalComponent, {
      width: '500px',
      data: {
        organization: { name: '', prompt: '' },
        isNew: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orgService.addOrganization(result);
      }
    });
  }

  openEditModal(org: Organization): void {
    const dialogRef = this.dialog.open(OrgDetailModalComponent, {
      width: '500px',
      data: {
        organization: { ...org },
        isNew: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && org._id) {
        this.orgService.updateOrganization(org._id, result);
      }
    });
  }

  confirmDelete(org: Organization): void {
    if (confirm(`Are you sure you want to delete "${org.name}"?`)) {
      if (org._id) {
        this.orgService.removeOrganization(org._id);
      }
    }
  }
}
