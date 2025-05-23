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

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
})
export class CategoriaComponent implements OnInit {
  public textoBusqueda: string = '';
  public categorias: Categoria[] = [];
  public categoriaSeleccion: Categoria | undefined;

  public columnas = [
    { name: 'Nombre', prop: 'nombre' },
  ];
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

        this.categorias.forEach((categoria) => {
          categoria.nombre = categoria.nombre;
        });
      },
      (err) => {
        window.alert("Error al obtener los datos.");
      }
    );
  }

  public listarCategorias() {
    this.categoriaService.listar().subscribe(
      (data) => {
        this.categorias = data;
      },
      (err) => {
        window.alert("Error al obtener los datos de las categorias.");
      }
    );
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.categoriaService.buscar(this.textoBusqueda).subscribe(
        (data) => {
          this.categorias = data;
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
          window.alert(err.message);
        }
      );
    } else {
      window.alert('Debe seleccionar una Categoría');
    }
  }

  private guardar(categoria: Categoria) {
    debugger;
    if (!categoria.nombre || categoria.nombre.trim() === '') {
      window.alert('El nombre de la categoría no puede estar vacío.');
      return;
    }

    // Normalizar el nombre para validación (sin espacios y en minúsculas)
    const nombreNormalizado = categoria.nombre.trim().toLowerCase();

    this.categoriaService.existeCategoria(nombreNormalizado).subscribe(
      (existe) => {
        if (existe) {
          window.alert(`La categoría "${categoria.nombre}" ya existe.`);
          return;
        }

        if (categoria.id == 0) {
          this.categoriaService.agregar(categoria).subscribe(
            (categoriaActualizado) => {
              this.listar();
              window.alert(
                'Los datos de la Categoría fueron agregada correctamente.'
              );
            },
            (err: HttpErrorResponse) => {
              window.alert(`Error agregando la Categoria: [${err.message}]`);
            }
          );
        } else {
          this.categoriaService.actualizar(categoria).subscribe(
            (categoriaActualizado) => {
              this.listar();
              window.alert(
                'Los datos de la Categoría fueron actualizados correctamente.'
              );
            },
            (err: HttpErrorResponse) => {
              window.alert(`Error actualizando Categoria: [${err.message}]`);
            }
          );
        }
      },
      (err) => {
        window.alert(
          `Error verificando existencia de categoría: ${err.message}`
        );
      }
    );
  }

  public verificarEliminar() {
    if (this.categoriaSeleccion != null && this.categoriaSeleccion.id > 0) {
      const dialogRef = this.dialog.open(DecidirComponent, {
        width: '400px',
        height: '200px',
        data: {
          encabezado: '¿Está seguro que desea eliminar la Categoría?',
          mensaje: `La Categoría: [${this.categoriaSeleccion.nombre}]`,
          id: this.categoriaSeleccion.id,
        },
      });

      dialogRef.afterClosed().subscribe(
        (datos) => {
          if (datos) {
            this.eliminar(datos.id);
          }
        },
        (err) => {
          window.alert("Error al eliminar, vuelve a intentar.");
        }
      );
    } else {
      window.alert('Debe seleccionar una Categoría');
    }
  }

  private eliminar(id: number) {
    this.categoriaService.eliminar(id).subscribe(
      (response) => {
        if (response == true) {
          this.listar();
          window.alert('Categoría eliminada correctamente.');
        } else {
          window.alert('No se pudo eliminar la Categoría.');
        }
      },
      (error) => {
        window.alert(error.message);
      }
    );
  }
}
