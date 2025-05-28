import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/modelos/cliente';
import { Globales } from 'src/app/modelos/globales';
import { Tipodocumento } from 'src/app/modelos/tipodocumento';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { TipodocumentoService } from 'src/app/servicios/tipodocumento.service';
import { DecidirComponent } from '../decidir/decidir.component';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ClienteEditarComponent } from '../cliente-editar/cliente-editar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  public textoBusqueda: string = "";
  public clientes: Cliente[] = [];
  public tipoDocumentos: Tipodocumento[] = [];
  public clienteSeleccion: Cliente | undefined;

  public columnas = [
    { name: 'ID', prop: 'id' },
    { name: 'Nombre', prop: 'nombre' },
    { name: 'Apellido', prop: 'apellido' },
    { name: 'Tipo Documento', prop: 'tipodocumento.tipo' },
    { name: 'Dirección', prop: 'direccion' },
    { name: 'Teléfono', prop: 'telefono' },
    { name: 'Correo', prop: 'correo' },
    { name: 'Móvil', prop: 'movil' },
    { name: 'Rol', prop: 'rol' },
    { name: 'Activo', prop: 'activo' },
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  public constructor(
    private clienteService: ClienteService,
    private tipoDocumentoService: TipodocumentoService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (Globales.usuario != null) {
      this.listar();
      this.listarTipoDocumentos();
    } else {
      this.router.navigate(["inicio"]);
    }
  }

  public onActivate(event: any) {
    if (event.type == 'click') {
      this.clienteSeleccion = event.row;
    }
  }

  public listar() {
    this.clienteService.listar().subscribe(
      data => {
        this.clientes = data;
      },
      error => {
        window.alert("Error al obtener los datos.");
      });
  }

  public cambiarMoroso(cliente: Cliente, nuevoEstado: boolean) {
    // Si se va a cambiar de false a true, pide confirmación
    if (!cliente.moroso && nuevoEstado) {
      Swal.fire({
        title: '¿Está seguro?',
        text: '¿Desea marcar este cliente como moroso?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, marcar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.actualizarCheckMoroso(cliente, nuevoEstado);
        }
      });
    } else {
      // Si es de true a false, o cualquier otro caso, cambia directamente
      this.actualizarCheckMoroso(cliente, nuevoEstado);
    }
  }

  private actualizarCheckMoroso(cliente: Cliente, nuevoEstado: boolean) {
    this.clienteService.actualizarMoroso(Number(cliente.id), nuevoEstado).subscribe(
      () => {
        cliente.moroso = nuevoEstado;
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el estado de moroso.',
        });
      }
    );
  }

  public listarTipoDocumentos() {
    this.tipoDocumentoService.listar().subscribe(
      data => {
        this.tipoDocumentos = data;
      },
      error => {
        window.alert("Error al obtener los datos de los tipos de documentos.");
      });
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.clienteService.buscar(this.textoBusqueda).subscribe(
        data => {
          this.clientes = data;
        },
        error => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    } else {
      this.listar();
    }
  }

  public agregar() {
    const dialogRef = this.dialog.open(ClienteEditarComponent, {
      width: '600px',
      height: '500px',
      data: {
        encabezado: "Agregando Nuevo Cliente:",
        cliente: new Cliente("", new Tipodocumento(0, "", ""), "", "", "", "", "", "", "12345", "", false, true),
        tipoDocumentos: this.tipoDocumentos,
      }
    });

    dialogRef.afterClosed().subscribe(datos => {
      this.guardar(datos.cliente);
    });
  }

  public modificar() {
    if (this.clienteSeleccion) {
      const dialogRef = this.dialog.open(ClienteEditarComponent, {
        width: '600px',
        height: '500px',
        data: {
          encabezado: `Modificando Cliente: [${this.clienteSeleccion.nombre}] [${this.clienteSeleccion.apellido}]`,
          cliente: this.clienteSeleccion,
          tipoDocumentos: this.tipoDocumentos,
        }
      });

      dialogRef.afterClosed().subscribe(datos => {
        this.guardar(datos.cliente);
      });
    } else {
      Swal.fire('Atención', 'Debe seleccionar un cliente para modificar.', 'warning');
    }
  }

  private guardar(cliente: Cliente) {
    if (Number(cliente.id) === 0) {
      this.clienteService.agregar(cliente).subscribe(clienteActualizado => {
        this.listar();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Los datos del cliente fueron agregados.',
        });
      },
        (err: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error agregando el cliente: [${err.message}]`,
          });
        });
    } else {
      this.clienteService.actualizar(cliente).subscribe(clienteActualizado => {
        this.listar();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Los datos del cliente fueron actualizados.',
        });
      },
        (err: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error actualizando cliente: [${err.message}]`,
          });
        });
    }
  }

  public verificarEliminar() {
    if (this.clienteSeleccion != null && Number(this.clienteSeleccion.id) >= 0) {
      Swal.fire({
        title: `¿Está seguro que desea eliminar el Cliente [${this.clienteSeleccion.id}]?`,
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.clienteSeleccion && this.clienteSeleccion.id) {
            this.eliminar(Number(this.clienteSeleccion.id));
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar un Cliente.',
      });
    }
  }

  private eliminar(id: number) {
    this.clienteService.eliminar(id).subscribe(response => {
      if (response == true) {
        this.listar();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El registro del Cliente fue eliminado.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el registro del Cliente.',
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
