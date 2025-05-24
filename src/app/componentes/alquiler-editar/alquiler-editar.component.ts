import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Alquiler } from 'src/app/modelos/alquiler';
import { Inventario } from 'src/app/modelos/inventario';
//import { Inventario } from 'src/app/modelos/inventario';
import { Cliente } from 'src/app/modelos/cliente';
import { Titulo } from 'src/app/modelos/titulo';

export interface DatosAlquiler {
  encabezado: string;
  alquiler: Alquiler;
  inventario: Inventario[];
  titulos: Titulo[];
  clientes: Cliente[];
  fechaPrestamo: Date;
  plazo: number;
  fechaDevolucion: Date;
  precio: number;
}

@Component({
  selector: 'app-alquiler-editar',
  templateUrl: './alquiler-editar.component.html',
  styleUrls: ['./alquiler-editar.component.css']
})

export class AlquilerEditarComponent {
  @Input() public dialogRef = MatDialogRef<AlquilerEditarComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: DatosAlquiler
  ) {

  }


}
