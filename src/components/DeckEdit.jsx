import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const DeckEdit = () => {
  const [title, setTitle] = useState("");
  const [cardsId, setCardsId] = useState([]);
  const navigate = useNavigate();

  const handleCreateDeck = async () => {
    try {
      const newDeck = {
        title: title,
        cards_id: cardsId,
      };

      const decksCollection = collection(db, "decks");
      const newDeckRef = await addDoc(decksCollection, newDeck);

      console.log("Deck created:", newDeckRef.id);
      // Navigate back to the home page after creating a deck
      navigate("/");
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };

  // Navigate back to the home page without saving changes
  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="DeckEdit">
      <h2>Creating New Deck</h2>
      <div className="form-group">
        <label>Title :</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Cards ID (comma-separated):</label>
        <input
          type="text"
          value={cardsId.join(",")}
          onChange={(e) => setCardsId(e.target.value.split(","))}
        />
      </div>
      <div className="button-group">
        <button className="cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button className="save" onClick={handleCreateDeck}>
          Save
        </button>
      </div>
    </div>
  );
};

export default DeckEdit;
