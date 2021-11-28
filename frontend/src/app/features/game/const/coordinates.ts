import {Position} from "../models/common";

export const BOARD_WIDTH = 1280;
export const BOARD_HEIGHT = 720;

export const CARD_WIDTH = 1 / 30;
export const CARD_HEIGHT = 1 / 10;

export const CARD_WIDTH_HOR = CARD_HEIGHT * BOARD_HEIGHT / BOARD_WIDTH;
console.log(CARD_WIDTH, CARD_WIDTH_HOR, CARD_WIDTH * BOARD_WIDTH, CARD_WIDTH_HOR * BOARD_HEIGHT)
export const CARD_HEIGHT_HOR = CARD_WIDTH * BOARD_WIDTH / BOARD_HEIGHT;

export const NAME_SIZE = 1/25;

export const THROW_POSITION: Position = {
  x: 1 / 2 + CARD_WIDTH,
  y: 1 / 2,
};
export const DRAW_POSITION: Position = {
  x: 1 / 2 - CARD_WIDTH,
  y: 1 / 2,
};

export const PLAYER_POSITIONS: Position[] = [
  {x: 1 / 2, y: 1 - CARD_HEIGHT * 2, rotation: 0},
  {x: 1 / 2, y: CARD_HEIGHT * 2, rotation: 180},
  {x: 3 * CARD_WIDTH, y: 1 / 2, rotation: 90},
  {x: 1 - 3 * CARD_WIDTH, y: 1 / 2, rotation: -90},
  {x: 1 / 4, y: CARD_HEIGHT * 2, rotation: 180},
  {x: 3 / 4, y: 1 - CARD_HEIGHT * 2, rotation: 0},
  {x: 3 / 4, y: CARD_HEIGHT * 2, rotation: 180},
  {x: 1 / 4, y: 1 - CARD_HEIGHT * 2, rotation: 0}
];

export const PLAYER_NAME_POSITIONS: Position[] = [
  {x: 1 / 2, y: 1 - CARD_HEIGHT + NAME_SIZE},
  {x: 1 / 2, y: CARD_HEIGHT - NAME_SIZE},
  {x: 3 * CARD_WIDTH, y: 1 / 2 + CARD_HEIGHT_HOR + NAME_SIZE},
  {x: 1 - 3 * CARD_WIDTH, y: 1 / 2 + CARD_HEIGHT_HOR + NAME_SIZE},
  {x: 1 / 4, y: CARD_HEIGHT - NAME_SIZE},
  {x: 3 / 4, y: 1 - CARD_HEIGHT + NAME_SIZE},
  {x: 3 / 4, y: CARD_HEIGHT - NAME_SIZE},
  {x: 1 / 4, y: 1 - CARD_HEIGHT + NAME_SIZE}
]

const handOffsets = (cardWidth: number, cardHeight: number): Position[] => {
  return [
    {x: (-cardWidth * 2) / 3, y: (-cardHeight * 2) / 3},
    {x: (cardWidth * 2) / 3, y: (-cardHeight * 2) / 3},
    {x: (cardWidth * 2) / 3, y: (cardHeight * 2) / 3},
    {x: (-cardWidth * 2) / 3, y: (cardHeight * 2) / 3},
    {x: -cardWidth * 2, y: (-cardHeight * 2) / 3},
    {x: cardWidth * 2, y: (-cardHeight * 2) / 3},
    {x: cardWidth * 2, y: (cardHeight * 2) / 3},
    {x: -cardWidth * 2, y: (cardHeight * 2) / 3},
  ];
}

export const HAND_OFFSETS: Position[] = handOffsets(CARD_WIDTH, CARD_HEIGHT)

export const HAND_OFFSETS_HOR: Position[] = handOffsets(CARD_WIDTH_HOR, CARD_HEIGHT_HOR)
