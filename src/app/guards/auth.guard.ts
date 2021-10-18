import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor( private us: UsuarioService, private router: Router) {

    }

    // tslint:disable-next-line:typedef
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('pasa x el canActivate guard');
        return this.us.validarToken().pipe(
            tap( estaAutenticado => {
                if (!estaAutenticado) { this.router.navigateByUrl('/login'); }
            })
        );
    }

}
