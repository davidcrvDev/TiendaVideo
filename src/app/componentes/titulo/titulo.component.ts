import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Globales } from 'src/app/modelos/globales';
import { Titulo } from 'src/app/modelos/titulo';
import { TituloService } from 'src/app/servicios/titulo.service';
import { TituloEditarComponent } from '../titulo-editar/titulo-editar.component';
import { DecidirComponent } from '../decidir/decidir.component';
import { Categoria } from 'src/app/modelos/categoria';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css']
})
export class TituloComponent implements OnInit {

  public textoBusqueda: string = "";
  public titulos: Titulo[] = [];
  public categorias: Categoria[] = [];
  public tituloSeleccion: Titulo | undefined;

  public columnas = [
    { name: 'Nombre', prop: 'nombre' },
    { name: 'Año publ.', prop: 'ano' },
    { name: 'Director', prop: 'director' },
    { name: 'Categoria', prop: 'categoria.nombre' },
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  public constructor(
    private tituloService: TituloService,
    private categoriaService: CategoriaService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (Globales.usuario) {
      this.listar();
      this.listarCategorias();
    } else {
      this.router.navigate(["inicio"]);
    }
  }

  public onActivate(event: any) {
    if (event.type == 'click') {
      this.tituloSeleccion = event.row;
    }
  }

  public listar() {
    this.tituloService.listar().subscribe(
      data => this.titulos = data,
      err => Swal.fire('Error', err.message, 'error')
    );
  }

  public listarCategorias() {
    this.categoriaService.listar().subscribe(
      data => this.categorias = data,
      err => Swal.fire('Error', err.message, 'error')
    );
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.tituloService.buscar(this.textoBusqueda).subscribe(
        data => this.titulos = data,
        err => Swal.fire('Error', err.message, 'error')
      );
    } else {
      this.listar();
    }
  }

  public agregar() {
    const dialogRef = this.dialog.open(TituloEditarComponent, {
      width: '600px',
      height: '500px',
      data: {
        encabezado: `Agregando nuevo Título de Videojuego`,
        titulo: new Titulo(0, "", 0, "", new Categoria(0, "")),
        categorias: this.categorias,
      }
    });

    dialogRef.afterClosed().subscribe(datos => {
      if (datos && datos.titulo) {
        this.guardar(datos.titulo);
      }
    });
  }

  public modificar() {
    if (this.tituloSeleccion) {
      const dialogRef = this.dialog.open(TituloEditarComponent, {
        width: '600px',
        height: '500px',
        data: {
          encabezado: `Editando Título: ${this.tituloSeleccion.nombre}`,
          titulo: this.tituloSeleccion,
          categorias: this.categorias,
        }
      });

      dialogRef.afterClosed().subscribe(datos => {
        if (datos && datos.titulo) {
          this.guardar(datos.titulo);
        }
      });
    } else {
      Swal.fire('Atención', 'Debe seleccionar un Título', 'warning');
    }
  }

  private guardar(titulo: Titulo) {
    if (titulo.id == 0) {
      this.tituloService.agregar(titulo).subscribe(
        tituloActualizado => {
          this.titulos.push(tituloActualizado);
          Swal.fire('Éxito', 'Título agregado correctamente.', 'success');
        },
        err => Swal.fire('Error', `Error al agregar: ${err.message}`, 'error')
      );
    } else {
      this.tituloService.actualizar(titulo).subscribe(() => {
        this.listar();
        Swal.fire('Actualizado', 'Título modificado correctamente.', 'success');
      });
    }
  }

  public verificarEliminar() {
    if (this.tituloSeleccion) {
      const dialogRef = this.dialog.open(DecidirComponent, {
        width: '400px',
        data: {
          encabezado: "¿Está seguro de eliminar el Título?",
          mensaje: `El Título: ${this.tituloSeleccion.nombre}`,
          id: this.tituloSeleccion.id,
        }
      });

      dialogRef.afterClosed().subscribe(datos => {
        if (datos) this.eliminar(datos.id);
      });
    } else {
      Swal.fire('Atención', 'Debe seleccionar un Título', 'warning');
    }
  }

  private eliminar(id: number) {
    this.tituloService.eliminar(id).subscribe(
      response => {
        if (response) {
          this.listar();
          Swal.fire('Eliminado', 'Título eliminado correctamente.', 'success');
        } else {
          Swal.fire('Error', 'No se pudo eliminar el Título.', 'error');
        }
      },
      error => Swal.fire('Error', error.message, 'error')
    );
  }
}
