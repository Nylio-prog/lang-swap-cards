import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Import your Firebase configuration
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import CardTable from "./CardTable";

const DeckView = () => {
  const location = useLocation();
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(location.state && location.state.deck);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        // Get the reference to the 'decks' collection
        const deckDocRef = doc(db, "decks", deckId);

        // Execute the query to get the deck with the specified deckId
        const deckSnapshot = await getDoc(deckDocRef);

        // Check if the deck exists
        if (deckSnapshot.exists()) {
          // Update the state with the fetched deck data
          setDeck({ id: deckSnapshot.id, ...deckSnapshot.data() });
        } else {
          console.error("Deck not found");
          // Handle the case where the deck with the specified deckId does not exist
        }
      } catch (error) {
        console.error("Error fetching deck:", error);
      } finally {
        // Set loading to false when fetchDeck is completed, regardless of success or failure
        setIsLoading(false);
      }
    };

    // Call fetchDeck when the component mounts or 'deckId' changes
    fetchDeck();
  }, [deckId]);

  if (isLoading) {
    // Render a loading indicator while fetching the deck
    return <p>Loading...</p>;
  }

  const handleCreateCard = async () => {
    navigate("/card/edit", { state: { deckId } });
  };

  return (
    <div className="DeckView">
      <h2>Deck : {deck.title}</h2>
      <CardTable cards={cards} deckId={deck.id} />
      <button className="create-card-button" onClick={handleCreateCard}>
        <FontAwesomeIcon icon={faPlus} size="3x" />
      </button>
    </div>
  );
};

export default DeckView;
