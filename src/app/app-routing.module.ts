import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { TituloComponent } from './componentes/titulo/titulo.component';
import { AlquilerComponent } from './componentes/alquiler/alquiler.component';
import { TecnologiaComponent } from './componentes/tecnologia/tecnologia.component';
import { CategoriaComponent } from './componentes/categoria/categoria.component';
import { InventarioComponent } from './componentes/inventario/inventario.component';
import { ClienteComponent } from './componentes/cliente/cliente.component';
import { CambiarClaveComponent } from './componentes/cambiar-clave/cambiar-clave.component';

const routes: Routes = [
  { path: "inicio", component: InicioComponent },
  { path: "cambiar-clave", component: CambiarClaveComponent },
  { path: "tecnologia", component: TecnologiaComponent },
  { path: "categoria", component: CategoriaComponent },
  { path: "inventario", component: InventarioComponent },
  { path: "titulo", component: TituloComponent },
  { path: "cliente", component: ClienteComponent },
  { path: "alquiler", component: AlquilerComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
