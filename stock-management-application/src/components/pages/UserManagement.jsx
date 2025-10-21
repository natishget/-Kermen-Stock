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

const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const UserManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "User_Name", //access nested data with dot notation
        header: " Username",
        size: 110,
      },
      {
        accessorKey: "Email",
        header: "email",
        size: 190,
      },
      {
        accessorKey: "User_Type", //normal accessorKey
        header: "User Type",
        size: 190,
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
                ? "rgba(255,255,255,1)" //random light yellow color for the background in light mode
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
                color: "#4d4d4dff", // Custom color for search icon in input fields
              },
            },
          },
        },
      }),
    [globalTheme]
  );

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching all users");
      setIsLoading(true);
      try {
        const response = await axios.get(`${BackEndURL}/user/getAllUsers`, {
          withCredentials: true,
        });
        // console.log("user data", response);
        setUserData(response.data);
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

  return (
    <div className="w-full mt-10 relative overflow-x-auto overflow-hidden no-scrollbar hover:overflow-y-scroll">
      <h1 className="text-gray-600 font-bold text-4xl">
        <span className="text-yellow-500">User</span> Management
      </h1>
      <ThemeProvider theme={tableTheme}>
        <MaterialReactTable
          columns={columns}
          data={userData}
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
                  // setEditedSale({
                  //   PID: row.original.PID,
                  //   Quantity: row.original.Quantity,
                  //   Unit_price: row.original.Unit_price,
                  //   Customer_Name: row.original.Customer_Name,
                  //   Date: row.original.Date,
                  //   Description: row.original.Description,
                  // });
                }}
              ></IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  // handleDeletePurchase(row.original.PIID);
                }}
              >
                {/* <DialogForPurchaseEdit
                // PurchaseData={row.original}
                /> */}
                <DeleteIcon sx={{ color: "#d44c3d" }} />
              </IconButton>
            </Box>
          )}
        />
      </ThemeProvider>
    </div>
  );
};

export default UserManagement;
