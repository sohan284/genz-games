import { useState } from "react";
import "./Ludo.css";
import Dice from "./Dice";

const PLAYERS = ["red", "green", "yellow", "blue"];
const BOARD_SIZE = 15;

// Define the path for each player
const PATHS = {
  red: [
    { x: 6, y: 1 },
    { x: 6, y: 2 },
    { x: 6, y: 3 },
    { x: 6, y: 4 },
    { x: 6, y: 5 },
    { x: 5, y: 6 },
    { x: 4, y: 6 },
    { x: 3, y: 6 },
    { x: 2, y: 6 },
    { x: 1, y: 6 },
    { x: 1, y: 7 },
    { x: 1, y: 8 },
    { x: 2, y: 8 },
    { x: 3, y: 8 },
    { x: 4, y: 8 },
    { x: 5, y: 8 },
    { x: 6, y: 9 },
    { x: 6, y: 10 },
    { x: 6, y: 11 },
    { x: 6, y: 12 },
    { x: 6, y: 13 },
    { x: 7, y: 13 },
    { x: 8, y: 13 },
    { x: 8, y: 12 },
    { x: 8, y: 11 },
    { x: 8, y: 10 },
    { x: 8, y: 9 },
    { x: 9, y: 8 },
    { x: 10, y: 8 },
    { x: 11, y: 8 },
    { x: 12, y: 8 },
    { x: 13, y: 8 },
    { x: 13, y: 7 },
    { x: 13, y: 6 },
    { x: 12, y: 6 },
    { x: 11, y: 6 },
    { x: 10, y: 6 },
    { x: 9, y: 6 },
    { x: 8, y: 5 },
    { x: 8, y: 4 },
    { x: 8, y: 3 },
    { x: 8, y: 2 },
    { x: 8, y: 1 },
    { x: 7, y: 1 },
    { x: 7, y: 2 },
    { x: 7, y: 3 },
    { x: 7, y: 4 },
    { x: 7, y: 5 },
    { x: 7, y: 6 },
    { x: 7, y: 7 },
  ],
  // Add similar paths for other colors
};

const HOME_POSITIONS = {
  red: [
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 2, y: 2 },
  ],
  green: [
    { x: 1, y: 13 },
    { x: 1, y: 14 },
    { x: 2, y: 13 },
    { x: 2, y: 14 },
  ],
  yellow: [
    { x: 13, y: 13 },
    { x: 13, y: 14 },
    { x: 14, y: 13 },
    { x: 14, y: 14 },
  ],
  blue: [
    { x: 13, y: 1 },
    { x: 13, y: 2 },
    { x: 14, y: 1 },
    { x: 14, y: 2 },
  ],
};

const SAFE_SPOTS = [
  { x: 1, y: 6 },
  { x: 6, y: 1 },
  { x: 8, y: 1 },
  { x: 13, y: 6 },
  { x: 13, y: 8 },
  { x: 8, y: 13 },
  { x: 6, y: 13 },
  { x: 1, y: 8 },
];

function Ludo() {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [pieces, setPieces] = useState({
    red: HOME_POSITIONS.red.map((pos) => ({
      ...pos,
      isHome: true,
      pathPosition: -1,
    })),
    green: HOME_POSITIONS.green.map((pos) => ({
      ...pos,
      isHome: true,
      pathPosition: -1,
    })),
    yellow: HOME_POSITIONS.yellow.map((pos) => ({
      ...pos,
      isHome: true,
      pathPosition: -1,
    })),
    blue: HOME_POSITIONS.blue.map((pos) => ({
      ...pos,
      isHome: true,
      pathPosition: -1,
    })),
  });
  const [canRoll, setCanRoll] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    if (!canRoll || isRolling) return;

    setIsRolling(true);
    setCanRoll(false);

    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newValue);
      setIsRolling(false);

      const currentColor = PLAYERS[currentPlayer];
      const hasValidMoves = checkValidMoves(currentColor, newValue);

      if (!hasValidMoves) {
        setTimeout(nextTurn, 1000);
      }
    }, 1000);
  };

  const checkValidMoves = (color, value) => {
    return pieces[color].some((piece) => {
      if (piece.isHome) return value === 6;
      if (piece.pathPosition + value > 49) return false;
      return true;
    });
  };

  const handlePieceClick = (color, pieceIndex) => {
    if (color !== PLAYERS[currentPlayer] || !diceValue) return;

    const piece = pieces[color][pieceIndex];
    if (piece.isHome && diceValue !== 6) return;

    const newPieces = { ...pieces };
    if (piece.isHome && diceValue === 6) {
      // Move out of home
      const startPos = PATHS[color][0];
      newPieces[color][pieceIndex] = {
        ...startPos,
        isHome: false,
        pathPosition: 0,
      };
    } else if (!piece.isHome) {
      // Move on path
      const newPathPosition = piece.pathPosition + diceValue;
      if (newPathPosition <= 49) {
        const newPos = PATHS[color][newPathPosition];
        newPieces[color][pieceIndex] = {
          ...newPos,
          isHome: false,
          pathPosition: newPathPosition,
        };

        // Check for captures
        checkForCaptures(newPos, color, newPieces);
      }
    }

    setPieces(newPieces);
    checkWinCondition(color, newPieces);

    if (diceValue === 6) {
      setCanRoll(true);
      setDiceValue(null);
    } else {
      nextTurn();
    }
  };

  const checkForCaptures = (newPos, currentColor, newPieces) => {
    PLAYERS.forEach((color) => {
      if (color === currentColor) return;

      newPieces[color].forEach((piece, index) => {
        if (
          !piece.isHome &&
          piece.x === newPos.x &&
          piece.y === newPos.y &&
          !isSafeSpot(newPos)
        ) {
          // Send piece back home
          newPieces[color][index] = {
            ...HOME_POSITIONS[color][index],
            isHome: true,
            pathPosition: -1,
          };
        }
      });
    });
  };

  const isSafeSpot = (pos) => {
    return SAFE_SPOTS.some((spot) => spot.x === pos.x && spot.y === pos.y);
  };

  const checkWinCondition = (color, pieces) => {
    const hasWon = pieces[color].every((piece) => piece.pathPosition === 49);
    if (hasWon) {
      setWinner(color);
    }
  };

  const nextTurn = () => {
    setCurrentPlayer((prev) => (prev + 1) % 4);
    setCanRoll(true);
    setDiceValue(null);
    setSelectedPiece(null);
  };

  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        let cellClass = "cell";

        // Add special cell styling
        if (isSafeSpot({ x: i, y: j })) {
          cellClass += " safe-spot";
        }

        // Add home area styling
        Object.entries(HOME_POSITIONS).forEach(([color, positions]) => {
          if (positions.some((pos) => pos.x === i && pos.y === j)) {
            cellClass += ` ${color}-home`;
          }
        });

        // Add path styling
        Object.entries(PATHS).forEach(([color, path]) => {
          if (path.some((pos) => pos.x === i && pos.y === j)) {
            cellClass += ` ${color}-path`;
          }
        });

        let cellContent = null;
        Object.entries(pieces).forEach(([color, colorPieces]) => {
          colorPieces.forEach((piece, index) => {
            if (piece.x === i && piece.y === j) {
              cellContent = (
                <div
                  className={`piece ${color} ${
                    color === PLAYERS[currentPlayer] ? "active" : ""
                  }`}
                  onClick={() => handlePieceClick(color, index)}
                />
              );
            }
          });
        });

        row.push(
          <div key={`${i}-${j}`} className={cellClass}>
            {cellContent}
          </div>
        );
      }
      board.push(
        <div key={i} className="row">
          {row}
        </div>
      );
    }
    return board;
  };

  return (
    <div className="ludo-container">
      <div className="ludo-game">
        <div className="game-header">
          <h2>Ludo Game</h2>
          <div className="game-info">
            <div className={`player-turn ${PLAYERS[currentPlayer]}`}>
              Current Player: {PLAYERS[currentPlayer]}
            </div>
            <div className="dice-value">Dice: {diceValue || "-"}</div>
          </div>
        </div>

        <div className="ludo-board">{renderBoard()}</div>

        <div className="game-controls">
          <div className="dice-section">
            <Dice
              value={diceValue}
              rolling={isRolling}
              onRoll={rollDice}
              disabled={!canRoll}
            />
            <div className="current-player">
              <div className={`player-indicator ${PLAYERS[currentPlayer]}`} />
              {PLAYERS[currentPlayer]}'s turn
            </div>
          </div>
        </div>

        {winner && (
          <div className="winner-overlay">
            <div className={`winner-message ${winner}`}>
              {winner.toUpperCase()} Wins!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Ludo;
