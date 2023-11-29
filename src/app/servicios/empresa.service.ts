import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Globales } from '../modelos/globales';
import { Observable } from 'rxjs';
import { Empresa } from '../modelos/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${environment.urlBase}empresas`;
  }

  public obtenerHeader() {
    const headers = new HttpHeaders({
      'Authorization': Globales.usuario!.token,
    });
    return { headers: headers };
  }

  public listar(): Observable<any> {
    let urlT = `${this.url}/listar`;
    return this.http.get<any[]>(urlT, this.obtenerHeader());
  }

  public buscar(nombre: string): Observable<any> {
    let urlT = `${this.url}/buscar/${nombre}`;
    return this.http.get<any[]>(urlT, this.obtenerHeader());
  }

  public agregar(empresa: Empresa): Observable<any> {
    let urlT = this.url + "/agregar";
    return this.http.post<any>(urlT, empresa, this.obtenerHeader());
  }

  public actualizar(empresa: Empresa): Observable<any> {
    let urlT = this.url + "/modificar";
    return this.http.put<any>(urlT, empresa, this.obtenerHeader());
  }
  
  public eliminar(id: number): Observable<any> {
    let urlT = `${this.url}/eliminar/${id}`;
    return this.http.delete<any>(urlT, this.obtenerHeader());
  }
  
}
