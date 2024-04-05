import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { saveStep1Info, saveStep2Info } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
    private activeStep2$ = new Subject<boolean>();
    activeStep2 = this.activeStep2$.asObservable();
    setStep2(flag: boolean) {
        this.activeStep2$.next(flag);
    }

    private activeStep3$ = new Subject<boolean>();
    activeStep3 = this.activeStep3$.asObservable();
    setStep3(flag: boolean) {
        this.activeStep3$.next(flag);
    }

    private saveStep1Info$ = new BehaviorSubject<saveStep1Info>({
        selectedModel: {
            code: '3',
            description: 'Cybertruck',
            colors: []
        },
        currentModel: '',
        selectedColor: {
            code: 'white',
            description: '',
            price: 0
        },
        currentColor: ''
    });
    saveStep1Info = this.saveStep1Info$.asObservable();
    setStep1Info(data:saveStep1Info){
        this.saveStep1Info$.next(data);
    }

    private saveStep2Info$ = new BehaviorSubject<saveStep2Info>({        
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
    saveStep2Info = this.saveStep2Info$.asObservable();
    setStep2Info(data:saveStep2Info){
        this.saveStep2Info$.next(data);
    }  
}