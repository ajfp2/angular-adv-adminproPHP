import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    public formSubmitted = false;

    public registerForm = this.fb.group({
        nombre: ['', Validators.required ],
        email: ['', [Validators.required, Validators.email ] ],
        password: ['', Validators.required ],
        password2: ['', Validators.required ],
        terminos: [false, Validators.required ],
        google: [0],
        img: [''],
        role: ['']
    }, {
        validators: this.passwordsIguales('password', 'password2')
    });

    constructor(private fb: FormBuilder, private usuarioservice: UsuarioService, private router: Router) { }

    crearUsuario(): void{
        this.formSubmitted = true;
        if (this.registerForm.invalid) {
            return;
        }

        // Enviar form
        this.usuarioservice.crearUsuario( this.registerForm.value ).subscribe( resp => {
            // console.log('usuario creado');
            // console.log(resp);
            this.router.navigateByUrl('/');
        }, (err) => {
            // Si suceden un error
            console.warn(err.error);
            const e = err.error;
            Swal.fire('ERROR-' + e.error, e.messages.error, 'error');
        } );
    }

    camponovalido(campo: string): boolean {
        if (this.registerForm.get(campo).invalid && this.formSubmitted ){
            return true;
        }
        else { return false; }
    }

    aceptaTerminos(): boolean{
        return !this.registerForm.get('terminos').value && this.formSubmitted;
    }

    clavesnovalidas(): boolean {
        const pass1 = this.registerForm.get('password').value;
        const pass2 = this.registerForm.get('password2').value;

        if ((pass1 !== pass2) && this.formSubmitted){
            return true;
        } else {
            return false;
        }
    }

    passwordsIguales(pass1: string, pass2: string): any {
        return (formGroup: FormGroup) => {
            const pass1Control = formGroup.get(pass1);
            const pass2Control = formGroup.get(pass2);
            if (pass1Control.value === pass2Control.value){
                pass2Control.setErrors(null);
            } else {
                pass2Control.setErrors({ noEsIgual: true });
            }
        };
    }


}
