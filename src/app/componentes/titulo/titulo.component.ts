import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Globales } from 'src/app/modelos/globales';
import { Titulo } from 'src/app/modelos/titulo';
import { TituloService } from 'src/app/servicios/titulo.service';
import { TituloEditarComponent } from '../titulo-editar/titulo-editar.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DecidirComponent } from '../decidir/decidir.component';
import { Categoria } from 'src/app/modelos/categoria';
import { CategoriaService } from 'src/app/servicios/categoria.service';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css'],
})
export class TituloComponent implements OnInit {
  public textoBusqueda: string = '';
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
    if (Globales.usuario != null) {
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
    debugger;
    this.tituloService.listar().subscribe(
      (data) => {
        this.titulos = data;

        this.titulos.forEach((titulo) => {
          titulo.ano = titulo.ano;
        });
      },
      (err) => {
        window.alert('Error al obtener los datos.');
      }
    );
  }

  public listarCategorias() {
    this.categoriaService.listar().subscribe(
      (data) => {
        this.categorias = data;
      },
      (err) => {
        window.alert('Error al obtener los datos de las categorias.');
      }
    );
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.tituloService.buscar(this.textoBusqueda).subscribe(
        (data) => {
          this.titulos = data;
        },
        (err) => {
          window.alert(err.message);
        }
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
        titulo: new Titulo(0, '', 0, '', new Categoria(0, '')),
        categorias: this.categorias,
      },
    });

    dialogRef.afterClosed().subscribe(
      (datos) => {
        this.guardar(datos.titulo);
      },
      (err) => {
        window.alert(err.message);
      }
    );
  }

  public modificar() {
    if (this.tituloSeleccion != null && this.tituloSeleccion.id >= 0) {
      const dialogRef = this.dialog.open(TituloEditarComponent, {
        width: '600px',
        height: '500px',
        data: {
          encabezado: `Editando a datos del título [${this.tituloSeleccion.nombre}]`,
          titulo: this.tituloSeleccion,
          categorias: this.categorias,
        },
      });

      dialogRef.afterClosed().subscribe(
        (datos) => {
          this.guardar(datos.titulo);
        },
        (err) => {
          window.alert(err.message);
        }
      );
    } else {
      window.alert('Debe seleccionar un Título');
    }
  }

  private guardar(titulo: Titulo) {
    if (!titulo.nombre || titulo.nombre.trim() === '') {
      window.alert('El nombre del titulo no puede estar vacio.');
      return;
    }

    const nombreNormalizado = titulo.nombre.trim().toLowerCase();

    this.tituloService.existeTitulo(nombreNormalizado).subscribe(
      (existe) => {
        if (existe) {
          window.alert(`El titulo "${titulo.nombre}" ya existe.`);
          return;
        }

        titulo.ano = titulo.ano;
        if (titulo.id == 0) {
          this.tituloService.agregar(titulo).subscribe(
            (tituloActualizado) => {
              this.listar();
              window.alert(
                'Los datos del Título de Videojuego fueron agregados'
              );
            },
            (err: HttpErrorResponse) => {
              window.alert(
                `Error agregando el Título de Videojuego: [${err.message}]`
              );
            }
          );
        } else {
          this.tituloService.actualizar(titulo).subscribe(
            (tituloActualizado) => {
              this.listar();
              window.alert(
                'Los datos del Título de Videojuego fueron actualizados'
              );
            },
            (err: HttpErrorResponse) => {
              window.alert(
                `Error actualizando Título de Videojuego: [${err.message}]`
              );
            }
          );
        }
      },
      (err) => {
        window.alert(`Error verificando existencia del titulo: ${err.message}`);
      }
    );
  }

  public verificarEliminar() {
    if (this.tituloSeleccion != null && this.tituloSeleccion.id >= 0) {
      const dialogRef = this.dialog.open(DecidirComponent, {
        width: '400px',
        height: '200px',
        data: {
          titulo: `Eliminando registro del título [${this.tituloSeleccion.nombre}]`,
          mensaje: 'Está seguro?',
          id: this.tituloSeleccion.id,
        },
      });

      dialogRef.afterClosed().subscribe(
        (datos) => {
          if (datos) {
            this.eliminar(datos.id);
          }
        },
        (err) => {
          window.alert('Error al eliminar, vuelve a intentar.');
        }
      );
    } else {
      window.alert('Debe seleccionar un Título');
    }
  }

  private eliminar(id: number) {
    this.tituloService.eliminar(id).subscribe(
      (response) => {
        if (response == true) {
          this.listar();
          window.alert('El registro del Título de Videojuego fue eliminado');
        } else {
          window.alert(
            'No se pudo eliminar el registro del Título de Videojuego'
          );
        }
      },
      (error) => {
        window.alert(error.message);
      }
    );
  }
}
