import { useState, useEffect } from "react";
import "./Dice.css";

const DICE_DOTS = {
  1: [{ top: "50%", left: "50%" }],
  2: [
    { top: "20%", left: "20%" },
    { top: "80%", left: "80%" },
  ],
  3: [
    { top: "20%", left: "20%" },
    { top: "50%", left: "50%" },
    { top: "80%", left: "80%" },
  ],
  4: [
    { top: "20%", left: "20%" },
    { top: "20%", left: "80%" },
    { top: "80%", left: "20%" },
    { top: "80%", left: "80%" },
  ],
  5: [
    { top: "20%", left: "20%" },
    { top: "20%", left: "80%" },
    { top: "50%", left: "50%" },
    { top: "80%", left: "20%" },
    { top: "80%", left: "80%" },
  ],
  6: [
    { top: "20%", left: "20%" },
    { top: "20%", left: "80%" },
    { top: "50%", left: "20%" },
    { top: "50%", left: "80%" },
    { top: "80%", left: "20%" },
    { top: "80%", left: "80%" },
  ],
};

function Dice({ value, rolling, onRoll, disabled }) {
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (rolling) {
      setIsRolling(true);
      const timer = setTimeout(() => {
        setIsRolling(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rolling]);

  const handleClick = () => {
    if (!disabled && !isRolling) {
      onRoll();
    }
  };

  const renderDots = () => {
    if (!value || isRolling) return null;
    return DICE_DOTS[value].map((position, index) => (
      <div
        key={index}
        className="dice-dot"
        style={{
          top: position.top,
          left: position.left,
          transform: "translate(-50%, -50%)",
        }}
      />
    ));
  };

  return (
    <div className="dice-container">
      <div
        className={`dice ${isRolling ? "rolling" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onClick={handleClick}
      >
        {renderDots()}
      </div>
    </div>
  );
}

export default Dice;
