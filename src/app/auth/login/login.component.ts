import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

    public loginForm = this.fb.group({

        email: [localStorage.getItem('email') || '', [Validators.required, Validators.email ] ],
        password: ['12341234', Validators.required ],
        remember: [true]
    });
    public formSubmitted = false;
    public btnLogin = '';

    constructor( private router: Router, private fb: FormBuilder, private us: UsuarioService) { }

    ngOnInit(): void {
    }

    // tslint:disable-next-line:typedef
    login() {
        // this.router.navigateByUrl('/');
        this.formSubmitted = true;
        this.btnLogin = 'disabled';
        if (this.loginForm.invalid) {
            Swal.fire('ERROR LOGIN', 'Campos incorrectos', 'error');
            this.btnLogin = '';
            return;
        }
        this.us.loginUsuario( this.loginForm.value )
        .subscribe(resp => {
            if (this.loginForm.get('remember').value){
                localStorage.setItem('email', this.loginForm.get('email').value);
            } else {
                localStorage.removeItem('email');
            }
            // IR al dashboard
            this.btnLogin = '';
            this.router.navigateByUrl('/');
        }, (err) => {
            // Si suceden un error
            console.error(err);
            let code = 502;
            let smsError = 'Timeout';
            if(err !== 1){
                console.warn(err.error);
                const e = err.error;
                code = e.error;
                smsError = e.messages.error;
            }
            this.btnLogin = '';
            Swal.fire('ERROR-' + code, smsError, 'error');
        });
    }
}
