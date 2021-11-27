
export interface CardUI {
  id: number
  value: string | null
  x: number
  y: number
  index: number
}

// export interface PlayerUI {
//   name: string;
// }

export interface GameStateUI {
  // players: Player[];
  cards: CardUI[];
}

export interface CardStyle {
  width: string,
  height: string,
  transform: string,
  'z-index': number
}

export interface GameStateUIWithStyles extends GameStateUI {
  cards: (CardUI & {style: CardStyle})[]
}
