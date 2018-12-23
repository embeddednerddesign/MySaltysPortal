import { Injectable } from '@angular/core';
import { Resource } from '../models/resource';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ResourcesService {

  constructor(private http: HttpClient) { }

  addResource(resource: Resource) {
    return this.http.post<Resource>(environment.baseUrl + 'api/Resources', resource);
  }

  updateResource(resource: Resource) {
    return this.http.put<void>(environment.baseUrl + 'api/Resources/' + resource.resourceId, resource);
  }

  removeResource(resource: Resource) {
    return this.http.delete(environment.baseUrl + 'api/Resources/' + resource.resourceId);
  }

  saveResource(resource: Resource, isNew: boolean) {
    if (isNew) {
      return this.addResource(resource);
    } else {
      return this.updateResource(resource);
    }
  }

  getResources() {
    return this.http.get<Resource[]>(environment.baseUrl + 'api/Resources');
  }

  getResourceById(resourceId) {
    return this.http.get<Resource>(environment.baseUrl + 'api/Resources/' + resourceId);
  }
}
