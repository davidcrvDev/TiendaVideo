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
        id: number,
        titulo: Titulo,
        disponible: number,
        tecnologia: Tecnologia,
        fechaadquisicion: Date,
        precio: number,
        activo: string,

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
