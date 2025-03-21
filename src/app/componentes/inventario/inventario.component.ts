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
      data => this.inventarios = data,
      err => Swal.fire('Error', err.message, 'error')
    );
    this.tituloService.listar().subscribe(
      data => this.titulos = data,
      err => Swal.fire('Error', err.message, 'error')
    );
    this.tecnologiaService.listar().subscribe(
      data => this.tecnologias = data,
      err => Swal.fire('Error', err.message, 'error')
    );
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.inventarioService.buscar(this.textoBusqueda).subscribe(
        data => this.inventarios = data,
        err => Swal.fire('Error', err.message, 'error')
      );
    } else {
      this.listar();
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

    dialogRef.afterClosed().subscribe(datos => {
      if (datos && datos.inventario) {
        this.guardar(datos.inventario);
      }
    });
  }

  public modificar() {
    if (this.inventarioSeleccion) {
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

      dialogRef.afterClosed().subscribe(datos => {
        if (datos && datos.inventario) {
          this.guardar(datos.inventario);
        }
      });
    } else {
      Swal.fire('Atención', 'Debe seleccionar un Inventario', 'warning');
    }
  }

  private guardar(inventario: Inventario) {
    if (inventario.id == 0) {
      this.inventarioService.agregar(inventario).subscribe(inventarioActualizado => {
        this.inventarios.push(inventarioActualizado);
        Swal.fire('Éxito', 'Inventario agregado correctamente.', 'success');
      }, err => {
        Swal.fire('Error', `Error al agregar: ${err.message}`, 'error');
      });
    } else {
      this.inventarioService.actualizar(inventario).subscribe(() => {
        this.listar();
        Swal.fire('Actualizado', 'Inventario modificado correctamente.', 'success');
      });
    }
  }

  public verificarEliminar() {
    if (this.inventarioSeleccion) {
      const dialogRef = this.dialog.open(DecidirComponent, {
        width: '400px',
        data: {
          encabezado: "¿Está seguro de eliminar el inventario?",
          mensaje: `El inventario: ${this.inventarioSeleccion.titulo.nombre}`,
          id: this.inventarioSeleccion.id,
        }
      });

      dialogRef.afterClosed().subscribe(datos => {
        if (datos) this.eliminar(datos.id);
      });
    } else {
      Swal.fire('Atención', 'Debe seleccionar un Inventario', 'warning');
    }
  }

  private eliminar(id: number) {
    this.inventarioService.eliminar(id).subscribe(response => {
      if (response) {
        this.listar();
        Swal.fire('Eliminado', 'Inventario eliminado correctamente.', 'success');
      } else {
        Swal.fire('Error', 'No se pudo eliminar el inventario.', 'error');
      }
    },
    error => Swal.fire('Error', error.message, 'error'));
  }
}