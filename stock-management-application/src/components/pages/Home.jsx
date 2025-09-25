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
        console.log("data", response.data);
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
    <div className="w-full flex-col overflow-hidden md:no-scrollbar hover:overflow-y-scroll drop-shadow-xl">
      <div className="w-full flex mt-5 justify-around">
        <Card
          name={"Sales"}
          value={homeData?.totalSalesPrice + " Br"}
          type={"1"}
        />

        <Card
          name={"Number of Sales"}
          value={homeData?.salesCount}
          type={"2"}
        />

        <Card
          name={"Purchase"}
          value={homeData?.combinedTotalPurchasedPrice + " Br"}
          type={"3"}
        />

        <Card
          name={"Number of Purchase"}
          value={homeData?.combinedPurchasedInventoryCount}
          type={"4"}
        />
      </div>

      <div className="flex gap-2">
        <div className="w-[48%] h-[50%] mt-14">
          <LineChart
            fullData={homeData?.monthlySales || []}
            type={"Monthly Sales"}
          />
        </div>
        <div className="w-[48%] h-[50%] mt-14">
          <LineChart
            fullData={homeData?.monthlyPurchases || []}
            type={"Monthly Purchases"}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
