var numOfQuestions = 10;
var targetSynonym;
var listOfWords = [];
var arrOfAnswers = [];
var arrOfUsersAnswers = [];
var currentQuestion = 0;
var introSection = document.querySelector(".intro-section");
var intros = document.querySelectorAll(".intro");
var mainPage = document.querySelector(".active");
var pageBody = document.body;
var revision = document.querySelector(".revision");
var Loader = document.querySelector(".loader");
var question = document.getElementById("question");
var answer = document.getElementById("answer");
var optBox = document.getElementById("optionsbox");
var skip = document.getElementById("skip");
var arrOfOptions;
var resultBox = document.querySelector(".resultbox");
var arrOfOptionsEl = [];
var arrOfTipsIndex = [];

var wrong = false;

let indexOfIntro = 0;
let introsLength = intros.length;

// api key = b993a7fe-7718-4827-b933-c0283f6cc94b
initializer();

skip.addEventListener("click", function () {
  startWorker();
});

function initializer() {
  if (indexOfIntro < introsLength) {
    setTimeout(function () {
      displayIntro(indexOfIntro);
    }, 1000);
  }
}

function displayIntro(ind) {
  intros.forEach(function (eachIntro, index) {
    if (index === ind) {
      eachIntro.classList.remove("hide");
      eachIntro.style.animationPlayState = "running";

      eachIntro.addEventListener("animationend", function () {
        setTimeout(function () {
          if (!eachIntro.classList.contains("btn-p")) {
            eachIntro.classList.add("hide");
            indexOfIntro++;
            initializer();
          } else {
            document
              .querySelector(".btn-p button")
              .addEventListener("click", function () {
                startWorker();
              });
          }
        }, 1000);
      });
    }
  });
}

function startWorker() {
  introSection.classList.add("hide");
  Loader.classList.remove("hide");
  document.body.classList.remove("background-img");
  getWord();
}

function getWord() {
  fetch("https://9073-102-89-3-63.ap.ngrok.io/")
    .then((response) => response.json())
    .then((result) => {
      let dataLength = result.data.length;
      let arrayOfChosenIndex = [];
      for (var i = 0; i < numOfQuestions; i++) {
        var getRandIndex = uniqueRand(arrayOfChosenIndex, dataLength);
        arrayOfChosenIndex.push(getRandIndex);
        listOfWords.push(result.data[getRandIndex].toUpperCase());
      }
      getSyn();
    })

    .catch((err) => {
      console.log(err);
    });
}

function getSyn() {
  searchWord = listOfWords[currentQuestion];
  console.log(searchWord);
  fetch(
    `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${searchWord}?key=b993a7fe-7718-4827-b933-c0283f6cc94b`
  )
    .then((response) => response.json())
    .then((data) => {
      targetSynonym = data[0]?.meta?.syns[0][1].toUpperCase();
      console.log(targetSynonym);

      if (targetSynonym) {
        arrOfAnswers.push(targetSynonym);
        question.innerHTML = `What is the synonym of the word <b style='color:red'> <i> ${searchWord} </i></b>`;
        arrOfOptions = targetSynonym.trim().split("");

        getArrayNumRange();
        getEachLetter();
        pageBody.classList.remove("flex");
        mainPage.classList.remove("hide");
        Loader.classList.add("hide");
      } else {
        currentQuestion++;
        arrOfAnswers.push(undefined);

        return getSyn();
      }
    })
    .catch((err) => {
      currentQuestion++;
      arrOfAnswers.push(undefined);
      return getSyn();
    });
  return;
}

function getEachLetter() {
  arrOfOptions.forEach(function (eacharr, index) {
    var newdiv = document.createElement("div");
    var clonediv = newdiv.cloneNode(true);

    generateResult(clonediv, eacharr, index);
    newdiv.classList.add("option");
    newdiv.setAttribute("data-id", index);
    newdiv.setAttribute("draggable", "true");
    newdiv.innerHTML = eacharr;

    arrOfOptionsEl.push(newdiv);
  });

  getEachEl();
}

function getEachEl() {
  var cloneArrayofoptionsEl = [...arrOfOptionsEl];

  cloneArrayofoptionsEl
    .map((a) => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)
    .forEach(function (optionEl) {
      optBox.appendChild(optionEl);

      optionEl.addEventListener("dragstart", dragStart);
    });
}

function uniqueRand(mainlist = [], val) {
  var rand = Math.floor(Math.random() * val);
  if (mainlist.includes(rand)) {
    return uniqueRand(mainlist, val);
  } else {
    return rand;
  }
}
function getArrayNumRange() {
  arrOfTipsIndex = [];
  var lenOfArr = arrOfOptions.length;
  if (lenOfArr <= 3) {
    rangeOfNum = 0;
  } else {
    rangeOfNum = lenOfArr - 2;
  }
  getNumOfTips = Math.floor(Math.random() * rangeOfNum);

  for (var i = 0; i < getNumOfTips; i++) {
    var getRand = uniqueRand(arrOfTipsIndex, lenOfArr);
    arrOfTipsIndex.push(getRand);
  }
}

function generateResult(divEl, arr, index) {
  divEl.classList.add("result");
  divEl.setAttribute("data-answerid", index);

  if (arrOfTipsIndex.length > 0) {
    if (arrOfTipsIndex.includes(index)) {
      divEl.innerHTML = arr;
      divEl.classList.add("active-result");
      divEl.setAttribute("data-resultid", index);
    }
  }
  resultBox.appendChild(divEl);
  divEl.addEventListener("dragenter", dragEnter);
  divEl.addEventListener("dragover", dragOver);
  divEl.addEventListener("drop", dragDrop);
  divEl.addEventListener("dragleave", dragLeave);
}

var draggedObjContent, droppedObj, arrOfElId;

function dragStart() {
  draggedObjContent = this.textContent;
  arrOfElId = this.getAttribute("data-id");
}

function dragEnter() {
  this.style.opacity = "0.6";
}
function dragOver(e) {
  e.preventDefault();
}
function dragDrop() {
  this.style.opacity = "1";
  droppedObj = this.getAttribute("data-resultid");
  if (droppedObj !== null) {
    this.classList.add("wrong-result-box");
    this.addEventListener("animationend", function () {
      this.classList.remove("wrong-result-box");
    });
  } else {
    let innerLetter;
    let answerId = this.getAttribute("data-answerid");
    let currentLetter = arrOfOptions[answerId];
    if (draggedObjContent === currentLetter) {
      innerLetter = currentLetter;
    } else {
      innerLetter = draggedObjContent;
      wrong = true;
    }
    this.textContent = innerLetter;
    arrOfTipsIndex.push(+answerId);
    this.setAttribute("data-resultid", answerId);
    arrOfOptionsEl[arrOfElId].style.visibility = "hidden";
    this.classList.add("dropped");

    this.addEventListener("animationend", function () {
      this.classList.remove("dropped");
      this.classList.add("filled");

      if (arrOfTipsIndex.length === arrOfOptions.length) {
        let className;
        if (!wrong) {
          className = "active-result";
        } else {
          className = "wrong-result";
        }
        document.querySelectorAll(".result").forEach(function (result) {
          result.classList.remove("filled");
          result.classList.add(className);
        });

        answer.innerHTML = targetSynonym;
        answer.style.display = "block";
        wrong = false;
        let usersWord = "";
        document.querySelectorAll(".result").forEach(function (result) {
          usersWord += result.textContent;
        });
        arrOfUsersAnswers.push(usersWord);

        if (currentQuestion < numOfQuestions - 1) {
          currentQuestion++;
          setTimeout(function () {
            answer.style.display = "none";
            mainPage.classList.add("hide");
            pageBody.classList.add("flex");
            Loader.classList.remove("hide");

            document.querySelectorAll(".result").forEach(function (result) {
              result.remove();
            });
            arrOfOptionsEl = [];
            optBox.innerHTML = "";
            getSyn();
            // location.reload()
          }, 5000);
        } else {
          setTimeout(displayResult, 3000);
        }
      }
    });
  }
  // if ( droppedObjIndex === draggedObjIndex){
  //     console.log(this)

  // }
}

function dragLeave() {
  this.style.opacity = "1";
}

function displayResult() {
  let mainTable = document.querySelector("table");
  let indexOfUndefined = [];
  arrOfAnswers.forEach(function (val, index) {
    if (val === undefined) {
      indexOfUndefined.push(index);
    }
  });
  console.log(indexOfUndefined);
  indexOfUndefined.forEach(function (ind) {
    arrOfAnswers.splice(ind, 1);
    listOfWords.splice(ind, 1);
  });

  console.log(arrOfAnswers);
  console.log(listOfWords);
  for (let i = 0; i < listOfWords.length; i++) {
    let classForUser =
      arrOfAnswers[i].trim() === arrOfUsersAnswers[i].trim()
        ? "rightAnswer"
        : "wrongAnswer";
    let row = document.createElement("tr");
    row.innerHTML = `
            <td class= 'initialQuestion'> ${listOfWords[i]}</td>
            <td class='initialAnswer'> ${arrOfAnswers[i]}</td>
            <td class='${classForUser}'> ${arrOfUsersAnswers[i]}</td>
        `;

    mainTable.append(row);
  }

  revision.classList.remove("hide");
  mainPage.classList.add("hide");
  Loader.classList.add("hide");
}
