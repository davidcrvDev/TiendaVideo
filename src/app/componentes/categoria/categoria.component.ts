import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Categoria } from 'src/app/modelos/categoria';
import { Globales } from 'src/app/modelos/globales';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { DecidirComponent } from '../decidir/decidir.component';
import { CategoriaEditarComponent } from '../categoria-editar/categoria-editar.component';
import Swal from 'sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
})
export class CategoriaComponent implements OnInit {
  public textoBusqueda: string = '';
  public categorias: Categoria[] = [];
  public categoriaSeleccion: Categoria | undefined;
  public categoriasOriginales: Categoria[] = [];

  public columnas = [{ name: 'Nombre', prop: 'nombre' }];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  public constructor(
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
      this.categoriaSeleccion = event.row;
    }
  }

  public listar() {
    this.categoriaService.listar().subscribe(
      (data) => {
        this.categorias = data;
        this.categoriasOriginales = data;
        //this.categorias = [...data];

        this.categorias.forEach((categoria) => {
          categoria.nombre = categoria.nombre;
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
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al obtener los datos de las categorias.',
        });
      }
    );
  }

  public buscar() {
    const texto = this.textoBusqueda.trim().toLowerCase();
    if (texto.length > 0) {
      const resultados = this.categoriasOriginales.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(texto)
      );
      if (resultados.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Categoria no encontrada',
          text: 'No se encontró ninguna categoria.',
        });
        this.categorias = [];
      } else {
        this.categorias = resultados;
      }
    } else {
      this.categorias = [...this.categoriasOriginales];
      this.categorias = [...this.categoriasOriginales];
    }
  }

  public agregar() {
    const dialogRef = this.dialog.open(CategoriaEditarComponent, {
      width: '600px',
      height: '500px',
      data: {
        encabezado: 'Agregando Nueva Categoría:',
        categoria: new Categoria(0, ''),
      },
    });

    dialogRef.afterClosed().subscribe((datos) => {
      this.guardar(datos.categoria);
    });
  }

  public modificar() {
    if (this.categoriaSeleccion != null && this.categoriaSeleccion.id > 0) {
      const dialogRef = this.dialog.open(CategoriaEditarComponent, {
        width: '600px',
        height: '500px',
        data: {
          encabezado: `Editando datos de la categoría: [${this.categoriaSeleccion.nombre}]`,
          categoria: this.categoriaSeleccion,
        },
      });

      dialogRef.afterClosed().subscribe(
        (datos) => {
          this.guardar(datos.categoria);
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error al guardar los datos',
            text: err.message,
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar una Categoría.',
      });
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar una Categoría.',
      });
    }
  }

  private guardar(categoria: Categoria) {
    if (!categoria.nombre || categoria.nombre.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El nombre de la categoría no puede estar vacío.',
      });
      return;
    }

    // Normalizar el nombre para validación (sin espacios y en minúsculas)
    const nombreNormalizado = categoria.nombre.trim().toLowerCase();

    this.categoriaService.existeCategoria(nombreNormalizado).subscribe(
      (existe) => {
        if (existe) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `La categoría "${categoria.nombre}" ya existe.`,
          });
          return;
        }

        if (categoria.id == 0) {
          this.categoriaService.agregar(categoria).subscribe(
            (categoriaActualizado) => {
              this.listar();
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: `Los datos de la Categoría "${categoria.nombre}" fueron agregada correctamente.`,
              });
            },
            (err: HttpErrorResponse) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Error agregando la Categoria: [${err.message}]`,
              });
            }
          );
        } else {
          this.categoriaService.actualizar(categoria).subscribe(
            (categoriaActualizado) => {
              this.listar();
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Los datos de la Categoría fueron actualizados correctamente.',
              });
            },
            (err: HttpErrorResponse) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Error actualizando la Categoria: [${err.message}]`,
              });
            }
          );
        }
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Error verificando existencia: [${err.message}]`,
        });
      }
    );
  }

  public verificarEliminar() {
    if (
      this.categoriaSeleccion != null &&
      Number(this.categoriaSeleccion.id) > 0
    ) {
      Swal.fire({
        title: `¿Está seguro que desea eliminar la Categoría [${this.categoriaSeleccion.id}]?`,
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.categoriaSeleccion && this.categoriaSeleccion.id) {
            this.eliminar(Number(this.categoriaSeleccion.id));
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar una Categoría.',
      });
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar una Categoría.',
      });
    }
  }

  private eliminar(id: number) {
    this.categoriaService.eliminar(id).subscribe(
      (response) => {
        if (response == true) {
          this.listar();
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Categoría eliminada correctamente.',
          });
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Categoría eliminada correctamente.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la Categoría.',
          });
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la Categoría.',
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      }
    );
  }
}
