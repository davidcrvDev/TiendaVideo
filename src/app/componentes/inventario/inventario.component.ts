import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/modelos/categoria';
import { Globales } from 'src/app/modelos/globales';
import { Inventario } from 'src/app/modelos/inventario';
import { Tecnologia } from 'src/app/modelos/tecnologia';
import { Titulo } from 'src/app/modelos/titulo';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { TecnologiaService } from 'src/app/servicios/tecnologia.service';
import { TituloService } from 'src/app/servicios/titulo.service';
import { DecidirComponent } from '../decidir/decidir.component';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { InventarioEditarComponent } from '../inventario-editar/inventario-editar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  public textoBusqueda: string = "";
  public inventarios: Inventario[] = [];
  public titulos: Titulo[] = [];
  public tecnologias: Tecnologia[] = [];
  public inventarioSeleccion: Inventario | undefined;
  public inventariosOriginales: Inventario[] = [];


  public columnas = [
    { name: 'Titulo', prop: 'titulo.nombre' },
    { name: 'Disponible', prop: 'disponible' },
    { name: 'Tecnologia', prop: 'tecnologia.nombre' },
    { name: 'Fecha adquisicion', prop: 'fechaadquisicion' },
    { name: 'Precio', prop: 'precio' },
    { name: 'Activo', prop: 'activo' },
  ];

  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  public constructor(
    private inventarioService: InventarioService,
    private tituloService: TituloService,
    private tecnologiaService: TecnologiaService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (Globales.usuario) {
      this.listar();
    } else {
      this.router.navigate(["inicio"]);
    }
  }

  public onActivate(event: any) {
    if (event.type == 'click') {
      this.inventarioSeleccion = event.row;
    }
  }

  public listar() {
    this.inventarioService.listar().subscribe(
      data => {
        this.inventariosOriginales = data;
        this.inventarios = [...data];
      },
      error => {
        window.alert("Error al obtener los datos.");
      });
  }
  public listarTitulos() {
    this.tituloService.listar()
      .subscribe(data => {
        this.titulos = data;
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron obtener los datos de los títulos, intente nuevamente.',
        });
      });
  }

  public listarTecnologias() {
    this.tecnologiaService.listar()
      .subscribe(data => {
        this.tecnologias = data;
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron obtener los datos de las tecnologías, ntente nuevamente.',
        });
      });
  }

  public buscar() {
    const texto = this.textoBusqueda.trim().toLowerCase();
    if (texto.length > 0) {
      const resultados = this.inventariosOriginales.filter(inventarios =>
        inventarios.titulo.nombre.toLowerCase().includes(texto)
      );
      if (resultados.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Inventario no encontrada',
          text: 'No se encontró ningun inventario.'
        });
        this.inventarios = [];
      } else {
        this.inventarios = resultados;
      }
    } else {
      this.inventarios = [...this.inventariosOriginales];
    }
  }

  public agregar() {
    const dialogRef = this.dialog.open(InventarioEditarComponent, {
      width: '600px',
      height: '500px',
      data: {
        encabezado: "Agregando nuevo Inventario:",
        inventario: new Inventario(0, new Titulo(0, "", 0, "", new Categoria(0, "")), 0, new Tecnologia(0, ""), new Date(), 0, ""),
        titulos: this.titulos,
        tecnologias: this.tecnologias,
      }
    });

    dialogRef.afterClosed().subscribe((datos) => {
      this.guardar(datos.inventario);
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al intentar agregar el inventario, intente nuevamente.',
      });
    });
  }

  public modificar() {
    if (this.inventarioSeleccion != null && this.inventarioSeleccion.id > 0) {
      const dialogRef = this.dialog.open(InventarioEditarComponent, {
        width: '600px',
        height: '500px',
        data: {
          encabezado: "Modificando Inventario:",
          inventario: this.inventarioSeleccion,
          titulos: this.titulos,
          tecnologias: this.tecnologias,
        }
      });

      dialogRef.afterClosed().subscribe((datos) => {
        this.guardar(datos.inventario);
      }, err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al intentar modificar el inventario, intente nuevamente.',
        });
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar un Inventario para modificar.',
      });
    }
  }

  private guardar(inventario: Inventario) {
    if (inventario.id == 0) {
      this.inventarioService.agregar(inventario).subscribe(inventarioActualizado => {
        this.listar();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Inventario agregado correctamente.',
        });
      },
      (err: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar el inventario, intente nuevamente.',
        });
      });
    } else {
      this.inventarioService.actualizar(inventario).subscribe(inventarioActualizado => {
        this.listar();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Inventario modificado correctamente.',
        });
      },
      (err: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo modificar el inventario, intente nuevamente.',
        });
      });
    }
  }

  public verificarEliminar() {
    if (this.inventarioSeleccion != null && Number(this.inventarioSeleccion.id) > 0) {
      Swal.fire({
        title: `¿Está seguro que desea eliminar el Inventario [${this.inventarioSeleccion.id}]?`,
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.inventarioSeleccion && this.inventarioSeleccion.id) {
            this.eliminar(Number(this.inventarioSeleccion.id));
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar un Inventario.',
      });
    }
  }

  private eliminar(id: number) {
    this.inventarioService.eliminar(id).subscribe(response => {
      if (response == true) {
        this.listar();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Inventario eliminado correctamente.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el inventario, intente nuevamente.',
        });
      }
    },
    error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al intentar eliminar el inventario, intente nuevamente.',
      });
    });
  }

  descargarReporteInventarios() {
    this.inventarioService.descargarReporteInventarios();
  }
}