//import { Alquiler } from "./alquiler";
import { Alquiler } from "./alquiler";
import { Inventario } from "./inventario";

export class DetalleAlquiler {

    public id: number;
    public alquiler: Alquiler | number;
    public inventario: Inventario;
    public cantidad: number;
    public precioUnitario: number;
    public subtotal: number;

    constructor(
        id: number = 0,
        alquiler: Alquiler | number = 0,
        inventario: Inventario,
        cantidad: number = 0,
        precioUnitario: number = 0,
        subtotal: number = 0,
    ) {
        this.id = id;
        this.alquiler = alquiler;
        this.inventario = inventario;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }
}