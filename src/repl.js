import readline from 'readline';

import {
  playIntro
} from './intro'

import {
  createMinefield,
  createIce,
  dig,
  flagMinefield,
  checkVictory
} from './board';

export const HELP = [
  'To dig a square, type "dig" and the square name, i.e. "dig C4"',
  'To flag (or unflag) a square, type "flag" and the square name, i.e., "flag H7"',
  'To quit, type "quit"',
  'To see these instructions again, type "help"',
]

const STANDARD_PROMPT = 'What would you like to do? ("dig", "flag", "quit")> '

export const showHelp = (konsole = console) => {
  HELP.forEach((line) => konsole.log(line));
}

const prompt = (userInterface, prompt) => new Promise(function(resolve) {
  userInterface.question(prompt, (input) => {
    resolve(input);
  })
})

export const display = (matrix, konsole = console) => {
  konsole.log(" |ABCDEFGHIJ");
  konsole.log("-+----------")
  let grid = matrix.map((row, index) => (index.toString() + '|' + row.join('')));
  grid.forEach((row) => konsole.log(row));
}


const quit = (userInterface) => {
  console.log("Goodbye!")
  userInterface.close();
  process.stdin.destroy();
  process.exit(0);
}


export class Game {
  constructor(konsole = console, rl = readline) {
    this.flags = 0;
    this.mines = null;
    this.ice = createIce();
    this.userInterface = rl.createInterface(process.stdin, process.stdout);
  }

  prompt(promptText) {
    return new Promise((resolve, reject) => {
      this.userInterface.question(promptText, (i) => resolve(i));
    })
  }

  start(konsole = console) {
    playIntro(konsole).then((() => {
      showHelp();
      display(this.ice);
      this.prompt(STANDARD_PROMPT)
        .then((input) => this.route(input))
    }))
  }

  end () {
    this.userInterface.close();
    process.stdin.destroy();
  }

  route(input, konsole = console) {
    input = input.toUpperCase();

    if (input.substring(0, 4) === "QUIT") {
      quit(userInterface);
      return;

    } else if (input.substring(0, 4) === "HELP") {
      showHelp();
      this.prompt(STANDARD_PROMPT)
        .then((input) => this.route(input));

    } else if (input.substring(0, 3) === "DIG") {
      let digSpot = input.substring(4, 6)
      konsole.log(`Digging ${digSpot}`)
      if (this.mines === null) {
        this.mines = createMinefield(digSpot);
      }
      this.ice = dig(this.mines, this.ice, digSpot);
      if (this.ice === "BOOM") {
        konsole.log("BOOM!!!!")
        konsole.log("")
        display(this.mines);
        this.userInterface.close();
        process.stdin.destroy();
        process.exit(0);
        return;
      }
      display(this.ice);
      this.prompt(STANDARD_PROMPT)
        .then((input) => this.route(input));
    } else if (input.substring(0, 4) === "FLAG") {
      flagMinefield(this.ice, input.substring(5, 7));
      if (checkVictory(this.mines, this.ice)) {
        konsole.log("CONGRATULATIONS!");
        display(this.mines);
        this.userInterface.close();
        process.stdin.destroy();
        newGame();
        return;
      } else {
        display(this.ice);
        this.prompt(STANDARD_PROMPT)
          .then((input => this.route(input)))
      }
    } else {
      konsole.log("I didn't understand what you said. Sorry.");
      this.prompt(STANDARD_PROMPT)
        .then((input) => this.route(input));
    }
  }
}

export const newGame = () => {
  let g = new Game();
  g.start();
}
