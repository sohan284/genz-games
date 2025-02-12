function GamePlayer({ game, closeGame }) {
  if (!game) return null; // No game selected

  return (
    <div className="fixed inset-0 flex flex-col bg-black bg-opacity-90">
      <button
        onClick={closeGame}
        className="p-2 bg-red-500 text-white self-end m-2"
      >
        Close
      </button>
      <iframe
        src={game.url}
        width="100%"
        height="90%"
        className="border-none"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default GamePlayer;
