import { Pais } from "./pais";

export class Region {

    public id: number;
    public region: string;
    public pais: Pais;

    constructor(
        id: number,
        region: string,
        pais: Pais
    ) {
        this.id = id;
        this.region = region;
        this.pais = pais;
    }
}
