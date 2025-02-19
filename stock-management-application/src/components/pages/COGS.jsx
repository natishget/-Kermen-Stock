import axios from "axios";
import React, { useEffect } from "react";

// enviroment variable
const BackEndURL = process.env.VITE_BACKEND_URL;

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
        alert(error.message);
      }
    };
    fetchData();
  }, []);
  return <div></div>;
};

export default COGS;
