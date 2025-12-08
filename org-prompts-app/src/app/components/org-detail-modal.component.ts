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
  templateUrl: './org-detail-modal.component.html',
  styleUrl: './org-detail-modal.component.css'
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
