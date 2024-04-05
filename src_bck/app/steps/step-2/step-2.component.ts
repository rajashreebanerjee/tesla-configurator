import { ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription, map} from 'rxjs';
import { NavbarComponent } from '../../navbar/navbar.component';
import { StoreService } from '../../services/store.service';
import { Config, ConfigInformation, ModelCodeAvailable, saveStep1Info, saveStep2Info } from '../../models/tesla.model';
import { TeslaService } from '../../services/tesla.service';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

export interface Step2Form {
  selectedConfig: FormControl<Config | null>,
  currentConfig: FormControl<string>,
  towHitch: FormControl<boolean>,
  yoke: FormControl<boolean>,
}

@Component({
  selector: 'app-step-2',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NavbarComponent,
    CurrencyFormatPipe
  ],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.scss'
})
export class Step2Component implements OnInit, OnDestroy {
  public subscription$: Subscription;
  public saveStep1Info: saveStep1Info | null = null;
  public saveStep2Info: saveStep2Info | null = null;
  public imagePath: string | null = null;
  selectedConfig: Config | null = null;
  public configInformation: ConfigInformation | null = null;

  step2Form: FormGroup = this.formBuilder.group<Step2Form>({
    selectedConfig: new FormControl<Config | null>( null),
    currentConfig: new FormControl<string>('', { nonNullable: true }),
    towHitch: new FormControl<boolean>(false, { nonNullable: true }),
    yoke: new FormControl<boolean>(false, { nonNullable: true }),
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private storeService: StoreService,
    private teslaService: TeslaService
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
   const selectedColorCode = this.saveStep1Info?.selectedColor?.code as string;
   
   this.subscription$.add(this.teslaService.getOptionByModel(selectedModelCode)
      .pipe(
        map((response: ConfigInformation) => {
          if(response){
            this.configInformation = response;
            if(!this.saveStep2Info?.currentConfig) {
              this.storeService.setStep2Info({
                currentConfig : this.saveStep2Info?.currentConfig as string,
                configs: this.saveStep2Info?.configs as Config,
                towHitch: response.towHitch,
                yoke: response.yoke 
              });
            }
          }
        })
      ).subscribe());
    this.selectedConfig = this.saveStep2Info?.configs as Config;
    this.step2Form.patchValue(this.saveStep2Info as saveStep2Info);
    this.imagePath = this.teslaService.createImagePath(selectedModelCode, selectedColorCode);
  }

  onModelChange(event: Event): void {
    if (!event) return;

    const selectConfig: string = (event.target as HTMLInputElement).value;
    const config: Config | undefined = this.teslaService.searchCurrentElement<Config>(selectConfig, this.configInformation?.configs);

    if (!config) {
      this.resetConfig();
      return;
    }
    this.selectedConfig = config;
    const savestep2data = {
      currentConfig : selectConfig,
        configs: config,
        towHitch: false,
        yoke: false 
    };
    this.storeService.setStep2(true);
    this.storeService.setStep2Info(savestep2data);
    this.step2Form.get('selectedConfig')?.patchValue(this.selectedConfig);
  }

  towCheck(event: Event): void {
    this.storeService.setStep2Info({
        currentConfig : this.saveStep2Info?.currentConfig as string,
        configs: this.saveStep2Info?.configs as Config,
        towHitch: (event.target as HTMLInputElement).checked,
        yoke: this.saveStep2Info?.yoke as boolean 
    });
  }

  yokeCheck(event: Event): void {
    this.storeService.setStep2Info({
      currentConfig : this.saveStep2Info?.currentConfig as string,
      configs: this.saveStep2Info?.configs as Config,
      towHitch:  this.saveStep2Info?.towHitch as boolean,
      yoke: (event.target as HTMLInputElement).checked
    });
  }
  
  private resetConfig(): void {
    // this.step2Form.get('selectedConfig')?.patchValue('');
    this.selectedConfig = null;
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
