import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const CardEdit = () => {
  const location = useLocation();
  const card = location.state && location.state.row;
  const deckId = location.state && location.state.deckId;
  const [front, setFront] = useState(card?.front ?? "");
  const [back, setBack] = useState(card?.back ?? "");
  const [decksId, setDecksId] = useState([]);
  const navigate = useNavigate();

  const handleSaveCard = async () => {
    try {
      // Check if the card is a new card (not yet in the database)
      if (!card?.id) {
        const newCardRef = await addDoc(collection(db, "cards"), {
          front: front,
          back: back,
          decks_id: [deckId],
        });

        const deckDocRef = doc(db, "decks", deckId);

        // Update the deck's cards_id array with the new card ID
        await updateDoc(deckDocRef, {
          cards_id: arrayUnion(newCardRef.id),
        });
      } else {
        // It's an existing card, update its data
        const cardDocRef = doc(db, "cards", card.id);
        await updateDoc(cardDocRef, {
          front: front,
          back: back,
        });
      }

      // Navigate back to the deck view after saving
      navigate(`/decks/${deckId}`);
    } catch (error) {
      // Handle errors
      console.error("Error saving/updating card:", error);
    }
  };

  // Navigate back to the home page without saving changes
  const handleCancel = () => {
    navigate(`/decks/${deckId}`);
  };

  return (
    <div className="CardEdit">
      <h2>Editing Card</h2>
      <div className="form-group">
        <label>Front :</label>
        <input
          type="text"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
        <label>Back :</label>
        <input
          type="text"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Decks ID (comma-separated):</label>
        <input
          type="text"
          value={decksId.join(",")}
          onChange={(e) => setDecksId(e.target.value.split(","))}
        />
      </div>
      <div className="button-group">
        <button className="cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button className="save" onClick={handleSaveCard}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CardEdit;
