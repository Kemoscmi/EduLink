import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface MotivoDialogData {
  title: string;
  message: string;
  motivoLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: string;
  danger?: boolean;
  minLength?: number;
}

@Component({
  selector: 'app-motivo-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './motivo-dialog.html',
  styleUrl: './motivo-dialog.css',
})
export class MotivoDialog {
  private readonly dialogRef = inject(MatDialogRef<MotivoDialog>);
  readonly data = inject<MotivoDialogData>(MAT_DIALOG_DATA);

  readonly minLength = this.data.minLength ?? 5;

  motivo = signal('');
  intentoEnviar = signal(false);

  esInvalido = computed(() => this.motivo().trim().length < this.minLength);
  mostrarError = computed(() => this.intentoEnviar() && this.esInvalido());

  confirmar(): void {
    this.intentoEnviar.set(true);

    if (this.esInvalido()) return;

    this.dialogRef.close(this.motivo().trim());
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
