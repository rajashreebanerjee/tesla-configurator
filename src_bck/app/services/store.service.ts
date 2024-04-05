import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { saveStep1Info, saveStep2Info } from '../models/tesla.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
    private step1Valid$ = new Subject<boolean>();
    step1Valid = this.step1Valid$.asObservable();
    setStep1(flag: boolean) {
        this.step1Valid$.next(flag);
    }

    private step2Valid$ = new Subject<boolean>();
    step2Valid = this.step2Valid$.asObservable();
    setStep2(flag: boolean) {
        this.step2Valid$.next(flag);
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