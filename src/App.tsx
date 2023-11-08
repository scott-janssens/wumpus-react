import './App.css';
import Board from './components/board';
import { Engine, GameState } from './engine/engine';
import { GameDifficulty } from './engine/gameDifficulty';
import { Direction } from './engine/direction';
import { ReactNode, useEffect, useRef, useState } from 'react';
import Modal from './components/modal';
import HelpPane from './components/helpPane';

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
  const [isFireMode, setIsFireMode] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [windowScale, setWindowScale] = useState(getScale(engine));
  const [gameCounter, setGamecounter] = useState(0);

  useEffect(() => {
    engine.onGameStateChanged.subscribe(handleGameStateChange);
    document.body.addEventListener("keyup", (e) => handleKeyEventRef.current(e));
    window.addEventListener('resize', handleWindowResize);

    return () => {
      engine.onGameStateChanged.unsubscribe(handleGameStateChange);
      document.body.removeEventListener("keyup", (e) => handleKeyEventRef.current(e));
      window.removeEventListener('resize', handleWindowResize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWindowResize = (ev: UIEvent) => {
    setWindowScale(getScale(engine));
  };

  const handleNewGame = (difficulty: GameDifficulty) => {
    engine.startNewGame(difficulty);
    setIsGameComplete(false);
    setGamecounter(gameCounter + 1);
  }

  const handleKeyEvent = (ev: KeyboardEvent) => {
    switch (ev.code) {
      case "ArrowUp":
        if (isFireMode) {
          engine.fireArrow(Direction.North);
          handleFireDlgClose();
        }
        else {
          engine.movePlayer(Direction.North);
        }
        break;
      case "ArrowRight":
        if (isFireMode) {
          engine.fireArrow(Direction.East);
          handleFireDlgClose();
        }
        else {
          engine.movePlayer(Direction.East);
        }
        break;
      case "ArrowDown":
        if (isFireMode) {
          engine.fireArrow(Direction.South);
          handleFireDlgClose();
        }
        else {
          engine.movePlayer(Direction.South);
        }
        break;
      case "ArrowLeft":
        if (isFireMode) {
          engine.fireArrow(Direction.West);
          handleFireDlgClose();
        }
        else {
          engine.movePlayer(Direction.West);
        }
        break;
      case "Space":
        handleFireDlgOpen();
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

  const handGameCompleteDlgClose = (buttonPressed: boolean) => {
    if (buttonPressed) {
      handleNewGame(engine.map.gameDifficultyValues.difficulty);
    }
  };

  const setupGameOverDlg = (): ReactNode => {
    switch (engine.gameState) {
      case GameState.Won:
        return (
          <Modal isOpen={isGameComplete} onClose={handGameCompleteDlgClose} buttonText="New Game">
            Your arrow striks true and slays the Wumpus. You are hailed a hero and become a legend in your own time.
          </Modal>);
      case GameState.Eaten:
        return (
          <Modal isOpen={isGameComplete} onClose={handGameCompleteDlgClose} buttonText="New Game">
            You stumble upon the Wumpus and are devoured for lunch.
          </Modal>);
      case GameState.Pit:
        return (
          <Modal isOpen={isGameComplete} onClose={handGameCompleteDlgClose} buttonText="New Game">
            You have fallen into a bottemless pit.
          </Modal>);
      case GameState.Missed:
        return (
          <Modal isOpen={isGameComplete} onClose={handGameCompleteDlgClose} buttonText="New Game">
            That wasn't where the Wumpus was.  The noise attracts the Wumpus and you are devoured for breakfast.
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
      <Modal isOpen={isFireMode} onClose={handleFireDlgClose}>
        You have but a single arrow. Press an arrow key to fire in that direction or ESC to continue exploring.
      </Modal>
      {setupGameOverDlg()}
    </div>
  );
}

export default App;
