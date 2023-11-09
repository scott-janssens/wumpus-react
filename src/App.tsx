import './App.css';
import Board from './components/board';
import { BatMovedArgs, Engine, GameState } from './engine/engine';
import { GameDifficulty } from './engine/gameDifficulty';
import { Direction } from './engine/direction';
import { ReactNode, useEffect, useRef, useState } from 'react';
import Modal from './components/modal';
import HelpPane from './components/helpPane';
import EndGameMessages from './engine/messages';

const engine = new Engine();
engine.startNewGame(GameDifficulty.Normal);

var isHorizontal = true;

const getScale = (engine: Engine): number => {
  const horizontalScaleX = Math.min(window.innerWidth / 1600, 1);
  const horizontalScaleY = Math.min(window.innerHeight / 900, 1);
  const verticalScaleX = Math.min(window.innerWidth / 1200, 1);
  const verticalScaleY = Math.min(window.innerHeight / 1300, 1);

  const horizontalScale = Math.min(horizontalScaleX, verticalScaleX);
  const verticalScale = Math.min(horizontalScaleY, verticalScaleY);
  isHorizontal = horizontalScale >= verticalScale;

  return isHorizontal ? Math.min(horizontalScaleX, horizontalScaleY) : Math.min(verticalScaleX, verticalScaleY);
}

function App() {
  const [lastBatMovedArgs, setLastBatMovedArgs] = useState<BatMovedArgs | null>(null);
  const [isFireMode, setIsFireMode] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [windowScale, setWindowScale] = useState(getScale(engine));
  const [gameCounter, setGamecounter] = useState(0);

  useEffect(() => {
    engine.onGameStateChanged.subscribe(handleGameStateChange);
    engine.onBatMoved.subscribe(handleBatMoved);
    document.body.addEventListener("keyup", (e) => handleKeyEventRef.current(e));
    window.addEventListener('resize', handleWindowResize);

    return () => {
      engine.onGameStateChanged.unsubscribe(handleGameStateChange);
      engine.onBatMoved.unsubscribe(handleBatMoved);
      document.body.removeEventListener("keyup", (e) => handleKeyEventRef.current(e));
      window.removeEventListener('resize', handleWindowResize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWindowResize = (ev: UIEvent) => {
    setWindowScale(getScale(engine));
  };

  const handleNewGame = (difficulty: GameDifficulty) => {
    setLastBatMovedArgs(null);
    engine.startNewGame(difficulty);
    setIsGameComplete(false);
    setGamecounter(gameCounter + 1);
  }

  const fireDirection = useRef<Direction | null>(null);

  const handleKeyEvent = (ev: KeyboardEvent) => {
    switch (ev.code) {
      case "ArrowUp":
        if (isFireMode) {
          fireDirection.current = Direction.North;
          engine.fireArrow(fireDirection.current);
          handleFireDlgClose();
        }
        else if (lastBatMovedArgs === null) {
          engine.movePlayer(Direction.North);
        }
        break;
      case "ArrowRight":
        if (isFireMode) {
          fireDirection.current = Direction.East;
          engine.fireArrow(fireDirection.current);
          handleFireDlgClose();
        }
        else if (lastBatMovedArgs === null) {
          engine.movePlayer(Direction.East);
        }
        break;
      case "ArrowDown":
        if (isFireMode) {
          fireDirection.current = Direction.South;
          engine.fireArrow(fireDirection.current);
          handleFireDlgClose();
        }
        else if (lastBatMovedArgs === null) {
          engine.movePlayer(Direction.South);
        }
        break;
      case "ArrowLeft":
        if (isFireMode) {
          fireDirection.current = Direction.West;
          engine.fireArrow(fireDirection.current);
          handleFireDlgClose();
        }
        else if (lastBatMovedArgs === null) {
          engine.movePlayer(Direction.West);
        }
        break;
      case "Space":
        if (lastBatMovedArgs === null) {
          handleFireDlgOpen();
        }
        break;
    }
  };
  const handleKeyEventRef = useRef(handleKeyEvent);
  handleKeyEventRef.current = handleKeyEvent;

  const handleFireDlgOpen = () => {
    if (!isFireMode && engine.gameState === GameState.Running) {
      setIsFireMode(true);
    }
  };

  const handleFireDlgClose = (buttonPressed: boolean = false) => {
    setIsFireMode(false);
  };

  const handleGameStateChange = (gameState: GameState) => {
    setIsGameComplete(true);
  };

  const handleBatMoved = (s: Engine, a: BatMovedArgs) => {
    setLastBatMovedArgs(a);
  }

  const handleBatDlgClose = (buttonPressed: boolean) => {
    if (!lastBatMovedArgs!.gameStateChanged) {
      setLastBatMovedArgs(null);
    }
  };

  const handGameCompleteDlgClose = (buttonPressed: boolean) => {
    if (buttonPressed) {
      handleNewGame(engine.map.gameDifficultyValues.difficulty);
    }
  };

  const setupGameOverDlg = (): ReactNode => {
    const messages = new EndGameMessages(engine.random);
    let msg = "";

    switch (engine.gameState) {
      case GameState.Won:
        return (
          <Modal isOpen={isGameComplete} title="Victory!" onClose={handGameCompleteDlgClose} buttonText="New Game">
            {messages.getVictoryDescription()}
          </Modal>);
      case GameState.Eaten:
        msg = lastBatMovedArgs !== null
          ? "...next to the fearsome Wumpus. You are devoured for " + messages.getMealDescription()
          : messages.getEatenDescription();
        return (
          <Modal isOpen={isGameComplete} title="Game Over" onClose={handGameCompleteDlgClose} buttonText="New Game">
            {msg}
          </Modal>);
      case GameState.Pit:
        msg = lastBatMovedArgs !== null
          ? "...into a bottemless pit."
          : messages.getPitDescription();
        return (
          <Modal isOpen={isGameComplete} title="Game Over" onClose={handGameCompleteDlgClose} buttonText="New Game">
            {msg}
          </Modal>);
      case GameState.Missed:
        return (
          <Modal isOpen={isGameComplete} title="Game Over" onClose={handGameCompleteDlgClose} buttonText="New Game">
            {messages.getMissedDescription(engine.map.getCavern(engine.playerLocation.x, engine.playerLocation.y), fireDirection.current!)}
          </Modal>);
    }
  }

  const viewClass = `view view-${isHorizontal ? "horizontal" : "vertical"}`;

  return (
    <div className="App">
      <div className={viewClass} style={{ transform: `scale(${windowScale})` }}>
        <Board map={engine.map} key={engine.map.seed} />
        <HelpPane engine={engine} isHorizontal={isHorizontal} onNewGame={handleNewGame} />
      </div>
      <Modal isOpen={lastBatMovedArgs !== null} title="Bat!" onClose={handleBatDlgClose}>
        You have encountered a bat who picks you up and drops you{lastBatMovedArgs?.gameStateChanged ? "..." : " elsewhere..."}
      </Modal>
      <Modal isOpen={isFireMode} title="Attack!" onClose={handleFireDlgClose}>
        You have but a single arrow. Press an arrow key to fire in that direction or ESC to continue exploring.
      </Modal>
      {setupGameOverDlg()}
    </div>
  );
}

export default App;
