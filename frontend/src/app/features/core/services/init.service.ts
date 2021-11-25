import {Injectable} from "@angular/core";
import {UserService} from "./user.service";
import {NakamaService} from "./nakama.service";

@Injectable({
  providedIn: 'root'
})
export class InitService {
  constructor(private userService: UserService, private nakamaService: NakamaService) {
  }

  public init() {
    const user = this.userService.user
    if(user) {
      this.nakamaService.authenticate(user.deviceId, user.username).subscribe()
    }
  }
}
