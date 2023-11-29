import { Empresa } from "./empresa";

export class Titulo {

    public id: number;
    public nombre: string;
    public año: String;
    public ano: String;
    public protagonistas: string;
    public productor: string;
    public director: string;
    public empresa: Empresa | null;
    public precio: number;

    constructor(id: number,
        nombre: string,
        año: String,
        protagonistas: string,
        productor: string,
        director: string,
        empresa: Empresa | null,
        precio: number) {
        this.id = id;
        this.nombre = nombre;
        this.año = año;
        this.ano = año;
        this.protagonistas = protagonistas;
        this.productor = productor;
        this.director = director;
        this.empresa = empresa;
        this.precio = precio;
    }
    
}
