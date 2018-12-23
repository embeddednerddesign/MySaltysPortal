import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Resource } from '../../../../models/resource';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';
import { ResourcesService } from '../../../../services/resources.service';
import { FormatterService } from '../../../../services/formatter.service';

@Component({
  selector: 'app-edit-resource',
  templateUrl: './edit-resource.component.html',
  styleUrls: ['./edit-resource.component.less']
})
export class EditResourceComponent implements OnInit, AfterViewInit {

  editResourcePanelVisible = false;
  addOrEdit = 'Add';

  resourceIdParam: string;
  resourceCategoryParam: string;

  name: FormControl;
  resourceType: FormControl;
  isNew: boolean;

  resourceTypes: string[] = [];

  public selectedResource: Resource;
  public editedResource: Resource;

constructor(private resourcesService: ResourcesService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    public formatterService: FormatterService,
    private route: ActivatedRoute,
    private router: Router) {
    this.name = new FormControl();
    this.resourceType = new FormControl();
}

  ngOnInit() {
    this.selectedResource = this.initResource(this.selectedResource);
    this.editedResource = this.initResource(this.editedResource);

    this.isNew = true;
    this.addOrEdit = 'Add';
    this.route.params.subscribe(params => {
      this.resourceIdParam = params['rsrcid'];
      if (this.resourceIdParam != '_' && this.resourceIdParam != null) {
        this.resourcesService.getResourceById(this.resourceIdParam).subscribe(snapshot => {
          this.selectedResource = snapshot as Resource;
          this.editedResource = snapshot as Resource;
          this.isNew = false;
          this.addOrEdit = 'Edit';
        });
      }
    });

    this.resourceTypes.push('Room');
    this.resourceTypes.push('Equipment');

  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  updateResource() {
    if (this.isNew) {
      this.resourcesService.addResource(this.editedResource).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/organization/resources', { outlets: { 'action-panel': null } }]);
      });
    }
    else {
      this.resourcesService.updateResource(this.editedResource).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/organization/resources', { outlets: { 'action-panel': null } }]);
      });
    }
  }

  cancelUpdate() {
    this.catalogueUpdatesService.refreshRequired = false;
    this.catalogueUpdatesService.catalogueUpdateComplete();
    this.router.navigate(['/management/organization/resources', { outlets: {'action-panel': null}}]);
  }

  initResource(pakage: Resource) {
    pakage = {
      resourceId: 0,
      name: '',
      resourceType: null
    };
    return pakage;
  }
}
