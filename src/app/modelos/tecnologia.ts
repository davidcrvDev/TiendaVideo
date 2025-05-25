
export class Tecnologia {

    public id: number;
    public nombre: string;
    public fabricante?: string;
    public idiomas_compatibles?: string;

    constructor(
        id: number,
        nombre: string,
        fabricante?: string,
        idiomas_compatibles?: string
        
    ) {

        this.id = id;
        this.nombre = nombre;
        this.fabricante = fabricante;
        this.idiomas_compatibles = idiomas_compatibles;
    }

}