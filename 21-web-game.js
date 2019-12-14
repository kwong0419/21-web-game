document.addEventListener("DOMContentLoaded", () => {

    let deck_id;

    let playerScore;
    let dealerScore;

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
            score = 0;
            score = scoreHand(drawData.data.cards, score);
            let h5 = document.createElement("h5");
            h5.innerText = `Score: ${score}`;

            for(let i = 0; i < drawData.data.cards.length; i++){
                let img = document.createElement("img");
                img.src = drawData.data.cards[i]["image"];
                hand.appendChild(img);
            }

            if(hand.id === "playerHand"){
                let hitBtn = document.createElement("button");
                let stayBtn = document.createElement("button");
                hitBtn.innerText = "HIT";
                stayBtn.innerText = "STAY";
                hand.appendChild(hitBtn);
                hand.appendChild(stayBtn);
            }

            hand.appendChild(h5)

        } catch (err) {
            console.log(err);
        }
    }

    let playerHand = document.querySelector("#playerHand");
    let dealerHand = document.querySelector("#dealerHand");
    startBtn.addEventListener("click", () => {
        let startBtn = document.querySelector("#startBtn");
        startBtn.style.display = "none";
        drawCards(deck_id, playerHand, playerScore);
        console.log(playerScore);
        drawCards(deck_id, dealerHand, dealerScore);
        console.log(dealerScore);
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