export class Tipodocumento {

    public id: number;
    public tipo: string;
    public sigla: string;

    constructor(
        id: number = 0,
        tipo: string = '',
        sigla: string = ''
    ) {
        this.id = id;
        this.tipo = tipo;
        this.sigla = sigla;
    }
    
}
