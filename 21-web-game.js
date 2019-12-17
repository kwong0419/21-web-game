document.addEventListener("DOMContentLoaded", () => {
    
    let deck_id;
    
    let playerScore = 0;
    let dealerScore = 0;
    let buttonsContainer = document.querySelector("#playerButtons");
    buttonsContainer.style.display = "none";
    let playerHand = document.querySelector("#playerHand");
    let dealerHand = document.querySelector("#dealerHand");
    let urls = [];

    let startBtn = document.querySelector("#startBtn");
    
    const fetchDeck = async () => {
        try {
            let res = await axios.get("https://deckofcardsapi.com/api/deck/new/");
            deck_id = res.data.deck_id;
            let shuffled = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`);
        } catch(error) {
            console.log(error);
        }
    }

    const displayDealerCards = (data) => {
        let val = document.querySelector("#dealerImgs");
        val.innerHTML = "";
        if(dealerScore === 0){
            for (let i = 0; i < data.data.cards.length; i++){
                urls.push(data.data.cards[i]["image"]);
            }
            let img = document.createElement("img");
            img.src = data.data.cards[0]["image"];
            let faceDown = document.createElement("img");
            faceDown.src = "https://raw.githubusercontent.com/nk1tz/vanilla-js-blackjack/master/card.png";
            val.appendChild(img);
            val.appendChild(faceDown);
        } else {
            urls.forEach(card => {
                let img = document.createElement("img");
                img.src = card;
                val.appendChild(img);
            })
            for(let i = 0; i < data.data.cards.length; i++){
                let draw = document.createElement("img");
                draw.src = data.data.cards[i]["image"];
                val.appendChild(draw);
            }
        }
    }

    const displayCards = (data, hand) => {
        let val = ""
        hand.id === "playerHand" ? val = "playerImgs" : val = "dealerImgs"
        let imgDiv = document.querySelector("#" + val)
        if(val === "dealerImgs"){
            displayDealerCards(data, val);
        } else {
            for(let i = 0; i < data.data.cards.length; i++){
                let img = document.createElement("img");
                img.src = data.data.cards[i]["image"];
                imgDiv.appendChild(img);
            }
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
            dScore.style.display = "none";
        }
    }

    const endGame = async () => {
        let playerScore = document.querySelector("#playerScore").value;
        let dealerScore = document.querySelector("#dealerScore").value;
        let message = document.createElement("h2");
        let buttons = document.querySelector("#playerButtons");
        buttons.innerHTML = "";
        while(dealerScore < 17){
            dealerScore = await draw(deck_id, dealerHand, dealerScore);
        }
        if(dealerScore > 21) {
            message.innerText = "Dealer busts!! You win!"
            reload();
        }
        else if(dealerScore === playerScore) {
            message.innerText = "Draw! Its a tie!";
            reload();
        } else if (playerScore > dealerScore){
            message.innerText = "Player beats the dealer! You win!";
            reload();
        } else {
            message.innerText = "Dealer beats the player! You lose!";
            reload();
        }
        document.querySelector("#dealerScore").style.display = "block";
        buttons.appendChild(message);
    }

    const reload = () => {
        let reload = document.createElement("button");
        reload.innerText = "reload";
        reload.id = "reloadBtn";
        document.body.appendChild(reload);
        reload.addEventListener("click", () => {
            window.location.reload();
        })
    }

    const isGameOver = (score, hand) => {
        let buttons = document.querySelector("#playerButtons");
        let message = document.createElement("h2");
        if (score === 21 && hand.id === "playerHand" ){
            buttons.innerHTML = "";
            message.innerText = "BLACKJACK!!! You win!";
            reload();
            buttons.appendChild(message)
            return true;
        } else if(score > 21 && hand.id === "playerHand"){
            buttons.innerHTML = "";
            message.innerText = "BUSTED!!!! You lose!";
            reload();
            buttons.appendChild(message);
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
        endGame();
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

    fetchDeck();

})



