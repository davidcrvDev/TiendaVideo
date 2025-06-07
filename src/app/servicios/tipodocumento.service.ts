import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Globales } from '../modelos/globales';
import { Observable } from 'rxjs';
import { Tipodocumento } from '../modelos/tipodocumento';

@Injectable({
    providedIn: 'root'
  })
export class TipodocumentoService {
    url: string;

    constructor(private http: HttpClient) {
        this.url = `${environment.urlBase}tipodocumentos`;
    }

    public obtenerHeader() {
        const headers = new HttpHeaders({
          'Authorization': Globales.usuario!.usuario,//.token
        });
        return { headers: headers };
    }

    public listar(): Observable<any> {
        let urlT = `${this.url}/listar`;
        return this.http.get<any[]>(urlT);
    }

    public buscar(tipo: string): Observable<any> {
        let urlT = `${this.url}/buscar/${tipo}`;
        return this.http.get<any[]>(urlT);
    }

    public agregar(tipodocumento: Tipodocumento): Observable<any> {
        let urlT = this.url + "/agregar";
        return this.http.post<any>(urlT, tipodocumento);
    }

    public actualizar(tipodocumento: Tipodocumento): Observable<any> {
        let urlT = this.url + "/modificar";
        return this.http.put<any>(urlT, tipodocumento);
    }

    public eliminar(id: number): Observable<any> {
        let urlT = `${this.url}/eliminar/${id}`;
        return this.http.delete<any>(urlT);
    }
}