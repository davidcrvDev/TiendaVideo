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
  templateUrl:'./titulo.component.html',
  styleUrls: ['./titulo.component.css'],
})
export class TituloComponent implements OnInit {
  public textoBusqueda: string = '';
  public titulos: Titulo[] = [];
  public categorias: Categoria[] = [];
  public tituloSeleccion: Titulo | undefined;
  public titulosOriginal: Titulo[] = [];

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
      this.router.navigate(['inicio']);
    }
  }

  public onActivate(event: any) {
    if (event.type == 'click') {
      this.tituloSeleccion = event.row;
    }
  }

  public listar() {
    this.tituloService.listar().subscribe(
      (data) => {
        this.titulos = data;
        this.titulosOriginal = data;
        //this.titulos = [...data];

        this.titulos.forEach((titulo) => {
          titulo.ano = titulo.ano;
        });
      },
      error => {
        window.alert("Error al obtener los datos.");
      });
  }

  public listarCategorias() {
    this.categoriaService.listar().subscribe(
      (data) => {
        this.categorias = data;
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los datos de las categorías.',
        });
      }
    );
  }

  public buscar() {
    const texto = this.textoBusqueda.trim().toLowerCase();
    if (texto.length > 0) {
      const resultados = this.titulosOriginal.filter(
        (titulo) =>
          titulo.nombre.toLowerCase().includes(texto) ||
          titulo.director.toLowerCase().includes(texto)
      );
      if (resultados.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Titulo no encontrado',
          text: 'No se encontró ningún titulo con ese nombre o director.',
        });
        this.titulos = [];
      } else {
        this.titulos = resultados;
      }
    } else {
      this.titulos = [...this.titulosOriginal];
    }
  }

  public agregar() {
    const dialogRef = this.dialog.open(TituloEditarComponent, {
      width: '600px',
      height: '500px',
      data: {
        encabezado: `Agregando nuevo Título de Videojuego`,
        titulo: new Titulo(0, '', 0, '', new Categoria(0, '')),
        categorias: this.categorias,
      },
    });

    dialogRef.afterClosed().subscribe(
      (datos) => {
        this.guardar(datos.titulo);
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al intentar agregar el título.',
        });
      }
    );
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
        },
      });

      dialogRef.afterClosed().subscribe(
        (datos) => {
          this.guardar(datos.titulo);
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al intentar modificar el título.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar un Título.',
      });
    }
  }

  private guardar(titulo: Titulo) {
    if (!titulo.nombre || titulo.nombre.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'El nombre del título no puede estar vacío.',
      });
      return;
    }

    const nombreNormalizado = titulo.nombre.trim().toLowerCase();

    this.tituloService.existeTitulo(nombreNormalizado).subscribe(
      (existe) => {
        if (existe) {
          Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: `El título "${titulo.nombre}" ya existe.`,
          });
          return;
        }

        titulo.ano = titulo.ano;
        if (titulo.id == 0) {
          this.tituloService.agregar(titulo).subscribe(
            (tituloActualizado) => {
              this.listar();
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Los datos del Título de Videojuego fueron agregados.',
              });
            },
            (err: HttpErrorResponse) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error agregando el Título de Videojuego: ${err.message}`,
              });
            }
          );
        } else {
          this.tituloService.actualizar(titulo).subscribe(
            (tituloActualizado) => {
              this.listar();
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Los datos del Título de Videojuego fueron actualizados.',
              });
            },
            (err: HttpErrorResponse) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error actualizando el Título de Videojuego: ${err.message}`,
              });
            }
          );
        }
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error verificando existencia del título: ${err.message}`,
        });
      }
    );
  }

  public verificarEliminar() {
    if (this.tituloSeleccion != null && this.tituloSeleccion.id >= 0) {
      Swal.fire({
        title: `¿Está seguro que desea eliminar el Título [${this.tituloSeleccion.nombre}]?`,
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.tituloSeleccion && this.tituloSeleccion.id !== undefined) {
            this.eliminar(this.tituloSeleccion.id);
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar un Título.',
      });
    }
  }

  private eliminar(id: number) {
    this.tituloService.eliminar(id).subscribe(
      (response) => {
        if (response == true) {
          this.listar();
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El registro del Título de Videojuego fue eliminado.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el registro del Título de Videojuego.',
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al eliminar el Título de Videojuego: ${error.message}`,
        });
      }
    );
  }

  descargarReporteTitulos() {
    this.tituloService.descargarReporteTitulos();
  }
}
