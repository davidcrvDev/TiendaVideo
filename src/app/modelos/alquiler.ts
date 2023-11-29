import { Inventario } from "./inventario";
import { Tercero } from "./tercero";

export class Alquiler {

    public id: number;
    public inventario: Inventario;
    public tercero: Tercero;
    public fechaPrestamo: Date;
    public plazo: number;
    public fechaDevolucion: Date;
    public precio: number;
    

    constructor(
        id: number,
        inventario: Inventario,
        tercero: Tercero,
        fechaPrestamo: Date,
        plazo: number,
        fechaDevolucion: Date,
        precio: number,

    ){

        this.id = id;
        this.inventario = inventario;
        this.tercero = tercero;
        this.fechaPrestamo = fechaPrestamo;
        this.plazo = plazo;
        this.fechaDevolucion = fechaDevolucion;
        this.precio = precio;
    }

}
