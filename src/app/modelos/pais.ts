export class Pais {

    public id: number;
    public nombre: string;
    public codigoAlfa2: string;
    public codigoAlfa3: string;

    constructor(
        id: number,
        nombre: string,
        codigoAlfa2: string,
        codigoAlfa3: string
    ) {
        this.id = id;
        this.nombre = nombre;
        this.codigoAlfa2 = codigoAlfa2;
        this.codigoAlfa3 = codigoAlfa3;
    }
}