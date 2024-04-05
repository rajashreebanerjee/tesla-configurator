import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { NavigationComponent } from '../../navigation/navigation.component';
import { Router } from '@angular/router';
import { ModelCodeAvailable, saveStep1Info, saveStep2Info } from '../../models/car.model';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-step-3',
  standalone: true,
  imports: [
    NavigationComponent,
    CurrencyPipe
  ],
  providers: [
  ],
  templateUrl: './step-3.component.html',
  styleUrl: './step-3.component.scss'
})
export class Step3Component implements OnInit, OnDestroy {
  public subscription$: Subscription;
  public imagePath: string | null = null;
  public saveStep1Info: saveStep1Info | null = null;
  public saveStep2Info: saveStep2Info | null = null;

  readonly OPTION_UPSELL_PRICE: number = 1000;
  totalPrice: number = 0;

  constructor(
    private router: Router,
    private storeService: StoreService,
    private apiService: ApiService
  ){
    this.subscription$ = this.storeService.saveStep1Info.subscribe((value) => {
      this.saveStep1Info = value;
      if(!value?.currentModel){
        this.router.navigate(['/']);
      }
    });
    this.subscription$.add(this.storeService.saveStep2Info.subscribe((value) => {
      this.saveStep2Info = value;
    }));
  }

  

  ngOnInit(): void {    
    const selectedModelCode = this.saveStep1Info?.selectedModel?.code as ModelCodeAvailable;
    const selectedColor = this.saveStep1Info?.selectedColor?.code as string;
    this.totalPrice = this.calculateTotalPrice();
    this.imagePath = this.apiService.createImagePath(selectedModelCode, selectedColor);
  }

  
  private calculateTotalPrice(): number {
    // config and color selected
    const configPrice: number = this.saveStep2Info?.configs?.price || 0;
    const colorPrice: number = this.saveStep1Info?.selectedColor?.price || 0;

    // options selected
    const yokePrice: number = this.saveStep2Info?.yoke ? this.OPTION_UPSELL_PRICE : 0;
    const towHitchPrice: number = this.saveStep2Info?.towHitch ? this.OPTION_UPSELL_PRICE : 0;

    return configPrice + colorPrice + yokePrice + towHitchPrice;
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}
