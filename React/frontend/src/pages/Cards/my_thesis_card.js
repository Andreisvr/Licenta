import React, { useState, useEffect,useContext} from "react";
import { useNavigate } from "react-router-dom";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import BACKEND_URL from "../../server_link";
import "../../page_css/my_thesis_cards.css";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateIcon from "@mui/icons-material/Create";
import { AppContext } from "../../components/AppContext";
// React component for displaying and managing a user's thesis

export default function MyThesis({
  thesisName,
  faculty,
  study_program,
  date_start,
  date_end,
  professor_name,
  viewType,
  description,
  id,
  state,
}) {
  // State to track whether the thesis is paused or open
  const [isToggled, setIsToggled] = useState(false);

  // State to control visibility of the confirmation dialog when deleting
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Access the function from context to store the current thesis ID
  const { handleThesisId } = useContext(AppContext); 

  // React Router hook to navigate between pages
  const navigate = useNavigate();  

  // Update the toggle state based on the thesis state (if not open, set as toggled)
  useEffect(() => {
    setIsToggled(state !== "open");
  }, [state]);

  // Handle the click event to navigate to the thesis modification page
  const handleModifyClick = () => {
    handleThesisId(id); 
    navigate(`/MyThesisInfo`);
  };

  // Function to withdraw (delete) the thesis from the backend
  const handleWithdraw = (id) => {
    fetch(`${BACKEND_URL}/prof/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to withdraw thesis");
      })
      .catch((error) => console.error("Error withdrawing thesis:", error));
    // After deletion, navigate to the professor's dashboard
    navigate("/prof");
  };

  // Function to pause the thesis (if it's not already closed)
  const handleStop = (id) => {
    if (state === "closed") return;
    fetch(`${BACKEND_URL}/stop_thesis/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update thesis state to pause");
      })
      .catch((error) => console.error("Error updating thesis state:", error));
  };

  // Function to reopen the thesis (if it's not closed permanently)
  const handleOpen = (id) => {
    if (state === "closed") return;
    fetch(`${BACKEND_URL}/open_thesis/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update thesis state to open");
      })
      .catch((error) => console.error("Error updating thesis state:", error));
  };

  // Toggles the state between active and paused
  const toggleState = () => {
    if (!isToggled) {
      handleStop(id); // pause thesis
    } else {
      handleOpen(id); // reopen thesis
    }
    setIsToggled(!isToggled); // update UI toggle state
  };

  // Utility function to format ISO date strings into "dd/mm/yyyy"
  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    if (date.getTime() === 0) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Opens the delete confirmation dialog
  const handleDeleteClick = () => {
    setIsConfirmDialogOpen(true);
  };

  // Executes the delete action and closes the confirmation dialog
  const handleConfirmDelete = () => {
    handleWithdraw(id);
    setIsConfirmDialogOpen(false);
  };

  // Cancels the delete action by closing the dialog
  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
  };

  // Returns a shortened version of the description for preview purposes
  const getShortDescription = (desc) => (desc ? `${desc.substring(0, 25)}${desc.length > 100 ? "..." : ""}` : "");


  return (
    <form className="applied_form">
      <p className="text title">Title: {getShortDescription(thesisName)}</p>
      <p className="text">
        Faculty: {faculty} {study_program && `Program: ${study_program}`}
      </p>
      <div className="add_date">
        <p className="text">{formatDate(date_start)}</p>
        <p className="text">{formatDate(date_end)}</p>
      </div>
      <div className="btn_group">
        <div className="icon-container">
          <DeleteOutlineIcon
            className="delete-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="icon-container">
          <CreateIcon
            className="modify-icon"
            onClick={handleModifyClick} 
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="toggle-section">
          <p className="toggle-text">{isToggled ? "Suspended" : "Suspend"}</p>
          <div
            className={`toggle-container ${isToggled ? "active" : ""}`}
            onClick={toggleState}
          >
            {isToggled ? <ToggleOnIcon /> : <ToggleOffIcon />}
          </div>
        </div>
      </div>

      {isConfirmDialogOpen && (
        <ConfirmDialog
          message="Are you sure you want to delete this thesis?
           It will be permanently removed from all locations, even if confirmed. You can only suspend it instead."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </form>
  );
}

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="confirm-dialog">
    <p style={{ color: "#333" }}>{message}</p>
    <button onClick={onConfirm}>Confirmă</button>
    <button onClick={onCancel}>Anulează</button>
  </div>
);
