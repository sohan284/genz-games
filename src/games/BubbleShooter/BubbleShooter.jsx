import { useState, useEffect, useRef } from "react";
import "./BubbleShooter.css";

const BUBBLE_SIZE = 40;
const COLORS = ["#ff4444", "#4CAF50", "#2196F3", "#ffeb3b", "#9c27b0"];
const ROWS = 8;
const COLS = 10;

function BubbleShooter() {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [angle, setAngle] = useState(0);
  const [currentBubble, setCurrentBubble] = useState(null);
  const [bubbleGrid, setBubbleGrid] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const initializeGame = () => {
    setIsGameOver(false);
    setScore(0);
    setIsMoving(false);

    // Create initial grid
    const grid = Array(ROWS)
      .fill()
      .map((_, row) =>
        Array(COLS)
          .fill()
          .map((_, col) =>
            row < 3
              ? {
                  color: COLORS[Math.floor(Math.random() * COLORS.length)],
                  x: col * BUBBLE_SIZE,
                  y: row * BUBBLE_SIZE,
                }
              : null
          )
      );

    setBubbleGrid(grid);
    createNewBubble();
  };

  const createNewBubble = () => {
    if (!canvasRef.current) return;

    setCurrentBubble({
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      x: canvasRef.current.width / 2 - BUBBLE_SIZE / 2,
      y: canvasRef.current.height - BUBBLE_SIZE,
      dx: 0,
      dy: 0,
    });
    setIsMoving(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    let animationFrameId;

    const render = () => {
      drawGame(context);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e) => {
      if (isMoving) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = canvas.width / 2;
      const centerY = canvas.height - BUBBLE_SIZE;
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      const newAngle = Math.atan2(deltaY, deltaX);
      setAngle(Math.min(Math.max(newAngle, -Math.PI / 2), Math.PI / 2));
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMoving, bubbleGrid, currentBubble]);

  const shootBubble = () => {
    if (!currentBubble || isMoving || isGameOver) return;

    setIsMoving(true);
    const speed = 8;
    setCurrentBubble((prev) => ({
      ...prev,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
    }));
  };

  const drawGame = (ctx) => {
    if (!ctx || !currentBubble) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw grid
    bubbleGrid.forEach((row, rowIndex) => {
      row.forEach((bubble, colIndex) => {
        if (bubble) {
          drawBubble(ctx, bubble.x, bubble.y, bubble.color);
        }
      });
    });

    // Draw current bubble
    drawBubble(ctx, currentBubble.x, currentBubble.y, currentBubble.color);

    // Update bubble position if moving
    if (isMoving) {
      updateBubblePosition();
    }

    // Draw shooter
    drawShooter(ctx);
  };

  const updateBubblePosition = () => {
    if (!currentBubble) return;

    const newX = currentBubble.x + currentBubble.dx;
    const newY = currentBubble.y + currentBubble.dy;

    // Wall collision
    if (newX <= 0 || newX >= canvasRef.current.width - BUBBLE_SIZE) {
      setCurrentBubble((prev) => ({
        ...prev,
        dx: -prev.dx,
        x: newX <= 0 ? 0 : canvasRef.current.width - BUBBLE_SIZE,
      }));
      return;
    }

    // Ceiling or bubble collision
    if (newY <= 0 || checkBubbleCollision()) {
      snapBubbleToGrid();
      return;
    }

    setCurrentBubble((prev) => ({
      ...prev,
      x: newX,
      y: newY,
    }));
  };

  const drawBubble = (ctx, x, y, color) => {
    ctx.beginPath();
    ctx.arc(
      x + BUBBLE_SIZE / 2,
      y + BUBBLE_SIZE / 2,
      BUBBLE_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
  };

  const drawShooter = (ctx) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height - BUBBLE_SIZE;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(angle) * BUBBLE_SIZE * 2,
      centerY + Math.sin(angle) * BUBBLE_SIZE * 2
    );
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const checkBubbleCollision = () => {
    if (!currentBubble) return false;

    const bubbleRow = Math.floor(currentBubble.y / BUBBLE_SIZE);
    const bubbleCol = Math.floor(currentBubble.x / BUBBLE_SIZE);

    for (let row = Math.max(0, bubbleRow - 1); row <= bubbleRow + 1; row++) {
      for (let col = Math.max(0, bubbleCol - 1); col <= bubbleCol + 1; col++) {
        if (row < ROWS && col < COLS && bubbleGrid[row][col]) {
          const dx =
            bubbleGrid[row][col].x +
            BUBBLE_SIZE / 2 -
            (currentBubble.x + BUBBLE_SIZE / 2);
          const dy =
            bubbleGrid[row][col].y +
            BUBBLE_SIZE / 2 -
            (currentBubble.y + BUBBLE_SIZE / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < BUBBLE_SIZE) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const snapBubbleToGrid = () => {
    if (!currentBubble) return;

    const row = Math.floor(currentBubble.y / BUBBLE_SIZE);
    const col = Math.floor(currentBubble.x / BUBBLE_SIZE);

    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      const newGrid = [...bubbleGrid];
      newGrid[row][col] = {
        color: currentBubble.color,
        x: col * BUBBLE_SIZE,
        y: row * BUBBLE_SIZE,
      };
      setBubbleGrid(newGrid);

      // Check for matches after placing bubble
      const matches = findMatches(row, col, currentBubble.color);
      if (matches.length >= 3) {
        removeMatches(matches);
      }

      // Check for game over
      if (row >= ROWS - 1) {
        setIsGameOver(true);
      } else {
        createNewBubble();
      }
    }
    setIsMoving(false);
  };

  const findMatches = (row, col, color) => {
    const matches = [];
    const visited = new Set();

    const checkAdjacent = (r, c) => {
      const key = `${r},${c}`;
      if (visited.has(key)) return;
      visited.add(key);

      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
      if (!bubbleGrid[r][c] || bubbleGrid[r][c].color !== color) return;

      matches.push({ row: r, col: c });

      // Check all adjacent positions
      checkAdjacent(r - 1, c); // up
      checkAdjacent(r + 1, c); // down
      checkAdjacent(r, c - 1); // left
      checkAdjacent(r, c + 1); // right
    };

    checkAdjacent(row, col);
    return matches;
  };

  const removeMatches = (matches) => {
    const newGrid = [...bubbleGrid];
    matches.forEach(({ row, col }) => {
      newGrid[row][col] = null;
    });
    setBubbleGrid(newGrid);
    setScore((prev) => prev + matches.length * 10);
  };

  return (
    <div className="bubble-shooter">
      <div className="game-info">
        <span>Score: {score}</span>
        {isGameOver && <span>Game Over!</span>}
      </div>
      <canvas
        ref={canvasRef}
        width={COLS * BUBBLE_SIZE}
        height={600}
        onClick={shootBubble}
      />
      <div className="game-controls">
        <button onClick={initializeGame}>New Game</button>
      </div>
    </div>
  );
}

export default BubbleShooter;
