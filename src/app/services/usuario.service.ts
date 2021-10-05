import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    constructor( private http: HttpClient, private router: Router) { }

    logout() {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
    }

    validarToken(): Observable<boolean> {
        const token = localStorage.getItem('token') || '';

        return this.http.post( `${ base_url }/auth/verifyToken`,   {token}, {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        }).pipe(
            tap( (resp: any) => {
                console.log('ser', resp );
                localStorage.setItem('token', token);
            }),
            map( resp => true),
            catchError( error => of(false) )
        );

    }

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

    loginUsuario( formData: LoginForm) {
        // console.log('Data:', formData);
        return this.http.post( `${ base_url }/auth/login`,   formData, {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        } ).pipe(
            tap( (resp: any) => {
                // console.log('ser', resp );
                localStorage.setItem('token', resp.token);
            })
        );

    }
}
