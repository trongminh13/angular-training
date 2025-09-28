import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Account } from 'src/app/core/model/account.model';
import { AccountService } from '../../../core/services/account.service';
import { DatatableColumn } from '../../../shared/components/my-datatable/my-datatable.component';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {

  public isLoading: boolean = false;
  public accounts: Account[] = [];
  public totalRows: number = 0;
  public columnsConfig: DatatableColumn[] = [];


  public searchForm: FormGroup;


  public isModalVisible: boolean = false;
  public selectedAccount: Account | null = null;


  private currentPage: number = 1;
  public readonly pageSize: number = 25; // As per the requirements

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder
  ) {

    this.searchForm = this.fb.group({
      last_name: [''],
      first_name: [''],
      gender: [''],
      email: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.loadAccounts();
  }


  private initializeColumns(): void {
    this.columnsConfig = [
      { field: 'account_number', label: 'Số tài khoản', width: '150px' },
      { field: 'firstname', label: 'Họ', width: '120px' },
      { field: 'lastname', label: 'Tên', width: '120px' },
      { field: 'balance', label: 'Số dư', width: '140px' },
      { field: 'gender', label: 'Giới tính', width: '100px' },
      { field: 'email', label: 'Email' },
      { field: 'actions', label: 'Hành động', width: '150px' } // Column for Edit/Delete buttons
    ];
  }


  public loadAccounts(): void {
    this.isLoading = true;
    const searchValues = this.searchForm.value;

    const params = {
      limit: this.pageSize,
      start: (this.currentPage - 1) * this.pageSize,
      ...searchValues // Merge values from the search form into params
    };

    this.accountService.searchAccounts(params).subscribe({
      next: (response) => {
        this.accounts = response.accounts;
        this.totalRows = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading account list:', err);
        this.isLoading = false; // Ensure loading is turned off on error
      }
    });
  }


  onSearch(): void {
    this.currentPage = 1;
    this.loadAccounts();
  }


  onPageChanged(event: { page: number; limit: number }): void {
    this.currentPage = event.page;
    this.loadAccounts();
  }



  openAddModal(): void {
    this.selectedAccount = null;
    this.isModalVisible = true;
  }

  openEditModal(account: Account): void {
    this.selectedAccount = { ...account };
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }


  handleSave(accountData: Partial<Account>): void {
    let operation: Observable<Account>;

    if (this.selectedAccount) {

      const updatedAccount = { ...this.selectedAccount, ...accountData } as Account;
      operation = this.accountService.updateAccount(updatedAccount);
    } else {

      operation = this.accountService.addAccount(accountData as Omit<Account, '_id'>);
    }

    operation.subscribe({
      next: () => {
        console.log('Data saved successfully!');
        this.closeModal();
        this.loadAccounts(); // Reload the list after saving
      },
      error: (err) => console.error('Error saving data:', err)
    });
  }


  deleteAccount(account: Account): void {

    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản ${account.firstname} ${account.lastname}?`)) {
      this.accountService.deleteAccount(account._id).subscribe({
        next: () => {
          console.log('Account deleted successfully!');

          if (this.accounts.length === 1 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.loadAccounts(); // Reload the list
        },
        error: (err) => console.error('Error deleting account:', err)
      });
    }
  }
}

