import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Color, Config, ConfigInformation, ModelCodeAvailable, ModelInformation } from '../models/tesla.model';

@Injectable({
  providedIn: 'root'
})
export class TeslaService {
  constructor(private httpClient: HttpClient) { }

  getModels(): Observable<ModelInformation[]> {
    return this.httpCallHandler<ModelInformation[]>('/models');
  }

  getOptionByModel(model: ModelCodeAvailable): Observable<ConfigInformation> {
    return this.httpCallHandler<ConfigInformation>(`/options/${model}`);
  }

  private httpCallHandler<T>(endpoint: string): Observable<T> {
    return this.httpClient.get<T>(endpoint)
      .pipe(
        map((response: T) => response)
      )
  }

  searchCurrentElement<T extends ModelInformation | Config>(currentValue: string, array?: T[] | null): T | undefined {
    return array?.find((model: T) => model.description === currentValue);
  }

  searchCurrentColor<T extends Color>(currentCode: string, array?: T[] | null): T | undefined {
    return array?.find((color: Color) => color.code === currentCode);
  }
  
  createImagePath(modelCode: string, currentColor: string): string {
    return `assets/images/${modelCode}/${currentColor}.jpg`;
  }

}
