import React, { useState, useEffect,useContext} from "react";
import { useNavigate } from "react-router-dom";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import "/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/my_thesis_cards.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateIcon from "@mui/icons-material/Create";
import { AppContext } from "../../components/AppContext";

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
  const [isToggled, setIsToggled] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { handleThesisId } = useContext(AppContext); 
  
  const navigate = useNavigate();  


  useEffect(() => {
    setIsToggled(state !== "open");
  }, [state]);

 
const handleModifyClick = () => {
   
    handleThesisId(id); 
  
    navigate(`/MyThesisInfo`);
  };

  const handleWithdraw = (id) => {
    fetch(`http://localhost:8081/prof/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to withdraw thesis");
      })
      .catch((error) => console.error("Error withdrawing thesis:", error));
    window.location.reload();
  };

  const handleStop = (id) => {
    if (state === "closed") return;
    fetch(`http://localhost:8081/stop_thesis/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update thesis state to pause");
      })
      .catch((error) => console.error("Error updating thesis state:", error));
  };

  const handleOpen = (id) => {
    if (state === "closed") return;
    fetch(`http://localhost:8081/open_thesis/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update thesis state to open");
      })
      .catch((error) => console.error("Error updating thesis state:", error));
  };

  const toggleState = () => {
    if (!isToggled) {
      handleStop(id);
    } else {
      handleOpen(id);
    }
    setIsToggled(!isToggled);
  };

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    if (date.getTime() === 0) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleDeleteClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    handleWithdraw(id);
    setIsConfirmDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
  };
  const getShortDescription = (desc) => (desc ? `${desc.substring(0, 25)}${desc.length > 100 ? "..." : ""}` : "");

  return (
    <form className="applied_form">
      <p className="text title">TitleM: {getShortDescription(thesisName)}</p>
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
