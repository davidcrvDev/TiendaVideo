import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tecnologia } from 'src/app/modelos/tecnologia';

export interface DatosTecnolgia {
  encabezado: string;
  tecnologia: Tecnologia;
}

@Component({
  selector: 'app-tecnologia-editar',
  templateUrl: './tecnologia-editar.component.html',
  styleUrls: ['./tecnologia-editar.component.css']
})
export class TecnologiaEditarComponent {
  public botonAceptarDeshabilitado: boolean = true;

  @Input() public dialogRef = MatDialogRef<TecnologiaEditarComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: DatosTecnolgia
  ) {

  }

  ngOnInit(): void {
    this.validarFormulario();
  }

  public validarFormulario(): void {
    const { tecnologia } = this.datos;

    const nombreValido = tecnologia.nombre && tecnologia.nombre.trim() !== "";

    this.botonAceptarDeshabilitado = !(nombreValido);
  }
}
