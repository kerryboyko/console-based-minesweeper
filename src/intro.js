
export const introText = [
  'MINESWEEPER',
  '-------------------------',
  'Hello, welcome to Minesweeper for the Node Console.',
  'The grid is 10 x 10, and there are 20 bombs.',
  'Choose the square by choosing the row number and column letter',
  'If you manage to mark all 20 bombs, you win.',
  'Don\'t worry. The first dig is never a bomb.  Good luck.',
  '-----------------------------'
];

export const playIntro = (konsole) => new Promise((resolve, reject) => {
  konsole = konsole || console;
  const iterIntro = (num) => {
    if(num < introText.length){
      konsole.log(introText[num]);
      setTimeout(() => {
        iterIntro(num + 1);
      }, 500)
    } else {
      resolve(konsole);
    }
  }
  iterIntro(0);
});
