import {GameState} from "../store/game.reducer";
import {CardUI, GameStateUI} from "../models/gameStateUI";
import {add, addIndex, concat, map, mergeWith, reduce} from "ramda";
import {Card, GameStateToClient, Hand } from "shared";
import {DRAW_POSITION, HAND_OFFSETS, PLAYER_POSITIONS, THROW_POSITION} from "../const/coordinates";
import {Position} from "../models/common";

const transformHand = (cards: Hand, position: Position): CardUI[] => {
  const mapIndex = addIndex(map);
  return mapIndex(
    (card, index) =>
      card !== null
        ? {
          ...(card as CardUI),
          ...mergeWith(add, position, HAND_OFFSETS[index]),
        }
        : null,
    cards
  ).filter((card): card is CardUI => card !== null);
};

const transformCards = (cards: Card[], position: Position): CardUI[] => {
  return map(
    (card) => ({
      ...card,
      ...position,
    }),
    cards
  );
};

export const gameStateToUI = (gameState: GameStateToClient | null): GameStateUI | null => {
  if(!gameState)
    return null

  const cards = reduce<CardUI[], CardUI[]>(
    concat,
    [],
    [
      transformCards(gameState.draw, DRAW_POSITION),
      transformCards(gameState.throw, THROW_POSITION),
      gameState.players.reduce(
        (acc, player, playerIndex) =>
          concat(
            acc,
            transformHand(player.cards, PLAYER_POSITIONS[playerIndex])
          ),
        [] as CardUI[]
      ),
    ]
  ).sort((card1, card2) => card1.id - card2.id);

  return {
    cards,
  };
};
