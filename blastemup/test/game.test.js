import Game from "../src/game";

describe("Game class", () => {
    it("should exist", () => {
        expect(Game).to.not.equal(undefined);
    });

    it("should have constructor", () => {
        const game = new Game();
        expect(game).not.to.equal(null);
    });
});
