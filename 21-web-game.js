document.addEventListener("DOMContentLoaded", () => {

    let deck_id;

    const fetchDeck = async () => {
        try {
            let res = await axios.get("https://deckofcardsapi.com/api/deck/new/");
            deck_id = res.data.deck_id;
            let shuffled = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`);
        } catch(error) {
            console.log(error);
        }
    }

    const drawCards = async(id, hand) => {
        try {
            let drawData = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`);
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
        } catch (err) {
            console.log(err);
        }
    }

    const hit = async(id) => {
        try{

        } catch {

        }
    }

    let playerHand = document.querySelector("#playerHand");
    let computerHand = document.querySelector("#dealerHand");
    startBtn.addEventListener("click", () => {
        let startBtn = document.querySelector("#startBtn");
        startBtn.style.display = "none";
        drawCards(deck_id, playerHand);
        drawCards(deck_id, computerHand);
    })

    fetchDeck();


})