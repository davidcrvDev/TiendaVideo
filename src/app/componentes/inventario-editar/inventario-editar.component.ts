import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inventario } from 'src/app/modelos/inventario';
import { Tecnologia } from 'src/app/modelos/tecnologia';
import { Titulo } from 'src/app/modelos/titulo';

export interface DatosInventario {
  encabezado: string;
  inventario: Inventario;
  titulos: Titulo[];
  tecnologias: Tecnologia[];
}

@Component({
  selector: 'app-inventario-editar',
  templateUrl: './inventario-editar.component.html',
  styleUrls: ['./inventario-editar.component.css']
})
export class InventarioEditarComponent {
  public botonAceptarDeshabilitado: boolean = true;

  @Input() public dialogRef = MatDialogRef <InventarioEditarComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: DatosInventario
  ) { 

  }

  ngOnInit(): void {
    this.validarFormulario();
  }

  public validarFormulario(): void {
    const { inventario } = this.datos;

    const tituloValido = inventario.titulo && inventario.titulo.id > 0;
    const disponibleValido = inventario.disponible && inventario.disponible > 0;
    const tecnologiaValido =inventario.tecnologia && inventario.tecnologia.id > 0;

    const precioValido = inventario.precio && inventario.precio >= 1000;
    const activoValido = inventario.activo && inventario.activo.length > 0;

    this.botonAceptarDeshabilitado = !(tituloValido && disponibleValido && tecnologiaValido && precioValido && activoValido);
  }
}
