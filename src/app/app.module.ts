import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReferenciasMaterialModule } from './referencias-material.module';
import { LoginComponent } from './componentes/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TituloComponent } from './componentes/titulo/titulo.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TituloEditarComponent } from './componentes/titulo-editar/titulo-editar.component';
import { DecidirComponent } from './componentes/decidir/decidir.component';
import { AlquilerComponent } from './componentes/alquiler/alquiler.component';
import { AlquilerEditarComponent } from './componentes/alquiler-editar/alquiler-editar.component';
import { TecnologiaComponent } from './componentes/tecnologia/tecnologia.component';
import { TecnologiaEditarComponent } from './componentes/tecnologia-editar/tecnologia-editar.component';
import { InventarioComponent } from './componentes/inventario/inventario.component';
import { InventarioEditarComponent } from './componentes/inventario-editar/inventario-editar.component';
import { CategoriaEditarComponent } from './componentes/categoria-editar/categoria-editar.component';
import { CategoriaComponent } from './componentes/categoria/categoria.component';
import { ClienteComponent } from './componentes/cliente/cliente.component';
import { ClienteEditarComponent } from './componentes/cliente-editar/cliente-editar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CambiarClaveComponent } from './componentes/cambiar-clave/cambiar-clave.component';
import { RecuperarClaveComponent } from './componentes/recuperar-clave/recuperar-clave.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChatbotComponent } from './componentes/chatbot/chatbot.component';
import { DetalleAlquilerComponent } from './componentes/detallealquiler/detallealquiler.component';
import { DetallealquilerEditarComponent } from './componentes/detallealquiler-editar/detallealquiler-editar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TituloComponent,
    TituloEditarComponent,
    TecnologiaComponent,
    TecnologiaEditarComponent,
    InventarioComponent,
    InventarioEditarComponent,
    CategoriaComponent,
    CategoriaEditarComponent,
    ClienteComponent,
    ClienteEditarComponent,
    DecidirComponent,
    AlquilerComponent,
    AlquilerEditarComponent,
    DetalleAlquilerComponent,
    DetallealquilerEditarComponent,
    CambiarClaveComponent,
    RecuperarClaveComponent,
    ChatbotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReferenciasMaterialModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
