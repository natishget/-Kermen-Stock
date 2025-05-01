// src/components/CartPage.js
import React, { useContext } from "react";
import { CartContext } from "../CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const Cart = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);

  const handleSubmit = () => {
    axios
      .post(`${BackEndURL}/sales/makeSales`, cart)
      .then((response) => {
        alert(response.data.message);
        generatePDF(cart);
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          alert("No response from server. Please try again.");
        } else {
          alert("Error: " + error.message);
        }
      })
      .finally(() => {
        clearCart();
      });
  };

  const generatePDF = (sales) => {
    console.log("creating the pdf");
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0);
    doc.text("Kermen Aluminum", 15, 15);

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("Sales Summary", 70, 30);

    let y = 40;

    sales.forEach((sale, index) => {
      doc.setFontSize(10);
      doc.text(`Item No. ${index + 1}`, 15, y);
      doc.text(`Product ID: ${sale.product_id}`, 15, y + 5);
      doc.text(`Quantity: ${sale.quantity}`, 15, y + 10);
      doc.text(`Date: ${sale.date}`, 15, y + 15);
      doc.text(`Description: ${sale.description}`, 15, y + 20);
      doc.text(`Unit Price: ${sale.unit_price}`, 15, y + 25);
      doc.text(`Customer: ${sale.customer}`, 15, y + 30);
      doc.text(`Color: ${sale.color}`, 15, y + 35);
      doc.text(`Imported: ${sale.isimported}`, 15, y + 40);
      doc.text(
        `-------------------------------------------------------`,
        15,
        y + 45
      );

      y += 50; // Move to the next section
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // Save the PDF
    doc.save("sales-summary.pdf");
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
