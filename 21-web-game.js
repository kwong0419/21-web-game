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
        for(let i = 0; i < data.data.cards.length; i++){
            let img = document.createElement("img");
            img.src = data.data.cards[i]["image"];
            hand.appendChild(img);
        }
    }

    const checkPlayer = (hand, score) => {
        let pScore = document.querySelector("#playerScore");
        let dScore = document.querySelector("#dealerScore");
        if(hand.id === "playerHand"){               
            buttonsContainer.style.display = "block";
            pScore.innerText = `Score: ${score}`;
        } else {
            dScore.innerText = `Score: ${score}`;
        }
    }

    const draw = async(id, hand, score) => {
        try {
            let drawData = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`);
            if(score !== 0){
                drawData = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
            }
            score = scoreHand(drawData.data.cards, score);
                     
            let buttons = document.querySelector("#playerButtons");
            let startBtn = document.querySelector("#startBtn");
            if (score === 21){
                console.log("BLACKJACK!!! You win!")
                buttons.innerHTML = "";
                let message = document.createElement("h1");
                message.innerText = "BLACKJACK!!! You win!";
                buttons.appendChild(message)
                return;
            } else if(score > 21){
                console.log("BUSTED!!!! You lose!");
                buttons.innerHTML = "";
                let message = document.createElement("h1");
                message.innerText = "BUSTED!!!! You lose!";
                buttons.appendChild(message);
                startBtn.style.display = "block";
                return;
            } else {
                
            }

            displayCards(drawData, hand);
            checkPlayer(hand, score);

            return score;
        } catch (err) {
            console.log(err);
        }
    }

    startBtn.addEventListener("click", async () => {
        let startBtn = document.querySelector("#startBtn");
        startBtn.style.display = "none";
        playerScore = await draw(deck_id, playerHand, playerScore);
        dealerScore = await draw(deck_id, dealerHand, dealerScore);
    })

    let hit = document.querySelector("#hitBtn");
    hit.addEventListener("click", async () => {
        playerScore = await draw(deck_id, playerHand, playerScore);
    })

    let stay = document.querySelector("#stayBtn");
    stay.addEventListener("click", () => {

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