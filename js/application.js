
let gmMain = null

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  gmMain = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
