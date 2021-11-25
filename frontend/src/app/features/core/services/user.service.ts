import {Injectable} from "@angular/core";
import {CookieService} from "ngx-cookie-service";
import {v4 as uuidv4} from "uuid";

interface User {
  deviceId: string,
  username: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private cookieService: CookieService) {
  }

  get userCreated(): boolean {
    return this.cookieService.check('user')
  }

  createUser(username: string): User {
    const deviceId = uuidv4();
    return {deviceId, username}
  }

  saveUser(user: User) {
    this.cookieService.set('user', JSON.stringify(user), 365, '/')
  }

  updateUser(username: string) {
    const user = this.user
    if(user) {
      this.cookieService.set('user', JSON.stringify({...user, username}), 365, '')
    }
  }

  get user(): User | null {
    const cookieContent = this.cookieService.get('user')
    if(!cookieContent)
      return null
    try {
      const user = JSON.parse(cookieContent)
      if(typeof user.username === "string" && typeof user.deviceId === "string") {
        return user as User
      }
    } catch (e) {
      console.log(e)
    }
    return null
  }
}
