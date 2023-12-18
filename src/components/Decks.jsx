import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Import your Firebase configuration
import { collection, getDocs, query, where } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import Header from "./Header";

const Decks = () => {
  const [decks, setDecks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user =
      storedUser !== "undefined" ? JSON.parse(storedUser) : undefined;

    if (!user) {
      navigate("/login");
    } else {
      // Fetch decks only if the user is present
      const fetchDecks = async () => {
        try {
          // Get the reference to the 'decks' collection
          const decksCollection = collection(db, "decks");

          const q = query(decksCollection, where("user_id", "==", user.uid));

          // Execute the query to get all decks
          const decksSnapshot = await getDocs(q);

          // Map the documents to an array of deck objects
          const decksData = decksSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Update the state with the fetched decks
          setDecks(decksData);
        } catch (error) {
          console.error("Error fetching decks:", error);
        }
      };

      // Example usage
      fetchDecks();
    }
  }, [navigate]);

  const handleCreateDeck = async () => {
    navigate("/decks/new");
  };

  const handleDeckClick = (deck) => {
    navigate(`/decks/${deck.id}`, { state: { deck } });
  };

  return (
    <div>
      <Header />
      <div className="Decks">
        <h2>Your decks</h2>
        {decks.map((deck) => (
          <div
            key={deck.id}
            className="deck-box"
            onClick={() => handleDeckClick(deck)}
          >
            <p>{deck.title}</p>
          </div>
        ))}
        <button className="create-deck-button" onClick={handleCreateDeck}>
          <FontAwesomeIcon icon={faPlus} size="3x" />
        </button>
      </div>
    </div>
  );
};

export default Decks;
