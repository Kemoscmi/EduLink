import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData) {
    return this.dialog
      .open(ConfirmDialog, {
        data,
        width: '360px',
        autoFocus: false,
      })
      .afterClosed();
  }
}
