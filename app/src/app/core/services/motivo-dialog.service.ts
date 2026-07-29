import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MotivoDialog, MotivoDialogData } from '../../shared/components/motivo-dialog/motivo-dialog';

@Injectable({
  providedIn: 'root',
})
export class MotivoDialogService {
  private readonly dialog = inject(MatDialog);

  solicitar(data: MotivoDialogData) {
    return this.dialog
      .open(MotivoDialog, {
        data,
        width: '420px',
        autoFocus: false,
      })
      .afterClosed();
  }
}
