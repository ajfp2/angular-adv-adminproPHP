import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

    private linkTheme = document.querySelector('#theme');

    constructor() {
        const tema = localStorage.getItem('theme') || './assets/css/colors/default-dark.css';
        this.linkTheme.setAttribute('href', tema);
    }

    changeTheme(tema: string): void {
        const url = `./assets/css/colors/${ tema }.css`;
        this.linkTheme.setAttribute('href', url);
        localStorage.setItem('theme', url);
        this.checkCurrentTheme();
      }

    checkCurrentTheme(): void {
        const links: NodeListOf<Element> = document.querySelectorAll('.selector');
        links.forEach( elem => {
            elem.classList.remove('working');
            const btnTheme = elem.getAttribute('data-theme');
            const btnUrl = `./assets/css/colors/${ btnTheme }.css`;
            const currentTheme = this.linkTheme.getAttribute('href');
            if (btnUrl === currentTheme){
                elem.classList.add('working');
            }
        });
    }
}
