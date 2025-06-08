import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // <-- NUEVO

@Component({
  selector: 'app-recuperar-clave',
  templateUrl: './recuperar-clave.component.html',
  styleUrls: ['./recuperar-clave.component.css']
})
export class RecuperarClaveComponent {
  correo: string = '';
  mensaje: string = '';
  error: string = '';

  constructor(
    private dialogRef: MatDialogRef<RecuperarClaveComponent>,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar // <-- NUEVO
  ) {}

  enviarCorreo() {
    this.usuarioService.enviarClavePorCorreo(this.correo).subscribe({
      next: res => {
        this.mensaje = 'Correo enviado exitosamente';
        this.error = '';
        this.snackBar.open('Se envió un enlace a tu correo', 'Cerrar', {
          duration: 3000
        });
      },
      error: err => {
        this.mensaje = '';
        this.error = err.error || 'Error al enviar el correo';
        this.snackBar.open('No se pudo enviar el correo de recuperación', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
