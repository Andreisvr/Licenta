import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Prof_role/My_thesis_info.css';
import { AppContext } from "../../components/AppContext";

export default function ThesisModify() {
  
  const [thesisData, setThesisData] = useState(null);
  const { thesis_id } = useContext(AppContext); 
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching thesis data for ID:', thesis_id);
    const fetchData = async () => {
        if (thesis_id) {
            try {
                const response = await fetch(`http://localhost:8081/thesis/${thesis_id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch thesis data');
                }
                const data = await response.json();
               
                setThesisData(data[0]);

            } catch (error) {
                console.error('Error fetching proposals:', error);
            }
        }
    };

    fetchData();
  }, [thesis_id]);


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setThesisData((prevData) => {
        const updatedData = {
            ...prevData,
            [name]: name === "limit" ? parseInt(value, 10) || 0 : value,
        };
         
        return updatedData;
    });
};
  const handleApply = (e) => {
        e.preventDefault();  
        const formattedData = {
          ...thesisData,
          start_date: thesisData.start_date ? formatDate(thesisData.start_date) : null,
          end_date: thesisData.end_date ? formatDate(thesisData.end_date) : null,
      };
        console.log('data modfiy',formattedData);
    fetch(`http://localhost:8081/update_thesis/${thesis_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Data updated successfully");
          } else {
            console.error("Error updating thesis");
          }
        })
        .catch((error) => console.error("Error:", error));

        navigate('/prof');
        
  };

  if (!thesisData) {
    return <div>Loading thesis information...</div>;
  }

  
  const formatDate = (dateString) => {
    if (!dateString) return ""; 
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; 
    return date.toISOString().split("T")[0]; 
  };
 
  
  return (
    <div className="th_info_body">
      <form className="left_form">
        <label className="label_modify">
          Title:
          <input className="input_modify"
            type="text"
            name="title"
            value={thesisData.title || ""}
            onChange={handleChange}
          />
        </label>
        <label  className="label_modify">
          Description:
          <textarea className="textarea_modify"
            name="description"
            value={thesisData.description || ""}
            onChange={handleChange}
          />
        </label>
        <label className="label_modify">
          Requirements:
          <textarea
            name="requirements"
            value={thesisData.requirements || ""}
            onChange={handleChange}
          />
        </label>
        <button className="button_gr" onClick={handleApply}>
        Modify
        </button>
      </form>

      <form className="right_form">
        <label className="label_modify">
          Limit:
          <input className="input_modify"
            type="number"
            name="limita"
            value={thesisData.limita || ""}
            onChange={handleChange}
          />
        </label>
        <label className="label_modify">
          Date From:
          <input className="input_modify"
            type="date"
            name="start_date"
            value={formatDate(thesisData.start_date) || ""}
            onChange={handleChange}
          />
        </label>
        <label className="label_modify">
          Date To:
          <input className="input_modify"
            type="date"
            name="end_date"
            value={formatDate(thesisData.end_date) || ""}
            onChange={handleChange}
          />
        </label>
       
      </form>
    </div>
  );
}
