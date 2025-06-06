import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Globales } from 'src/app/modelos/globales';
import { Tecnologia } from 'src/app/modelos/tecnologia';
import { TecnologiaService } from 'src/app/servicios/tecnologia.service';
import { DecidirComponent } from '../decidir/decidir.component';
import { TecnologiaEditarComponent } from '../tecnologia-editar/tecnologia-editar.component';
import Swal from 'sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tecnologia',
  templateUrl: './tecnologia.component.html',
  styleUrls: ['./tecnologia.component.css'],
})
export class TecnologiaComponent implements OnInit {
  public textoBusqueda: string = '';
  public tecnologias: Tecnologia[] = [];
  public tecnologiaSeleccion: Tecnologia | undefined;
  public tecnologiaOriginal: Tecnologia[] = [];

  public columnas = [{ name: 'Nombre', prop: 'nombre' }];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  public constructor(
    private tecnologiaService: TecnologiaService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (Globales.usuario) {
      this.listar();
      this.listarTecnologias();
    } else {
      this.router.navigate(['inicio']);
    }
  }

  public onActivate(event: any) {
    if (event.type == 'click') {
      this.tecnologiaSeleccion = event.row;
    }
  }
  
  public listar() {
    this.tecnologiaService.listar().subscribe(
      (data) => {
        this.tecnologias = data;
        this.tecnologiaOriginal = data;
        //this.tecnologias = [...data];

        this.tecnologias.forEach((tecnologia) => {
          tecnologia.nombre = tecnologia.nombre;
        });
      },
      (err) => {
        window.alert('Error al obtener los datos.');
      }
    );
  }

  public listarTecnologias() {
    this.tecnologiaService.listar().subscribe(
      (data) => {
        this.tecnologias = data;
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los datos de las tecnologías.',
        });
      }
    );
  }

  public buscar() {
    const texto = this.textoBusqueda.trim().toLowerCase();
    if (texto.length > 0) {
      const resultados = this.tecnologiaOriginal.filter((tecnologias) =>
        tecnologias.nombre.toLowerCase().includes(texto)
      );
      if (resultados.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Tecnologia no encontrada',
          text: 'No se encontró ninguna tecnologia con ese nombre.',
        });
        this.tecnologias = [];
      } else {
        this.tecnologias = resultados;
      }
    } else {
      this.tecnologias = [...this.tecnologiaOriginal];
    }
  }

  public agregar() {
    const dialogRef = this.dialog.open(TecnologiaEditarComponent, {
      width: '600px',
      height: '500px',
      data: {
        encabezado: 'Agregando Nueva Tecnología:',
        tecnologia: new Tecnologia(0, ''),
      },
    });

    dialogRef.afterClosed().subscribe(
      (datos) => {
        this.guardar(datos.tecnologia);
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al intentar agregar la tecnología.',
        });
      }
    );
  }

  public modificar() {
    if (this.tecnologiaSeleccion != null && this.tecnologiaSeleccion.id >= 0) {
    if (this.tecnologiaSeleccion != null && this.tecnologiaSeleccion.id >= 0) {
      const dialogRef = this.dialog.open(TecnologiaEditarComponent, {
        width: '600px',
        height: '500px',
        data: {
          encabezado: `Editando a datos de la tecnología [${this.tecnologiaSeleccion.nombre}]`,
          tecnologia: this.tecnologiaSeleccion,
        },
      });

      dialogRef.afterClosed().subscribe(
        (datos) => {
          this.guardar(datos.tecnologia);
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al intentar modificar la tecnología.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar una Tecnología.',
      });
    }
  }

  private guardar(tecnologia: Tecnologia) {
    if (!tecnologia.nombre || tecnologia.nombre.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'El nombre de la tecnología no puede estar vacío.',
      });
    if (!tecnologia.nombre || tecnologia.nombre.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'El nombre de la tecnología no puede estar vacío.',
      });
      return;
    }

    const nombreNormalizado = tecnologia.nombre.trim().toLowerCase();

    this.tecnologiaService.existeTecnologia(nombreNormalizado).subscribe(
      (existe) => {
        if (existe) {
          Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: `La tecnología "${tecnologia.nombre}" ya existe.`,
          });
        if (existe) {
          Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: `La tecnología "${tecnologia.nombre}" ya existe.`,
          });
          return;
        }

        if (tecnologia.id == 0) {
          this.tecnologiaService.agregar(tecnologia).subscribe(
            (tecnologiaActualizado) => {
              this.listar();
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Los datos de la Tecnología fueron agregados.',
              });
            },
            (err: HttpErrorResponse) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error agregando la Tecnología: ${err.message}`,
              });
            }
          );
        } else {
          this.tecnologiaService.actualizar(tecnologia).subscribe(
            (tecnologiaActualizado) => {
              this.listar();
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Los datos de la Tecnología fueron actualizados.',
              });
            },
            (err: HttpErrorResponse) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error actualizando la Tecnología: ${err.message}`,
              });
            }
          );
        }
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error verificando existencia de la tecnología: ${err.message}`,
        });
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error verificando existencia de la tecnología: ${err.message}`,
        });
      }
    );
  }

  public verificarEliminar() {
    if (this.tecnologiaSeleccion != null && this.tecnologiaSeleccion.id >= 0) {
      Swal.fire({
        title: '¿Está seguro que desea eliminar la Tecnología?',
        text: `La Tecnología: [${this.tecnologiaSeleccion.nombre}] será eliminada.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          if (
            this.tecnologiaSeleccion &&
            this.tecnologiaSeleccion.id !== undefined
          ) {
            this.eliminar(this.tecnologiaSeleccion.id);
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar una Tecnología.',
      });
    }
  }

  private eliminar(id: number) {
    this.tecnologiaService.eliminar(id).subscribe(
      (response) => {
        if (response == true) {
          this.listar();
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El registro de la Tecnología fue eliminado.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la Tecnología seleccionada.',
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al eliminar la Tecnología: ${error.message}`,
        });
      }
    );
  }
}