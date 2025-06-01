import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tecnologia } from 'src/app/modelos/tecnologia';
import { TecnologiaService } from 'src/app/servicios/tecnologia.service';

export interface DatosTecnolgia {
  encabezado: string;
  tecnologia: Tecnologia;
  tecnologiaService: TecnologiaService;
}

@Component({
  selector: 'app-tecnologia-editar',
  templateUrl: './tecnologia-editar.component.html',
  styleUrls: ['./tecnologia-editar.component.css']
})
export class TecnologiaEditarComponent {
  public botonAceptarDeshabilitado: boolean = true;

  constructor(
      public dialogRef: MatDialogRef<TecnologiaEditarComponent>,
      @Inject(MAT_DIALOG_DATA) public datos: DatosTecnolgia
    ) {}

  ngOnInit(): void {
    this.validarFormulario();
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permite solo soloLetras
    if (!/^[a-zA-Z\s]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  public validarFormulario(): void {
    const { tecnologia } = this.datos;
    const nombreValido = tecnologia.nombre && tecnologia.nombre.trim() !== "";
    const nombreNormalizado = tecnologia.nombre ? tecnologia.nombre.trim().toLowerCase(): '';

    this.botonAceptarDeshabilitado = !(nombreValido);

    if (nombreNormalizado === ''){
      this.botonAceptarDeshabilitado = true;
      return;
    }

    this.datos.tecnologiaService.existeTecnologia(nombreNormalizado).subscribe(
      (existe) => {
        this.botonAceptarDeshabilitado = existe;
      },
      err => {
        console.error('Error validando tecnologia:', err);
        this.botonAceptarDeshabilitado = true;
      }
    );
  }
}