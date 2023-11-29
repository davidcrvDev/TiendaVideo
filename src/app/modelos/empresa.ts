import { Pais } from "./pais";

export class Empresa {

    public id: number;
    public nombre: string;
    public pais: Pais;

    constructor(
        id: number,
        nombre: string,
        pais: Pais,
    ) {
        this.id = id;
        this.nombre = nombre;
        this.pais = pais;
    }
}