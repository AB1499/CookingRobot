import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
    id: string;
    userid: string;

    login(id: string, userid: string): void {
        this.id = id;
        this.userid = userid;
    }
}