import axios from "axios";
import React, { useEffect } from "react";

const COGS = () => {
  useEffect(() => {
    const fetchData = async () => {
      const data = {
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      };
      try {
        const response = await axios.get(
          "http://localhost:8800/api/financial/financialData",
          data,
          { withCredentials: true }
        );
        alert(response.data.message);
      } catch (error) {
        alert(error.message);
      }
    };
  }, []);
  return <div></div>;
};

export default COGS;
