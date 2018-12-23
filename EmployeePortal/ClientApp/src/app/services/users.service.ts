import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserCategory } from '../models/user-category';
import { Subject } from 'rxjs';

@Injectable()
export class UsersService {

  private loggedInUserUpdatedSource = new Subject<any>();
  loggedInUserUpdated$ = this.loggedInUserUpdatedSource.asObservable();

  loggedInUser: User = {
    id: '',
    firstName: '',
    lastName: '',
    avatar: '',
    phoneNumber: '',
    email: '',
    address: {
      address1: '',
      address2: '',
      city: '',
      province: 'British Columbia',
      country: 'Canada',
      postalCode: ''
    },
    clinics: [],
    userCategoryId: 0,
    userCategory: {
      userCategoryId: 0,
      categoryName: ''
    },
    serviceProvider: false,
    canSetBreaks: false,
  };

  constructor(private http: HttpClient) { }

  loggedInUserUpdated(value) {
    this.loggedInUserUpdatedSource.next(value);
  }

  addUser(user: User, password: string) {
    return this.http.post<User>(environment.baseUrl + 'api/Users/' + password, user);
  }

  updateUser(user: User) {
    return this.http.put<void>(environment.baseUrl + 'api/Users/' + user.id, user);
  }

  removeUser(user: User) {
    return this.http.delete(environment.baseUrl + 'api/Users/' + user.id);
  }

  saveUser(user: User, isNew: boolean, password) {
    if (isNew) {
      return this.addUser(user, password);
    } else {
      return this.updateUser(user);
    }
  }

  getUserById(userId: string) {
    return this.http.get<User>(environment.baseUrl + 'api/Users/' + userId);
  }

  getUsers() {
    return this.http.get<User[]>(environment.baseUrl + 'api/Users');
  }

  getUserCategories() {
    return this.http.get<UserCategory[]>(environment.baseUrl + 'api/UserCategories');
  }

}
