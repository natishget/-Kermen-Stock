import axios from "axios";
import React, { useEffect } from "react";

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const COGS = () => {
  useEffect(() => {
    const fetchData = async () => {
      const data = {
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      };
      try {
        const response = await axios.get(
          `${BackEndURL}/financial/financialData`,
          data,
          { withCredentials: true }
        );
        console.log("financial daata", response.data.message);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          alert("No response from server. Please try again.");
        } else {
          alert("Error: " + error.message);
        }
      }
    };
    fetchData();
  }, []);
  return <div></div>;
};

export default COGS;
