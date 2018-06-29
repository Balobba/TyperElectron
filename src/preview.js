const electron = require('electron')

//To access the array from main.js since ipc doesn't work for newly created window
let currentWindow = electron.remote.getCurrentWindow();
let arrayOfSentences = currentWindow.custom.array;
let textSpeed = currentWindow.custom.speed;
let cursorStatus = currentWindow.custom.cursor;
let wait = currentWindow.custom.wait;
let toggleCursor;
//Check whether the cursor should show or not
if(cursorStatus){
  let toggleCursor = document.getElementById('cursorID').style.visibility = "visible";
}else{
  let toggleCursor = document.getElementById('cursorID').style.visibility = "hidden";
}



//Typer Algorithm

var typer = {
   words: arrayOfSentences,
   wordIndex: 0,
   speed: textSpeed, //150 500 100 10
   nextWordWait: wait, //1000 100
   html: {
      word: document.querySelector('.myWord')
   },
   init: function init() {
      this.typeLetter();
   },
   typeLetter: function typeLetter() {
      var _this = this;

      var timer = arguments.length <= 0 || arguments[0] === undefined ? this.speed : arguments[0];

      setTimeout(function () {
         var word = {
            finished: _this.words[_this.wordIndex],
            current: _this.readWord()
         };

         var nextLetterIndex = word.finished.length - word.current.length;
         if (nextLetterIndex > 0) {
            nextLetterIndex = word.finished.length - nextLetterIndex;
            var nextLetter = word.finished[nextLetterIndex];
            _this.html.word.innerHTML += nextLetter;
            _this.typeLetter();
            return;
         }
         _this.nextWord();
      }, timer);
   },
   readWord: function readWord() {
      return this.html.word.innerHTML;
   },
   clearWord: function clearWord() {
      this.html.word.innerHTML = '';
   },
   nextWord: function nextWord() {
      var _this2 = this;

      this.wordIndex++;
      if (this.wordIndex == this.words.length) {
         this.wordIndex = 0;
      }
      setTimeout(function () {
         _this2.clearWord();
         _this2.typeLetter(_this2.nextWordWait);
      }, this.nextWordWait);
   }
};

typer.init();
