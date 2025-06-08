import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetallealquilerEditarComponent } from '../detallealquiler-editar/detallealquiler-editar.component';
import { DetalleAlquiler } from 'src/app/modelos/detallealquiler';
import { Inventario } from 'src/app/modelos/inventario';
import { DetalleAlquilerService } from 'src/app/servicios/detallealquiler.service';
import { InventarioService } from 'src/app/servicios/inventario.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { Globales } from 'src/app/modelos/globales';
import { Tecnologia } from 'src/app/modelos/tecnologia';
import { Titulo } from 'src/app/modelos/titulo';
import { Categoria } from 'src/app/modelos/categoria';

@Component({
  selector: 'app-detallealquiler',
  templateUrl: './detallealquiler.component.html',
  styleUrls: ['./detallealquiler.component.css'],
})
export class DetalleAlquilerComponent implements OnInit {
  detalles: DetalleAlquiler[] = [];
  inventarios: Inventario[] = [];

  columnas = [
    { name: 'Código', prop: 'id' },
    { name: 'Inventario', prop: 'inventario.titulo.nombre' },
    { name: 'Cantidad', prop: 'cantidad' },
    { name: 'Precio unitario', prop: 'precioUnitario' },
    { name: 'Subtotal', prop: 'subtotal' },
  ];

  public detalleSeleccion: DetalleAlquiler | undefined;
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  constructor(
    public dialog: MatDialog,
    private detalleService: DetalleAlquilerService,
    private inventarioService: InventarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (Globales.usuario) {
      this.listar();
      this.cargarInventarios();
    } else {
      this.router.navigate(['inicio']);
    }
  }

  listar(): void {
    this.detalleService.listar().subscribe((data) => (this.detalles = data));
  }

  cargarInventarios(): void {
    this.inventarioService
      .listar()
      .subscribe(data => {this.inventarios = data;},
        err => {
          window.alert("Error al obtener los datos de los titulos")
        });
  }

  onActivate(event: any): void {
    if (event.type === 'click') {
      this.detalleSeleccion = event.row;
    }
  }

  agregar(): void {
    const dialogRef = this.dialog.open(DetallealquilerEditarComponent, {
      width: '500px',
      data: {
        encabezado: 'Agregando Detalle de Alquiler',
        detalleAlquiler: new DetalleAlquiler(
          0,
          0,
          new Inventario(0, new Titulo(0, '', 0, '', new Categoria(0, '')), 0, new Tecnologia(0, ''), new Date(), 0, ''),
          0,
          0,
          0
        ),
        inventarios: this.inventarios,
      },
    });

    dialogRef.afterClosed().subscribe((datos) => {
      if (datos) {
        this.guardar(datos.detalleAlquiler);
      }
    });
  }

  modificar(): void {
    if (!this.detalleSeleccion) {
      alert('Debe seleccionar un detalle de alquiler.');
      return;
    }

    const dialogRef = this.dialog.open(DetallealquilerEditarComponent, {
      width: '500px',
      data: {
        encabezado: `Editando Detalle de Alquiler [${this.detalleSeleccion.id}]`,
        detalleAlquiler: { ...this.detalleSeleccion },
        inventarios: this.inventarios,
      },
    });

    dialogRef.afterClosed().subscribe((datos) => {
      if (datos) {
        this.guardar(datos.detalleAlquiler);
      }
    });
  }

  guardar(detalle: DetalleAlquiler): void {
    if (detalle.id === 0) {
      this.detalleService.agregar(detalle).subscribe(() => this.listar());
    } else {
      this.detalleService.actualizar(detalle).subscribe(() => this.listar());
    }
  }

  eliminar(): void {
    if (!this.detalleSeleccion) {
      alert('Debe seleccionar un detalle de alquiler.');
      return;
    }

    this.detalleService
      .eliminar(this.detalleSeleccion.id)
      .subscribe((res) => {
        if (res) {
          this.listar();
        } else {
          alert('No se pudo eliminar el detalle.');
        }
      });
  }
}
// git para fabith