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

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const Sales = () => {
  const [allSales, setAllSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editedSale, setEditedSale] = useState({
    SID: "",
    PID: "",
    Quantity: "",
    Unit_price: 10,
    Customer_Name: "natnael",
    Date: "",
    Description: "",
    Color: "",
    isImported: "",
  });
  const [edit, setEdit] = useState({ dere: "43" });

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
        header: "Price",
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
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BackEndURL}/sales/allSales`, {
          withCredentials: true,
        });
        setAllSales(response.data);
      } catch (error) {
        console.log(error.response.data.msg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditedSale = (e) => {
    const { name, value } = e.target;
    setEditedSale({ ...editedSale, [name]: value });
  };

  const handleChange = (e) => {
    setEdit({ ...edit, [e.target.name]: e.target.value });
    console.log(e.target.name + e.target.value + "\n" + edit);
  };

  const handleEditSales = async () => {
    try {
      const response = axios.post(
        `${BackEndURL}/sales/updateSales`,
        editedSale
      );
      alert("Sales Updated");
    } catch (error) {
      alert(error.message);
    }
  };

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
      alert("Sales Deleted");
    } catch (error) {
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
      <div className="col-span-4 row-span-3 relative overflow-x-auto overflow-hidden no-scrollbar hover:overflow-y-scroll">
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
                      console.log(row.original);
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
                    <DialogForSalesEdit salesData={row.original} />
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
