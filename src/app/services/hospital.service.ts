import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';


const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class HospitalService {

    constructor(private http: HttpClient) { }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    // get uid(): string{
    //     return this.usuario.id || '';
    // }

    get headers(): any{
        return {
            headers: {
                // tslint:disable-next-line:object-literal-key-quotes
                'Authorization': this.token || ''
            }
        };
    }

    // tslint:disable-next-line:typedef
    cargar_hospitales(desde: number = 1) {
        const url = `${ base_url }/hospitales?page=${ desde }`;
        return this.http.get(url, this.headers ).pipe(
            delay(100),
            map( (resp: any) => resp.hospitales )
        );
    }

    // tslint:disable-next-line:typedef
    crear_hospital(nombre: string, iduser: string) {
        const url = `${ base_url }/hospitales`;
        const data = {
            nombre,
            img: '',
            usuario: 1
        };
        return this.http.post(url, data, this.headers );
    }

    // tslint:disable-next-line:typedef
    actualizar_hospital(hospital: Hospital) {
        // console.log('Actualizar', hospital);
        const url = `${ base_url }/hospitales/${ hospital.id }`;
        const data = {
            nombre: hospital.nombre,
            usuario: hospital.usuario
        };
        return this.http.put(url, data, this.headers );
    }

    // tslint:disable-next-line:typedef
    eliminar_hospital(id: string) {
        const url = `${ base_url }/hospitales/${ id }`;
        return this.http.delete(url, this.headers );
    }

}
