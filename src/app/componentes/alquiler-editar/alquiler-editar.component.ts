import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Alquiler } from 'src/app/modelos/alquiler';
import { Inventario } from 'src/app/modelos/inventario';
//import { Inventario } from 'src/app/modelos/inventario';
import { Cliente } from 'src/app/modelos/cliente';
import { Titulo } from 'src/app/modelos/titulo';

export interface DatosAlquiler {
  encabezado: string;
  alquiler: Alquiler;
  inventarios: Inventario[];
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
  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosAlquiler) {}

  ngOnInit() {
  console.log('Inventarios disponibles:', this.datos.inventarios);
}


  alquiler: Alquiler = new Alquiler();

  detalleTemporal: DetalleAlquiler = this.nuevoDetalleTemporal();

  editando: boolean = false;
  indexEditando: number = -1;

  columnasTabla: string[] = ['inventario', 'cantidad', 'precioUnitario', 'subtotal', 'acciones'];

  nuevoDetalleTemporal(): DetalleAlquiler {
    return {
      id: 0,
      alquiler: new Alquiler(),
      inventario: new Inventario(),
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0,
    };
  }

  calcularFechaDevolucion() {
    if (this.datos.alquiler.fechaPrestamo && this.datos.alquiler.plazo) {
      const fechaPrestamo = new Date(this.datos.alquiler.fechaPrestamo);
      const fechaDevolucion = new Date(fechaPrestamo);
      fechaDevolucion.setDate(fechaPrestamo.getDate() + this.datos.alquiler.plazo);
      this.datos.alquiler.fechaDevolucion = fechaDevolucion.toISOString().substring(0, 10);
    }
  }

  actualizarDatosInventario() {
    if (this.detalleTemporal.inventario) {
      this.detalleTemporal.precioUnitario = this.detalleTemporal.inventario.precio;
      this.actualizarSubtotal();
    }
  }

  actualizarSubtotal() {
    this.detalleTemporal.subtotal = (this.detalleTemporal.cantidad || 0) * (this.detalleTemporal.precioUnitario || 0);
  }

  agregarODetalle() {
    const detalle = this.detalleTemporal;

    if (!detalle.inventario || detalle.cantidad <= 0) return;

    if (detalle.cantidad > detalle.inventario.disponible) {
      alert("Cantidad excede disponibilidad.");
      return;
    }

    const detalleClonado = { ...detalle };

    if (this.editando && this.indexEditando >= 0) {
      this.datos.alquiler.detalles[this.indexEditando] = detalleClonado;
    } else {
      // Evitar duplicados de inventario
      const existe = this.datos.alquiler.detalles.find(d => d.inventario?.id === detalleClonado.inventario.id);
      if (existe) {
        alert("Este producto ya está agregado.");
        return;
      }
      this.datos.alquiler.detalles.push(detalleClonado);
    }

    this.resetDetalle();
  }

  editarDetalle(index: number) {
    this.detalleTemporal = { ...this.datos.alquiler.detalles[index] };
    this.editando = true;
    this.indexEditando = index;
  }

  eliminarDetalle(index: number) {
    this.datos.alquiler.detalles.splice(index, 1);
    this.resetDetalle();
  }

  resetDetalle() {
    this.detalleTemporal = this.nuevoDetalleTemporal();
    this.editando = false;
    this.indexEditando = -1;
  }

  calcularPrecioTotal(): number {
    return this.datos.alquiler.detalles.reduce((total, d) => total + d.subtotal, 0);
  }
}
