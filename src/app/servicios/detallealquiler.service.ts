import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Globales } from '../modelos/globales';
import { DetalleAlquiler } from '../modelos/detallealquiler';

@Injectable({
    providedIn: 'root'
  })
export class DetalleAlquilerService {

    url: string;

    constructor(private http: HttpClient
    ) {
        this.url = `${environment.urlBase}detalleAlquileres`;
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

    public agregar(detallealquiler: DetalleAlquiler): Observable<any> {
        let urlT = this.url + "/agregar";
        return this.http.post<any>(urlT, detallealquiler, this.obtenerHeader());
    }

    public actualizar(detallealquiler: DetalleAlquiler): Observable<any> {
        let urlT = this.url + "/modificar";
        return this.http.put<any>(urlT, detallealquiler, this.obtenerHeader());
    }

    public eliminar(id: number): Observable<any> {
        let urlT = `${this.url}/eliminar/${id}`;
        return this.http.delete<any>(urlT, this.obtenerHeader());
    }
}