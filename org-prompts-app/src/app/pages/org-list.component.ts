import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrganizationService, Organization } from '../services/organization.service';
import { OrgDetailModalComponent } from '../components/org-detail-modal.component';

@Component({
  selector: 'app-org-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './org-list.component.html',
  styleUrl: './org-list.component.css'
})
export class OrgListComponent implements OnInit {
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
        isNew: true,
        existingOrganizations: this.organizations
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        this.orgService.addOrganization(result);
      }
    });
  }

  openEditModal(org: Organization): void {
    const dialogRef = this.dialog.open(OrgDetailModalComponent, {
      width: '500px',
      data: {
        organization: { ...org },
        isNew: false,
        existingOrganizations: this.organizations,
        currentOrgId: org._id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && org._id) {
        this.orgService.updateOrganization(org._id, result);
      }
    });
  }

  confirmDelete(org: Organization): void {
    if (confirm(`האם אתה בטוח שברצונך למחוק "${org.name}"?`)) {
      if (org._id) {
        this.orgService.removeOrganization(org._id);
      }
    }
  }
}
