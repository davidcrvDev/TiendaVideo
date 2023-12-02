import { Ciudad } from "./ciudad";
import { Tipodocumento } from "./tipodocumento";

export class Tercero {

    public id: number;
    public tipoDocumento: Tipodocumento;
    public nombre: string;
    public direccion: string;
    public telefono: string;
    public ciudad: Ciudad;
    public correo: string;
    public movil: string;

    constructor(
        id: number,
        tipoDocumento: Tipodocumento,
        nombre: string,
        direccion: string,
        telefono: string,
        ciudad: Ciudad,
        correo: string,
        movil: string,

    ){

        this.id = id;
        this.tipoDocumento = tipoDocumento;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.ciudad = ciudad;
        this.correo = correo;
        this.movil = movil;
    }
}
