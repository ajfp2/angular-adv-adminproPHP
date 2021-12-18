import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Hospital } from '../../../models/hospital.model';

import { ModalImagenService } from '../../../services/modal-imagen.service';
import { HospitalService } from '../../../services/hospital.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

    public hospitales: Hospital[] = [];
    public cargando = true;
    private imgSubs: Subscription;

    constructor( private hospitalservice: HospitalService, private modalImg: ModalImagenService, private busquedas: BusquedasService ) { }

    ngOnInit(): void {
        this.cargar_hospitales();
        this.imgSubs = this.modalImg.nuevaImg
        .pipe(delay(100))
        .subscribe( img => this.cargar_hospitales() );
    }

    ngOnDestroy(): void {
        this.imgSubs.unsubscribe();
    }

    cargar_hospitales(): void {
        this.cargando = true;
        this.hospitalservice.cargar_hospitales().subscribe( (hospitales: any) => {
            this.cargando = false;
            this.hospitales = hospitales;
            // this.hospitales.push(resp.hospitales);
        });
    }

    guardarCambios(hospital: Hospital): void{
        this.hospitalservice.actualizar_hospital( hospital ).subscribe( resp => {
            // console.log( resp );
            Swal.fire(
                'Actualizado',
                hospital.nombre,
                'success'
            );
        });

    }

    eliminarHospital(hospital: Hospital): void {
        Swal.fire({
            title: '¿Esta seguro?',
            text: 'Va a borrar ' + hospital.nombre + ', ¿desea continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar!',
            cancelButtonText: 'Cancelar!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.hospitalservice.eliminar_hospital(hospital.id).subscribe( resp => {
                    // console.log( resp );
                    this.cargar_hospitales();
                    Swal.fire(
                        'Eliminado',
                        hospital.nombre,
                        'success'
                    );
                });
            }
        });
    }

    // tslint:disable-next-line:typedef
    async crearHospitalModal(){
        const { value = ''} = await Swal.fire<string>({
            title: 'Crear Hospital',
            input: 'text',
            inputLabel: 'Nombre del Hospital:',
            inputPlaceholder: 'Nombre ...',
            showCancelButton: true,
            cancelButtonText: 'Cancelar!',
            cancelButtonColor: '#d33'
        });

        if (value.trim().length > 0) {
            this.hospitalservice.crear_hospital( value, '1').subscribe( (resp: any) => {
                console.log(resp);
                this.hospitales.push(resp.hospital);
            });
        }
    }

    buscar( termino: string ): any{
        if ( termino.length === 0) {
            return this.cargar_hospitales();
        }
        this.busquedas.buscar('hospitales', termino).subscribe( (resultados: Hospital[]) => {
            // console.log( resultados );
            this.hospitales = resultados;
        });
    }

    abrirModal(hospital: Hospital): void {
        // console.log('guarda', user );
        const img: string = (hospital.img === '') ? 'xx' : hospital.img;
        this.modalImg.abrirModal('hospitales', hospital.id, img);

    }

}
