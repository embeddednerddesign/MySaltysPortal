import { Injectable } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

@Injectable()
export class FormatterService {

    constructor() { }

    textCapitalize(formCtrl) {
        formCtrl.setValue(new TitleCasePipe().transform(formCtrl.value));
    }

    textUppercase(formCtrl) {
        formCtrl.setValue(new UpperCasePipe().transform(formCtrl.value));
    }

    formatPhoneNumber(formCtrl) {
        var s2 = (""+formCtrl.value).replace(/\D/g, '');
        var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
        var result = (!m) ? formCtrl.value : m[1] + "-" + m[2] + "-" + m[3];
        formCtrl.setValue(result);
    }
}
