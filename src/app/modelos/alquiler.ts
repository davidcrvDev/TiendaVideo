import { Titulo } from "./titulo";
import { Tercero } from "./tercero";

export class Alquiler {

    public id: number;
    public titulo: Titulo;
    public tercero: Tercero;
    public fechaPrestamo: Date;
    public plazo: number;
    public fechaDevolucion: Date;
    public precio: number;
    

    constructor(
        id: number,
        titulo: Titulo,
        tercero: Tercero,
        fechaPrestamo: Date,
        plazo: number,
        fechaDevolucion: Date,
        precio: number,

    ){

        this.id = id;
        this.titulo = titulo;
        this.tercero = tercero;
        this.fechaPrestamo = fechaPrestamo;
        this.plazo = plazo;
        this.fechaDevolucion = fechaDevolucion;
        this.precio = precio;
    }

}
