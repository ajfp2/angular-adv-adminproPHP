import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {
    public user: Usuario;

    constructor( private us: UsuarioService) {
        this.user = us.usuario;
    }

    logout(): void {
        this.us.logout();
    }



}
