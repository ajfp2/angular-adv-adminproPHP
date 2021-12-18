import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

    constructor( private http: HttpClient ) { }

    get token(): string {
        return localStorage.getItem('token') || '';
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

    private transformarUsuarios(resultados: any[]): Usuario[] {

        return resultados.map(
            user => new Usuario (user.nombre, user.email, '', user.img, user.google, user.role, user.id )
        );
    }

    private transformarHospitales(resultados: any[]): Hospital[] {

        // return resultados.map(
        //     hosp => new Hospital (hosp.nombre, hosp.img, hosp.usuario, hosp.id )
        // );
        return resultados;
    }

    private transformarMedicos(resultados: any[]): Hospital[] {

        return resultados;
    }

    // tslint:disable-next-line:typedef
    buscar( tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
        const url = `${ base_url }/busquedas/${ tipo }/${ termino }`;
        return this.http.get<any[]>(url, this.headers ).pipe(
            map( (resp: any) => {
                switch ( tipo ){
                    case 'usuarios':
                    return this.transformarUsuarios( resp.resultados );
                    case 'hospitales':
                    return this.transformarHospitales( resp.resultados );
                    case 'medicos':
                    return this.transformarMedicos( resp.resultados );
                    default: return [];
                }
            })
        );
    }
}
