import { Cliente } from './cliente';
import { DetalleAlquiler } from './detallealquiler';
import { Tipodocumento } from './tipodocumento';

export class Alquiler {
  public id: number;
  public cliente: Cliente;
  public fechaPrestamo: Date;
  public plazo: number;
  public fechaDevolucion: string;
  public precio: number;
  public detalles: DetalleAlquiler[];

  constructor(
    id: number = 0,
    cliente: Cliente = new Cliente('', new Tipodocumento(0, '', ''), '', '', '', '', '', '', '', '', false, true), //('', new Tipodocumento(0, '', ''), '', '', '', '', '', '', '', '', false, true)
    fechaPrestamo: Date = new Date(),
    plazo: number = 0,
    fechaDevolucion: string = '',
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
