import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'app-medico',
    templateUrl: './medico.component.html',
    styles: [
    ]
})
export class MedicoComponent implements OnInit {

    public medicoForm: FormGroup;
    public hospitales: Hospital[] = [];
    public hospitalSeleccionado: Hospital;
    public medicoSeleccionado: Medico;

    constructor( private fb: FormBuilder, private hs: HospitalService, private ms: MedicoService,
                 private router: Router, private activaRoute: ActivatedRoute) { }

    ngOnInit(): void {
        this.medicoForm = this.fb.group({
            nombre: ['', Validators.required],
            hospital: ['', Validators.required]
        });

        this.cargarHospitales();

        this.medicoForm.get('hospital').valueChanges.subscribe( hospitalId => {
            this.hospitalSeleccionado = this.hospitales.find( h => h.id === hospitalId );
        });

        this.activaRoute.params.subscribe( ({ id }) => {
            this.cargarMedico( id );
        });
    }

    // tslint:disable-next-line:typedef
    cargarMedico(idMed: string) {
        if (idMed === 'nuevo') {
            return;
        }

        this.ms.getMedico(idMed).pipe(delay(1000)).subscribe( medico => {
            console.log('medico', medico);
            if (!medico){
                return this.router.navigateByUrl('/dashboard/medicos');
            }
            const { nombre, hospital: {id} } = medico;
            this.medicoForm.setValue( {nombre, hospital: id});
            this.medicoSeleccionado = medico;
        });
    }


    // tslint:disable-next-line:typedef
    cargarHospitales() {
        this.hs.cargar_hospitales().subscribe( (hospitales: any) => {
            console.log('hospitales', hospitales);
            this.hospitales = hospitales;
        });
    }

    // tslint:disable-next-line:typedef
    guardarMedico() {
        const { nombre } = this.medicoForm.value;

        if (this.medicoSeleccionado){
            // Update
            const data = {
                ...this.medicoForm.value,
                id: this.medicoSeleccionado.id,
                usuario: this.medicoSeleccionado.usuario,
                img: this.medicoSeleccionado.img
            };
            this.ms.actualizar_medico(data).subscribe( (resp: any) => {
                console.log( resp );
                Swal.fire(
                    'Médico actualizado', `${ nombre } actualizado correctamente`, 'success'
                );
                // this.router.navigateByUrl(`/dashboard/medico/${ resp.data }`);
            });
        } else {
            // Insert
            this.ms.crear_medico( this.medicoForm.value ).subscribe( (resp: any) => {
                Swal.fire(
                    'Médico creado', `${ nombre } creado correctamente`, 'success'
                );
                this.router.navigateByUrl(`/dashboard/medico/${ resp.data }`);
            });
        }
    }

}
