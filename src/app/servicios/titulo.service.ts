import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Globales } from '../modelos/globales';
import { Titulo } from '../modelos/titulo';

@Injectable({
  providedIn: 'root'
})
export class TituloService {

  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${environment.urlBase}titulos`;
  }

  public obtenerHeader(){
    const headers = new HttpHeaders({
      'Authorization': Globales.usuario!.usuario,//.token
    });
    return {headers: headers};
  }

  public listar(): Observable<any>{
    let urlT = `${this.url}/listar`;
    return this.http.get<any[]>(urlT);
  }

  public buscar(nombre: string): Observable<any> {
    let urlT = `${this.url}/buscar/${nombre}`;
    return this.http.get<any[]>(urlT);
  }

  public agregar(titulo: Titulo): Observable<any> {
    let urlT = this.url + "/agregar";
    return this.http.post<any>(urlT, titulo);
  }

  public actualizar(titulo: Titulo): Observable<any> {
    let urlT = this.url + "/modificar";
    return this.http.put<any>(urlT, titulo);
  }

  public eliminar(id: number): Observable<any> {
    let urlT = `${this.url}/eliminar/${id}`;
    return this.http.delete<any>(urlT);
  }

  public existeTitulo(nombre: string): Observable<boolean>{
    let urlT = `${this.url}/existe/${encodeURIComponent(nombre.trim().toLowerCase())}`;
    return this.http.get<boolean>(urlT);
  }

  public descargarReporteTitulos() {
    this.http.get('http://localhost:8080/titulos/reporte', { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'titulos_reporte.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
  
}
