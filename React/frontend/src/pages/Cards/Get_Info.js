export async  function GetAllApplies(id) {


    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const studentId = userInfo?.id;
        if (!studentId) {
            console.error("Student ID not found");
            return [];
        }

        const response = await fetch(`http://localhost:8081/aplies/${studentId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        return data; // return the data here directly

    } catch (error) {
        console.error("Error in GetAllApplies:", error);
        return []; // return an empty array in case of error
    }
}



export async function GetAllAccepted(id) {
    try {
        const response = await fetch(`http://localhost:8081/Accepted/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch accepted applications");
        }

        const data = await response.json();
        return data; // Return the fetched data

    } catch (error) {
        console.error("Error in GetAllAccepted:", error);
        return []; // Return an empty array in case of error
    }
}
