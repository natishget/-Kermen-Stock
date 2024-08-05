import React, { useEffect, useState } from "react";
import Card from "../Card";
import Card2 from "../Card2";
import LineChart from "../charts/LineGraph";
import axios from "axios";

const Home = () => {
  const [homeData, setHomeData] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8800/api/getData/allData`)
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
    <>
      {homeData.length === 0 ? (
        <>
          <div className="col-span-1 row-span-1 mt-5">
            <Card name={"Sales"} value={"0Br"} />
          </div>
          <div className="col-span-1 row-span-1 mt-5">
            <Card name={"Number of Sales"} value={"0"} />
          </div>
          <div className="col-span-1 row-span-1 mt-5">
            <Card name={"Purchase"} value={"0Br"} />
          </div>
          <div className="col-span-1 row-span-1 mt-5">
            <Card name={"Number of Purchase"} value={"0"} />
          </div>
        </>
      ) : (
        homeData.map((home, index) => (
          <>
            <div className="col-span-1 row-span-1 mt-5">
              <Card
                name={"Sales"}
                value={home.totalSalesPrice + "Br"}
                type={"1"}
              />
            </div>
            <div className="col-span-1 row-span-1 mt-5">
              <Card
                name={"Number of Sales"}
                value={home.salesCount}
                type={"2"}
              />
            </div>
            <div className="col-span-1 row-span-1 mt-5">
              <Card
                name={"Purchase"}
                value={home.combinedTotalPurchasedPrice + "Br"}
                type={"3"}
              />
            </div>
            <div className="col-span-1 row-span-1 mt-5">
              <Card
                name={"Number of Purchase"}
                value={home.combinedPurchasedInventoryCount}
                type={"4"}
              />
            </div>
          </>
        ))
      )}
      <div className="col-span-2 row-span-1">
        <Card2 />
      </div>
      <div className="col-span-2 row-span-1">
        <LineChart />
      </div>
      <div className="col-span-2 row-span-1">Chart 2</div>
      <div className="col-span-2 row-span-1">Chart 3</div>
    </>
  );
};

export default Home;
