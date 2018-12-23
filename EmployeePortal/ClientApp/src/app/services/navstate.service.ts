import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavStateService {

    public sideNavExpanded = new Subject<boolean>();

    constructor() {}

    sideNavExpandState(expanded: boolean) {
        this.sideNavExpanded.next(expanded);
    }

    ngOnDestroy() {
        this.sideNavExpanded.next();
    }
}