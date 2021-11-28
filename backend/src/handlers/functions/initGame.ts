import { GameState, Card } from "shared";

const createCards = (): Card[] => {
    const cards: Card[] = [];
    let index = 53;
    let id = 0
    for (const p of ["c", "d", "h", "s"]) {
        for (let i = 1; i <= 13; i++) {
            cards.push({
                id: id++,
                value: p + i.toString(),
                index: index--,
            });
        }
    }
    for (let i = 1; i <= 2; i++) {
        cards.push({
            id: id++,
            value: "j" + i.toString(),
            index: index--,
        });
    }
    return cards;
};


export const initializeGame = (state: GameState): GameState => {
    const CARDS_IN_HAND = 4
    let cards = createCards()

    state.players = state.players.map((player) => {
        cards.slice(0, CARDS_IN_HAND).forEach((card, i) => {
            player.cards[i] = card
        })
        cards = cards.slice(CARDS_IN_HAND)
        return player
    })

    state.draw = cards;
    state.throw = []
    state.index = 54
    return state;
}
