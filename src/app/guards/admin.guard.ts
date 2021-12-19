import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor( private usuarioSrv: UsuarioService, private router: Router ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
            if ( this.usuarioSrv.role === 'ADMIN'){
                return true;
            } else {
                this.router.navigateByUrl('/dashboard');
                return false;
            }
    }

}
