import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  sendmail(to:string,subject:string,emails:string[],editorData:string) {
    let payload ={
      to,
      subject,
      emails,
      editorData
    }
    console.log(payload);
    return this.http.post(`${this.baseUrl}/sendmail`,payload);
  }
}
