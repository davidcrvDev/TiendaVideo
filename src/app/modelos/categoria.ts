export class Categoria {

    public id: number;
    public nombre: string;

    constructor(
        id: number = 0,
        nombre: string = '',
        
    ) {

        this.id = id;
        this.nombre = nombre;
    }
}