import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
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

  public constructor(private inventarioService: InventarioService,
    private tituloService: TituloService,
    private tecnologiaService: TecnologiaService,
    private router: Router,
    public dialog: MatDialog,
  ) { 

  }

  ngOnInit(): void {
    if (Globales.usuario != null) {
      this.listar();
      this.listarTitulos();
      this.listarTecnologias();
    }
    else {
      this.router.navigate(["inicio"]);
    }
  }

  public onActivate(event: any) {
    if (event.type == 'click') {
      this.inventarioSeleccion = event.row;
    }
  }

  public listar() {
    debugger;
    this.inventarioService.listar()
     .subscribe(data => {
      console.log("Datos recibidos", data)
        this.inventarios = data

      },
        err => {
          window.alert(err.message)
        });
  }

  public listarTitulos() {
    this.tituloService.listar()
     .subscribe(data => {
        this.titulos = data;

      },
        err => {
          window.alert(err.message)
        });
  }

  public listarTecnologias() {
    this.tecnologiaService.listar()
     .subscribe(data => {
        this.tecnologias = data;

      },
        err => {
          window.alert(err.message)
        });
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.inventarioService.buscar(this.textoBusqueda)
       .subscribe(data => {
          this.inventarios = data;

        },
          err => {
            window.alert(err.message)
          });
    }
    else {
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

    dialogRef.afterClosed().subscribe((datos) => {
      this.guardar(datos.inventario);
    }, err => {
      window.alert(err.message)
    }
  );
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
        window.alert(err.message)
      }
    );
    }
    else {
      window.alert("Debe seleccionar un Inventario para modificar.");
    }
  }

  private guardar(inventario: Inventario) {

    if (inventario.id == 0) {
      this.inventarioService.agregar(inventario).subscribe(inventarioActualizado => {
          this.listar();
          window.alert("Inventario agregado correctamente.");
        },
          (err: HttpErrorResponse) => {
            window.alert(`Èrror al agregar el inventario: ${err.message}`);
          });
    }
    else {
      this.inventarioService.actualizar(inventario).subscribe(inventarioActualizado => {
          this.listar();
          window.alert("Inventario modificado correctamente.");
        },
          (err: HttpErrorResponse) => {
            window.alert(`Error al actualizar el inventario: ${err.message}`);
          });
    }
  }

  public verificarEliminar() {
    if (this.inventarioSeleccion != null && this.inventarioSeleccion.id > 0) {
      const dialogRef = this.dialog.open(DecidirComponent, {
        width: '400px',
        data: {
          encabezado: "¿Está seguro de eliminar el inventario?",
          mensaje: `El inventario: ${this.inventarioSeleccion.titulo.nombre}`,
          id: this.inventarioSeleccion.id,
        }
      });

      dialogRef.afterClosed().subscribe(datos => {
        if (datos) {
          this.eliminar(datos.id);
        }
      },
    err => {
      window.alert(err.message)
    });
    }
    else {
      window.alert("Debe seleccionar un Inventario para eliminar.");
    }
  }

  private eliminar(id: number) {
    this.inventarioService.eliminar(id).subscribe(response => {
      if (response == true) {
        this.listar();
        window.alert("Inventario eliminado correctamente.");
      }
      else {
        window.alert("No se pudo eliminar el inventario.");
      }
    },
  error => {
    window.alert(error.message)
  });
  }
}

