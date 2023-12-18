import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const PracticeDeck = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasWaitedFlipTime, setHasWaitedFlipTime] = useState(true);
  const [unseenCardIndices, setUnseenCardIndices] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user =
      storedUser !== "undefined" ? JSON.parse(storedUser) : undefined;

    if (!user) {
      navigate("/login");
    } else {
      const fetchCards = async () => {
        try {
          const deckDocument = doc(db, "decks", deckId);
          const deckSnapshot = await getDoc(deckDocument);

          if (deckSnapshot.exists()) {
            const cardsIdArray = deckSnapshot.data().cards_id;
            const fetchedCardsPromises = cardsIdArray.map(async (cardId) => {
              const cardDocument = doc(db, "cards", cardId);
              const cardSnapshot = await getDoc(cardDocument);
              if (cardSnapshot.exists()) {
                return { id: cardSnapshot.id, ...cardSnapshot.data() };
              } else {
                console.log(`Card with ID ${cardId} does not exist.`);
                return null;
              }
            });

            const fetchedCards = await Promise.all(fetchedCardsPromises);
            const filteredCards = fetchedCards.filter((card) => card !== null);

            setCards(filteredCards);

            // Initialize unseenCardIndices based on the number of cards
            setUnseenCardIndices(
              Array.from({ length: filteredCards.length }, (_, index) => index)
            );
          } else {
            console.log("Deck document does not exist.");
          }
        } catch (error) {
          console.error("Error fetching cards:", error);
        }
      };

      fetchCards();
    }
  }, [deckId, navigate]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    let newUnseenIndices = unseenCardIndices;
    let randomIndex = 0;
    // Check if all cards have been seen
    if (newUnseenIndices.length === 0) {
      newUnseenIndices = Array.from(
        { length: cards.length },
        (_, index) => index
      );
    }
    randomIndex =
      newUnseenIndices[Math.floor(Math.random() * newUnseenIndices.length)];
    newUnseenIndices = newUnseenIndices.filter(
      (index) => index !== randomIndex
    );

    // Update state and set current card index
    setCurrentCardIndex(randomIndex);

    setIsFlipped(false);
    setHasWaitedFlipTime(false);
    setTimeout(() => {
      setHasWaitedFlipTime(true);
    }, 500); //Should be the time of the transition

    setUnseenCardIndices(newUnseenIndices);
  };

  return (
    <div className="PracticeDeck">
      {cards.length > 0 && (
        <div
          className={`card ${isFlipped ? "flipped" : ""}`}
          onClick={handleCardClick}
        >
          <div className="card-content">
            <div className="card-front">{cards[currentCardIndex].front}</div>
            <div className="card-back">
              {hasWaitedFlipTime ? cards[currentCardIndex].back : ""}
            </div>
          </div>
        </div>
      )}
      <button onClick={handleNextCard}>Next Card</button>
    </div>
  );
};

export default PracticeDeck;
