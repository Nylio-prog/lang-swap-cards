import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../firebaseConfig";

const CardTable = ({ cards, deckId }) => {
  const navigate = useNavigate();
  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    // Convert cards to data and set it to state
    const data = cards.map((card) => ({
      id: card.id,
      front: card.front,
      back: card.back,
    }));
    setCardsData(data);
  }, [cards]);

  const handleActionClick = (action, row) => {
    if (action === "Edit") {
      navigate(`/card/edit`, { state: { row, deckId } });
    } else if (action === "Delete") {
      deleteCard(row.id);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      // Get the reference to the card document in Firebase
      const cardDocRef = doc(db, "cards", cardId);

      // Delete the card document
      await deleteDoc(cardDocRef);

      const deckDocRef = doc(db, "decks", deckId);

      // Update the deck's cards_id array to remove the deleted card ID
      await updateDoc(deckDocRef, {
        cards_id: arrayRemove(cardId),
      });

      setCardsData((prevCardsData) =>
        prevCardsData.filter((card) => card.id !== cardId)
      );
    } catch (error) {
      // Handle errors
      console.error("Error deleting card:", error);
    }
  };

  const columns = [
    {
      name: "Front",
      selector: (row) => row.front,
    },
    {
      name: "Back",
      selector: (row) => row.back,
    },
    {
      cell: (row) => (
        <div className="action-button-container">
          <div
            className="action-button"
            onClick={() => handleActionClick("Edit", row)}
          >
            <FontAwesomeIcon icon={faPencil} />
          </div>
          <div
            className="action-button"
            onClick={() => handleActionClick("Delete", row)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#B99470", // Header background color
        color: "#FEFAE0",
      },
    },
    cells: {
      style: {
        padding: "12px", // Cell padding
        backgroundColor: "#A9B388",
        color: "#FEFAE0",
      },
    },
  };

  return (
    <div className="CardTable">
      <DataTable
        columns={columns}
        data={cardsData}
        customStyles={customStyles}
      />
    </div>
  );
};

export default CardTable;
