import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Globales } from 'src/app/modelos/globales';
import { Tecnologia } from 'src/app/modelos/tecnologia';
import { TecnologiaService } from 'src/app/servicios/tecnologia.service';
import { DecidirComponent } from '../decidir/decidir.component';
import { TecnologiaEditarComponent } from '../tecnologia-editar/tecnologia-editar.component';

@Component({
  selector: 'app-tecnologia',
  templateUrl: './tecnologia.component.html',
  styleUrls: ['./tecnologia.component.css']
})
export class TecnologiaComponent implements OnInit  {

  public textoBusqueda: string = "";
  public tecnologias: Tecnologia[] = [];
  public tecnologiaSeleccion: Tecnologia | undefined;

  public columnas = [
    { name: 'ID', prop: 'id' },
    { name: 'Nombre', prop: 'nombre' },
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  public constructor(
    private tecnologiaService: TecnologiaService,
    private router: Router,
    public dialog: MatDialog,
  ) { 
    
  }

  ngOnInit(): void {
    if (Globales.usuario != null) {
      this.listar();
      this.listarTecnologias();
    }
    else {
      this.router.navigate(["inicio"]);
    }
  }

  public onActivate(event: any) {
    if (event.type == 'click') {
      this.tecnologiaSeleccion = event.row;
    }
  }

  public listar() {
    this.tecnologiaService.listar()
     .subscribe(data => {
        this.tecnologias = data;

        this.tecnologias.forEach(tecnologia => {
          tecnologia.nombre = tecnologia.nombre;
        });
      },
        err => {
          window.alert("Error al obtener los datos.")
        });
  }

  public listarTecnologias() {
    this.tecnologiaService.listar()
     .subscribe(data => {
        this.tecnologias = data;
      },
        err => {
          window.alert("Error al obtener los datos de las tecnologias. ")
        });
  }

  public buscar() {
    if (this.textoBusqueda.length > 0) {
      this.tecnologiaService.buscar(this.textoBusqueda)
       .subscribe(data => {
          this.tecnologias = data;
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
    const dialogRef = this.dialog.open(TecnologiaEditarComponent, {
      width: '600px',
      height: '500px',
      data: {
        encabezado: "Agregando Nueva Tecnología:",
        tecnologia: new Tecnologia(0, ""),
      }
  });

  dialogRef.afterClosed().subscribe((datos) => {
    this.guardar(datos.tecnologia);
    }, err => {
      window.alert(err.message)
  });
  }

  public modificar() {
    if (this.tecnologiaSeleccion!= null && this.tecnologiaSeleccion.id >= 0) {
      const dialogRef = this.dialog.open(TecnologiaEditarComponent, {
        width: '600px',
        height: '500px',
        data: {
          encabezado: `Editando a datos de la tecnologia [${this.tecnologiaSeleccion.nombre}]`,
          tecnologia: this.tecnologiaSeleccion,
        }
      });

      dialogRef.afterClosed().subscribe((datos) => {
        this.guardar(datos.tecnologia);
      }, err => {
        window.alert(err.message)
      });
    }
    else {
      window.alert("Debe seleccionar una Tecnología");
    }
  }

  private guardar(tecnologia: Tecnologia) {
    debugger;
    if (!tecnologia.nombre || tecnologia.nombre.trim() === ''){
      window.alert('El nombre de la categoria no puede estar vacío');
      return;
    }

    const nombreNormalizado = tecnologia.nombre.trim().toLowerCase();

    this.tecnologiaService.existeTecnologia(nombreNormalizado).subscribe(
      (existe) => {
        if (existe){
          window.alert(`La tecnologia "${tecnologia.nombre}" ya existe. `)
          return;
        }

        if (tecnologia.id == 0) {
          this.tecnologiaService.agregar(tecnologia).subscribe(tecnologiaActualizado => {
            this.listar();
            window.alert("Los datos de la Tecnología fueron agregados");
          },
            (err: HttpErrorResponse) => {
              window.alert(`Error agregando la Tecnología: [${err.message}]`);
            });
        }
        else {
          this.tecnologiaService.actualizar(tecnologia).subscribe(tecnologiaActualizado => {
            this.listar();
            window.alert("Los datos de la Tecnología fueron actualizados");
          },
            (err: HttpErrorResponse) => {
              window.alert(`Error actualizando Tecnología: [${err.message}]`);
            });
        }
      },
      (err) => {
        window.alert(
          `Error verificando existencia de tecnologia: ${err.message}`
        );
      }
    );
  }

  public verificarEliminar() {
    if (this.tecnologiaSeleccion!= null && this.tecnologiaSeleccion.id >= 0) {
      const dialogRef = this.dialog.open(DecidirComponent, {
        width: '400px',
        height: '200px',
        data: {
          encabezado: "¿Está seguro que desea eliminar la Tecnología?",
          mensaje: `La Tecnología: [${this.tecnologiaSeleccion.nombre}]`,
          id: this.tecnologiaSeleccion.id,
        }
      });

      dialogRef.afterClosed().subscribe(datos => {
        if (datos) {
          this.eliminar(datos.id);
        }
      },
        err => {
          window.alert("Error al eliminar, vuelve a intentar.");
        });
    }
    else {
      window.alert("Debe seleccionar una Tecnología");
    }
  }

  private eliminar(id: number) {
   this.tecnologiaService.eliminar(id).subscribe(response => {
    if (response == true) {
      this.listar();
      window.alert("El registro de la Tecnología fue eliminado");
    }
    else {
      window.alert("No se puede eliminar la Tecnología seleccionada");
    }
   },
   error => {
     window.alert(error.message);
   });
  }
}
