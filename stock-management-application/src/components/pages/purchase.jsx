import React, { useEffect, useState } from "react";
import axios from "axios";

const Purchase = () => {
  const [allPurchases, setAllPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8800/api/purchase/allPurchase`)
      .then((res) => {
        console.log(res.data);
        if (res.data.msg != "") setAllPurchases(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("there is something wrong please trying again");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatDate = (dataTimeString) => {
    const date = new Date(dataTimeString);
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
    <div className="col-span-4 row-span-3  relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product name
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
          </tr>
        </thead>
        <tbody>
          {allPurchases.length === 0 ? (
            <tr className="border-b  bg-mybg dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                No purchase were made
              </th>
            </tr>
          ) : (
            allPurchases.map((purchases, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {purchases.Product_name}
                </th>
                <td className="px-6 py-4">{purchases.Quantity}</td>
                <td className="px-6 py-4">{formatDate(purchases.Date)}</td>
                <td className="px-6 py-4">{purchases.Description}</td>
                <td className="px-6 py-4">{purchases.Unit_price} Br</td>
                <td className="px-6 py-4">{purchases.Customer_Name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Purchase;
