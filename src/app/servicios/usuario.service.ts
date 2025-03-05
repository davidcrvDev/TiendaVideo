import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${environment.urlBase}usuarios`;
  }

  public login(usuario: string, clave: string): Observable<any> {
    // let urlT =`${this.url}/login?usuario=${usuario}&clave=${clave}`;
    // return this.http.get(urlT);

    return new Observable(observer => {
      observer.next({ usuario: 'bypass-user' }); // Usuario simulado
      observer.complete();
  });
  }

}
