import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Empresa } from 'src/app/modelos/empresa';
import { Pais } from 'src/app/modelos/pais';

export interface DatosEmpresa {
  encabezado: string;
  empresa: Empresa;
  paises: Pais[];
}

@Component({
  selector: 'app-empresa-editar',
  templateUrl: './empresa-editar.component.html',
  styleUrls: ['./empresa-editar.component.css']
})
export class EmpresaEditarComponent {
  
  @Input() public dialogRef = MatDialogRef<EmpresaEditarComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: DatosEmpresa
  ) {

  }

  ngOnInit(): void {

  }

}
