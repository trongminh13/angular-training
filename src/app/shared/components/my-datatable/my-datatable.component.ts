import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Account } from 'src/app/core/model/account.model';


export interface DatatableColumn {
  field: string;
  label: string;
  width?: string;
}

@Component({
  selector: 'app-my-datatable',
  templateUrl: './my-datatable.component.html',
  styleUrls: ['./my-datatable.component.scss']
})
export class MyDatatableComponent implements OnChanges {


  @Input() rows: Account[] = [];
  @Input() columns: DatatableColumn[] = [];
  @Input() totalRows: number = 0;
  @Input() isLoading: boolean = false;
  @Input() pageSize: number = 25;


  @Output() pageChanged = new EventEmitter<{ page: number; limit: number }>();
  @Output() edit = new EventEmitter<Account>();
  @Output() delete = new EventEmitter<Account>();


  public currentPage: number = 1;
  public totalPages: number = 0;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalRows']) {
      this.calculateTotalPages();
    }
  }

  private calculateTotalPages(): void {
    if (this.totalRows > 0) {
      this.totalPages = Math.ceil(this.totalRows / this.pageSize);
    } else {
      this.totalPages = 0;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && this.currentPage !== page && !this.isLoading) {
      this.currentPage = page;

      this.pageChanged.emit({ page: this.currentPage, limit: this.pageSize });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
}

