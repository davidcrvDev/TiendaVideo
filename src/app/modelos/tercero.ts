export class Tercero {

    public id: number;
    public tipoDocumento: number;
    public nombre: string;
    public direccion: string;
    public telefono: string;
    public ciudad: number;
    public correo: string;
    public movil: string;

    constructor(
        id: number,
        tipoDocumento: number,
        nombre: string,
        direccion: string,
        telefono: string,
        ciudad: number,
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
