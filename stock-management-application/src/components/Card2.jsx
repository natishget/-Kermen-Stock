import purchase from "../assets/icons/purchase.svg";
import { useState, useEffect } from "react";

const Card2 = ({ name, value }) => {
  return (
    <>
      <div className=" border rounded-xl border-slate-600 flex-col items-center bg-mycolor mx-3 py-2 h-full w-2/3 p-3 overflow-hidden no-scrollbar hover:overflow-y-scroll">
        <p className="text-yellow-400 font-bold ">List of Materials</p>
        <div className="mt-2 ml-2">
          <ul>
            <li className="py-2">Aluminium Panel</li>
            <li className="py-2">Aluminium Sheet</li>
            <li className="py-2">Aluminium Rail</li>
            <li className="py-2">Aluminium Steel </li>
            <li className="py-2">Copper</li>
            <li className="py-2">Brass</li>
            <li className="py-2">Stainless Steel</li>
            <li className="py-2">Phosphor Bronze</li>
            <li className="py-2">Titanium</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Card2;
