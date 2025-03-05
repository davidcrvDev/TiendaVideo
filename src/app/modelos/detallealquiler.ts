import { Alquiler } from "./alquiler";
import { Inventario } from "./inventario";

export class DetalleAlquiler {

    public id: number;
    public alquiler: Alquiler;
    public inventario: Inventario;
    public cantidad: number;
    public precioUnitario: number;
    public subtotal: number;

    constructor(
        id: number,
        alquiler: Alquiler,
        inventario: Inventario,
        cantidad: number,
        precioUnitario: number,
        subtotal: number,
    ) {
        this.id = id;
        this.alquiler = alquiler;
        this.inventario = inventario;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }
}