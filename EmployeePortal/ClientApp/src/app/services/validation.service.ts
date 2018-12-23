import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

@Injectable()
export class ValidationService {

    constructor() { }

    validatePhoneNumber(c: FormControl) {
        const PHONE_REGEXP = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        var returnVal;

        if (c.value !== '') {
            returnVal = PHONE_REGEXP.test(c.value) ? null : {
                phoneError: { }
            };
        }
        else {
            returnVal = null;
        }
        return returnVal;
    }

    validatePostalCode(c: FormControl) {
        const POSTALCODE_REGEXP = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        var returnVal;

        if (c.value !== '') {
            returnVal = POSTALCODE_REGEXP.test(c.value) ? null : {
                postalCodeError: { }
            };
        }
        else {
            returnVal = null;
        }
        return returnVal;
    }

    validateZipCode(c: FormControl) {
        const ZIPCODE_REGEXP = /^[0-9]{5}(?:-[0-9]{4})?$/;
        var returnVal;

        if (c.value !== '') {
            returnVal = ZIPCODE_REGEXP.test(c.value) ? null : {
                zipCodeError: { }
            };
        }
        else {
            returnVal = null;
        }
        return returnVal;
    }

    validateDate(c: FormControl) {
        // date format MM/DD/YYYY
        var returnVal = null;

        if (c.value === null) {
            returnVal = {
                dateError: { }
            };
        }
        else {
            if (c.value._i !== undefined && c.value._i.year === undefined) {
                var dateComponents = c.value._i.split('/');
                if ((!isNaN(parseInt(dateComponents[0])) && parseInt(dateComponents[0]) > 0 && parseInt(dateComponents[0]) < 13) &&
                    (!isNaN(parseInt(dateComponents[1])) && parseInt(dateComponents[1]) > 0 && parseInt(dateComponents[1]) < 31) &&
                    (!isNaN(parseInt(dateComponents[2])) && parseInt(dateComponents[2]) > 1900 && parseInt(dateComponents[2]) <= (new Date()).getFullYear())) {
                        returnVal = null;
                    }
                    else {
                        returnVal = {
                            dateError: { }
                        };
                    }
            }
            else {
                returnVal = null;
            }
        }
        return returnVal;
    }

    validateWebsite(c: FormControl) {
        const URL_REGEXP = /^(?![^\n]*\.$)(?:https?:\/\/)?(?:(?:[2][1-4]\d|25[1-5]|1\d{2}|[1-9]\d|[1-9])(?:\.(?:[2][1-4]\d|25[1-5]|1\d{2}|[1-9]\d|[0-9])){3}(?::\d{4})?|[a-z\-]+(?:\.[a-z\-]+){2,})$/;
        var returnVal;

        if (c.value !== '') {
            returnVal = URL_REGEXP.test(c.value) ? null : {
                websiteError: { }
            };
        }
        else {
            returnVal = null;
        }
        return returnVal;
    }

    validateMSPNumber(c: FormControl) {
      const ZIPCODE_REGEXP = /^[0-9]+$/;
      var returnVal;

      if (c.value !== '') {
          returnVal = ZIPCODE_REGEXP.test(c.value) ? null : {
              zipCodeError: { }
          };
      }
      else {
          returnVal = null;
      }
      return returnVal;
  }
}
