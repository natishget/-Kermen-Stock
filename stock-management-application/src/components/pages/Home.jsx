import React, { useEffect, useState } from "react";
import Card from "../Card";
import Card2 from "../Card2";
import LineChart from "../charts/LineGraph";
import axios from "axios";

// enviroment variable
const BackEndURL = process.env.VITE_BACKEND_URL;

const Home = ({ userData }) => {
  //axios credentials
  axios.defaults.withCredentials = true;
  // protected Route
  const [homeData, setHomeData] = useState([]);

  useEffect(() => {
    axios
      .get(`${BackEndURL}/getData/allData`)
      .then((res) => {
        setHomeData(res.data);
        console.log(homeData);
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
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
