import readline from 'readline';
import {playIntro} from './intro'
import { createMinefield, dig, createIce } from './board';

}

const HELP = [
  'To dig a square, type "dig" and the square name, i.e. "dig C4"',
  'To mark (or unmark) a square, type "mark" and the square name, i.e., "mark H7"',
  'To quit, type "quit"',
  'To see these instructions again, type "help"',
]

const STANDARD_PROMPT = 'What would you like to do? ("dig", "mark", "quit")'

const showHelp = () => {
  HELP.forEach((line) => console.log(line));
}

const prompt = (interface, prompt) => new Promise(function(resolve, reject) {
  interface.question(prompt, (input) => {
    // TODO: if input is understod
    resolve(input);
    // TODO: otherwise reject;
  })
})

const display = (matrix) => {
  console.log(" |ABCDEFGHIJ");
  console.log("-+----------")
  matrix.map((row, index) => (index.toString() + '|' + row.join('')))
    .forEach((row) => console.log(row))
  })
}


const quit = (interface) => {
  console.log("Goodbye!")
  interface.close();
  process.stdin.destroy();
  process.exit(0);
}

const newGame = () => {
  let g = new Game();
  g.start();
}

class Game {
  constructor(){
    this.flags = 0;
    this.mines = null;
    this.ice = createIce();
    this.interface = readline.createInterface(process.stdin, process.stdout);
  }

  prompt (promptText) { return new Promise((resolve, reject) => {
    this.interface.question(promptText, (i) => resolve(i));
  }

  start () {
    playIntro().then((() => {
      showHelp();
      display(this.ice); 
      this.prompt(STANDARD_PROMPT)
        .then((input) => this.route(input))
    }))
  }

  route (input) {
    input = input.toUpper();
    // TODO: Validate input;
    if(input.substring(0, 4) === "QUIT"){
      quit(interface);
      return;
    };
    if(input.substring(0, 4) === "HELP"){
      showHelp();
      this.prompt(STANDARD_PROMPT)
        .then((input) => this.route(input));
    }
    if(input.substring(0, 3) === "DIG"){
      let digSpot = input.substring(4, 2)
      console.log(`Digging ${digSpot}`)
      if (this.mines === null){
        this.mines = createMinefield(digSpot));
      }
      this.ice = dig(this.mines, this.ice, digSpot);
      if(this.ice === "BOOM"){
        this.interface.close();
        process.stdin.destroy();
        newGame();
      }
      // else if this.flags === 20 {
      display(this.ice);

    }
}
