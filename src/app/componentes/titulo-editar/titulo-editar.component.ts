import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Empresa } from 'src/app/modelos/empresa';
import { Titulo } from 'src/app/modelos/titulo';

export interface DatosTitulo {
  encabezado: string;
  titulo: Titulo;
  empresas: Empresa[];
}

@Component({
  selector: 'app-titulo-editar',
  templateUrl: './titulo-editar.component.html',
  styleUrls: ['./titulo-editar.component.css']
})
export class TituloEditarComponent {

  @Input() public dialogRef = MatDialogRef<TituloEditarComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: DatosTitulo
  ) {

  }

}
