import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Globales } from '../modelos/globales';
import { Observable } from 'rxjs';
import { Categoria } from '../modelos/categoria';

@Injectable({
    providedIn: 'root'
  })
export class CategoriaService {
    url: string;

    constructor(private http: HttpClient) {
        this.url = `${environment.urlBase}categorias`;
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

    public buscar(nombre: string): Observable<any> {
        let urlT = `${this.url}/buscar/${nombre}`;
        return this.http.get<any[]>(urlT);
    }

    public agregar(categoria: Categoria): Observable<any> {
        let urlT = this.url + "/agregar";
        return this.http.post<any>(urlT, categoria);
    }

    public actualizar(categoria: Categoria): Observable<any> {
        let urlT = this.url + "/modificar";
        return this.http.put<any>(urlT, categoria);
    }

    public eliminar(id: number): Observable<any> {
        let urlT = `${this.url}/eliminar/${id}`;
        return this.http.delete<any>(urlT);
    }

    public existeCategoria(nombre: string): Observable<boolean> {
        let urlT = `${this.url}/existe/${encodeURIComponent(nombre.trim().toLowerCase())}`;
        return this.http.get<boolean>(urlT);
    }
    
}