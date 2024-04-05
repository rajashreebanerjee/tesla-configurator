import { Routes } from '@angular/router';
import { Step1Component } from './steps/step-1/step-1.component';
import { Step2Component } from './steps/step-2/step-2.component';

export const routes: Routes = [
    { path: '', redirectTo: 'step-1', pathMatch: 'full' },
    { path: 'step-1', title: 'Step-1', component: Step1Component },
    { path: 'step-2', title: 'Step-2', component: Step2Component },
];
