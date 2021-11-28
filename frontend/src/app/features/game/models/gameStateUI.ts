
export interface CardStyle {
  width: string,
  height: string
  transform: string,
  'z-index': number
}

export interface CardUI {
  id: number
  value: string | null
  index: number
  state: string
}

export interface PlayerStyle {
  transform: string
}
export interface PlayerUI {
  displayName: string;
  style: any
}

export interface GameStateUI {
  players: PlayerUI[];
  cards: CardUI[];
}

export interface GameStateUIWithStyles extends GameStateUI {
  cards: (CardUI & {style: CardStyle})[],
  players: (PlayerUI & {style: PlayerStyle})[]
}
