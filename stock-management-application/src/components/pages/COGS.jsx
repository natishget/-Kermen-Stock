import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
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
import NotFound from "@/assets/2480259.jpg";

const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const COGS = () => {
  const [financialData, setFinancialData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BackEndURL}/auth/protectedRoute`, {
          withCredentials: true,
        });

        setIsAdmin(response?.data?.user?.userType === "admin" ? true : false);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.message);
        } else if (error.request) {
          alert("No response from server. Please try again.");
        } else {
          alert("Error: " + error.message);
        }
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${BackEndURL}/financial/financialData`,
          {
            params: { startDate: "2024-01-01", endDate: "2024-12-31" },
            withCredentials: true,
          }
        );
        setFinancialData(response.data.message);
      } catch (error) {
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
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "PID", //access nested data with dot notation
        header: "Product ID",
        size: 110,
      },
      {
        accessorKey: "ProductName",
        header: "Product Name",
        size: 70,
      },
      {
        accessorKey: "TotalQuantity", //normal accessorKey
        header: "Total Quantity",
        size: 190,
        // Format the date using the formatDate function
      },
      {
        accessorKey: "Color",
        header: "Color",
        size: 150,
      },
      {
        accessorKey: "isImported",
        header: "Imported",
        size: 70,
        Cell: ({ cell }) => (cell.getValue() === 1 ? "YES" : "NO"),
      },
      {
        accessorKey: "TotalCost",
        header: "Total Cost",
        size: 70,
      },
      {
        accessorKey: "WeightedAvgCostPerUnit",
        header: "Weighted Avg. Cost/Unit",
        size: 110,
      },
      {
        accessorKey: "SalePricePerUnit",
        header: "Sale Price/Unit",
        size: 70,
      },
      {
        accessorKey: "COGS",
        header: "COGS(FIFO)",
        size: 70,
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

  if (!isAdmin) {
    return (
      <div className="w-full mt-10 relative overflow-x-auto overflow-hidden no-scrollbar hover:overflow-y-scroll">
        <img src={NotFound} alt="not found image" />
      </div>
    );
  }

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
          <span className="text-red-500">Financial</span> Data
        </h1>
        <div className="bg-black">
          <ThemeProvider theme={tableTheme}>
            <MaterialReactTable
              columns={columns}
              data={financialData}
              enableColumnOrdering
              enableColumnPinning
              // enableRowActions
              // positionActionsColumn={`last`}
              // renderRowActions={({ row, table }) => (
              //   <Box
              //     sx={{
              //       display: "flex",
              //       flexWrap: "nowrap",
              //       gap: "8px",
              //     }}
              //   ></Box>
              // )}
            />
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default COGS;
