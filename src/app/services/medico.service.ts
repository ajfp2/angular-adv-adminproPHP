import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;
@Injectable({
    providedIn: 'root'
})
export class MedicoService {

    constructor(private http: HttpClient) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get headers(): any{
        return {
            headers: {
                // tslint:disable-next-line:object-literal-key-quotes
                'Authorization': this.token || ''
            }
        };
    }


    // tslint:disable-next-line:typedef
    getMedico(medicoId: string){
        const url = `${ base_url }/medicos/${ medicoId }`;
        return this.http.get(url, this.headers ).pipe(
            // map( (resp: {ok: boolean, medico: Medico }) => resp.medico ),
            map( (resp: any) => resp.medico ),
            catchError( error => of(false) )
        );
    }

    // tslint:disable-next-line:typedef
    cargar_medicos(desde: number = 1) {
        const url = `${ base_url }/medicos?page${ desde }`;
        return this.http.get(url, this.headers ).pipe(
            delay(1000),
            map( resp => resp )
        );
    }

    // tslint:disable-next-line:typedef
    crear_medico(medico: {nombre: string, hospital: string}) {
        console.log('Creando medico', medico);
        const url = `${ base_url }/medicos`;
        const data = {
            nombre: medico.nombre,
            img: '',
            hospital: medico.hospital,
            usuario: 1
        };
        return this.http.post(url, data, this.headers );
    }

    // tslint:disable-next-line:typedef
    actualizar_medico(medico: Medico) {
        console.log('Actualizar', medico);
        const url = `${ base_url }/medicos/${ medico.id }`;
        const data = {
            nombre: medico.nombre,
            hospital: medico.hospital,
            usuario: medico.usuario,
            img: medico.img
        };
        console.log('Actualizar2', data);
        return this.http.put(url, data, this.headers );
    }

    // tslint:disable-next-line:typedef
    eliminar_medico(id: string) {
        const url = `${ base_url }/medicos/${ id }`;
        return this.http.delete(url, this.headers );
    }
}
