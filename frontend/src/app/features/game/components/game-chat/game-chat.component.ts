import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {selectChatMessages} from "../../store/game.selectors";
import {Store} from "@ngrx/store";
import {NakamaService} from "../../../core/services/nakama.service";
import {FormBuilder, Validators} from "@angular/forms";
import {NgScrollbar} from "ngx-scrollbar";

@Component({
  selector: 'app-game-chat',
  templateUrl: './game-chat.component.html',
  styleUrls: ['./game-chat.component.sass']
})
export class GameChatComponent implements OnInit {
  @ViewChild('chatMessages')
  chatMessagesElement: NgScrollbar | undefined

  chatMessages$ = this.store.select(selectChatMessages)

  chatMessageForm = this.fb.group({
    message: ['', [Validators.required, Validators.max(100)]]
  })

  constructor(private store: Store,
              private nakamaService: NakamaService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.chatMessages$.subscribe(() => {
      setTimeout(() => this.chatMessagesElement?.scrollTo({bottom: 0, duration: 50}), 100)
    })
  }

  sendChatMessage() {
    if(this.chatMessageForm.valid) {
      const formValue = this.chatMessageForm.value
      this.nakamaService.chatMessage(formValue.message)
      this.chatMessageForm.reset()
    }
  }
}
