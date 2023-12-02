export class Tipodocumento {

    public id: number;
    public tipo: string;
    public ingles: string;
    public sigla: string;

    constructor(
        id: number,
        tipo: string,
        ingles: string,
        sigla: string
    ) {
        this.id = id;
        this.tipo = tipo;
        this.ingles = ingles;
        this.sigla = sigla;
    }
    
}
