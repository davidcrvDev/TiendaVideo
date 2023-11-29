import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DatosLogin {
  usuario: string;
  clave: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  @Input() public dialogRef = MatDialogRef<LoginComponent>;
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: DatosLogin
  ) {

  }
  
}
