import { Component } from '@angular/core';
import { usuario } from './modelos/usuario';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './componentes/login/login.component';
import { UsuarioService } from './servicios/usuario.service';
import { Router } from '@angular/router';
import { Globales } from './modelos/globales';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TiendaVideo';

  public usuarioActual: usuario | null = null;

  public opciones = [
    { titulo: "Clientes", url: "cliente", icono: "assets/iconos/Titulo.png" },
    { titulo: "Categorias", url: "categoria", icono: "assets/iconos/Pais.png" },
    { titulo: "Tecnologias", url: "tecnologia", icono: "assets/iconos/Empresa.png" },
    { titulo: "Títulos", url: "titulo", icono: "assets/iconos/Titulo.png" },
    { titulo: "Inventarios", url: "inventario", icono: "assets/iconos/Pais.png" },
    { titulo: "Alquileres", url: "alquiler", icono: "assets/iconos/Titulo.png" },
  ]

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) {}

  login(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      height: '400px'
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado && resultado.usuario) {
        this.usuarioActual = new usuario(resultado.usuario);
        Globales.usuario = this.usuarioActual;
        this.router.navigate(['inicio']);
      }
    });
  }

  cerrar() {
    this.usuarioActual = null;
    Globales.usuario = null;
    this.router.navigate(["inicio"]);
  }
  
}
