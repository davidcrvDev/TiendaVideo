import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { RecuperarClaveComponent } from '../recuperar-clave/recuperar-clave.component';

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
    public dialog: MatDialog,
    private snackBar: MatSnackBar, // <-- NUEVO
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ingresar() {
    this.usuarioService.login(this.datos.usuario, this.datos.clave).subscribe({
      next: (response) => {
        const usuario = response.usuario;
        if (usuario) {
          localStorage.setItem('usuarioActual', JSON.stringify(usuario));
          this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
            duration: 3000
          });
          this.dialogRef.close({ usuario });
        }
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
        this.snackBar.open('Credenciales incorrectas', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close(null);
  }

  abrirRecuperacion() {
    this.dialog.open(RecuperarClaveComponent);
  }
}
