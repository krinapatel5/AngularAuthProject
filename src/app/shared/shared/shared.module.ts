import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { DeleteDialogComponent } from '../dialog/delete-dialog/delete-dialog.component';

@NgModule({
  declarations: [DeleteDialogComponent],
  imports: [CommonModule, MaterialModule, HttpClientModule],
  exports: [MaterialModule],
})
export class SharedModule {}
