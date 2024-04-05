import { Component, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { StoreService } from '../services/store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'navigation-bar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnDestroy  {
  public activeStep2: boolean = false;
  public activeStep3: boolean = false;  
  public subscription$: Subscription;

  constructor( private storeService: StoreService ) {
    this.subscription$ = this.storeService.activeStep2.subscribe((value) => {
      this.activeStep2 = value;
    });

    this.subscription$.add(this.storeService.activeStep3.subscribe((value) => {
      this.activeStep3 = value;
    }));
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}
