import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/modelos/categoria';
import { Titulo } from 'src/app/modelos/titulo';

export interface DatosTitulo {
  encabezado: string;
  titulo: Titulo;
  categorias: Categoria[];
}

@Component({
  selector: 'app-titulo-editar',
  templateUrl: './titulo-editar.component.html',
  styleUrls: ['./titulo-editar.component.css']
})
export class TituloEditarComponent {
  public botonAceptarDeshabilitado: boolean = true;

  @Input() public dialogRef = MatDialogRef<TituloEditarComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: DatosTitulo
  ) {

  }

  ngOnInit(): void {
    this.validarFormulario();
  }

  public validarFormulario(): void {
    const { titulo } = this.datos;

    // Validaciones de los campos obligatorios
    const nombreValido = titulo.nombre && titulo.nombre.trim() !== "";
    const anoValido = titulo.ano && titulo.ano <= 2025 && titulo.ano > 0;
    const categoriaValida = titulo.categoria && titulo.categoria.id > 0; // La categoría debe estar seleccionada

    // Si todos los campos obligatorios están correctos, activamos el botón
    this.botonAceptarDeshabilitado = !(nombreValido && anoValido && categoriaValida);
  }

}
