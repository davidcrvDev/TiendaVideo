import { Tecnologia } from "./tecnologia";
import { Titulo } from "./titulo";

export class Inventario {

    public id: number;
    public titulo: Titulo;
    public disponible: number;
    public tecnologia: Tecnologia;
    public fechaadquisicion: Date;
    public precio: number;
    public activo: string;
    

    constructor(
        id: number = 0,
        titulo: Titulo = new Titulo(),
        disponible: number = 0,
        tecnologia: Tecnologia = new Tecnologia(),
        fechaadquisicion: Date = new Date(),
        precio: number = 0,
        activo: string = '',

    ){

        this.id = id;
        this.titulo = titulo;
        this.disponible = disponible;
        this.tecnologia = tecnologia;
        this.fechaadquisicion = fechaadquisicion;
        this.precio = precio;
        this.activo = activo;
    }

}
