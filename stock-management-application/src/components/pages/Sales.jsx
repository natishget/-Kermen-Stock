import React, { useState, useEffect } from "react";
import axios from "axios";

const Sales = () => {
  const [allSales, setAllSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(); // This state is not used, so you might consider removing it if it's unnecessary.

  useEffect(() => {
    axios
      .get(`http://localhost:8800/api/sales/allSales`)
      .then((res) => {
        console.table(res.data);
        setAllSales(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong please try again");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center items-center px-6 py-4 font-medium text-2xl text-gray-900 whitespace-nowrap dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="col-span-4 row-span-3 relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product Name
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Sales Date
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Customer
              </th>
            </tr>
          </thead>
          <tbody>
            {allSales.length === 0 ? (
              <tr className="border-b bg-mybg dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  No sales were made
                </th>
              </tr>
            ) : (
              allSales.map((sale, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {sale.Product_name}
                  </th>
                  <td className="px-6 py-4">{sale.Quantity}</td>
                  <td className="px-6 py-4">{formatDate(sale.Date)}</td>
                  <td className="px-6 py-4">{sale.Description}</td>
                  <td className="px-6 py-4">{sale.Unit_price} Br</td>
                  <td className="px-6 py-4">{sale.Customer_Name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Sales;
