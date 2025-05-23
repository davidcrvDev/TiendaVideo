import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Alquiler } from 'src/app/modelos/alquiler';
import { Inventario } from 'src/app/modelos/inventario';
import { Cliente } from 'src/app/modelos/cliente';
import { Titulo } from 'src/app/modelos/titulo';
import { DetalleAlquiler } from 'src/app/modelos/detallealquiler';

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
  styleUrls: ['./alquiler-editar.component.css'],
})
export class AlquilerEditarComponent {
  @Input() public dialogRef = MatDialogRef<AlquilerEditarComponent>;

  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosAlquiler) {}

  alquiler: Alquiler = new Alquiler();
  detalleTemporal: DetalleAlquiler = {
    id: 0,
    alquiler: new Alquiler(),
    inventario: new Inventario(),
    cantidad: 0,
    precioUnitario: 0,
    subtotal: 0,
  };
  inventario: Inventario[] = [];
  editando: boolean = false;
  indexEditando: number = -1;
  columnasTabla: string[] = [
    'inventario',
    'cantidad',
    'precioUnitario',
    'subtotal',
    'acciones',
  ];

  calcularFechaDevolucion() {
    if (this.datos.alquiler.fechaPrestamo && this.datos.alquiler.plazo) {
      const fechaPrestamo = new Date(this.datos.alquiler.fechaPrestamo);
      const plazo = this.datos.alquiler.plazo;

      const fechaDevolucion = new Date(fechaPrestamo);
      fechaDevolucion.setDate(fechaPrestamo.getDate() + plazo);

      this.datos.alquiler.fechaDevolucion = fechaDevolucion; //.toISOString().substring(0, 10);
    }
  }

  editarDetalle(index: number) {
    this.detalleTemporal = { ...this.datos.alquiler.detalles[index] };
    this.editando = true;
    this.indexEditando = index;
  }

  eliminarDetalle(index: number) {
    this.datos.alquiler.detalles.splice(index, 1);
  }

  agregarODetalle(detalle: DetalleAlquiler) {
    // Asegurar que el detalle contiene una instancia real del inventario
    if (!detalle.inventario || detalle.cantidad <= 0) return;

  if (this.editando && this.indexEditando >= 0) {
    this.datos.alquiler.detalles[this.indexEditando] = { ...detalle };
    this.editando = false;
    this.indexEditando = -1;
  } else {
    this.datos.alquiler.detalles.push({ ...detalle });
  }

  this.detalleTemporal = new DetalleAlquiler();
  this.detalleTemporal.inventario = new Inventario(); // reinicializar
  }

  actualizarDatosInventario() {
    const invSel = this.detalleTemporal.inventario;
    if (invSel) {
      this.detalleTemporal.precioUnitario = invSel.precio;
      this.actualizarSubtotal();
    }
  }

  actualizarSubtotal() {
    this.detalleTemporal.subtotal =
      (this.detalleTemporal.cantidad || 0) *
      (this.detalleTemporal.precioUnitario || 0);
  }

  calcularPrecioTotal(): number {
    return this.datos.alquiler.detalles.reduce(
      (total, d) => total + d.subtotal,
      0
    );
  }
}
