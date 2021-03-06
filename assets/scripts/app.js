const ATTACK = 10;
const STRONG_ATTACK = 17;
const MONSTER_ATTACK = 14;
const HEAL = 17;

const EVENT_PLAYER_ATTACK = "PLAYER ATTACKED MONSTER";
const EVENT_MONSTER_ATTACK = "MONSTER ATTACKED PLAYER";
const EVENT_PLAYER_STRONG_ATTACK = "PLAYER ATTACKED STRONGLY ON MONSTER";
const EVENT_HEALING = "PLAYER HEALED";
const EVENT_GAME_OVER = "EVENT_GAME_OVER";
let completeLogEntry = [];

function writeToLog(ev, val, currMHealth, currPHealth) {
  let logEntry = {
    Event: ev,
    Value: val,
    playerCurrentHealth: currPHealth,
    monsterCurrentHealth: currMHealth,
  };

  if (ev === EVENT_PLAYER_ATTACK) {
    logEntry.target = "MONSTER";
  } else if (ev === EVENT_MONSTER_ATTACK) {
    logEntry.target = "PLAYER";
  } else if (ev === EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = "MONSTER";
  } else if (ev === EVENT_HEALING) {
    logEntry.target = "MONSTER";
  } else if (ev === EVENT_GAME_OVER) {
    logEntry.target = "GameOver";
  }

  completeLogEntry.push(logEntry);
}
let bonusLife = true;

function checkInput() {
  let initHealth = prompt("Enter Starting Health Values.");

  let HEALTH = parseInt(initHealth);

  if (isNaN(HEALTH) || HEALTH <= 0) {
    alert("Invalid Input, Refresh and enter valid value.");
    throw { Message: "Invalid Input, Enter a Number!" };
  }
  return HEALTH;
}

let MAX_HEALTH = checkInput();
let currentPlayerHealth = MAX_HEALTH;
let currentMonsterHealth = MAX_HEALTH;

adjustHealthBars(MAX_HEALTH);

function attackSelector(attack) {
  const Mdamage = dealMonsterDamage(attack);
  currentMonsterHealth -= Mdamage;
  writeToLog(
    EVENT_PLAYER_ATTACK,
    Mdamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  const Pdamage = dealPlayerDamage(MONSTER_ATTACK);
  currentPlayerHealth -= Pdamage;
  writeToLog(
    EVENT_MONSTER_ATTACK,
    Pdamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && bonusLife) {
    alert("Bonus Life Activated!");
    bonusLife = false;
    removeBonusLife();
    setPlayerHealth(HEAL);
    currentPlayerHealth += HEAL;
    writeToLog(EVENT_HEALING, HEAL, currentMonsterHealth, currentPlayerHealth);
  }
  if (currentPlayerHealth > 0 && currentMonsterHealth <= 0) {
    alert("You WON");
  } else if (currentMonsterHealth > 0 && currentPlayerHealth <= 0) {
    alert("You Lose");
  } else if (currentPlayerHealth === 0 && currentMonsterHealth === 0) {
    alert("Match Draw");
  }

  if (
    currentMonsterHealth <= 0 ||
    currentPlayerHealth <= 0 ||
    (currentPlayerHealth === 0 && currentMonsterHealth === 0)
  ) {
    writeToLog(EVENT_GAME_OVER, 0, currentMonsterHealth, currentPlayerHealth);

    alert("Game is restarting...");

    resetValue(checkInput());
    completeLogEntry = [];
  }
}

function resetValue(val) {
  currentPlayerHealth = val;
  currentMonsterHealth = val;
  adjustHealthBars(val);

  resetGame(val);
}

function attackHandler() {
  attackSelector(ATTACK);
}

function healHandler() {
  const diff = MAX_HEALTH - currentPlayerHealth;

  let healValue = diff < HEAL ? diff : HEAL;
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    EVENT_HEALING,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );

  const Pdamage = dealPlayerDamage(MONSTER_ATTACK);
  currentPlayerHealth -= Pdamage;
  writeToLog(
    EVENT_MONSTER_ATTACK,
    Pdamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
}

function logHandler() {
  console.log(completeLogEntry);
}

function strongAttackHandler() {
  attackSelector(STRONG_ATTACK);
}
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
logBtn.addEventListener("click", logHandler);
