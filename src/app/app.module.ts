import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReferenciasMaterialModule } from './referencias-material.module';
import { LoginComponent } from './componentes/login/login.component';
import { FormsModule } from '@angular/forms';
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReferenciasMaterialModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
