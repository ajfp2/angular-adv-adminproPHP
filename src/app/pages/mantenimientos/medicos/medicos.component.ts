import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
    selector: 'app-medicos',
    templateUrl: './medicos.component.html',
    styles: [
    ]
})
export class MedicosComponent implements OnInit, OnDestroy {

    public medicos: Medico[] = [];
    public cargando = true;
    private imgSubs: Subscription;

    constructor(private medService: MedicoService, private modalImg: ModalImagenService, private busquedas: BusquedasService) { }

    ngOnInit(): void {
        this.cargarMedicos();
        this.imgSubs = this.modalImg.nuevaImg
        .pipe(delay(100))
        .subscribe( img => this.cargarMedicos() );
    }

    ngOnDestroy(): void {
        this.imgSubs.unsubscribe();
    }

    cargarMedicos(): void {
        this.cargando = true;
        this.medService.cargar_medicos().subscribe( (resp: any) => {

            this.cargando = false;
            this.medicos = resp.medicos;
        });
    }

    abrirModal(medico: Medico): void {
        // console.log('guarda', user );
        const img: string = (medico.img === '') ? 'xx' : medico.img;
        this.modalImg.abrirModal('medicos', medico.id, img);

    }

    guardarCambios(medico: Medico): void{
        this.medService.actualizar_medico( medico ).subscribe( resp => {
            // console.log( resp );
            Swal.fire(
                'Actualizado',
                medico.nombre,
                'success'
            );
        });

    }

    borrarMedico(medico: Medico): void {
        Swal.fire({
            title: '¿Esta seguro?',
            text: 'Va a borrar ' + medico.nombre + ', ¿desea continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar!',
            cancelButtonText: 'Cancelar!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.medService.eliminar_medico(medico.id).subscribe( resp => {
                    // console.log( resp );
                    this.cargarMedicos();
                    Swal.fire(
                        'Eliminado',
                        medico.nombre,
                        'success'
                    );
                });
            }
        });
    }

    buscar( termino: string ): any{
        if ( termino.length === 0) {
            return this.cargarMedicos();
        }
        this.busquedas.buscar('medicos', termino).subscribe( (resultados: Medico[]) => {
            // console.log( resultados );
            this.medicos = resultados;
        });
    }
}
