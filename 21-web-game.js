document.addEventListener("DOMContentLoaded", () => {

    let deck_id;

    let playerScore = 0;
    let dealerScore = 0;

    const fetchDeck = async () => {
        try {
            let res = await axios.get("https://deckofcardsapi.com/api/deck/new/");
            deck_id = res.data.deck_id;
            let shuffled = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`);
        } catch(error) {
            console.log(error);
        }
    }

    const drawCards = async(id, hand, score) => {
        try {

            let drawData = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`);
            if(score !== 0){
                drawData = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
            }
            score = scoreHand(drawData.data.cards, score);

            let h5 = document.createElement("h5");
            h5.innerText = `Score: ${score}`;

            for(let i = 0; i < drawData.data.cards.length; i++){
                let img = document.createElement("img");
                img.src = drawData.data.cards[i]["image"];
                hand.appendChild(img);
            }

            if(hand.id === "playerHand"){
                let buttonsContainer = document.querySelector("#playerButtons");
                buttonsContainer.innerHTML = "";
                let hitBtn = document.createElement("button");
                let stayBtn = document.createElement("button");
                hitBtn.innerText = "HIT";
                stayBtn.innerText = "STAY";
                hitBtn.id = "hitBtn";
                stayBtn.id = "stayBtn";
                buttonsContainer.appendChild(hitBtn);
                buttonsContainer.appendChild(stayBtn);
            }

            hand.appendChild(h5)
            return score;
        } catch (err) {
            console.log(err);
        }
    }

    let playerHand = document.querySelector("#playerHand");
    let dealerHand = document.querySelector("#dealerHand");
    startBtn.addEventListener("click", async () => {
        let startBtn = document.querySelector("#startBtn");
        startBtn.style.display = "none";
        playerScore = await drawCards(deck_id, playerHand, playerScore);
        dealerScore = await drawCards(deck_id, dealerHand, dealerScore);
        
        if (playerScore <= 21){
            let hit = document.querySelector("#hitBtn");
            hit.addEventListener("click", () => {
                playerScore = drawCards(deck_id, playerHand, playerScore);
            })
        }
            
    })
        
    fetchDeck();

})

function scoreHand(cards, score) {
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