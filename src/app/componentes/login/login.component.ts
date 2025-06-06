import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/servicios/usuario.service';

export interface DatosLogin {
  usuario: string;
  clave: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  datos: DatosLogin = {
    usuario: '',
    clave: '',
  };

  error: string = ''; // Para mostrar errores al usuario

  constructor(
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Inicializar con datos simulados
    // this.datos.usuario = "bypass";
    // this.datos.clave = "bypass";
  }

  ingresar(): void {
    this.error = ''; // Limpia errores anteriores
    this.usuarioService.login(this.datos.usuario, this.datos.clave).subscribe({
      next: (respuesta: any) => {
        // Login exitoso: cierra el diálogo y devuelve los datos del usuario
        this.dialogRef.close(respuesta);
      },
      error: (error: any) => {
        // Error: muestra mensaje
        this.error = error.error || 'Credenciales incorrectas';
      },
    });
  }
}
