document.addEventListener('DOMContentLoaded', () => {

    // Board
    const gameOver = document.querySelector('.gameOver')
    let spots = Array.from(document.querySelectorAll('.board div'))
    
    // Stats
    const cardsLeft = document.querySelector('#cardsLeft')
    const gameDuration = document.querySelector('#duration')
    const setCountDisplay = document.querySelector('#setCount')
    const scoreDisplay = document.querySelector('#score')

    // Buttons
    const newGameBtn = document.querySelector('#newGame')
    const new3CardsBtn = document.querySelector('#new3Cards')
    const findSetBtn = document.querySelector('#findSet')

    // Cards on Board
    let displayedCards
    let selectedCards

    // Game Variables
    let score
    let setCount
    let time
    let lastTime
    let timer
    let deck

    //Sounds
    let correctSound = new Audio("../sounds/correct.mp3")
    let incorrectSound = new Audio("../sounds/incorrect.mp3")

    setupGame()

    // Setup Game
    function setupGame(){
        score = 0
        setCount = 0
        time = 1
        lastTime = 1
        gameDuration.innerHTML = 0
        scoreDisplay.innerHTML = 0
        setCountDisplay.innerHTML = 0
        cardsLeft.innerHTML = 69
        gameOver.innerHTML = ""
        spots.forEach(index => {
            index.classList.remove('card')
            while(index.firstChild){
                index.removeChild(index.firstChild)
            }
        })
        if(!timer){
            let timer = setInterval(updateTimer, 1000) 
        }
        deck = []
        populateDeck()
        setupBoard()
        deselectCards()
        removeHints()
        updateCardListeners()
    }

    // Populate Deck
    function populateDeck() {
        for(let i  = 1; i < 4; i++){
            for(let j = 1; j < 4; j++){
                for(let k = 1; k < 4; k++){
                    for(let l = 1; l < 4; l++){
                        deck.push({shape: i, shade: j, color: k, number: l})
                    }
                }
            }
        }
    }

    // Initial Board Setup
    function setupBoard(){
        for(let i = 0; i < 12; i++){
            let random = Math.floor(Math.random() * deck.length)
            card = deck.splice(random, 1)
            spots[i].classList.add('card')
            for(let j = 0; j < card[0].number; j++){
                var img = document.createElement("img")
                img.src = selectCardPNG(card)
                spots[i].appendChild(img)
            }
        }
        for(let i = 0; i < 21; i++){
            spots[i].classList.add('item'+(i+1))
        }
        displayedCards = document.querySelectorAll(".card")
    }

    // Select Card
    function selectCardPNG(card){
        // Shape: 1 = Diamond, 2 = Oval, 3 = Squiggle
        // Shade: 1 = Open, 2 = Solid, 3 = Striped
        // Color: 1 = Blue, 2 = Green, 3 = Red
        let fileName = "images/"
        switch(card[0].shape){
            case 1:
                fileName += "diamond_"
                break;
            case 2:
                fileName += "oval_"
                break;
            case 3:
                fileName += "squiggle_"
                break;
        }
        switch(card[0].shade){
            case 1:
                fileName += "open_"
                break;
            case 2:
                fileName += "solid_"
                break;
            case 3:
                fileName += "striped_"
                break;
        }
        switch(card[0].color){
            case 1:
                fileName += "blue.png"
                break;
            case 2:
                fileName += "green.png"
                break;
            case 3:
                fileName += "red.png"
                break;
        }
        return fileName
    }

    // Check 3 cards for a valid set
    function checkCards(cards) {
        // This works but can probably be refactored
        sameShape = false
        sameShade = false
        sameColor = false
        sameNumber = false
        differentShape = false
        differentShade = false
        differentColor = false
        differentNumber = false

        // Check Same
        if(cards[0].shape === cards[1].shape && cards[0].shape === cards[2].shape){
            sameShape = true
        }
        if(cards[0].shade === cards[1].shade && cards[0].shade === cards[2].shade){
            sameShade = true
        }
        if(cards[0].color === cards[1].color && cards[0].color === cards[2].color){
            sameColor = true
        }
        if(cards[0].number === cards[1].number && cards[0].number === cards[2].number){
            sameNumber = true
        }
        // Check all different
        if(cards[0].shape !== cards[1].shape && cards[0].shape !== cards[2].shape && cards[1].shape !== cards[2].shape){
            differentShape = true
        }
        if(cards[0].shade !== cards[1].shade && cards[0].shade !== cards[2].shade && cards[1].shade !== cards[2].shade){
            differentShade = true
        }
        if(cards[0].color !== cards[1].color && cards[0].color !== cards[2].color && cards[1].color !== cards[2].color){
            differentColor = true
        }
        if(cards[0].number !== cards[1].number && cards[0].number !== cards[2].number && cards[1].number !== cards[2].number){
            differentNumber = true
        }

        // XOR all booleans
        //if((sameShape && differentShade && differentColor && differentNumber) || (differentShape && sameShade && differentColor && differentNumber) || 
        //(differentShape && differentShade && sameColor && differentNumber) || (differentShape && differentShade && differentColor && sameNumber)){
        //    return true;
        //}else{
        //    return false;
        //}
        if (sameShape || differentShape) {
            if (sameShade || differentShade) {
                if (sameColor || differentColor) {
                    return (sameNumber || differentNumber)
                }
            }
        }
    }

    // Check selected cards
    function checkSelections(){
        selectedCards = document.querySelectorAll(".card.selected")
        let cards = processCardDivs(selectedCards)
        if(checkCards(cards)){
            correctSound.play()
            addScore()
            replaceCards()
            setCount++
            setCountDisplay.innerHTML = "" + setCount
        }else{
            incorrectSound.play()
            deselectCards()
        }
        removeHints()
    }

    // Process Div element for Card
    function processCardDivs(selectedCards){
        cards = [{shape: 0, shade: 0, color: 0, number: 0}, {shape: 0, shade: 0, color: 0, number: 0}, {shape: 0, shade: 0, color: 0, number: 0}]
        for(let i = 0; i < selectedCards.length; i++){
            let src = selectedCards[i].firstChild.src.split('/images/')[1]
            if(src.includes('diamond')){
                cards[i].shape = 1
            }else if(src.includes('oval')){
                cards[i].shape = 2
            }else{
                cards[i].shape = 3
            }
            if(src.includes('open')){
                cards[i].shade = 1
            }else if(src.includes('solid')){
                cards[i].shade = 2
            }else{
                cards[i].shade = 3
            }
            if(src.includes('blue')){
                cards[i].color = 1
            }else if(src.includes('green')){
                cards[i].color = 2
            }else{
                cards[i].color = 3
            }
            cards[i].number = selectedCards[i].childElementCount
        }
        return cards
    }

    // Deselect selected cards
    function deselectCards() {
        selectedCards = document.querySelectorAll(".selected")
        selectedCardsLength = selectedCards.length
        for(let i = 0; i < selectedCardsLength; i++){
            selectedCards[i].classList.remove("selected")
        }
    }

    // Remove hint cards
    function removeHints(){
        hintCards = document.querySelectorAll(".hint")
        hintCardslength = hintCards.length
        for(let i = 0; i < hintCardslength; i++){
            hintCards[i].classList.remove("hint")
        }
    }

    // Replace 3 cards
    function replaceCards() {
        selectedCards = document.querySelectorAll(".card.selected")
        selectedCardsLength = selectedCards.length
        // Remove Cards

        for(let i = 0; i < selectedCardsLength; i++){
            while(selectedCards[i].firstChild){
                selectedCards[i].removeChild(selectedCards[i].firstChild)
            }
            selectedCards[i].classList.remove("card")
        }
        // After removal
        displayedCards = document.querySelectorAll(".card")
        if(displayedCards.length < 12){
            addCards()
        }else{
            sortCards()
        }
        deselectCards()
        cardsLeft.innerHTML = "" + deck.length

        // Check for Game End
        endGame()
    }

    // Add 3 cards
    function addCards(){
        // Validate we have cards left
        if(deck.length != 0){
            selectedCards = document.querySelectorAll(".selected")
            selectedCardsLength = selectedCards.length
            for(let i = 0; i < selectedCardsLength; i++){
                let random = Math.floor(Math.random() * deck.length)
                card = deck.splice(random, 1)
                selectedCards[i].classList.add('card')
                for(let j = 0; j < card[0].number; j++){
                    var img = document.createElement("img")
                    img.src = selectCardPNG(card)
                    selectedCards[i].appendChild(img)
                }
            }
        }
    }

    // Add 3 extra cards
    function new3Cards() {
        displayedCards = document.querySelectorAll(".card")
        displayedCardsLength = displayedCards.length
        for(i = 1; i < 4; i++){
            cardDiv = document.querySelector(".item" + (i + displayedCardsLength))
            cardDiv.classList.add('card')
            let random = Math.floor(Math.random() * deck.length)
            card = deck.splice(random, 1)
            for(let j = 0; j < card[0].number; j++){
                var img = document.createElement("img")
                img.src = selectCardPNG(card)
                cardDiv.appendChild(img)
            }
        }
        updateCardListeners()
    }

    // Sort cards if more than 12
    function sortCards() {
        displayedCards = document.querySelectorAll(".card")
        selectedCards = document.querySelectorAll(".selected")
        for(let i = 0; i < selectedCards.length; i++){
            console.log(selectedCards[i].classList.item(0).slice(4,6))
            if(selectedCards[i].classList.item(0).slice(4,6) <= displayedCards.length){
                console.log("here!")
                while(displayedCards[displayedCards.length - 1].firstChild){
                    selectedCards[i].appendChild(displayedCards[displayedCards.length - 1].removeChild(displayedCards[displayedCards.length - 1].firstChild))
                }
                displayedCards[displayedCards.length - 1].classList.remove("card")
                selectedCards[i].classList.add("card")
                displayedCards = document.querySelectorAll(".card")
            }
        }
        updateCardListeners()
    }

    // Add score
    function addScore(){
        // TODO
        score += Math.floor(1000 * (lastTime / (time - lastTime)))
        scoreDisplay.innerHTML = "" + score
        lastTime = time
    }

    // Update Timer
    function updateTimer(){
        time++
        gameDuration.innerHTML = "" + time
    }

    // Selects (add to selected class) 3 cards that comprise a set. returns true on success, false on failure.
    // Takes an array of divs with the card class as a parameter
    function findSet(cardDivs){
        for(let i = 0; i < cardDivs.length - 2; i++){
        	for(let j = i + 1; j < cardDivs.length - 1; j++){
        		for(let k = j + 1; k < cardDivs.length; k++){
        			if(checkCards(processCardDivs([cardDivs[i], cardDivs[j], cardDivs[k]]))){
        				//grab set
        				let set = [cardDivs[i], cardDivs[j], cardDivs[k]]
        				//select set cards
        				cardDivs[i].classList.add("hint")
        				cardDivs[j].classList.add("hint")
        				cardDivs[k].classList.add("hint")
        				return true
        			}
        		}
        	}
        }
        return false
    }

    // Game over
    function endGame(){
        displayedCards = document.querySelectorAll(".card")
        if(deck.length === 0 && !findSet(displayedCards)){
            var p = document.createElement('h1')
            p.innerHTML = "Game Over!"
            gameOver.appendChild(p)
        }
    }

    // Button Listeners
    newGameBtn.addEventListener('click', () =>{
        setupGame()
    })

    new3CardsBtn.addEventListener('click', () =>{
        // TODO
        new3Cards()
    })

    findSetBtn.addEventListener('click', () =>{
        displayedCards = document.querySelectorAll(".card")
        findSet(displayedCards)
    })

    // Card Listeners
    function updateCardListeners() {
        for(let i = 0; i < spots.length; i++){
            spots[i].removeEventListener('click', cardClickEvent)
        }
        displayedCards = document.querySelectorAll(".card")
        for(let i = 0; i < displayedCards.length; i++){
            displayedCards[i].addEventListener('click', cardClickEvent)

        }
    }

    function cardClickEvent(evt) {
        if(!evt.currentTarget.classList.contains('selected')){
            evt.currentTarget.classList.add('selected')
        }
        selectedCards = document.querySelectorAll(".card.selected")
        selectedCardsLength = selectedCards.length
        if(selectedCardsLength === 3){
            checkSelections()                
        }
        
    }
})
