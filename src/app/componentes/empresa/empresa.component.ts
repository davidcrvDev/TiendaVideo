import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Empresa } from 'src/app/modelos/empresa';
import { Pais } from 'src/app/modelos/pais';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { PaisService } from 'src/app/servicios/pais.service';
import { DecidirComponent } from '../decidir/decidir.component';
import { EmpresaEditarComponent } from '../empresa-editar/empresa-editar.component';
import { Globales } from 'src/app/modelos/globales';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  public empresas: Empresa[] = [];
  public paises: Pais[] = [];
  public columnas = [
    { name: 'Nombre', prop: 'nombre' },
    { name: 'Codigo', prop: 'id' },
    { name: 'País', prop: 'pais.pais' },
  ];
  public textoBusqueda: string = "";
  public empresaSeleccion: Empresa | undefined;
  public tipoSeleccion = SelectionType;
  public modoColumna = ColumnMode;
  tema: String = "dark";

  constructor(public dialog: MatDialog,
    private empresaService: EmpresaService,
    private paisService: PaisService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (Globales.usuario) {
      this.listar();
      this.listarPaises();
    }
    else {
      this.router.navigate(["inicio"]);
    }
  }

  public onActivate(event: any) {
    if (event.type == 'click') {
      this.empresaSeleccion = event.row;
    }
  }

  public listar() {
    this.empresaService.listar()
      .subscribe(data => {
        this.empresas = data;
      },
        err => {
          window.alert(err.message)
        });
  }

  public listarPaises() {
    this.paisService.listar()
      .subscribe(data => {
        this.paises = data;
      },
        err => {
          window.alert(err.message)
        });
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.empresaService.buscar(this.textoBusqueda)
        .subscribe(data => {
          this.empresas = data;
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
    const dialogRef = this.dialog.open(EmpresaEditarComponent, {
      width: '600px',
      height: '500px',
      data: {
        encabezado: "Agregando Empresa:",
        empresa: new Empresa(
          0, //Id
          "", //Nombre
          new Pais(0, "", "", ""),
        ),
        paises: this.paises,
      }
    });

    dialogRef.afterClosed().subscribe((datos) => {
      if (datos) {
        this.guardar(datos.empresa);
      }
    }, err => {
      window.alert(err.message)
    }
    );
  }

  public modificar() {
    if (this.empresaSeleccion != null && this.empresaSeleccion.id >= 0) {
      const dialogRef = this.dialog.open(EmpresaEditarComponent, {
        width: '600px',
        height: '500px',
        data: {
          encabezado: `Editando a datos del título [${this.empresaSeleccion.nombre}]`,
          empresa: this.empresaSeleccion,
          paises: this.paises,
        }
      });

      dialogRef.afterClosed().subscribe((datos) => {
        if (datos) {
          this.guardar(datos.empresa);
        }
      }, err => {
        window.alert(err.message)
      }
      );

    }
    else {
      window.alert("Debe seleccionar un Título");
    }
  }

  private guardar(empresa: Empresa) {
    if (empresa.id == 0) {
      this.empresaService.agregar(empresa).subscribe(empresaActualizada => {
        this.listar();
        window.alert("Los datos de la Empresa fueron agregados");
      },
        (err: HttpErrorResponse) => {
          window.alert(`Error agregando la Empresa: [${err.message}]`);
        });
    }
    else {
      this.empresaService.actualizar(empresa).subscribe(empresaActualizada => {
        this.listar();
        window.alert("Los datos de la Empresa fueron actualizados");
      },
        (err: HttpErrorResponse) => {
          window.alert(`Error actualizando Empresa: [${err.message}]`);
        });
    }
  }

  public verificarEliminar() {
    if (this.empresaSeleccion != null && this.empresaSeleccion.id >= 0) {
      const dialogRef = this.dialog.open(DecidirComponent, {
        width: '400px',
        height: '200px',
        data: {
          titulo: `Eliminando registro de la empresa [${this.empresaSeleccion.nombre}]`,
          mensaje: "Está seguro?",
          id: this.empresaSeleccion.id,
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
    this.empresaService.eliminar(id).subscribe(response => {
      if (response == true) {
        this.listar();
        window.alert("El registro de la Empresa fue eliminado");
      }
      else {
        window.alert("No se pudo eliminar el registro de la Empresa");
      }
    },
      error => {
        window.alert(error.message)
      }
    );
  }

}