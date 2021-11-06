import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import Swal from 'sweetalert2';
import { isError } from 'util';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

    public totalUsuarios = 0;
    public usuarios: Usuario[] = [];
    public usuariosTemp: Usuario[] = [];
    public imgSubs: Subscription;
    public desde = 1;
    public cargando = true;

    constructor( private us: UsuarioService, private busquedas: BusquedasService, private modalImg: ModalImagenService) { }

    ngOnInit(): void {
        this.cargarUsuariosPages();
        this.imgSubs = this.modalImg.nuevaImg.subscribe( img => this.cargarUsuariosPages() );
    }

    ngOnDestroy() {
        this.imgSubs.unsubscribe();
    }

    // tslint:disable-next-line:typedef
    cargarUsuariosPages() {
        this.cargando = true;
        this.us.cargar_usuarios(this.desde).subscribe( resp => {
            // const { total, usuarios } = resp;
            // console.log('Component', resp );
            this.totalUsuarios = resp.total;
            this.usuarios = resp.usuarios;
            this.usuariosTemp = resp.usuarios;
            this.cargando = false;
        });
    }

    cambiarPagina( valor: number ): void {
        this.desde += valor;
        if (this.desde < 0){
            this.desde = 0;
        } else if (this.desde >= this.totalUsuarios){
            this.desde -= valor;
        }
        this.cargarUsuariosPages();
    }

    // tslint:disable-next-line:typedef
    eliminarUsuario( usuario: Usuario){
        if ( usuario.id === this.us.uid ){
            return Swal.fire('ERROR!!', 'No se puede borrar a si mismo', 'error');
        }

        Swal.fire({
            title: '¿Borrar usuario?',
            text: `Va a borrar al usuario ${ usuario.nombre }`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar usuario!'
          }).then((result) => {
            if (result.isConfirmed) {
                this.us.elimina_usuario(usuario).subscribe(
                    resp => {
                        // console.log( resp );
                        this.cargarUsuariosPages();
                        Swal.fire('Usuario borrado!', `${ usuario.nombre } fue eliminado correctamente`, 'success');
                    }
                );
            }
        });
    }

    // tslint:disable-next-line:typedef
    cambiarRole(usuario: Usuario) {
        this.us.guardarUsuario(usuario).subscribe( resp => {
            console.log( resp );
        });
    }

    buscar( termino: string ): any{
        if ( termino.length === 0) {
            return this.usuarios = this.usuariosTemp;
        }
        this.busquedas.buscar('usuarios', termino).subscribe( resultados => {
            // console.log( resultados );
            this.usuarios = resultados;
        });
    }

    abrirModal(user: Usuario): void {
        // console.log('guarda', user );
        const img: string = (user.img === '') ? 'xx' : user.img;
        this.modalImg.abrirModal('usuarios', user.id, img);
    }

}
