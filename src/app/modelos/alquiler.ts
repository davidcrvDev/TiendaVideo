import { Cliente } from './cliente';
import { DetalleAlquiler } from './detallealquiler';

export class Alquiler {
  public id: number;
  public cliente: Cliente;
  public fechaPrestamo: Date;
  public plazo: number;
  public fechaDevolucion: Date;
  public precio: number;
  public detalles: DetalleAlquiler[];

  constructor(
    id: number = 0,
    cliente: Cliente = new Cliente(),
    fechaPrestamo: Date = new Date(),
    plazo: number = 0,
    fechaDevolucion: Date = new Date(),
    precio: number = 0,
    detalles: DetalleAlquiler[] = []
  ) {
    this.id = id;
    this.cliente = cliente;
    this.fechaPrestamo = fechaPrestamo;
    this.plazo = plazo;
    this.fechaDevolucion = fechaDevolucion;
    this.precio = precio;
    this.detalles = detalles;
  }
}
