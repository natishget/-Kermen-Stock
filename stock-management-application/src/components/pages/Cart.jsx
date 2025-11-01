// src/components/CartPage.js
import React, { useContext, useMemo, useEffect, useState } from "react";
import { CartContext } from "../CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import { Box, IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const Cart = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const [isQuotation, setIsQuotation] = useState(true);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BackEndURL}/sales/makeSales`, cart);
      setIsQuotation(false);
      generatePDF(cart);
      clearCart();
      sessionStorage.removeItem("sales");
      alert(response.data.message);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error);
      } else if (error.request) {
        alert("No response from server. Please try again.");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  const generatePDF = (cart) => {
    const doc = new jsPDF();
    let count = 0;
    if (cart.length === 0) {
      return alert("Cart is Empty!!!");
    }
    autoTable(doc, {
      head: [["No", "Product ID", "Quantity", "Color", "Imported", "Date"]],
      body: cart.map((item) => [
        ++count,
        item.product_id,
        item.quantity,
        item.color,
        item.imported ? "Yes" : "No",
        item.date,
      ]),
    });

    doc.save(isQuotation ? "Quotation.pdf" : "Sales.pdf");
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "product_id", //access nested data with dot notation
        header: "Product Name",
        size: 110,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        size: 70,
      },
      {
        accessorKey: "date", //normal accessorKey
        header: "Purchase Date",
        size: 190,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 150,
      },
      {
        accessorKey: "unit_price",
        header: "Unit Price",
        size: 70,
      },
      {
        accessorKey: "color",
        header: "Color",
        size: 70,
      },
      {
        accessorKey: "isimported",
        header: "Is Imported",
        size: 70,
      },
      {
        accessorKey: "customer",
        header: "Customer",
        size: 110,
      },
    ],
    []
  );

  const globalTheme = useTheme();

  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: globalTheme.palette.mode, //let's use the same dark/light mode as the global theme
          primary: globalTheme.palette.secondary, //swap in the secondary color as the primary for the table
          delete: globalTheme.palette.success,
          info: {
            main: "rgb(255,122,0)", //add in a custom color for the toolbar alert background stuff
          },
          background: {
            default:
              globalTheme.palette.mode === "light"
                ? "rgba(255, 255, 255, 1)" //random light yellow color for the background in light mode
                : "#000", //pure black table in dark mode for fun
          },
          text: {
            primary: "#3b3b3bff",
          },
        },
        typography: {
          button: {
            textTransform: "none", //customize typography styles for all buttons in table by default
            fontSize: "1.2rem",
          },
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "1.1rem", //override to make tooltip font size larger
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              thumb: {
                color: "pink", //change the color of the switch thumb in the columns show/hide menu to pink
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: "#4d4d4dff", // Custom color for checkboxes (unchecked state)
                "&.Mui-checked": {
                  color: "#1e88e5", // Custom color for checkboxes (checked state)
                },
              },
            },
          },
          MuiIcon: {
            styleOverrides: {
              root: {
                color: "#4d4d4dff", // Custom color for icons
              },
            },
          },
          MuiSvgIcon: {
            styleOverrides: {
              root: {
                color: "#4d4d4dff", // Custom color for icons like filter
              },
            },
          },
          MuiInputAdornment: {
            styleOverrides: {
              root: {
                color: "#000", // Custom color for search icon in input fields
              },
            },
          },
        },
      }),
    [globalTheme]
  );

  const formatDate = (dataTimeString) => {
    const date = new Date(dataTimeString);
    return date.toLocaleDateString();
  };

  return (
    <div className=" w-full mb-16 col-span-4 row-span-3 overflow-hidden md:no-scrollbar hover:overflow-y-scroll justify-center items-center">
      <div className="flex justify-between items-center m-4">
        <h2 className="text-2xl font-bold my-4 text-gray-600">
          {isQuotation ? "Quotation" : "Sales"}{" "}
        </h2>
        <div>
          <button
            className="border py-2 px-3 rounded mr-3 hover:bg-gray-700 bg-gray-800 font-bold"
            onClick={handleSubmit}
          >
            Create Sales
          </button>
          <button
            className="border py-2 px-3 rounded hover:bg-gray-700 bg-gray-800 font-bold"
            onClick={() => generatePDF(cart)}
          >
            Create Quotation
          </button>
        </div>
      </div>
      {cart.length === 0 ? (
        <p className="text-gray-600 text-lg">No items in the cart</p>
      ) : (
        <ThemeProvider theme={tableTheme}>
          <MaterialReactTable
            columns={columns}
            data={cart}
            enableColumnOrdering
            enableColumnPinning
            enableRowActions
            positionActionsColumn={`last`}
            renderRowActions={({ row, table }) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: "8px",
                }}
              >
                <IconButton
                  sx={{ color: "#1e88e5" }}
                  onClick={() => {
                    console.log(row.original);
                    setEditedSale({
                      PID: row.original.PID,
                      Quantity: row.original.Quantity,
                      Unit_price: row.original.Unit_price,
                      Customer_Name: row.original.Customer_Name,
                      Date: row.original.Date,
                      Description: row.original.Description,
                    });
                  }}
                ></IconButton>
                <IconButton
                  color="error"
                  // onClick={() => {
                  //   handleDeletePurchase(row.original.PIID);
                  // }}
                >
                  {/* <DialogForPurchaseEdit PurchaseData={row.original} /> */}
                  <DeleteIcon sx={{ color: "#d44c3d" }} />
                </IconButton>
              </Box>
            )}
          />
        </ThemeProvider>
      )}
    </div>
  );
};

export default Cart;
