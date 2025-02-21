import { Titulo } from "./titulo";
import { Tercero } from "./tercero";
import { Inventario } from "./inventario";

export class Alquiler {

    public id: number;
    public inventario: Inventario;
    public titulo: Titulo;
    public tercero: Tercero;
    public fechaPrestamo: Date;
    public plazo: number;
    public fechaDevolucion: Date;
    public precio: number;
    

    constructor(
        id: number,
        inventario: Inventario,
        titulo: Titulo,
        tercero: Tercero,
        fechaPrestamo: Date,
        plazo: number,
        fechaDevolucion: Date,
        precio: number,

    ){

        this.id = id;
        this.inventario = inventario;
        this.titulo = titulo;
        this.tercero = tercero;
        this.fechaPrestamo = fechaPrestamo;
        this.plazo = plazo;
        this.fechaDevolucion = fechaDevolucion;
        this.precio = precio;
    }

}
