import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
  organization: any;
  isNew: boolean;
}

@Component({
  selector: 'app-org-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="modal-container">
      <h2>{{ data.isNew ? 'Add Organization' : 'Edit Organization' }}</h2>
      
      <form (ngSubmit)="onSave()">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Organization Name</mat-label>
          <input matInput [(ngModel)]="data.organization.name" name="name" required />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Prompt</mat-label>
          <textarea matInput [(ngModel)]="data.organization.prompt" name="prompt" rows="4" required></textarea>
        </mat-form-field>

        <div class="modal-actions">
          <button mat-raised-button type="submit" color="primary">Save</button>
          <button mat-raised-button (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .modal-container {
      padding: 20px;
      min-width: 400px;
    }
    h2 {
      margin-top: 0;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .modal-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class OrgDetailModalComponent {
  constructor(
    public dialogRef: MatDialogRef<OrgDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onSave(): void {
    this.dialogRef.close(this.data.organization);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
