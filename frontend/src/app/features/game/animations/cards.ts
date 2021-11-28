import {animate, AnimationStateMetadata, state, style, transition, trigger} from "@angular/animations";
import {
  CARD_HEIGHT, CARD_WIDTH,
  DRAW_POSITION,
  HAND_OFFSETS,
  HAND_OFFSETS_HOR,
  PLAYER_POSITIONS,
  THROW_POSITION
} from "../const/coordinates";
import {add, mergeWith} from "ramda";

function getState(name: string, x: number, y: number, rotation: number = 0) {
  return state(
    name,
    style({
      transform: `translate(calc(${x} * {{boardWidth}}px), calc(${y} * {{boardHeight}}px)) rotate(${rotation}deg)`
    }),
    { params: {
        boardWidth: 0,
        boardHeight: 0,
      } }
  )
}

function playerCards(): AnimationStateMetadata[] {
  const states: AnimationStateMetadata[] = []
  PLAYER_POSITIONS.forEach((playerPosition, playerIndex) =>
    [...Array(8).keys()].forEach((handIndex) => {
      let position = mergeWith(add, playerPosition, playerPosition?.rotation == 90 || playerPosition?.rotation == -90
        ? HAND_OFFSETS_HOR[handIndex]
        : HAND_OFFSETS[handIndex])
      const s = getState(
        `player${playerIndex}-card${handIndex}`, position.x - CARD_WIDTH / 2, position.y - CARD_HEIGHT / 2, position.rotation
      )
      states.push(s)
    }))
  return states
}

function playerHands(): AnimationStateMetadata[] {
  return PLAYER_POSITIONS.map((playerPosition) =>
    getState(`player${playerPosition}-hand`, playerPosition.x, playerPosition.y, playerPosition.rotation)
  )
}

export function cardsAnimation() {
  return trigger('cards', [
    ...playerCards(),
    ...playerHands(),
    getState('throw', THROW_POSITION.x - CARD_WIDTH / 2, THROW_POSITION.y - CARD_HEIGHT / 2),
    getState('draw', DRAW_POSITION.x - CARD_WIDTH / 2, DRAW_POSITION.y - CARD_HEIGHT / 2),
    transition('* => *', [
      animate('0.3s')
    ])
  ])
}
