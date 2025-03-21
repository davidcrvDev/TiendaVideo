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
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  public textoBusqueda: string = "";
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
    public dialog: MatDialog,
  ){}

  ngOnInit(): void {
    if (Globales.usuario != null) {
      this.listar();
      this.listarCategorias();
    } else {
      this.router.navigate(["inicio"]);
    }
  }

  public onActivate(event: any) {
    if (event.type == 'click') {
      this.categoriaSeleccion = event.row;
    }
  }

  public listar() {
    this.categoriaService.listar()
     .subscribe(data => {
        this.categorias = data;
     },
     err => {
       Swal.fire('Error', err.message, 'error');
     });
  }

  public listarCategorias() {
    this.categoriaService.listar()
     .subscribe(data => {
        this.categorias = data;
      },
        err => {
          Swal.fire('Error', err.message, 'error');
        });
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.categoriaService.buscar(this.textoBusqueda)
       .subscribe(data => {
          this.categorias = data;
        },
          err => {
            Swal.fire('Error', err.message, 'error');
          });
    } else {
      this.listar();
    }
  }

  public agregar() {
    const dialogRef = this.dialog.open(CategoriaEditarComponent, {
      width: '600px',
      height: '500px',
      data: {
        encabezado: "Agregando Nueva Categoría:",
        categoria: new Categoria(0, ""),
      }
    });

    dialogRef.afterClosed().subscribe(datos => {
      this.guardar(datos.categoria);
    });
  }

  public modificar() {
    if (this.categoriaSeleccion && this.categoriaSeleccion.id > 0) {
      const dialogRef = this.dialog.open(CategoriaEditarComponent, {
        width: '600px',
        height: '500px',
        data: {
          encabezado: `Editando datos de la categoría: [${this.categoriaSeleccion.nombre}]`,
          categoria: this.categoriaSeleccion,
        }
      });

      dialogRef.afterClosed().subscribe(datos => {
        this.guardar(datos.categoria);
      },
      err => {
        Swal.fire('Error', err.message, 'error');
      });
    } else {
      Swal.fire('Atención', 'Debe seleccionar una Categoría', 'warning');
    }
  }

  private guardar(categoria: Categoria) {
    this.categoriaService.listar().subscribe((categoriasActualizadas: Categoria[]) => {
      const nombreNormalizado = categoria.nombre.trim().toLowerCase();
  
      const nombreExiste = categoriasActualizadas.some((cat: Categoria) =>
        cat.id !== categoria.id &&  
        cat.nombre.trim().toLowerCase() === nombreNormalizado 
      );
  
      if (nombreExiste) {
        Swal.fire({
          title: 'Error',
          text: 'El nombre de la Categoría ya existe. No se permite modificarlo ni duplicarlo.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
        });
        return;
      }
  
      if (categoria.id == 0) {
        this.categoriaService.agregar(categoria).subscribe(() => {
          this.listar();
          Swal.fire({
            title: '¡Éxito!',
            text: 'Los datos de la Categoría fueron agregados correctamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
          });
        });
      } else {
        this.categoriaService.actualizar(categoria).subscribe(() => {
          this.listar();
          Swal.fire({
            title: '¡Actualizado!',
            text: 'Los datos de la Categoría fueron actualizados correctamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
          });
        });
      }
    });
  }   

  public verificarEliminar() {
    if (this.categoriaSeleccion && this.categoriaSeleccion.id > 0) {
      const dialogRef = this.dialog.open(DecidirComponent, {
        width: '400px',
        height: '200px',
        data: {
          encabezado: "¿Está seguro que desea eliminar la Categoría?",
          mensaje: `¿Está seguro que desea eliminar la Categoría?: [${this.categoriaSeleccion.nombre}]`,
          id: this.categoriaSeleccion.id,
        }
      });

      dialogRef.afterClosed().subscribe(datos => {
        if (datos) {
          this.eliminar(datos.id);
        }
      },
      err => {
        Swal.fire('Error', err.message, 'error');
      });
    } else {
      Swal.fire('Atención', 'Debe seleccionar una Categoría', 'warning');
    }
  }

  private eliminar(id: number) {
    this.categoriaService.eliminar(id).subscribe(response => {
      if (response){
        this.listar();
        Swal.fire('Eliminado', 'Categoría eliminada correctamente.', 'success');
      } else {
        Swal.fire('Error', 'No se pudo eliminar la Categoría.', 'error');
      }
    },
    error => {
      Swal.fire('Error', error.message, 'error');
    });
  }
}
