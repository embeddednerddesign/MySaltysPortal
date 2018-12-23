import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Room } from '../models/room';

@Injectable()
export class RoomService {
  constructor(private http: HttpClient) {}

  getRooms() {
    return this.http.get<Room[]>(environment.baseUrl + 'api/rooms');
  }
}
