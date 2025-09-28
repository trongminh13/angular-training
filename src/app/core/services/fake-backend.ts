import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';


import { Account, ParamSearch, createParamSearch } from '../model/account.model';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, body, params } = request;


    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/accounts') && method === 'GET':
          return handleGet();
        case url.endsWith('/accounts') && method === 'POST':
          return handlePost();
        case url.match(/\/accounts\/\w+$/) && method === 'PUT':
          return handlePut();
        case url.match(/\/accounts\/\w+$/) && method === 'DELETE':
          return handleDelete();
        default:
          return next.handle(request);
      }
    }


    function handleGet() {

      let accounts: Account[] = JSON.parse(localStorage.getItem('accounts') || '[]');

      const searchParams = {
        first_name: params.get('first_name'),
        last_name: params.get('last_name'),
        email: params.get('email'),
        gender: params.get('gender'),
        address: params.get('address')
      };


      const filteredAccounts = accounts.filter(acc => {
        return (
          (!searchParams.first_name || acc.firstname.toLowerCase().includes(searchParams.first_name.toLowerCase())) &&
          (!searchParams.last_name || acc.lastname.toLowerCase().includes(searchParams.last_name.toLowerCase())) &&
          (!searchParams.email || acc.email.toLowerCase().includes(searchParams.email.toLowerCase())) &&
          (!searchParams.gender || acc.gender === searchParams.gender) &&
          (!searchParams.address || acc.address.toLowerCase().includes(searchParams.address.toLowerCase()))
        );
      });



      const start = parseInt(params.get('start') || '0', 10);
      const limit = parseInt(params.get('limit') || '25', 10);
      const total = filteredAccounts.length;
      const paginatedAccounts = filteredAccounts.slice(start, start + limit);

      const response = {
        accounts: paginatedAccounts,
        total: total
      };

      return of(new HttpResponse({ status: 200, body: response })).pipe(delay(500));
    }

    function handlePost() {
        const newAccount = body;
        let accounts: Account[] = JSON.parse(localStorage.getItem('accounts') || '[]');


        newAccount._id = Math.random().toString(36).substr(2, 9);
        newAccount.account_number = Math.floor(100000 + Math.random() * 900000).toString();

        accounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(accounts));
        return of(new HttpResponse({ status: 200, body: newAccount }));
    }

    function handlePut() {
        const id = url.split('/').pop()!;
        let accounts: Account[] = JSON.parse(localStorage.getItem('accounts') || '[]');
        const index = accounts.findIndex(acc => acc._id === id);
        if (index > -1) {
            accounts[index] = { ...accounts[index], ...body };
            localStorage.setItem('accounts', JSON.stringify(accounts));
        }
        return of(new HttpResponse({ status: 200, body: accounts[index] }));
    }

    function handleDelete() {
        const id = url.split('/').pop()!;
        let accounts: Account[] = JSON.parse(localStorage.getItem('accounts') || '[]');
        accounts = accounts.filter(acc => acc._id !== id);
        localStorage.setItem('accounts', JSON.stringify(accounts));
        return of(new HttpResponse({ status: 200 }));
    }
  }
}
