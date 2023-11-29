import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Globales } from '../modelos/globales';
import { Alquiler } from '../modelos/alquiler';

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {

  url:string;

  constructor(private http: HttpClient
    ) {
      this.url = `${environment.urlBase}alquileres`;
    }

  public obtenerHeader() {
    const headers = new HttpHeaders({
      'Authorization': Globales.usuario!.usuario,//.token
    });
    return { headers: headers };
  }

  public listar(): Observable<any> {
    let urlT = `${this.url}/listar`;
    return this.http.get<any[]>(urlT, this.obtenerHeader());
  }

  public buscar(id: number): Observable<any> {
    let urlT = `${this.url}/buscar/${id}`;
    return this.http.get<any[]>(urlT, this.obtenerHeader());
  }

  public agregar(alquiler: Alquiler): Observable<any> {
    let urlT = this.url + "/agregar";
    return this.http.post<any>(urlT, alquiler, this.obtenerHeader());
  }

  public actualizar(alquiler: Alquiler): Observable<any> {
    let urlT = this.url + "/modificar";
    return this.http.put<any>(urlT, alquiler, this.obtenerHeader());
  }
  
  public eliminar(id: number): Observable<any> {
    let urlT = `${this.url}/eliminar/${id}`;
    return this.http.delete<any>(urlT, this.obtenerHeader());
  }
}
