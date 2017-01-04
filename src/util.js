export const deepArrayCopy = (array) => array.map((el) => (Array.isArray(el) ? deepArrayCopy(el) : el) )

export const knuthShuffler = (array) => {
  for(let i = 0; i < array.length; i++){
    let rand = Math.floor(Math.random() * array.length);
    let temp = array[i];
    array[i] = array[rand];
    array[rand] = temp;
  }
  return array;
}
