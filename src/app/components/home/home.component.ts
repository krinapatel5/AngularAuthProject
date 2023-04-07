// import { Component, OnInit } from '@angular/core';
// import { AuthenticationService } from 'src/app/services/authentication.service';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss']
// })
// export class HomeComponent implements OnInit {
//   user$ = this.authService.currentUser$;

//   constructor(private authService: AuthenticationService){}

//   ngOnInit(): void{}
// }
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StorageService } from '../../services/storage.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/shared/dialog/delete-dialog/delete-dialog.component';
import { ModalService } from '../../services/modal.service';
import { Subscription, take } from 'rxjs';
import { AddCompanyComponent } from 'src/app/add-company/add-company.component';

export interface UserData {
  id: string;
  companyName: string;
  email: string;
  phone: number;
  createdAt: string;
  address: string;
  action: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [],
})
export class HomeComponent implements AfterViewInit, MaterialModule, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'companyName',
    'email',
    'phone',
    'createdAt',
    'address',
    'action',
  ];
  dataSource: MatTableDataSource<UserData>;
  myFormData: any;
  customPaginator: any;
  public subscription: Subscription = new Subscription();

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  constructor(
    private storageservice: StorageService,
    private dialog: MatDialog,
    private modalservice: ModalService
  ) {
    // Assign the data to the data source for the table to render
    this.myFormData = this.storageservice.getData('formData');
    this.dataSource = new MatTableDataSource(this.myFormData);
  }

  ngAfterViewInit() {
    this.myFormData = this.myFormData.map((ob: any, index: any) => {
      return { ...ob, id: index + 1 };
    });
    this.dataSource = new MatTableDataSource(this.myFormData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPaginateChange(event: any) {
    this.customPaginator = event;
  }

  openCompanyFormDialog() {
    this.dialog.open(AddCompanyComponent, {
      width: '50vw',
      height: '90vh',
    });
  }

  removeAndUpdateRecord(index: any) {
    let updatedIndex = index;
    if (this.customPaginator && Object.keys(this.customPaginator)?.length) {
      updatedIndex =
        this.customPaginator.pageIndex * this.customPaginator.pageSize +
        updatedIndex;
    }
    let newCompanyData = JSON.parse(localStorage.getItem('formData') || '');
    newCompanyData.splice(updatedIndex, 1);
    localStorage.clear();
    this.storageservice.saveData('formData', newCompanyData);
    this.myFormData = this.storageservice.getData('formData');
    this.dataSource = new MatTableDataSource(this.myFormData);
    this.ngAfterViewInit();
  }

  editCompanyDetails(row: any, index: any) {
    this.dialog.open(AddCompanyComponent, {
      data: row,
      width: '75%',
      height: '90vh',
    });
    this.modalservice
      .getModalClose()
      .pipe(take(1))
      .subscribe((result: any) => {
        if (result === true) {
          this.removeAndUpdateRecord(index);
        } else {
          return;
        }
      });
    return;
  }

  deleteCompanyDetails(index: any) {
    this.dialog
      .open(DeleteDialogComponent, {})
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.removeAndUpdateRecord(index);
        }
      });
  }
}
