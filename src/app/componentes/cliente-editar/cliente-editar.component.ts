import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cliente } from 'src/app/modelos/cliente';
import { Tipodocumento } from 'src/app/modelos/tipodocumento';

export interface DatosCliente {
  encabezado: string;
  cliente: Cliente;
  tipoDocumentos: Tipodocumento[];
}

@Component({
  selector: 'app-cliente-editar',
  templateUrl: './cliente-editar.component.html',
  styleUrls: ['./cliente-editar.component.css']
})
export class ClienteEditarComponent {
  public botonAceptarDeshabilitado: boolean = true;

  @Input() public dialogRef = MatDialogRef<ClienteEditarComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: DatosCliente
  ) {

  }

  ngOnInit(): void {
    this.validarFormulario();
  }

  public validarFormulario(): void {
    const { cliente } = this.datos;

    const idValido = cliente.id && cliente.id.trim() !== "" && cliente.id.length <= 50;
    debugger
    const tipoDocValido = cliente.tipoDocumento && cliente.tipoDocumento.id >= 0;
    const nombreValido = cliente.nombre && cliente.nombre.trim() !== "" && cliente.nombre.length <= 60;
    const apellidoValido = cliente.apellido && cliente.apellido.trim()!== "" && cliente.apellido.length <= 60;
    const direccionValida = cliente.direccion && cliente.direccion.trim()!== "" && cliente.direccion.length <= 50;
    //const telefonoValido = cliente.telefono && cliente.telefono.trim()!== "" && cliente.telefono.length <= 20;
    const correoValido = cliente.correo && cliente.correo.trim()!== "" && cliente.correo.length <= 50;
    const movilValido = cliente.movil && cliente.movil.trim()!== "" && cliente.movil.length <= 20;
    const rolValido = cliente.rol && cliente.rol.trim()!== "" && cliente.rol.length <= 20;

    this.botonAceptarDeshabilitado =!(idValido && tipoDocValido && nombreValido && apellidoValido && direccionValida && correoValido && movilValido && rolValido);
  }

  public soloNumeros(event: KeyboardEvent) {
    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
    }
  }

  public soloLetras(event: KeyboardEvent) {
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}