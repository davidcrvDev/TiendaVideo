import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DatosDecision {
  titulo: string;
  mensaje: string;
  id: number;
}

@Component({
  selector: 'app-decidir',
  templateUrl: './decidir.component.html',
  styleUrls: ['./decidir.component.css']
})
export class DecidirComponent {
  
  constructor(
    public dialogRef: MatDialogRef<DecidirComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: DatosDecision
  ) {}

  onConfirm(): void {
    this.dialogRef.close({ id: this.datos.id });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  
}
