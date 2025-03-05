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
  ){

  }

  ngOnInit(): void {
      if (Globales.usuario != null){
        this.listar();
        this.listarTipoDocumentos();
      }
      else{
        this.router.navigate(["inicio"]);
      }
  }

  public onActivate(event: any){
    if (event.type == 'click'){
      this.clienteSeleccion = event.row;
    }
  }

  public listar(){
    debugger;
    this.clienteService.listar()
     .subscribe(data => {
        this.clientes = data;

      },
      error => {
        window.alert(error.message);
      });
  }

  public listarTipoDocumentos(){
    this.tipoDocumentoService.listar()
     .subscribe(data => {
        this.tipoDocumentos = data;
      },
      error => {
        window.alert(error.message);
      });
  }

  public buscar(){
    if (this.textoBusqueda.length > 0){
      this.clienteService.buscar(this.textoBusqueda)
       .subscribe(data => {
          this.clientes = data;
        },
        error => {
          window.alert(error.message);
        });
    }
    else{
      this.listar();
    }
  }

  public agregar(){
    const dialogRef = this.dialog.open(ClienteEditarComponent, {
      width: '600px',
      height: '500px',
      data: { 
        encabezado: "Agregando Nuevo Cliente:",
        cliente: new Cliente(0, new Tipodocumento(0, "", ""), "", "", "", "", "", "", "", "", false, false),
        tipoDocumentos: this.tipoDocumentos,
      }
    });

    dialogRef.afterClosed().subscribe((datos) => {
      this.guardar(datos.cliente);
    },
  err => {
      window.alert(err.message)
  });
  }

  public modificar(){
    if (this.clienteSeleccion!= undefined){
      const dialogRef = this.dialog.open(ClienteEditarComponent, {
        width: '600px',
        height: '500px',
        data: { 
          encabezado: `Modificando Cliente: [${this.clienteSeleccion.nombre}] [${this.clienteSeleccion.apellido}]`,
          cliente: this.clienteSeleccion,
          tipoDocumentos: this.tipoDocumentos,
        }
      });

      dialogRef.afterClosed().subscribe((datos) => {
        this.guardar(datos.cliente);
      },
      err => {
        window.alert(err.message)
      });
    }
    else{
      window.alert("Debe seleccionar un cliente para modificar.");
    }
  }

  private guardar(cliente: Cliente) {
    if(cliente.id == 0){
      this.clienteService.agregar(cliente).subscribe(clienteActualizado => {
          this.listar();
          window.alert("Cliente agregado correctamente.");
        },
        (error: HttpErrorResponse) => {
          window.alert(`Error agregando el Cliente: [${error.message}]`);
        });
    }
    else {
      this.clienteService.actualizar(cliente).subscribe(clienteActualizado => {
          this.listar();
          window.alert("Cliente modificado correctamente.");
        },
        (error: HttpErrorResponse) => {
          window.alert(`Error modificando el Cliente: [${error.message}]`);
        });
    }
  }

  public verificarEliminar(){
    if (this.clienteSeleccion != null && this.clienteSeleccion.id >=0) {
      const dialogRef = this.dialog.open(DecidirComponent, {
        width: '400px',
        height: '200px',
        data: { 
          titulo: `Eliminando registro del cliente [${this.clienteSeleccion.nombre}]`,
          mensaje: "¿Está seguro de eliminar este cliente?",
          id: this.clienteSeleccion.id,
        }
      });

      dialogRef.afterClosed().subscribe(datos => {
        if (datos){
          this.eliminar(datos.id);
        }
      },
    err => {
        window.alert(err.message)
      });
    }
    else{
      window.alert("Debe seleccionar un cliente para eliminar.");
    }
  }

  public eliminar(id: number){
    this.clienteService.eliminar(id).subscribe(response => {
      if (response == true){
        this.listar();
        window.alert("Cliente eliminado correctamente.");
      }
      else {
        window.alert("No se pudo eliminar el cliente.");
      }
    },
    error => {
      window.alert(error.message)
    });
  }

  

}
