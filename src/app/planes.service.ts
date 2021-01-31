import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {

  constructor(
    private _http: HttpClient
  ) { }

  getPlanes(take = 50, skip = 0) {
    return this._http.get<IPlaneType[]>(`${AppConfig.apiUrl}/planes/types?take=${take}&skip=${skip}`);
  }

  getPlane(typeCode: string) {
    return this._http.get<IPlaneType>(`${AppConfig.apiUrl}/planes/types/${typeCode}`);
  }

  getPlaneByAtcTypeCode(atcTypeCode: string) {
    return this._http.get<IAtcTypeCodeResponse>(`${AppConfig.apiUrl}/planes/types/atc/${atcTypeCode}`);
  }
}

export interface IPlaneType {
  typeCode: string;
  description: string;
  atcTypeCodes: IAtcTypeCode[];
}

export interface  IAtcTypeCode {
  atcTypeCode: string;
}

export interface IAtcTypeCodeResponse {
  atcTypeCode: string;
  plane: IPlaneType;
}
