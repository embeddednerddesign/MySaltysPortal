import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoryType } from '../../../models/category-type';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.less']
})
export class ManageCategoriesDialogComponent implements OnInit {
  categoryType: CategoryType;

  @ViewChild('content')
  private content: ElementRef;

  list: Category[];
  title: string;

  constructor(
    public dialogRef: MatDialogRef<ManageCategoriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: CategoryType,
    private service: CategoryService
  ) {
    this.categoryType = data;
    this.service.categoryType = data;
  }

  ngOnInit() {
    this.title = this.getTitle(this.service.categoryType);
    this.service.getAll().subscribe(list => {
      this.list = list;
    });
  }

  private getTitle(categoryType: CategoryType) {
    switch (categoryType) {
      case CategoryType.Product:
        return `Manage Product Categories`;

      case CategoryType.Service:
        return `Manage Service Categories`;

      default:
        return categoryType;
    }
  }

  addCategory() {
    const minId = this.list.reduce((prev, curr) => (prev.id < curr.id ? prev : curr)).id;
    const id = minId > 0 ? 0 : minId - 1;

    this.list.push({ id: id, name: '' });

    setTimeout(() => {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    });
  }

  remove(id: number) {
    this.list = this.list.filter(c => c.id !== id);
  }

  close() {
    this.dialogRef.close();
  }
}
