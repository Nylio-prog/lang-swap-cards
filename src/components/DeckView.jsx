import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore";
import { useLocation } from "react-router-dom";

const DeckView = () => {
  const location = useLocation();
  const deck = location.state && location.state.deck;
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      if (deck && deck.cards_id) {
        try {
          const cardsCollection = collection(db, "cards");

          // Fetch all cards where the ID is in the deck's cards_id array
          const cardsSnapshot = await getDocs(cardsCollection);
          const filteredCards = cardsSnapshot.docs
            .filter((doc) => deck.cards_id.includes(doc.id))
            .map((doc) => ({ id: doc.id, ...doc.data() }));

          setCards(filteredCards);
        } catch (error) {
          console.error("Error fetching cards:", error);
        }
      }
    };

    fetchCards();
  }, [deck]);

  if (!deck) {
    // Handle the case where the deck is not available
    return <div>Deck not found</div>;
  }

  return (
    <div className="DeckView">
      {cards.map((card) => (
        <div key={card.id} className="card-box">
          <p><strong>Card ID:</strong> {card.id}</p>
          <div className="vertical-line"></div>
          <p><strong>Front:</strong> {card.front}</p>
          <div className="vertical-line"></div>
          <p><strong>Back:</strong> {card.back}</p>
          {/* Add more paragraphs for additional card details */}
        </div>
      ))}
    </div>
  );
};

export default DeckView;
