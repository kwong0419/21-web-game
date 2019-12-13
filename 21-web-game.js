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

    const drawCards = async(id) => {
        try {
            let drawData = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`);
            let playerHand = document.querySelector("#playerHand");
            // playerHand.innerHTML = "";
            for(let i = 0; i < drawData.data.cards.length; i++){
                let img = document.createElement("img");
                img.src = drawData.data.cards[i]["image"];
                playerHand.appendChild(img);
            }
        } catch (err) {
            console.log(err);
        }
    }

    
    startBtn.addEventListener("click", () => {
        let startBtn = document.querySelector("#startBtn");
        startBtn.style.display = "none";
        drawCards(deck_id);
        
    })

    fetchDeck();


})