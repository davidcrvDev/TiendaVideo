import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetalleAlquiler } from 'src/app/modelos/detallealquiler';
import { Inventario } from 'src/app/modelos/inventario';

export interface DatosDetalleAlquiler {
  encabezado: string;
  detalleAlquiler: DetalleAlquiler;
  inventarios: Inventario[];
}

@Component({
  selector: 'app-detallealquiler-editar',
  templateUrl: './detallealquiler-editar.component.html',
  styleUrls: ['./detallealquiler-editar.component.css'],
})
export class DetallealquilerEditarComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosDetalleAlquiler) {}

  @Output() detalleGuardado = new EventEmitter<DetalleAlquiler>();

  actualizarInfoInventario() {
    if (this.datos.detalleAlquiler.inventario) {
      this.datos.detalleAlquiler.precioUnitario = this.datos.detalleAlquiler.inventario.precio;
      this.calcularSubtotal();
    }
  }

  calcularSubtotal() {
    const detalle = this.datos.detalleAlquiler;
    detalle.subtotal = (detalle.cantidad || 0) * (detalle.precioUnitario || 0);
  }

  guardarDetalle() {
    this.detalleGuardado.emit({ ...this.datos.detalleAlquiler });
  }
}
// git para fabith