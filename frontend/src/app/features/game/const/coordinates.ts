import {Position} from "../models/common";

export const BOARD_WIDTH = 1280;
export const BOARD_HEIGHT = 720;

export const CARD_WIDTH = 1 / 30;
export const CARD_HEIGHT = 1 / 10;

export const THROW_POSITION: Position = {
  x: 1 / 2 + CARD_WIDTH,
  y: 1 / 2,
};
export const DRAW_POSITION: Position = {
  x: 1 / 2 - CARD_WIDTH,
  y: 1 / 2,
};

export const PLAYER_POSITIONS: Position[] = [
  {x: 1 / 2, y: 1 - CARD_HEIGHT * 2},
  {x: 1 / 2, y: CARD_HEIGHT * 2},
  {x: 3 * CARD_WIDTH, y: 1 / 2},
  {x: 1 - 3 * CARD_WIDTH, y: 1 / 2},
  {x: 1 / 4, y: CARD_HEIGHT * 2},
  {x: 3 / 4, y: 1 - CARD_HEIGHT * 2},
  {x: 3 / 4, y: CARD_HEIGHT * 2},
  {x: 1 / 4, y: 1 - CARD_HEIGHT * 2}
];

export const HAND_OFFSETS: Position[] = [
  {x: (-CARD_WIDTH * 2) / 3, y: (-CARD_HEIGHT * 2) / 3},
  {x: (CARD_WIDTH * 2) / 3, y: (-CARD_HEIGHT * 2) / 3},
  {x: (CARD_WIDTH * 2) / 3, y: (CARD_HEIGHT * 2) / 3},
  {x: (-CARD_WIDTH * 2) / 3, y: (CARD_HEIGHT * 2) / 3},
  {x: -CARD_WIDTH * 2, y: (-CARD_HEIGHT * 2) / 3},
  {x: CARD_WIDTH * 2, y: (-CARD_HEIGHT * 2) / 3},
  {x: CARD_WIDTH * 2, y: (CARD_HEIGHT * 2) / 3},
  {x: -CARD_WIDTH * 2, y: (CARD_HEIGHT * 2) / 3},
];
