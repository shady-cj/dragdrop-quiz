var numOfQuestions = 10
var targetSynonym;
var listOfWords=[]
var currentQuestion = 0
var mainPage = document.querySelector('.active')
var pageBody = document.body
var Loader = document.querySelector(".loader")
var question=document.getElementById("question")
var answer=document.getElementById("answer")
var optBox = document.getElementById("optionsbox")
var arrOfOptions;
var resultBox = document.querySelector('.resultbox')
var arrOfOptionsEl = []
var arrOfTipsIndex =[]

var wrong = false



// api key = b993a7fe-7718-4827-b933-c0283f6cc94b


getWord()






function getWord(){
    fetch('http://127.0.0.1:9000/')
    .then(response => response.json())
    .then(result =>{
        let dataLength = result.data.length
        let arrayOfChosenIndex =[]
        for (var i=0 ; i < numOfQuestions; i++){
            var getRandIndex = uniqueRand(arrayOfChosenIndex,dataLength)
            arrayOfChosenIndex.push(getRandIndex)
            listOfWords.push(result.data[getRandIndex].toUpperCase())
        }
        
        getSyn()
    })
        
    .catch(err=>{
        console.log(err)
   
    })



}

function getSyn(){
    searchWord = listOfWords[currentQuestion]
    console.log(searchWord)
    fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${searchWord}?key=b993a7fe-7718-4827-b933-c0283f6cc94b`)
    .then(response=>response.json())
    .then(data => {
        targetSynonym=data[0]?.meta?.syns[0][2].toUpperCase()
        console.log(targetSynonym)
        
        if (targetSynonym){
            question.innerHTML = `What is the synonym of the word <b style='color:red'> <i> ${searchWord} </i></b>`
            arrOfOptions=targetSynonym.trim().split('')
            getArrayNumRange()
            getEachLetter()
            pageBody.classList.remove('flex')
            mainPage.classList.remove('hide')
            Loader.classList.add('hide')
            

        }else{
            currentQuestion++

            return getSyn()
        }
    })
    return;
}




function getEachLetter(){

    arrOfOptions.forEach(function(eacharr,index){

        var newdiv=document.createElement('div')
        var clonediv=newdiv.cloneNode(true)
    
        generateResult(clonediv,eacharr,index)
        newdiv.classList.add('option')
        newdiv.setAttribute('data-id',index)
        newdiv.setAttribute('draggable','true')
        newdiv.innerHTML= eacharr
    
    
        arrOfOptionsEl.push(newdiv)
        
    
        
    })

    
    getEachEl()

}




function getEachEl(){

    var cloneArrayofoptionsEl=[...arrOfOptionsEl]

    cloneArrayofoptionsEl.map(a => ({value:a,sort:Math.random()})).sort((a,b)=>(a.sort-b.sort)).map(a => (a.value)).forEach(function(optionEl){

    optBox.appendChild(optionEl)

    optionEl.addEventListener('dragstart',dragStart)
})
}




function uniqueRand(mainlist=[],val){
    var rand =  Math.floor(Math.random()*val)
    if (mainlist.includes(rand)){
        return uniqueRand(mainlist,val)
        
    }else{

        return rand
    }
}
function getArrayNumRange(){
    arrOfTipsIndex =[]
    var lenOfArr = arrOfOptions.length
    if (lenOfArr <= 3){

        rangeOfNum= 0
    }else{
        rangeOfNum= lenOfArr-2
    }
    getNumOfTips=Math.floor(Math.random()*rangeOfNum)

    for (var i=0; i<getNumOfTips; i++){
        var getRand = uniqueRand(arrOfTipsIndex,lenOfArr)
        arrOfTipsIndex.push(getRand)
        

    }
}

function generateResult(divEl,arr,index){
    divEl.classList.add('result')
    divEl.setAttribute('data-answerid',index)

    if (arrOfTipsIndex.length > 0){

        if (arrOfTipsIndex.includes(index)){

            divEl.innerHTML = arr
            divEl.classList.add('active-result')
            divEl.setAttribute("data-resultid",index)

        }
    }
    resultBox.appendChild(divEl)
    divEl.addEventListener('dragenter',dragEnter)
    divEl.addEventListener('dragover',dragOver)
    divEl.addEventListener('drop',dragDrop)
    divEl.addEventListener('dragleave',dragLeave)

    

}

var draggedObjContent, droppedObj,arrOfElId;

function dragStart(){

    console.log('drag starts')
    draggedObjContent = this.textContent
    arrOfElId= this.getAttribute("data-id")
}

function dragEnter(){

    console.log('drag enters')
    this.style.opacity = "0.6"
}
function dragOver(e){
    e.preventDefault()
}
function dragDrop(){
    this.style.opacity = "1"
    droppedObj = this.getAttribute('data-resultid')
    if (droppedObj !== null){
        this.classList.add("wrong-result-box")
        this.addEventListener('animationend',function(){
            this.classList.remove('wrong-result-box')
        })
    }else{
        let innerLetter;
        let answerId= this.getAttribute('data-answerid')
        let currentLetter=arrOfOptions[answerId]
        if (draggedObjContent === currentLetter){
            innerLetter = currentLetter
          
        }else{
            innerLetter = draggedObjContent
            wrong = true
        }
        this.textContent = innerLetter
        arrOfTipsIndex.push(+answerId)
        this.setAttribute('data-resultid',answerId)
        arrOfOptionsEl[arrOfElId].style.visibility = "hidden"
        this.classList.add('dropped')
        this.addEventListener('animationend',function(){

            this.classList.remove('dropped')
        })

        if (arrOfTipsIndex.length === arrOfOptions.length){
            let className;
            if (!wrong){
                className = "active-result"
            }else{
                className = "wrong-result"
            }
            document.querySelectorAll('.result').forEach(function(result){
                result.classList.add(className)
            })

            answer.innerHTML=targetSynonym
            answer.style.display="block"
            setTimeout(function(){
                location.reload()
            },5000)
        }
    }
    // if ( droppedObjIndex === draggedObjIndex){
    //     console.log(this)

    // }
}

function dragLeave(){

    this.style.opacity = "1"
}

