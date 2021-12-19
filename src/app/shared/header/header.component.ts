import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {
    public user: Usuario;

    constructor( private us: UsuarioService, private router: Router) {
        this.user = us.usuario;
    }

    logout(): void {
        this.us.logout();
    }

    buscarDatos(termino: string): void {
        console.log( termino );
        if ( termino.length === 0){
            this.router.navigateByUrl('/dashboard');
        } else {
            this.router.navigateByUrl(`/dashboard/buscar/${ termino }`);
        }
    }



}
