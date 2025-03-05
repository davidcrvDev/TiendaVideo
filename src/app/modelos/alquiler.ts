import { Cliente } from "./cliente";

export class Alquiler {

    public id: number;
    public cliente: Cliente;
    public fechaPrestamo: Date;
    public plazo: number;
    public fechaDevolucion: Date;
    public precio: number;
    

    constructor(
        id: number,
        cliente: Cliente,
        fechaPrestamo: Date,
        plazo: number,
        fechaDevolucion: Date,
        precio: number,

    ){

        this.id = id;
        this.cliente = cliente;
        this.fechaPrestamo = fechaPrestamo;
        this.plazo = plazo;
        this.fechaDevolucion = fechaDevolucion;
        this.precio = precio;
    }

}
