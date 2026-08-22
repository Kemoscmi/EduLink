import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface ResenaDialogData {
  servicioNombre: string;
  tutorNombre: string;
}

@Component({
  selector: 'app-resena-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './resena-dialog.html',
  styleUrl: './resena-dialog.css',
})
export class ResenaDialog {
  private readonly dialogRef = inject(MatDialogRef<ResenaDialog>);
  readonly data = inject<ResenaDialogData>(MAT_DIALOG_DATA);

  puntuacion = signal(5);
  comentario = signal('');
  intentoEnviar = signal(false);

  setRating(val: number): void {
    this.puntuacion.set(val);
  }

  confirmar(): void {
    this.intentoEnviar.set(true);
    const commentVal = this.comentario().trim();
    if (commentVal.length < 5 || commentVal.length > 355) {
      return;
    }
    this.dialogRef.close({
      puntuacion: this.puntuacion(),
      comentario: commentVal,
    });
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
