import purchase from "../assets/icons/purchase.svg";
import { useState, useEffect } from "react";

import axios from "axios";

// emvironment variable
const BackEndURL = process.env.VITE_BACKEND_URL;

const Card2 = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (
      sessionStorage.getItem("products") === null ||
      sessionStorage.getItem("products") === undefined
    ) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${BackEndURL}/product/getProducts`);
          sessionStorage.setItem("products", JSON.stringify(response.data));
          setProducts(response.data);
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchProducts();
    } else {
      setProducts(JSON.parse(sessionStorage.getItem("products")));
    }
  }, []);

  return (
    <>
      <div className=" border rounded-xl border-slate-600 flex-col items-center bg-mycolor mx-3 py-2 h-full w-2/3 p-3 overflow-hidden no-scrollbar hover:overflow-y-scroll">
        <p className="text-yellow-400 font-bold ">List of Materials</p>
        <div className="mt-2 ml-2">
          <ul>
            {products.map((product) => (
              <li className="py-2">{product?.Product_name}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Card2;
