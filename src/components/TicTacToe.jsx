import { useState } from "react";
import PropTypes from "prop-types";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

Square.propTypes = {
  value: PropTypes.string,
  onSquareClick: PropTypes.func.isRequired,
};

function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isVsComputer, setIsVsComputer] = useState(false);

  function getEmptySquares(board) {
    return board.reduce((empty, square, index) => {
      if (!square) empty.push(index);
      return empty;
    }, []);
  }

  function computerMove(board) {
    const computerMoves = getEmptySquares(board);
    for (const move of computerMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "O";
      if (calculateWinner(boardCopy) === "O") {
        return move;
      }
    }

    for (const move of computerMoves) {
      const boardCopy = [...board];
      boardCopy[move] = "X";
      if (calculateWinner(boardCopy) === "X") {
        return move;
      }
    }

    if (!board[4]) return 4;

    const randomIndex = Math.floor(Math.random() * computerMoves.length);
    return computerMoves[randomIndex];
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);

    if (isVsComputer) {
      if (!calculateWinner(nextSquares)) {
        setTimeout(() => {
          const computerSquares = nextSquares.slice();
          const computerChoice = computerMove(computerSquares);
          computerSquares[computerChoice] = "O";
          setSquares(computerSquares);
          setXIsNext(true);
        }, 300);
      }
    } else {
      setXIsNext(!xIsNext);
    }
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : squares.every((square) => square)
    ? "Game is a draw!"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="game">
      <h2>Tic Tac Toe</h2>
      <div className="game-controls">
        <button
          className="mode-button"
          onClick={() => {
            setIsVsComputer(!isVsComputer);
            resetGame();
          }}
        >
          {isVsComputer ? "Switch to 2 Players" : "Play vs Computer"}
        </button>
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      </div>
      <div className="status">
        {status}
        {isVsComputer && <div className="mode-indicator">(vs Computer)</div>}
      </div>
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div key={row} className="board-row">
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              return (
                <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => handleClick(index)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToe;
