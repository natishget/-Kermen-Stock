import React, { useEffect, useState, useMemo } from "react";
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
import DialogForPurchaseEdit from "../DialogBox/DialogForPurchaseEdit";

// enviroment variable
const BackEndURL = process.env.VITE_BACKEND_URL;

const Purchase = () => {
  const [allPurchases, setAllPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        header: "Purchase Date",
        size: 190,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: "Description",
        header: "Description",
        size: 150,
      },
      {
        accessorKey: "Unit_Price",
        header: "Unit Price",
        size: 70,
      },
      {
        accessorKey: "Color",
        header: "Color",
        size: 70,
      },
      {
        accessorKey: "isImported",
        header: "Is Imported",
        size: 70,
      },
      {
        accessorKey: "Seller",
        header: "Seller",
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
                ? "rgb(22,32,42,255)" //random light yellow color for the background in light mode
                : "#000", //pure black table in dark mode for fun
          },
          text: {
            primary: "#c0c2be",
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
                color: "#d9d4c5", // Custom color for icons like filter
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

  useEffect(() => {
    axios
      .get(`${BackEndURL}/purchase/allPurchase`)
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

  const handleDeletePurchase = async (PIID) => {
    const data = {
      PIID: PIID,
    };
    try {
      const response = await axios.post(
        `${BackEndURL}/purchase/deletePurchase`,
        data
      );
      alert("Purchase Deleted");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const formatDate = (dataTimeString) => {
    const date = new Date(dataTimeString);
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
    <div className="col-span-4 row-span-3 overflow-hidden no-scrollbar hover:overflow-y-scroll  relative overflow-x-auto">
      <ThemeProvider theme={tableTheme}>
        <MaterialReactTable
          columns={columns}
          data={allPurchases}
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
                onClick={() => {
                  handleDeletePurchase(row.original.PIID);
                }}
              >
                <DialogForPurchaseEdit PurchaseData={row.original} />
                <DeleteIcon sx={{ color: "#d44c3d" }} />
              </IconButton>
            </Box>
          )}
        />
      </ThemeProvider>
    </div>
  );
};

export default Purchase;
