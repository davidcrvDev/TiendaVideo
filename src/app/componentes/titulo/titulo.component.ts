import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Globales } from 'src/app/modelos/globales';
import { Empresa } from 'src/app/modelos/empresa';
import { Titulo } from 'src/app/modelos/titulo';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { TituloService } from 'src/app/servicios/titulo.service';
import { TituloEditarComponent } from '../titulo-editar/titulo-editar.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Pais } from 'src/app/modelos/pais';
import { DecidirComponent } from '../decidir/decidir.component';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css']
})
export class TituloComponent implements OnInit {

  public textoBusqueda: string = "";
  public titulos: Titulo[] = [];
  public empresas: Empresa[] = [];
  public tituloSeleccion: Titulo | undefined;

  public columnas = [
    { name: 'Nombre', prop: 'nombre' },
    { name: 'Año publ.', prop: 'año' },
    { name: 'Protagonistas', prop: 'protagonistas' },
    { name: 'Productor', prop: 'productor' },
    { name: 'Director', prop: 'director' },
    { name: 'Empresa', prop: 'empresa.nombre' },
    { name: 'Precio', prop: 'precio' },
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  public constructor(private tituloService: TituloService,
    private empresaService: EmpresaService,
    private router: Router,
    public dialog: MatDialog,) {

  }

  ngOnInit(): void {
    if (Globales.usuario != null) {
      this.listar();
      this.listarEmpresas();
    }
    else {
      this.router.navigate(["inicio"]);
    }
  }

  public onActivate(event: any) {
    if (event.type == 'click') {
      this.tituloSeleccion = event.row;
    }
  }

  public listar() {
    this.tituloService.listar()
      .subscribe(data => {
        this.titulos = data;

        this.titulos.forEach(titulo => {
          titulo.ano = titulo.año;
        });

      },
        err => {
          window.alert(err.message)
        });
  }

  public listarEmpresas() {
    this.empresaService.listar()
      .subscribe(data => {
        this.empresas = data;
      },
        err => {
          window.alert(err.message)
        });
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.tituloService.buscar(this.textoBusqueda)
        .subscribe(data => {
          this.titulos = data;
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
    const dialogRef = this.dialog.open(TituloEditarComponent, {
      width: '600px',
      height: '500px',
      data: {
        encabezado: `Agregando nuevo Título de Videojuego`,
        titulo: new Titulo(0, "", 0, "", "", "", new Empresa(0, "", new Pais(0, "", "", "")), 0),
        empresas: this.empresas,
      }
    });

    dialogRef.afterClosed().subscribe((datos) => {
      this.guardar(datos.titulo);
    }, err => {
      window.alert(err.message)
    }
    );
  }

  public modificar() {
    if (this.tituloSeleccion != null && this.tituloSeleccion.id >= 0) {
      const dialogRef = this.dialog.open(TituloEditarComponent, {
        width: '600px',
        height: '500px',
        data: {
          encabezado: `Editando a datos del título [${this.tituloSeleccion.nombre}]`,
          titulo: this.tituloSeleccion,
          empresas: this.empresas,
        }
      });

      dialogRef.afterClosed().subscribe((datos) => {
        this.guardar(datos.titulo);
      }, err => {
        window.alert(err.message)
      }
      );

    }
    else {
      window.alert("Debe seleccionar un Título");
    }
  }

  private guardar(titulo: Titulo) {
    titulo.año = titulo.ano;
    if (titulo.id == 0) {
      this.tituloService.agregar(titulo).subscribe(tituloActualizado => {
        this.listar();
        window.alert("Los datos del Título de Videojuego fueron agregados");
      },
        (err: HttpErrorResponse) => {
          window.alert(`Error agregando el Título de Videojuego: [${err.message}]`);
        });
    }
    else {
      this.tituloService.actualizar(titulo).subscribe(tituloActualizado => {
        this.listar();
        window.alert("Los datos del Título de Videojuego fueron actualizados");
      },
        (err: HttpErrorResponse) => {
          window.alert(`Error actualizando Título de Videojuego: [${err.message}]`);
        });
    }
  }

  public verificarEliminar() {
    if (this.tituloSeleccion != null && this.tituloSeleccion.id >= 0) {
      const dialogRef = this.dialog.open(DecidirComponent, {
        width: '400px',
        height: '200px',
        data: {
          titulo: `Eliminando registro del título [${this.tituloSeleccion.nombre}]`,
          mensaje: "Está seguro?",
          id: this.tituloSeleccion.id,
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
      window.alert("Debe seleccionar un Título");
    }
  }

  private eliminar(id: number) {
    this.tituloService.eliminar(id).subscribe(response => {
      if (response == true) {
        this.listar();
        window.alert("El registro del Título de Videojuego fue eliminado");
      }
      else {
        window.alert("No se pudo eliminar el registro del Título de Videojuego");
      }
    },
      error => {
        window.alert(error.message)
      }
    );
  }

}
