import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
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
import DialogForSalesEdit from "../DialogBox/DialogForSalesEdit";
import { useNavigate } from "react-router-dom";

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const Sales = () => {
  const navigate = useNavigate();
  const [allSales, setAllSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      sessionStorage.getItem("sales") === null ||
      sessionStorage.getItem("sales") === undefined
    ) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BackEndURL}/sales/allSales`, {
            withCredentials: true,
          });
          setAllSales(response.data);
          sessionStorage.setItem("sales", JSON.stringify(response.data));
        } catch (error) {
          console.clear();
          if (error.response) {
            alert(error.response.data.message);
          } else if (error.request) {
            alert("No response from server. Please try again.");
          } else {
            alert("Error: " + error.message);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      const sales = JSON.parse(sessionStorage.getItem("sales"));
      setAllSales(sales);
      setIsLoading(false);
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "Product_name", //access nested data with dot notation
        header: "Product Name",
        size: 110,
      },
      {
        accessorKey: "Quantity",
        header: "Quantity",
        size: 70,
      },
      {
        accessorKey: "Date", //normal accessorKey
        header: "Sales Date",
        size: 190,
        Cell: ({ cell }) => formatDate(cell.getValue()), // Format the date using the formatDate function
      },
      {
        accessorKey: "Description",
        header: "Description",
        size: 150,
      },
      {
        accessorKey: "Unit_price",
        header: "Unit Price",
        size: 70,
      },
      {
        accessorKey: "Total_Price",
        header: "Total Price",
        size: 70,
      },
      {
        accessorKey: "Customer_Name",
        header: "Customer",
        size: 110,
      },
      {
        accessorKey: "Color",
        header: "Color",
        size: 70,
      },
      {
        accessorKey: "isImported",
        header: "Imported",
        size: 70,
        Cell: ({ cell }) => (cell.getValue() === 1 ? "YES" : "NO"),
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
                ? "rgba(255,255, 255,1)" //random light yellow color for the background in light mode
                : "#000", //pure black table in dark mode for fun
          },
          text: {
            primary: "#3b3b3bff",
          },
        },
        typography: {
          button: {
            textTransform: "none", //customize typography styles for all buttons in table by default
            fontSize: "2.2rem",
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
                color: "#d9d4c5", // Custom color for checkboxes (unchecked state)
                "&.Mui-checked": {
                  color: "#1e88e5", // Custom color for checkboxes (checked state)
                },
              },
            },
          },
          MuiIcon: {
            styleOverrides: {
              root: {
                color: "#d9d4c5", // Custom color for icons
              },
            },
          },
          MuiSvgIcon: {
            styleOverrides: {
              root: {
                color: "#000000ff", // Custom color for icons like filter
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

  const handleDeleteSales = async (SID) => {
    console.log("sid", SID);
    const data = {
      SID: SID,
    };
    try {
      const response = await axios.post(
        `${BackEndURL}/sales/deleteSales`,
        data
      );
      sessionStorage.removeItem("sales");
      navigate(0);
      alert("Sales Deleted");
    } catch (error) {
      console.clear();
      alert(error.response.data.message);
    }
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center items-center px-6 py-4 font-medium text-2xl text-gray-500 whitespace-nowrap dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="w-full mt-10 relative overflow-x-auto overflow-hidden no-scrollbar hover:overflow-y-scroll">
        <h1 className="text-gray-600 font-bold text-4xl">
          <span className="text-blue-500">Sales</span> Table
        </h1>
        <div className="bg-black">
          <ThemeProvider theme={tableTheme}>
            <MaterialReactTable
              columns={columns}
              data={allSales}
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
                      setEditedSale({
                        SID: row.original.SID,
                        PID: row.original.PID,
                        Quantity: row.original.Quantity,
                        Unit_price: row.original.Unit_price,
                        Customer_Name: row.original.Customer_Name,
                        Date: row.original.Date,
                        Description: row.original.Description,
                        Color: row.original.Color,
                        isImported: row.original.isImported,
                      });
                    }}
                  >
                    <DialogForSalesEdit
                      salesData={row.original}
                      key={row.original.SID}
                    />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      handleDeleteSales(row.original.SID);
                    }}
                  >
                    <DeleteIcon sx={{ color: "#d44c3d" }} />
                  </IconButton>
                </Box>
              )}
            />
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default Sales;
