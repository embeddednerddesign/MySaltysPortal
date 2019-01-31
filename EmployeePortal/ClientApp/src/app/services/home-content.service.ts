import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HomeContent } from '../models/home-content';

@Injectable()
export class HomeContentService {

  contentSelected = false;

  constructor(private http: HttpClient) { }

  addHomeContent(content: HomeContent) {
    return this.http.post<HomeContent>(environment.baseUrl + 'api/HomeContent', content);
  }
  updateCompany(content: HomeContent) {
    return this.http.put<void>(environment.baseUrl + 'api/HomeContent/' + content.homeContentId, content);
  }
  removeCompany(content: HomeContent) {
    return this.http.delete(environment.baseUrl + 'api/HomeContent/' + content.homeContentId);
  }
  getHomeContent() {
    return this.http.get<HomeContent[]>(environment.baseUrl + 'api/HomeContent');
  }
  getHomeContentById(contentId) {
    return this.http.get<HomeContent>(environment.baseUrl + 'api/HomeContent/' + contentId);
  }

}
