import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, SearchResult } from '../model/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = '/accounts';

  constructor(private http: HttpClient) { }

  searchAccounts(params: any): Observable<SearchResult> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key]) {
        httpParams = httpParams.append(key, params[key]);
      }
    }
    return this.http.get<SearchResult>(this.apiUrl, { params: httpParams });
  }


  addAccount(accountData: Omit<Account, '_id'>): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, accountData);
  }


  updateAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${account._id}`, account);
  }


  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

