import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription, map } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { ApiService } from '../../services/api.service';
import { Color, ModelInformation, saveStep1Info } from '../../models/car.model';

export interface Step1Form {
  selectedModel: FormControl<ModelInformation | null>,
  currentModel: FormControl<string>,
  selectedColor: FormControl<Color | null>,
  currentColor: FormControl<string>
}

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.scss'
})
export class Step1Component implements OnInit, OnDestroy  {
  public saveStep1Info: saveStep1Info | null = null;
  public carModelInformation: ModelInformation[] | null = null;
  public selectedModel: ModelInformation | null = null;
  public imagePath: string | null = null;
  public subscription$: Subscription;

  public step1Form: FormGroup = this.formBuilder.group<Step1Form>({
    selectedModel: new FormControl<ModelInformation | null>( null),
    currentModel: new FormControl<string>('', { nonNullable: true }),
    selectedColor: new FormControl<Color | null>( null),
    currentColor: new FormControl<string>('', { nonNullable: true })
  });

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private storeService: StoreService
  ){
    this.subscription$ = this.storeService.saveStep1Info.subscribe((value) => {
      this.saveStep1Info = value;      
    });
  }
  
  ngOnInit(): void {
    this.subscription$.add(this.apiService.getModels()
      .pipe(
        map((respose: ModelInformation[]) => {
          this.carModelInformation = respose;
        }),
      ).subscribe());

      if(this.saveStep1Info?.currentModel) {
        this.step1Form.patchValue(this.saveStep1Info as saveStep1Info);
        this.selectedModel = this.saveStep1Info.selectedModel;
        this.imagePath = this.apiService.createImagePath(this.selectedModel.code, this.saveStep1Info.currentColor as string);
      }
  } 

  onModelChange(event: Event): void {
    if (!event) {
      return;
    }
    this.resetConfig(); // to reset the configration of selected data from step 2 component 
    this.storeService.setStep2(true); // enable step2 navigation
    this.storeService.setStep3(false);  // disable step3 navigation
    const selectedModelCode: string = (event.target as HTMLInputElement).value;
    const selectedModel: ModelInformation | undefined = this.apiService.searchCurrentElement<ModelInformation>(selectedModelCode, this.carModelInformation);
    
    if (!selectedModel) {
      this.selectedModel = null;
      return;
    }
    const firstColor: Color = selectedModel.colors[0];
    const savestep1data = {
      selectedModel: selectedModel,
      currentModel: selectedModelCode,
      selectedColor: firstColor,
      currentColor: firstColor.code
    }
    this.selectedModel = selectedModel;
    this.storeService.setStep1Info(savestep1data);
    this.step1Form.patchValue(savestep1data);
    this.imagePath = this.apiService.createImagePath(selectedModel.code, firstColor.code);
  }

  onColorChange(event: Event): void {
    if (!event) return;
    const selectedColorCode: string = (event.target as HTMLInputElement).value;
    const color: Color | undefined = this.apiService.searchCurrentColor<Color>(selectedColorCode, this.selectedModel?.colors);

    if (!color) {
      return;
    }
    this.storeService.setStep2(true); // enable step2 navigation
    const modelCode: string = this.selectedModel?.code ? this.selectedModel.code : '';  
    this.storeService.setStep1Info({
      selectedModel: this.selectedModel as ModelInformation,
      currentModel:  this.selectedModel?.description as string,
      selectedColor: color,
      currentColor: selectedColorCode
    });
    this.imagePath = this.apiService.createImagePath(modelCode, color.code);
  }

  resetConfig(): void {
    this.storeService.setStep2Info({
      currentConfig : '',
        configs: {
            id: 0,
            description: '',
            range: 0,
            speed: 0,
            price: 0
        },
        towHitch: false,
        yoke: false
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
