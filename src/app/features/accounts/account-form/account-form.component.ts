import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from 'src/app/core/model/account.model';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit, OnChanges {
  @Input() account: Account | null = null;
  @Output() save = new EventEmitter<Partial<Account>>();
  @Output() cancel = new EventEmitter<void>();

  public accountForm: FormGroup;
  public formTitle: string = 'Thêm mới tài khoản';

  constructor(private fb: FormBuilder) {

    this.accountForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      gender: ['M', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      balance: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['account'] && this.account) {
      this.formTitle = `Chỉnh sửa tài khoản: ${this.account.firstname} ${this.account.lastname}`;
      this.accountForm.patchValue(this.account);
    } else {
      this.formTitle = 'Thêm mới tài khoản';
      this.accountForm.reset({ gender: 'M' });
    }
  }


  get f() {
    return this.accountForm.controls;
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      this.save.emit(this.accountForm.value);
    } else {

      this.accountForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.cancel.emit();
  }
}

