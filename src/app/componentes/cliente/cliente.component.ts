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
    { name: 'Tipo Documento', prop: 'tipoDocumento.tipo' },
    { name: 'Dirección', prop: 'direccion' },
    { name: 'Teléfono', prop: 'telefono' },
    { name: 'Correo', prop: 'correo' },
    { name: 'Móvil', prop: 'movil' },
    { name: 'Rol', prop: 'rol' },
    { name: 'Moroso', prop: 'moroso' },
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
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  public listarTipoDocumentos() {
    this.tipoDocumentoService.listar().subscribe(
      data => {
        this.tipoDocumentos = data;
      },
      error => {
        Swal.fire('Error', error.message, 'error');
      }
    );
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
        cliente: new Cliente(0, new Tipodocumento(0, "", ""), "", "", "", "", "", "", "", "", false, false),
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
    this.clienteService.listar().subscribe(clientesActualizados => {
      const nombreNormalizado = cliente.nombre.trim().toLowerCase();
      const apellidoNormalizado = cliente.apellido.trim().toLowerCase();
      
      const clienteExiste = clientesActualizados.some((c: Cliente) =>
        c.id !== cliente.id &&
        c.nombre.trim().toLowerCase() === nombreNormalizado &&
        c.apellido.trim().toLowerCase() === apellidoNormalizado
      );
      
      if (clienteExiste) {
        Swal.fire('Error', 'El cliente ya existe.', 'error');
        return;
      }
      
      if (cliente.id == 0) {
        this.clienteService.agregar(cliente).subscribe(() => {
          this.listar();
          Swal.fire('Éxito', 'Cliente agregado correctamente.', 'success');
        });
      } else {
        this.clienteService.actualizar(cliente).subscribe(() => {
          this.listar();
          Swal.fire('Éxito', 'Cliente actualizado correctamente.', 'success');
        });
      }
    });
  }

  public verificarEliminar() {
    if (this.clienteSeleccion) {
      const dialogRef = this.dialog.open(DecidirComponent, {
        width: '400px',
        height: '200px',
        data: {
          titulo: `Eliminando Cliente [${this.clienteSeleccion.nombre}]`,
          mensaje: "¿Está seguro de eliminar este cliente?",
          id: this.clienteSeleccion.id,
        }
      });

      dialogRef.afterClosed().subscribe(datos => {
        if (datos) {
          this.eliminar(datos.id);
        }
      });
    } else {
      Swal.fire('Atención', 'Debe seleccionar un cliente para eliminar.', 'warning');
    }
  }

  private eliminar(id: number) {
    this.clienteService.eliminar(id).subscribe(response => {
      if (response) {
        this.listar();
        Swal.fire('Eliminado', 'Cliente eliminado correctamente.', 'success');
      } else {
        Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
      }
    });
  }
}
