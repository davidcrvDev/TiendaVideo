import { Categoria } from "./categoria";

export class Titulo {

    public id: number;
    public nombre: string;
    public ano: number;
    public director: string;
    public categoria: Categoria;

    constructor(
        id: number,
        nombre: string,
        ano: number,
        director: string,
        categoria: Categoria,
        
    ) {
        this.id = id;
        this.nombre = nombre;
        this.ano = ano;
        this.director = director;
        this.categoria = categoria;
        
    }
    
}
