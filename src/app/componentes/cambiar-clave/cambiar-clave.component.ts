import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.css']
})
export class CambiarClaveComponent {
  correo: string = '';
  claveActual: string = '';
  nuevaClave: string = '';
  mensaje: string = '';

  constructor(private usuarioService: UsuarioService) {
    const usuarioLogueado = this.usuarioService.getUsuarioActual();
    if (usuarioLogueado && usuarioLogueado.correo) {
      this.correo = usuarioLogueado.correo;
    }
  }



  cambiarClave() {
    console.log("Ejecutando cambio de clave...");

    this.usuarioService.cambiarClave(this.correo, this.claveActual, this.nuevaClave).subscribe({
      next: (res: any) => {
        console.log("Respuesta del backend:", res);
        this.mensaje = res?.mensaje || "Contraseña cambiada con éxito.";
        alert(this.mensaje);
        this.claveActual = '';
        this.nuevaClave = '';
      },
      error: (err: any) => {
        console.error("Error en el cambio de clave:", err);
        let errorMsg = "Error desconocido";

        if (err.error?.mensaje) {
          errorMsg = err.error.mensaje;
        } else if (typeof err.error === 'string') {
          errorMsg = err.error;
        }

        this.mensaje = "Error: " + errorMsg;
        alert(this.mensaje);
      }
    });
  }
}
