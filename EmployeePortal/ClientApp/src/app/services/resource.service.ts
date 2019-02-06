import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Resource } from '../models/resource';

@Injectable()
export class ResourceService {

  contentSelected = false;

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
  getResources() {
    return this.http.get<Resource[]>(environment.baseUrl + 'api/Resources');
  }
  getResourceById(resourceId) {
    return this.http.get<Resource>(environment.baseUrl + 'api/Resources/' + resourceId);
  }

  uploadResource(formData: FormData) {
    return this.http.post<void>(environment.baseUrl + 'api/Resources/Resource', formData);
  }

}
