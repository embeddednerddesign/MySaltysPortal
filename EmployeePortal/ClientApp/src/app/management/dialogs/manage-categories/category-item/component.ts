import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Category } from '../../../../models/category';
import { CategoryType } from '../../../../models/category-type';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-category-item',
  templateUrl: 'view.html',
  styleUrls: ['style.less']
})
export class CategoryItemComponent implements OnInit {
  @Input()
  set categoryType(value: CategoryType) {
    this.service.categoryType = value;
  }

  readonly control = new FormControl();

  @Input()
  set data(value: Category) {
    this._data = value;
    this.control.setValue(value ? value.name : '');
    this.placeholder = this.isNew ? 'Enter New Category Name' : '';

    if (this.isNew) {
      setTimeout(() => {
        this.input.nativeElement.focus();
      });
    }
  }
  private _data: Category;

  private get isNew(): boolean {
    const data = this._data;
    return data ? data.id <= 0 : false;
  }

  @ViewChild('input')
  private input: ElementRef;

  isProgressBarVisible = false;
  isSaveButtonVisible = false;

  @Output()
  readonly deleted = new EventEmitter<number>();

  placeholder = '';

  constructor(private service: CategoryService) {}

  ngOnInit() {
    this.control.valueChanges.subscribe(value => {
      const data = this._data;
      const visible = this.isNew || data ? value && data.name !== value : !!value;
      this.isSaveButtonVisible = visible;
    });
  }

  save() {
    let data = this._data;

    if (data) {
      this.isProgressBarVisible = true;

      data = {
        id: data.id,
        name: this.control.value
      };

      if (data.id > 0) {
        this.service.updateCategory(data).subscribe(
          () => {
            this.isSaveButtonVisible = false;
            this.isProgressBarVisible = false;
            this._data.name = data.name;
          },
          () => {
            this.isProgressBarVisible = false;
          }
        );
      } else {
        data.id = 0;

        this.service.createCategory(data).subscribe(
          res => {
            this.isSaveButtonVisible = false;
            this.isProgressBarVisible = false;
            this._data.id = res.id;
          },
          () => {
            this.isProgressBarVisible = false;
          }
        );
      }
    }
  }

  delete() {
    const data = this._data;

    if (data) {
      const id = data.id;

      if (id > 0) {
        this.isProgressBarVisible = true;

        this.service.deleteCategory(id).subscribe(
          () => {
            this.deleted.emit(id);
            this.isProgressBarVisible = false;
          },
          () => {
            this.isProgressBarVisible = false;
          }
        );
      } else {
        this.deleted.emit(id);
      }
    }
  }
}
