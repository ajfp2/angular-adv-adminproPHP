import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map, catchError, timeout, timeoutWith, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    public usuario: Usuario;
    constructor( private http: HttpClient, private router: Router) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get uid(): string{
        return this.usuario.id || '';
    }

    get role(): 'ADMIN' | 'USER' {
        return this.usuario.role;
    }

    get headers(): any{
        return {
            // headers: new HttpHeaders().set('Authorization', this.token)
            headers: {
                // tslint:disable-next-line:object-literal-key-quotes
                'Authorization': this.token || ''
            }
        };
    }

    // tslint:disable-next-line:typedef
    guardarLocalStorage(token: string, menu: any) {
        localStorage.setItem('token', token);
        localStorage.setItem('menu', JSON.stringify( menu ));
    }

    logout(): void {
        // TODO: Boorrar menu
        localStorage.removeItem('token');
        localStorage.removeItem('menu');
        this.router.navigateByUrl('/login');
    }

    validarToken(): Observable<boolean> {
        return this.http.post( `${ base_url }/usuarios/verifyToken`,   { }, {
            headers: new HttpHeaders().set('Authorization', this.token)
        }).pipe(
            timeoutWith(15000, throwError(1)),
            map( (resp: any) => {
                const { email, google, id, img = '', nombre, role } = resp.usuario;

                this.usuario = new Usuario( nombre, email, '', img, google, role, id);
                // this.usuario.imprimirUsuario();
                this.guardarLocalStorage( resp.token, resp.menu);
                return true;
            }),
            catchError( error => of(false) )
        );
    }

    // tslint:disable-next-line:typedef
    crearUsuario( formData: RegisterForm) {
        // console.log('Data:', formData);
        return this.http.post( `${ base_url }/auth`,   formData, {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        } ).pipe(
            tap( (resp: any) => {
                // console.log('ser', resp );
                localStorage.setItem('token', resp.token);
            })
        );

    }

    // tslint:disable-next-line:typedef
    loginUsuario( formData: LoginForm) {
        // console.log('Data:', formData);
        return this.http.post( `${ base_url }/auth/login`,   formData, {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        } ).pipe(
            timeoutWith(8000, throwError(1)),
            tap( (resp: any) => {
                // console.log('login tap', resp );
                // localStorage.setItem('token', resp.token);
                this.guardarLocalStorage( resp.token, resp.menu);
            })
        );

    }

    // tslint:disable-next-line:typedef
    actualizarPerfil( data: { email: string, nombre: string, role?: string }) {
        data = {
            ...data,
            role: this.usuario.role
        };
        return this.http.put( `${ base_url }/usuarios/${ this.uid }`, data, this.headers);
    }

    // tslint:disable-next-line:typedef
    cargar_usuarios(desde: number = 1) {
        const url = `${ base_url }/usuarios?page=${ desde }`;
        return this.http.get<CargarUsuario[]>(url, this.headers ).pipe(
            delay(1000),
            map( (resp: any) => {
                console.log( resp );
                const userRecibidos = resp.usuarios.map(
                    user => new Usuario (user.nombre, user.email, '', user.img, user.google, user.role, user.id )
                );
                return {
                    total: resp.total,
                    usuarios: userRecibidos
                };
            })
        );
    }

    // tslint:disable-next-line:typedef
    elimina_usuario(user: Usuario ) {
        console.log(' eliminando ..');
        return this.http.delete( `${ base_url }/usuarios/${ user.id }`, this.headers);
    }

    // tslint:disable-next-line:typedef
    guardarUsuario( user: Usuario) {
        return this.http.put( `${ base_url }/usuarios/${ user.id }`, user, this.headers);
    }
}
