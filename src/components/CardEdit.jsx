import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Select from "react-select";

const customStyles = {
  input: (provided) => ({
    ...provided,
    "&::after": {
      paddingTop: "10px",
    },
  }),
};

const CardEdit = () => {
  const location = useLocation();
  const card = location.state && location.state.row;
  const deckId = location.state && location.state.deckId;
  const [front, setFront] = useState(card?.front ?? "");
  const [back, setBack] = useState(card?.back ?? "");
  const [decksId, setDecksId] = useState([deckId]);
  const [allDecks, setAllDecks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all decks from the database
    const fetchAllDecks = async () => {
      const decksCollection = collection(db, "decks");
      const decksSnapshot = await getDocs(decksCollection);
      const decks = decksSnapshot.docs.map((doc) => ({
        label: doc.data().title,
        value: doc.id,
      }));
      setAllDecks(decks);
    };

    fetchAllDecks();
  }, []);

  const handleSaveCard = async () => {
    try {
      // Check if the card is a new card (not yet in the database)
      if (!card?.id) {
        const newCardRef = await addDoc(collection(db, "cards"), {
          front: front,
          back: back,
          decks_id: decksId,
        });

        // Update the selected decks' cards_id arrays with the new card ID
        for (const selectedDeckId of decksId) {
          const deckDocRef = doc(db, "decks", selectedDeckId);
          await updateDoc(deckDocRef, {
            cards_id: arrayUnion(newCardRef.id),
          });
        }
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
        <label>Decks:</label>
        <Select
          isMulti
          options={allDecks}
          value={allDecks.filter((deck) => decksId.includes(deck.value))}
          onChange={(selectedOptions) =>
            setDecksId(selectedOptions.map((option) => option.value))
          }
          styles={customStyles}
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
