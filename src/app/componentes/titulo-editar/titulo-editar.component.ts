import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/modelos/categoria';
import { Titulo } from 'src/app/modelos/titulo';
import { TituloService } from 'src/app/servicios/titulo.service';

export interface DatosTitulo {
  encabezado: string;
  titulo: Titulo;
  categorias: Categoria[];
  tituloService: TituloService;
}

@Component({
  selector: 'app-titulo-editar',
  templateUrl: './titulo-editar.component.html',
  styleUrls: ['./titulo-editar.component.css'],
})
export class TituloEditarComponent {
  public botonAceptarDeshabilitado: boolean = true;

  @Input() public dialogRef = MatDialogRef<TituloEditarComponent>;

  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosTitulo) {}

  ngOnInit(): void {
    this.validarFormulario();
  }

  public validarFormulario(): void {
    const { titulo } = this.datos;

    const nombreValido = titulo.nombre && titulo.nombre.trim() !== '';
    const anoValido = titulo.ano && titulo.ano <= 2025 && titulo.ano > 0;
    const categoriaValida = titulo.categoria && titulo.categoria.id > 0; // La categoría debe estar seleccionada
    const nombreNormalizado = titulo.nombre
      ? titulo.nombre.trim().toLowerCase()
      : '';

    // Si todos los campos obligatorios están correctos, activamos el botón
    this.botonAceptarDeshabilitado = !(
      nombreValido &&
      anoValido &&
      categoriaValida
    );

    if (nombreNormalizado === '') {
      this.botonAceptarDeshabilitado = true;
      return;
    }

    this.datos.tituloService.existeTitulo(nombreNormalizado).subscribe(
      (existe) => {
        this.botonAceptarDeshabilitado = existe;
      },
      (err) => {
        console.error('Error validando titulo:', err);
        this.botonAceptarDeshabilitado = true;
      }
    );
  }
  
   public soloNumeros(event: KeyboardEvent) {
    // Permite solo números
    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
    }
  }
}