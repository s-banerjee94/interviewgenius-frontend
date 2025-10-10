import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-forbidden',
  imports: [RouterLink, CardModule, ButtonModule],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css'
})
export class Forbidden {

}
