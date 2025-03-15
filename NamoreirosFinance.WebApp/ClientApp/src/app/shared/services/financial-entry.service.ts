import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFinancialEntry } from '../interfaces/financial-entry.interface';
import { QueryRequest } from '../models/query-request';

@Injectable({
  providedIn: 'root'
})
export class FinancialEntryService {
  private readonly apiUrl = "http://localhost:5214/api/FinancialEntry/v1";

  constructor(private http: HttpClient) { }

  getEntries(): Observable<IFinancialEntry[]> {
    return this.http.get<IFinancialEntry[]>(this.apiUrl);
  }

  getEntryById(id: number): Observable<IFinancialEntry> {
    return this.http.get<IFinancialEntry>(`${this.apiUrl}/${id}`);
  }

  addEntry(entry: IFinancialEntry): Observable<IFinancialEntry> {
    return this.http.post<IFinancialEntry>(this.apiUrl, entry);
  }

  updateEntry(entry: IFinancialEntry): Observable<IFinancialEntry> {
    return this.http.patch<IFinancialEntry>(`${this.apiUrl}/${entry.id}`, entry);
  }

  deleteEntry(id: number): Observable<IFinancialEntry> {
    return this.http.delete<IFinancialEntry>(`${this.apiUrl}/${id}`);
  }

  getPaginatedEntries(request: QueryRequest): Observable<IFinancialEntry[]> {
    return this.http.post<IFinancialEntry[]>(`${this.apiUrl}/search`, request);
  }
}
