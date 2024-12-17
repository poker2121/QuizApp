// https://opentdb.com/api.php?amount=5&category=28&difficulty=medium

var categoryMenu = document.getElementById("categoryMenu");
var difficultyOptions = document.getElementById("difficultyOptions");
var questionsNumber = document.getElementById("questionsNumber");
var mainBtn = document.getElementById("startQuiz");
var form = document.getElementById("quizOptions");
var questionsContainer = document.querySelector(".questions .row")

let questions;
let myQuiz;

mainBtn.addEventListener( "click"  ,   async ()=>{
  myQuiz = new Quiz(categoryMenu.value , questionsNumber.value , difficultyOptions.value )
  
  questions = await myQuiz.getAllQuestions();
  console.log(questions);
  form.classList.replace("d-flex" , "d-none")

  let myQuestion = new Questions(0)
  console.log(myQuestion);
  
  myQuestion.display()
  
  
})


class Quiz {
  constructor(category , numbers , difficulty){
    this.category = category;
    this.numbers = numbers;
    this.difficulty = difficulty;
    this.score = 0
  }


  getApi(){
    return `https://opentdb.com/api.php?amount=${this.numbers}&category=${this.category}&difficulty=${this.difficulty}`
  }

  async getAllQuestions(){
    let res = await fetch(this.getApi())
    let data = await res.json()

    return data.results
  }

  showResult() {
    return `
      <div
        class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
      >
        <h2 class="mb-0">
        ${
          this.score == this.numbers
            ? `Congratulations enta afelt 3ash 🎉`
            : `Your score is ${this.score}`
        }      
        </h2>
        <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
      </div>
    `;
  }

}


class Questions {
  constructor(index){
    this.index = index
    this.question= questions[index].question;
    this.category = questions[index].category;
    this.difficulty = questions[index].difficulty;
    this.correctAnswer = questions[index].correct_answer;
    this.incorrectAnswer = questions[index].incorrect_answers;
    this.myAllAnswers = this.getAllAnswers();
    this.isAnswered = false
  }

  getAllAnswers(){
    let allAnswers = [  ...this.incorrectAnswer ,  this.correctAnswer ]
    allAnswers.sort()

    return allAnswers
  }

  display() {
    const questionMarkUp = `
      <div
        class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
      >
        <div class="w-100 d-flex justify-content-between">
          <span class="btn btn-category">${this.category}</span>
          <span class="fs-6 btn btn-questions">${this.index + 1} of ${
      questions.length
    } Questions</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
        ${this.myAllAnswers
          .map((choice) => `<li>${choice}</li>`).toString().replaceAll(",", "")
}
        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${
          myQuiz.score
        }</h2>        
      </div>
    `;

    questionsContainer.innerHTML = questionMarkUp;

    let allChoices = document.querySelectorAll(".choices li");

    allChoices.forEach((li) => {
      li.addEventListener( "click"   ,    ()=>{
        this.checkAnswer(li)
        this.nextQuestion()
      })
    });

  }

  checkAnswer(choice){

    if(!this.isAnswered){
      this.isAnswered = true;
      if(choice.innerHTML == this.correctAnswer){
        choice.classList.add("correct")
        myQuiz.score++
      }else {
        console.log("egaba ghalattt");
        choice.classList.add("wrong")
      }

    }
    
  }

  nextQuestion(){
    this.index++
    setTimeout(() => {
      if(this.index < questions.length){
        let myNewQuestion = new Questions(this.index)
        myNewQuestion.display()
      }
      else {
        let result = myQuiz.showResult()
        
        questionsContainer.innerHTML = result

        document.querySelector(".again").addEventListener("click"  ,  ()=>{
          window.location.reload()
        })
      }
    }, 2000);
    

  }
}