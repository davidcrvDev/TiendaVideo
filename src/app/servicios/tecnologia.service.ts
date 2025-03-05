import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Globales } from '../modelos/globales';
import { Observable } from 'rxjs';
import { Tecnologia } from '../modelos/tecnologia';

@Injectable({
    providedIn: 'root'
  })
export class TecnologiaService {
    url: string;

    constructor(private http: HttpClient) {
        this.url = `${environment.urlBase}tecnologias`;
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

    public buscar(nombre: string): Observable<any> {
        let urlT = `${this.url}/buscar/${nombre}`;
        return this.http.get<any[]>(urlT, this.obtenerHeader());
    }

    public agregar(tecnologia: Tecnologia): Observable<any> {
            let urlT = this.url + "/agregar";
            return this.http.post<any>(urlT, tecnologia, this.obtenerHeader());
    }

    public actualizar(tecnologia: Tecnologia): Observable<any> {
            let urlT = this.url + "/modificar";
            return this.http.put<any>(urlT, tecnologia, this.obtenerHeader());
    }

    public eliminar(id: number): Observable<any> {
        let urlT = `${this.url}/eliminar/${id}`;
        return this.http.delete<any>(urlT, this.obtenerHeader());
    }
}