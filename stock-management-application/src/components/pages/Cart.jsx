// src/components/CartPage.js
import React, { useContext } from "react";
import { CartContext } from "../CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);

  const handleSubmit = () => {
    axios
      .post(`http://localhost:8800/api/sales/makeSales`, cart, {
        responseType: "blob", // To handle binary data
      })
      //   .then((res) => {
      //     if (res.data.message === "YES") {
      //       alert("All sales processed successfully");
      //       clearCart(); // Clear the cart after submitting
      //     } else throw new Error(res.data.message);
      //   })
      //   .catch((err) => {
      //     alert(err instanceof Error ? err.message : "An error occurred");
      //   });
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "sales-summary.pdf"); // Name of the PDF
        document.body.appendChild(link);
        link.click();
        link.remove(); // Remove the link after download
      })
      .catch((err) => {
        console.error("Error downloading PDF", err.message);
      });
  };

  return (
    <div className=" w-full mb-16 col-span-4 row-span-3 overflow-hidden md:no-scrollbar hover:overflow-y-scroll justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <div className="m-3 w-full">
          {cart.map((item, index) => (
            <div key={index} className="mb-4 border p-3 rounded-[20px]">
              <p>Product ID: {item.product_id}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {item.unit_price}</p>
              <p>Date: {item.date}</p>
              <p>Color: {item.color}</p>
              <p>imported: {item.isimported}</p>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-yellow-500 text-white p-2 rounded"
          >
            Submit Sales
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
