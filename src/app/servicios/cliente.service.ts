import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globales } from '../modelos/globales';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { Cliente } from '../modelos/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  url: string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = `${environment.apiUrl}clientes`;
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

  // Ejemplo de método en ClienteService
  actualizarMoroso(id: number, moroso: boolean) {
    return this.http.patch(`${this.url}/${id}/moroso`, { moroso });
}
  
  public buscar(nombre: string): Observable<any> {
    let urlT = `${this.url}/buscar/${nombre}`;
    return this.http.get<any[]>(urlT);
  }

  public agregar(cliente: Cliente): Observable<any> {
    let urlT = this.url + "/agregar";
    return this.http.post<any>(urlT, cliente);
  }

  public actualizar(cliente: Cliente): Observable<any> {
    let urlT = this.url + "/modificar";
    return this.http.put<any>(urlT, cliente);
  }

  public eliminar(id: number): Observable<any> {
    let urlT = `${this.url}/eliminar/${id}`;
    return this.http.delete<any>(urlT);
  }

  public descargarReporteClientes() {
    this.http.get(`${this.url}/reporte`, { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clientes_reporte.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
