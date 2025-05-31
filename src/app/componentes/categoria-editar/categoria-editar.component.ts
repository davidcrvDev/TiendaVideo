import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/modelos/categoria';
import { CategoriaService } from 'src/app/servicios/categoria.service';

export interface DatosCategoria {
  encabezado: string;
  categoria: Categoria;
  categoriaService: CategoriaService;
}

@Component({
  selector: 'app-categoria-editar',
  templateUrl: './categoria-editar.component.html',
  styleUrls: ['./categoria-editar.component.css'],
})
export class CategoriaEditarComponent {
  public botonAceptarDeshabilitado: boolean = true;

  //@Input() public dialogRef = MatDialogRef<CategoriaEditarComponent>;

  constructor(
    public dialogRef: MatDialogRef<CategoriaEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: DatosCategoria
  ) {}

  ngOnInit(): void {
    this.validarFormulario();
  }

  public validarFormulario(): void {
    const { categoria } = this.datos;
    const nombreValido = categoria.nombre && categoria.nombre.trim() !== '';
    const nombreNormalizado = categoria.nombre
      ? categoria.nombre.trim().toLowerCase()
      : '';

    this.botonAceptarDeshabilitado = !nombreValido;

    if (nombreNormalizado === '') {
      this.botonAceptarDeshabilitado = true;
      return;
    }

    this.datos.categoriaService.existeCategoria(nombreNormalizado).subscribe(
      (existe) => {
        this.botonAceptarDeshabilitado = existe;
      },
      (err) => {
        console.error('Error validando categoría:', err);
        this.botonAceptarDeshabilitado = true;
      }
    );
  }
}
