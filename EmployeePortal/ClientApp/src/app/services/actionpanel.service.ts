import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ActionPanelService {

    private actionPanelOpen = new BehaviorSubject(false);

    constructor() {}

    actionPanelVisible() {
        return this.actionPanelOpen.asObservable();
    }

    setActionPanelVisibility(value: boolean) {
        this.actionPanelOpen.next(value);
    }
}

@Injectable()
export class MasterOverlayService {

    public masterOverlayEnabled = new Subject<boolean>();

    constructor() {}

    masterOverlayState(overlay: boolean) {
        this.masterOverlayEnabled.next(overlay);
    }

    ngOnDestroy() {
        this.masterOverlayEnabled.next();
    }
}
