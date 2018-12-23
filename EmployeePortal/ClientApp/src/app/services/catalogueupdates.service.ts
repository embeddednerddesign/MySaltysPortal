import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CatalogueUpdatesService {

    public catalogueUpdated = new Subject();
    public refreshRequired: boolean = false;

    constructor() {}

    catalogueUpdateComplete() {
        this.catalogueUpdated.next();
    }

    ngOnDestroy() {
        this.catalogueUpdated.next();
    }
}