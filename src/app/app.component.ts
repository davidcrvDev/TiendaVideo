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
    { titulo: "Categorias", url: "categoria", icono: "assets/iconos/Pais.png" },
    { titulo: "Inventarios", url: "inventario", icono: "assets/iconos/Pais.png" },
    { titulo: "Tecnologias", url: "tecnologia", icono: "assets/iconos/Empresa.png" },
    { titulo: "Títulos", url: "titulo", icono: "assets/iconos/Titulo.png" },
    { titulo: "Clientes", url: "cliente", icono: "assets/iconos/Cliente.png" },
    { titulo: "Alquileres", url: "alquiler", icono: "assets/iconos/Alquiler.png" },
  ]

  constructor(public dialog: MatDialog,
    private usuarioService: UsuarioService,
    private router: Router
  ) {

  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: "400px",
      height: "400px",
      data: { usuario: "bypass", clave: "bypass" }
    });

    // dialogRef.afterClosed().subscribe(data => {
    //   this.usuarioService.login(data.usuario, data.clave).subscribe(response => {
    //     this.usuarioActual = new usuario(response.usuario); //response.token
    //     Globales.usuario = this.usuarioActual;
    //   });
    // });


    dialogRef.afterClosed().subscribe(() => {
      // Simular un usuario siempre autenticado
      this.usuarioActual = new usuario("bypass-user");
      Globales.usuario = this.usuarioActual;

      // Opcionalmente, redirigir a una página predeterminada
      this.router.navigate(["inicio"]); 
  });
  }

  cerrar() {
    this.usuarioActual = null;
    Globales.usuario = null;
    this.router.navigate(["inicio"]);
  }
  
}
