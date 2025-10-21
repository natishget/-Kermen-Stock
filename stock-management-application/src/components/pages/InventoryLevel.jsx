import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import { Box, IconButton } from "@mui/material";

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const InventoryLevel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [inventoryLevel, setInventoryLevel] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BackEndURL}/inventory/inventoryLevel`
        );
        console.log(response.data);
        if (response.data.msg !== "") setInventoryLevel(response.data);
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

  const formatDate = (dataTimeString) => {
    const date = new Date(dataTimeString);
    return date.toLocaleDateString();
  };

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
        header: "Updated Date",
        size: 190,
        Cell: ({ cell }) => formatDate(cell.getValue()), // Format the date using the formatDate function
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
                ? "rgba(255, 255, 255,1)" //random light yellow color for the background in light mode
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

  if (isLoading)
    return (
      <div className="flex w-full h-full justify-center items-center px-6 py-4 font-medium text-2xl text-gray-900 whitespace-nowrap dark:text-white">
        Loading...
      </div>
    );

  return (
    <>
      <div className="w-full mt-10 relative overflow-x-auto overflow-hidden no-scrollbar hover:overflow-y-scroll">
        <h1 className="text-gray-600 font-bold text-4xl"><span className="text-blue-500">Inventory</span> Level</h1>
        <div className="bg-black">
          <ThemeProvider theme={tableTheme}>
            <MaterialReactTable
              columns={columns}
              data={inventoryLevel}
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
                ></Box>
              )}
            />
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default InventoryLevel;
