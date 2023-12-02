import { Region } from "./region";

export class Ciudad {

    public id: number;
    public ciudad: string;
    public region: Region;

    constructor(
        id: number,
        ciudad: string,
        region: Region
    ) {
        this.id = id;
        this.ciudad = ciudad;
        this.region = region;
    }
}
