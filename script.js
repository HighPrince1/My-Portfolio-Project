async function checkGuess() {
  const guessInput = document.getElementById('guess-input');
  const feedbackText = document.getElementById('feedback-text');

  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > getMaxNumber()) {
    feedbackText.textContent = `Please enter a valid number between 1 and ${getMaxNumber()}.`;
    return;
  }

  guessInput.disabled = true;

  const playerResultPromise = new Promise(resolve => {
    feedbackText.textContent = `Your guess: ${guess}`;

    setTimeout(() => {
      resolve();
    }, 3000);
  });

  await playerResultPromise;

  if (guess < secretNumber) {
    feedbackText.textContent = "Your guess is too low.";
    feedbackText.classList.add('error');
  } else if (guess > secretNumber) {
    feedbackText.textContent = "Your guess is too high.";
    feedbackText.classList.add('error');
  } else {
    feedbackText.textContent = "Congratulations! You guessed the correct number. You win!";
    feedbackText.classList.add('success');
    playerWins++;
    await sleep(3000);
    if (stage === 10) {
      // Player completed all stages
      endGame();
    } else {
      moveToNextStage();
    }
    return;
  }

  feedbackText.textContent += "\nComputer's turn...";
  await sleep(3000);

  const computerGuess = Math.floor(Math.random() * getMaxNumber()) + 1;

  if (computerGuess < secretNumber) {
    feedbackText.textContent = `Computer's guess: ${computerGuess}\nComputer's guess is too low.`;
    feedbackText.classList.add('error');
  } else if (computerGuess > secretNumber) {
    feedbackText.textContent = `Computer's guess: ${computerGuess}\nHint: Computer's guess is too high.`;
    feedbackText.classList.add('error');
  } else {
    feedbackText.textContent = `Computer's guess: ${computerGuess}\nComputer guessed correctly. Computer wins!`;
    feedbackText.classList.add('success')
    computerWins++;
    await sleep(3000);
    resetGame();
    return;
  }

  await sleep(3000);
  guessInput.value = '';
  feedbackText.textContent = "Your turn. Enter your guess:";
  guessInput.disabled = false;
  guessInput.focus();
}

function endGame() {
  const guessInput = document.getElementById('guess-input');
  const feedbackText = document.getElementById('feedback-text');

  guessInput.disabled = true;
  feedbackText.textContent = "Congratulations! You have completed all stages.";
  feedbackText.classList.add('success')

  setTimeout(() => {
    const playAgain = confirm("Do you want to play again?");
    if (playAgain) {
      resetGame();
    } else {
      feedbackText.textContent = "Game Over";
    }
  }, 3000);
}

function resetGame() {
  const guessInput = document.getElementById('guess-input');
  const feedbackText = document.getElementById('feedback-text');

  stage = 1;
  playerWins = 0;
  computerWins = 0;
  changeDifficulty(difficulty);

  guessInput.disabled = false;
  feedbackText.textContent = "Your turn. Enter your guess:";
  guessInput.value = '';
  guessInput.focus();
  updatePlayerStats();
}

function moveToNextStage() {
  const stageInfo = document.getElementById('stage-info');
  const feedbackText = document.getElementById('feedback-text');

  stage++;
  changeDifficulty(difficulty);

  stageInfo.innerHTML = `<h2>Stage ${stage}</h2>
    <p>Difficulty: <span id="difficulty">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span></p>
    <p>Guess a number between 1 and ${getMaxNumber()}.</p>`;

    feedbackText.textContent = "Your turn. Enter your guess:";
  updatePlayerStats();
}

function updatePlayerStats() {
  const humanWinsElement = document.getElementById('human-wins');
  const computerWinsElement = document.getElementById('computer-wins');

  humanWinsElement.textContent = playerWins;
  computerWinsElement.textContent = computerWins;
}

function changeDifficulty(selectedDifficulty) {
  const difficultyElement = document.getElementById('difficulty');
  const difficultyButtons = document.querySelectorAll('.difficulty-btn');

  difficulty = selectedDifficulty;
  difficultyElement.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);

  difficultyButtons.forEach(button => {
    if (button.id === `${selectedDifficulty}-btn`) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  resetSecretNumber();
}

function resetSecretNumber() {
  secretNumber = Math.floor(Math.random() * getMaxNumber()) + 1;
}

function getMaxNumber() {
  switch (difficulty) {
    case 'easy':
      return 10;
    case 'medium':
      return 20;
    case 'hard':
      return 30;
    default:
      return 10;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Event Listeners
document.getElementById('guess-btn').addEventListener('click', checkGuess);

document.getElementById('easy-btn').addEventListener('click', () => {
  changeDifficulty('easy');
});

document.getElementById('medium-btn').addEventListener('click', () => {
  changeDifficulty('medium');
});

document.getElementById('hard-btn').addEventListener('click', () => {
  changeDifficulty('hard');
});

// Initialize the game
let stage = 1;
let playerWins = 0;
let computerWins = 0;
let difficulty = 'easy';
let secretNumber;

changeDifficulty(difficulty);
