import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Globales } from '../modelos/globales';
import { Pais } from '../modelos/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${environment.urlBase}paises`;
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

  public agregar(pais: Pais): Observable<any> {
    let urlT = this.url + "/agregar";
    return this.http.post<any>(urlT, pais, this.obtenerHeader());
  }

  public actualizar(pais: Pais): Observable<any> {
    let urlT = this.url + "/modificar";
    return this.http.put<any>(urlT, pais, this.obtenerHeader());
  }
  
  public eliminar(id: number): Observable<any> {
    let urlT = `${this.url}/eliminar/${id}`;
    return this.http.delete<any>(urlT, this.obtenerHeader());
  }

}
