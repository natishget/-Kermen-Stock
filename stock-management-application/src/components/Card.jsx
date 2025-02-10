import purchase from "../assets/icons/purchase.svg";
import sell from "../assets/icons/sell.svg";
import sales from "../assets/icons/sales.svg";
import buy from "../assets/icons/sell.svg";

import { useState, useEffect } from "react";

const Card = ({ name, value, type }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count <= 100) {
        setCount((prevCount) => prevCount + 4);
      } else {
        clearInterval(interval);
      }
    }, 0.1);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="w-64 border rounded-xl border-slate-600 flex justify-center items-center bg-mycolor mx-3 py-2">
        <img
          src={
            type === "1"
              ? sales
              : type === "2"
              ? sell
              : type === "3"
              ? purchase
              : type === "4"
              ? buy
              : purchase
          }
          alt="small"
          className="w-7"
        />
        <div className="pl-3">
          <p className="font-bold">{name}</p>
          <p className="text-yellow-400 font-bold">{value}</p>
        </div>
      </div>
    </>
  );
};

export default Card;
