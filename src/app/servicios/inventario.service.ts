import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Globales } from '../modelos/globales';
import { Observable } from 'rxjs';
import { Inventario } from '../modelos/inventario';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  
  url: string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = `${environment.apiUrl}inventarios`;
  }

  public obtenerHeader() {
    const headers = new HttpHeaders({
      'Authorization': Globales.usuario!.usuario,//.token
    });
    return { headers: headers };
  }

  public listar(): Observable<any> {
    let urlT = `${this.url}/listar`;
    return this.http.get<any[]>(urlT).pipe(
      map(inventarios => 
        inventarios.map(inv => ({
          ...inv,
          fechaadquisicion: this.formatearFecha(inv.fechaadquisicion)
        }))
      )
    );
  }

  private formatearFecha(fecha: string | Date): string {
    const dateObj = new Date(fecha);
    dateObj.setDate(dateObj.getDate() + 1);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // `MM`
    const day = dateObj.getDate().toString().padStart(2, '0'); // `dd`
    return `${year}-${month}-${day}`;
  }

  public buscar(nombre: string): Observable<any> {
    let urlT = `${this.url}/buscar/${nombre}`;
    return this.http.get<any[]>(urlT);
  }

  public agregar(inventario: Inventario): Observable<any> {
    let urlT = this.url + "/agregar";
    return this.http.post<any>(urlT, inventario);
  }

  public actualizar(inventario: Inventario): Observable<any> {
    let urlT = this.url + "/modificar";
    return this.http.put<any>(urlT, inventario);
  }

  public eliminar(id: number): Observable<any> {
    let urlT = `${this.url}/eliminar/${id}`;
    return this.http.delete<any>(urlT);
  }

  public descargarReporteInventarios() {
    this.http.get(`${this.url}/reporte`, { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventarios_reporte.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}