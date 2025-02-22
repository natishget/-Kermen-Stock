import React, { useEffect, useState } from "react";
import Card from "../Card";
import Card2 from "../Card2";
import LineChart from "../charts/LineGraph";
import axios from "axios";

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const Home = ({ userData }) => {
  //axios credentials
  axios.defaults.withCredentials = true;
  // protected Route
  const [homeData, setHomeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/getData/allData`,
          {
            withCredentials: true,
          }
        );
        setHomeData(response.data);
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
  return (
    <div className="w-full flex-col overflow-hidden md:no-scrollbar hover:overflow-y-scroll">
      {homeData.length === 0 ? (
        <div className="w-full flex mt-5">
          <Card name={"Sales"} value={"0Br"} />

          <Card name={"Number of Sales"} value={"0"} />

          <Card name={"Purchase"} value={"0Br"} />

          <Card name={"Number of Purchase"} value={"0"} />
        </div>
      ) : (
        homeData.map((home, index) => (
          <div className="w-full flex mt-5 justify-around" key={index}>
            <Card
              name={"Sales"}
              value={home.totalSalesPrice + " Br"}
              type={"1"}
            />

            <Card name={"Number of Sales"} value={home.salesCount} type={"2"} />

            <Card
              name={"Purchase"}
              value={home.combinedTotalPurchasedPrice + " Br"}
              type={"3"}
            />

            <Card
              name={"Number of Purchase"}
              value={home.combinedPurchasedInventoryCount}
              type={"4"}
            />
          </div>
        ))
      )}
      <div className="w-full  mt-14 flex justify-center items-center">
        <LineChart />
      </div>
    </div>
  );
};

export default Home;
