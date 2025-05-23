import { Categoria } from "./categoria";

export class Titulo {

    public id: number;
    public nombre: string;
    public ano: number;
    public director: string;
    public categoria: Categoria;

    constructor(
        id: number = 0,
        nombre: string = '',
        ano: number = 0,
        director: string = '',
        categoria: Categoria = new Categoria(),
        
    ) {
        this.id = id;
        this.nombre = nombre;
        this.ano = ano;
        this.director = director;
        this.categoria = categoria;
        
    }
    
}
