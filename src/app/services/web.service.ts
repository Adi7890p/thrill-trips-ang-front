import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebService {
  private readonly ROOT_URL = environment.baseUrl;
  private http = inject(HttpClient);
  //similar to constants, cannot modify this url

  constructor() { }
  post(url: string, payload: Object) {
    return this.http.post(`${this.ROOT_URL}/${url}`, payload);
  }

}