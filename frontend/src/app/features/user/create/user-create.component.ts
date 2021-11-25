import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NakamaService} from "../../core/services/nakama.service";
import {UserService} from "../../core/services/user.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.sass']
})
export class UserCreateComponent implements OnInit {

  userForm = this.fb.group({
    username: ['', Validators.required]
  })

  constructor(private fb: FormBuilder,
              private router: Router,
              private nakamaService: NakamaService,
              private userService: UserService,
              private toastr: ToastrService) {

  }

  ngOnInit(): void {

  }

  createUser() {
    const {username} = this.userForm.value
    const user = this.userService.createUser(username)
    this.nakamaService.authenticate(user.deviceId, user.username).subscribe({
        next: (success) => {
          this.userService.saveUser(user)
          this.router.navigate(['game','create-or-join'])
        },
        error: (err) => {
          console.error(err)
          this.toastr.error(err)
        }
      }
    )
  }
}
