import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'http://localhost:2007/api/upload';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<{ imageUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ imageUrl: string; filename: string }>(
      `${this.apiUrl}/image`,
      formData
    );
  }
}
