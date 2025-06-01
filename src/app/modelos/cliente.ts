import { Tipodocumento } from './tipodocumento';

export class Cliente {
  public id: string;
  public tipoDocumento: Tipodocumento;
  public nombre: string;
  public apellido: string;
  public direccion: string;
  public telefono: string;
  public correo: string;
  public movil: string;
  public clave: string;
  public rol: string;
  public moroso: boolean;
  public activo: boolean;

  constructor(
    id: string = '',
    tipoDocumento: Tipodocumento = {} as Tipodocumento,
    nombre: string = '',
    apellido: string = '',
    direccion: string = '',
    telefono: string = '',
    correo: string = '',
    movil: string = '',
    clave: string = '',
    rol: string = '',
    moroso: boolean = false,
    activo: boolean = true
  ) {
    this.id = id;
    this.tipoDocumento = tipoDocumento;
    this.nombre = nombre;
    this.apellido = apellido;
    this.direccion = direccion;
    this.telefono = telefono;
    this.correo = correo;
    this.movil = movil;
    this.clave = clave;
    this.rol = rol;
    this.moroso = moroso;
    this.activo = activo;
  }
}
