var question=document.getElementById("question")
var answer=document.getElementById("answer")
var optBox = document.getElementById("optionsbox")
var arrOfOptions=answer.textContent.trim().toUpperCase().split('')
var resultBox = document.querySelector('.resultbox')
var arrOfOptionsEl = []
var arrOfTipsIndex =[]

var wrong = false


getArrayNumRange()





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


var cloneArrayofoptionsEl=[...arrOfOptionsEl]

cloneArrayofoptionsEl.map(a => ({value:a,sort:Math.random()})).sort((a,b)=>(a.sort-b.sort)).map(a => (a.value)).forEach(function(optionEl){

    optBox.appendChild(optionEl)

    optionEl.addEventListener('dragstart',dragStart)
})






function uniqueRand(val){

    var rand =  Math.floor(Math.random()*val)
    if (arrOfTipsIndex.includes(rand)){

        return uniqueRand(val)
        
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
        var getRand = uniqueRand(lenOfArr)
        
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

var draggedObjContent;
var droppedObj;
function dragStart(){

    console.log('drag starts')
    draggedObjContent = this.textContent
}

function dragEnter(){

    console.log('drag enters')
}
function dragOver(e){
    e.preventDefault()
    console.log('drag hover')
}
function dragDrop(){

    console.log('object is dropped')
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
        if (arrOfTipsIndex.length === arrOfOptions.length){
            if (!wrong){
                document.querySelectorAll('.result').forEach(function(result){
                    result.classList.add("active-result")
                })
            }
        }
    }
    // if ( droppedObjIndex === draggedObjIndex){
    //     console.log(this)

    // }
}

function dragLeave(){

    console.log('drag leaves')
}