import purchase from "../assets/icons/purchase.svg";
import sell from "../assets/icons/sell.svg";
import sales from "../assets/icons/sales.svg";
import buy from "../assets/icons/sell.svg";

import { useState, useEffect } from "react";

import { House, BadgeDollarSign, ShoppingBag, Handshake, ShoppingCart, ChartNoAxesColumn, Calculator, LogOut  } from "lucide-react"

const Card = ({ name, value, type }) => {
 

  return (
    <>
      <div className="w-64 border rounded-xl border-slate-300 flex justify-center items-center bg-mycolor mx-3 py-2">
        { type === "1"
              ? <BadgeDollarSign size={28} className="text-gray-600"/>
              : type === "2"
              ? <Handshake size={28} className="text-gray-600"/>
              : type === "3"
              ? <ShoppingBag size={28} className="text-gray-600"/>
              : type === "4"
              ? <ShoppingCart size={28} className="text-gray-600"/>
              : <BadgeDollarSign size={28} className="text-gray-600"/>}
        <div className="pl-3">
          <p className="font-bold text-gray-600 text-lg">{name}</p>
          <p className="text-yellow-500 font-bold text-xl">{value}</p>
        </div>
      </div>
    </>
  );
};

export default Card;
