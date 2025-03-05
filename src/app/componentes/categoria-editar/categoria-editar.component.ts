import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/modelos/categoria';

export interface DatosCategoria {
  encabezado: string;
  categoria: Categoria;
}

@Component({
  selector: 'app-categoria-editar',
  templateUrl: './categoria-editar.component.html',
  styleUrls: ['./categoria-editar.component.css']
})
export class CategoriaEditarComponent {
  public botonAceptarDeshabilitado: boolean = true;

  @Input() public dialogRef = MatDialogRef<CategoriaEditarComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: DatosCategoria
  ) {

  }

  ngOnInit(): void {
    this.validarFormulario();
  }

  public validarFormulario(): void {
    const { categoria } = this.datos;

    const nombreValido = categoria.nombre && categoria.nombre.trim() !== "";

    this.botonAceptarDeshabilitado = !(nombreValido);
  }
}
