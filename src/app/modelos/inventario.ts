export class Inventario {

    public id: number;
    public titulo: number;
    public consecutivo: number;
    public tecnologia: number;
    public fechaAdquisicion: Date;
    public activo: string;
    

    constructor(
        id: number,
        titulo: number,
        consecutivo: number,
        tecnologia: number,
        fechaAdquisicion: Date,
        activo: string,

    ){

        this.id = id;
        this.titulo = titulo;
        this.consecutivo = consecutivo;
        this.tecnologia = tecnologia;
        this.fechaAdquisicion = fechaAdquisicion;
        this.activo = activo;
    }

}
