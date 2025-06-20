import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}usuarios`;
  }

  public login(usuario: string, clave: string): Observable<any> {
    // let urlT =`${this.url}/login?usuario=${usuario}&clave=${clave}`;
    // return this.http.get(urlT);

    // return new Observable((observer) => {
    //   observer.next({ usuario: 'bypass-user' }); // Usuario simulado
    //   observer.complete();

    const loginPayload = {
      correo: usuario,
      clave: clave,
    };
    const urlT = `${environment.apiUrl}auth/login`; // Ajusta si tu backend usa otro path

    return this.http.post(urlT, loginPayload);
    //});
  }

  public cambiarClave(
    correo: string,
    claveActual: string,
    nuevaClave: string
  ): Observable<any> {
    const payload = {
      correo,
      claveActual,
      nuevaClave,
    };
    const url = `${environment.apiUrl}clientes/cambiar-clave`;
    return this.http.put(url, payload);
  }

  getUsuarioActual(): any {
    const usuarioStr = localStorage.getItem('usuarioActual');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  enviarClavePorCorreo(correo: string) {
    return this.http.post(`${environment.apiUrl}auth/enviar-clave`, { correo });
  }
}
