import { Component, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { StoreService } from '../services/store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnDestroy  {
  public step1Valid: boolean = false;
  public step2Valid: boolean = false;  
  public subscription$: Subscription;

  constructor( private storeService: StoreService ) {
    this.subscription$ = this.storeService.step1Valid.subscribe((value) => {
      this.step1Valid = value;
    });

    this.subscription$.add(this.storeService.step2Valid.subscribe((value) => {
      this.step2Valid = value;
    }));
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}
