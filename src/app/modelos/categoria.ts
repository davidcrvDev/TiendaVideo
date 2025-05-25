export class Categoria {

    public id: number;
    public nombre: string;
    public descripcion?: string;
    public clasificacion_edad?: string;

    constructor(
        id: number,
        nombre: string,
        descripcion?: string,
        clasificacion_edad?: string
        
    ) {

        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.clasificacion_edad = clasificacion_edad;
    }
}