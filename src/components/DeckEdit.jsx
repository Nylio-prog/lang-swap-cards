import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Select from "react-select";

const customStyles = {
  input: (provided) => ({
    ...provided,
    "&::after": {
      // Your custom styles for ::after
      paddingTop: "10px",
    },
  }),
};

const DeckEdit = () => {
  const [title, setTitle] = useState("");
  const [cardsId, setCardsId] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all cards from the database
    const fetchAllCards = async () => {
      const cardsCollection = collection(db, "cards");
      const cardsSnapshot = await getDocs(cardsCollection);
      const cards = cardsSnapshot.docs.map((doc) => ({
        label: `${doc.data().front} - ${doc.data().back}`,
        value: doc.id,
      }));
      setAllCards(cards);
    };

    fetchAllCards();
  }, []);

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
        <label>Cards:</label>
        <Select
          isMulti
          options={allCards}
          value={allCards.filter((card) => cardsId.includes(card.value))}
          onChange={(selectedOptions) =>
            setCardsId(selectedOptions.map((option) => option.value))
          }
          styles={customStyles}
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
