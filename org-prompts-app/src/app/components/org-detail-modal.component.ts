import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
  organization: any;
  isNew: boolean;
  existingOrganizations: any[];
  currentOrgId?: string;
}

@Component({
  selector: 'app-org-detail-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './org-detail-modal.component.html',
  styleUrl: './org-detail-modal.component.css'
})
export class OrgDetailModalComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrgDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data.organization.name, [Validators.required, this.duplicateNameValidator.bind(this)]],
      prompt: [this.data.organization.prompt, Validators.required]
    });
  }

  duplicateNameValidator(control: any) {
    const name = control.value?.trim();
    
    if (!name) {
      return null;
    }

    const duplicate = this.data.existingOrganizations.find(org => {
      if (!this.data.isNew && (org._id === this.data.currentOrgId || org.id === this.data.currentOrgId)) {
        return false;
      }
      return org.name.trim().toLowerCase() === name.toLowerCase();
    });

    return duplicate ? { duplicateName: true } : null;
  }

  get nameControl() {
    return this.form.get('name');
  }

  get promptControl() {
    return this.form.get('prompt');
  }

  getNameError(): string {
    if (this.nameControl?.hasError('required')) {
      return 'שם הארגון הוא שדה חובה';
    }
    if (this.nameControl?.hasError('duplicateName')) {
      return 'כבר קיים אחראי כזה';
    }
    return '';
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
