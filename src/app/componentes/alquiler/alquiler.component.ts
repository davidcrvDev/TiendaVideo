import { Component, OnInit } from '@angular/core';
import { Alquiler } from 'src/app/modelos/alquiler';
import { MatDialog } from '@angular/material/dialog';
//import { Inventario } from 'src/app/modelos/inventario';
import { Cliente } from 'src/app/modelos/cliente';
import { AlquilerService } from 'src/app/servicios/alquiler.service';
import { TituloService } from 'src/app/servicios/titulo.service';
import { Router } from '@angular/router';
import { Globales } from 'src/app/modelos/globales';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { DecidirComponent } from '../decidir/decidir.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AlquilerEditarComponent } from '../alquiler-editar/alquiler-editar.component';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Tipodocumento } from 'src/app/modelos/tipodocumento';
import { Titulo } from 'src/app/modelos/titulo';
import { Inventario } from 'src/app/modelos/inventario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alquiler',
  templateUrl: './alquiler.component.html',
  styleUrls: ['./alquiler.component.css']
})
export class AlquilerComponent implements OnInit {

  public alquileres: Alquiler[] = [];
  public inventarios: Inventario[] = [];
  public titulos: Titulo[] = [];
  public clientes: Cliente[] = [];
  public columnas = [
    { name: '#Titulos', prop: 'inventario.titulo.nombre' },
    { name: '#Codigo Cliente', prop: 'cliente.id' },
    { name: 'Cliente', prop: 'cliente.nombre'},
    { name: 'Fecha prestamo', prop: 'fechaPrestamo' },
    { name: 'Plazo', prop: 'plazo' },
    { name: 'Fecha devolucion', prop: 'fechaDevolucion' },
    { name: 'Precio', prop: 'precio' },
  ];

  public textoBusqueda: string = '';
  public alquilerSeleccion: Alquiler | undefined;
  public tipoSeleccion = SelectionType;
  public modoColumna = ColumnMode;
  tema: String = "dark";
  

  constructor(public dialog: MatDialog,
    private alquilerService: AlquilerService,
    //private inventarioService: inventarioService,
    private tituloService: TituloService,
    private clienteService: ClienteService,
    private router: Router
  ){ }

  ngOnInit(): void {
    if (Globales.usuario) {
      this.listar();
      this.listarClientes();
      this.listarTitulos();
    }
    else {
      this.router.navigate(["inicio"]);
    }
  }

  public onActivate(event: any) {
    if (event.type == 'click') {
      this.alquilerSeleccion = event.row;
    }
  }

  public listar() {
    this.alquilerService.listar()
      .subscribe(data => {
        this.alquileres = data;
      },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener los datos.',
          });
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
            text: 'Error al obtener los datos de los títulos.',
          });
        });
  }

  public listarClientes() {
    this.clienteService.listar()
      .subscribe(data => {
        this.clientes = data;
      },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener los datos de los clientes.',
          });
        });
  }

  public buscarAlquiler() {
    if (this.textoBusqueda.trim().length > 0) {
      this.alquilerService.buscar(Number(this.textoBusqueda))
        .subscribe(data => {
          this.alquileres = data;
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener la busqueda.',
          });
        });
    } else {
      this.listar();
    }
  }

  public agregar() {
    const dialogRef = this.dialog.open(AlquilerEditarComponent, {
      width: '600px',
      height: '500px',
      data: {
        encabezado: "Agregando Alquiler:",
        alquiler: new Alquiler(
          0,
          new Cliente("", new Tipodocumento(0, "", ""), "", "", "", "", "", "", "", "", false, true),
          new Date(),
          0,
          '',
          0,
        ),
        titulos: this.titulos,
        clientes: this.clientes,
      }
    });

    dialogRef.afterClosed().subscribe((datos) => {
      if (datos) {
        this.guardar(datos.alquiler);
      }
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
      });
    });
  }

  public modificar() {
    if (this.alquilerSeleccion != null && this.alquilerSeleccion.id >= 0) {
      const dialogRef = this.dialog.open(AlquilerEditarComponent, {
        width: '600px',
        height: '500px',
        data: {
          encabezado: `Editando a datos del alquiler [${this.alquilerSeleccion.id}]`,
          alquiler: this.alquilerSeleccion,
          titulos: this.titulos,
          clientes: this.clientes,
          fechaPrestamo: this.columnas,
        }
      });

      dialogRef.afterClosed().subscribe((datos) => {
        if (datos) {
          this.guardar(datos.alquiler);
        }
      }, err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message,
        });
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar un Alquiler.',
      });
    }
  }

  private guardar(alquiler: Alquiler) {
    if (alquiler.id == 0) {
      this.alquilerService.agregar(alquiler).subscribe(alquilerActualizado => {
        this.listar();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Los datos del alquiler fueron agregados.',
        });
      },
        (err: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error agregando el alquiler: [${err.message}]`,
          });
        });
    } else {
      this.alquilerService.actualizar(alquiler).subscribe(alquilerActualizado => {
        this.listar();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Los datos del alquiler fueron actualizados.',
        });
      },
        (err: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error actualizando alquiler: [${err.message}]`,
          });
        });
    }
  }

  public verificarEliminar() {
    if (this.alquilerSeleccion != null && Number(this.alquilerSeleccion.id) > 0) {
      Swal.fire({
        title: `¿Está seguro que desea eliminar el Alquiler [${this.alquilerSeleccion.id}]?`,
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.alquilerSeleccion && this.alquilerSeleccion.id) {
            this.eliminar(Number(this.alquilerSeleccion.id));
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar un Alquiler.',
      });
    }
  }

  private eliminar(id: number) {
    this.alquilerService.eliminar(id).subscribe(response => {
      if (response == true) {
        this.listar();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El registro del Alquiler fue eliminado.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el registro del Alquiler.',
        });
      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      });
  }
}
