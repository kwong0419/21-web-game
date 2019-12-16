document.addEventListener("DOMContentLoaded", () => {

    let deck_id;
    
    let playerScore = 0;
    let dealerScore = 0;
    let buttonsContainer = document.querySelector("#playerButtons");
    buttonsContainer.style.display = "none";
    let playerHand = document.querySelector("#playerHand");
    let dealerHand = document.querySelector("#dealerHand");
    
    
    const fetchDeck = async () => {
        try {
            let res = await axios.get("https://deckofcardsapi.com/api/deck/new/");
            deck_id = res.data.deck_id;
            let shuffled = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`);
        } catch(error) {
            console.log(error);
        }
    }

    const displayCards = (data, hand) => {
        let val = ""
        hand.id === "playerHand" ? val = "playerImgs" : val = "dealerImgs"
        let imgDiv = document.querySelector("#" + val);
        for(let i = 0; i < data.data.cards.length; i++){
            let img = document.createElement("img");
            img.src = data.data.cards[i]["image"];
            imgDiv.appendChild(img);
        }
    }

    const checkPlayerScore = (hand, score) => {
        let pScore = document.querySelector("#playerScore");
        let dScore = document.querySelector("#dealerScore");
        if(hand.id === "playerHand"){               
            buttonsContainer.style.display = "block";
            pScore.innerText = `Score: ${score}`;
            pScore.value = score;
        } else {
            dScore.innerText = `Score: ${score}`;
            dScore.value = score;
        }
    }

    const endGame = async () => {
        let playerScore = document.querySelector("#playerScore").value;
        let dealerScore = document.querySelector("#dealerScore").value;
        let message = document.createElement("h1");
        let buttons = document.querySelector("#playerButtons");
        buttons.innerHTML = "";
        while(dealerScore < 17){
            dealerScore = await draw(deck_id, dealerHand, dealerScore);
        }
        if(dealerScore > 21) {
            message.innerText = "Dealer busts!! You win!"
        }
        else if(dealerScore === playerScore) {
            message.innerText = "Draw! Its a tie!";
        } else if (playerScore > dealerScore){
            message.innerText = "Player beats the dealer! You win!";
        } else {
            message.innerText = "Dealer beats the player! You lose!";
        }
        buttons.appendChild(message);
    }

    const isGameOver = (score, hand) => {
        let buttons = document.querySelector("#playerButtons");
        let startBtn = document.querySelector("#startBtn");
        if (score === 21 && hand.id === "playerHand" ){
            buttons.innerHTML = "";
            let message = document.createElement("h1");
            message.innerText = "BLACKJACK!!! You win!";
            buttons.appendChild(message)
            startBtn.innerText = "start a new game?"
            startBtn.style.display = "block";
            return true;
        } else if(score > 21 && hand.id === "playerHand"){
            buttons.innerHTML = "";
            let message = document.createElement("h1");
            message.innerText = "BUSTED!!!! You lose!";
            buttons.appendChild(message);
            startBtn.innerText = "start a new game?"
            startBtn.style.display = "block";
            return true;
        } else {
            return false;
        }
    }

    const draw = async(id, hand, score) => {
        try {
            let drawData = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`); 
            if(score !== 0){
                drawData = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`);
                if(isGameOver(score, hand)){
                    return score;
                }
            }
            score = scoreHand(drawData.data.cards, score);
            
            displayCards(drawData, hand);
            checkPlayerScore(hand, score);
            if(isGameOver(score, hand)){
                return score;
            }
            
            return score;
        } catch (err) {
            console.log(err);
        }
    }

    // const resetGame = (playerScore, dealerScore) => {
    //     let reset = document.querySelectorAll(".reset");
    //     reset.forEach(node => {
    //         node.innerHTML = ""
    //     })
    //     playerScore = 0;
    //     dealerScore = 0;
    // }

    startBtn.addEventListener("click", async () => {
        let startBtn = document.querySelector("#startBtn");
        startBtn.style.display = "none";
        // if(playerScore >  0 && dealerScore > 0){
        //     resetGame(playerScore, dealerScore);
        // } else {
            playerScore = await draw(deck_id, playerHand, playerScore);
            dealerScore = await draw(deck_id, dealerHand, dealerScore);
        // }
    })

    let hit = document.querySelector("#hitBtn");
    hit.addEventListener("click", async () => {
        playerScore = await draw(deck_id, playerHand, playerScore);
    })

    let stay = document.querySelector("#stayBtn");
    stay.addEventListener("click", () => {
        endGame();
    })
        
    fetchDeck();

})


const scoreHand = (cards, score) => {
    let numAces = 0;
    cards.forEach(card => {
        if(card.value === 'ACE') {
            numAces++;
        } else if (card.value === 'KING' || card.value === 'QUEEN' || card.value === 'JACK'){
            score += 10;
        } else if (Number(card.value)){
            score += Number(card.value);
        }
    })
    for(let i = numAces; i > 0; i--){
        if(score > (11-i)){
            score += 1;
        } else {
            score += 11;
        }
    }
    return score;
}    


