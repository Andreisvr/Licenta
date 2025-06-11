
import BACKEND_URL from "../../server_link";

export async  function GetAllApplies(id) {


    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const studentId = userInfo?.id;
        if (!studentId) {
            console.error("Student ID not found");
            return [];
        }

        const response = await fetch(`${BACKEND_URL}/aplies/${studentId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        return data; 

    } catch (error) {
        console.error("Error in GetAllApplies:", error);
        return []; 
    }
}



export async function GetAllAccepted(id) {
    try {
        const response = await fetch(`${BACKEND_URL}/Accepted/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch accepted applications");
        }

        const data = await response.json();
        return data; 

    } catch (error) {
        console.error("Error in GetAllAccepted:", error);
        return []; 
    }
}
