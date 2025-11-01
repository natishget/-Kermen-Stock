import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Table, // New: Standard MUI Table
  TableBody, // New
  TableCell, // New
  TableContainer, // New
  TableHead, // New
  TableRow, // New
  Paper, // New
  TablePagination, // New
  createTheme,
  ThemeProvider,
  useTheme,
  Box,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DialogForSalesEdit from "../DialogBox/DialogForSalesEdit";

// --- Mock Component for Compilation ---
// This mock replaces the external component and uses an IconButton as a trigger.

// -------------------------------------
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const Sales = () => {
  const navigate = useNavigate();
  const [allSales, setAllSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- REVERTED STATE for standard MUI TablePagination ---
  const [page, setPage] = useState(0); // 0-indexed page for MUI
  const [rowsPerPage, setRowsPerPage] = useState(10); // Matches your backend default limit

  // State for pagination metadata from the server
  const [totalCount, setTotalCount] = useState(0);

  // Function to fetch data from the backend
  const fetchData = async () => {
    setIsLoading(true);

    try {
      // Use the simpler state variables for the fetch
      const serverPage = page + 1;
      const limit = rowsPerPage;

      const response = await axios.get(`${BackEndURL}/sales/allSales`, {
        params: {
          page: serverPage,
          limit: limit,
        },
        withCredentials: true,
      });

      // Backend response structure: { data: [...], pagination: {...} }
      setAllSales(response.data.data);
      setTotalCount(response.data.pagination.totalCount);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      // Removed alert, using console.error for less intrusive error handling
    } finally {
      setIsLoading(false);
    }
  };

  // The useEffect hook now depends on the combined 'page' and 'rowsPerPage' state
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, BackEndURL]); // Include dependencies

  // --- RE-IMPLEMENTED HANDLERS for standard MUI TablePagination ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page (0) whenever the limit changes
  };
  // -------------------------------------------------------------

  const columns = useMemo(
    () => [
      { accessorKey: "Product_name", header: "Product Name", size: 110 },
      { accessorKey: "Quantity", header: "Quantity", size: 70 },
      {
        accessorKey: "Date",
        header: "Sales Date",
        size: 190,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      { accessorKey: "Description", header: "Description", size: 150 },
      { accessorKey: "Unit_price", header: "Unit Price", size: 70 },
      { accessorKey: "Total_Price", header: "Total Price", size: 70 },
      { accessorKey: "Customer_Name", header: "Customer", size: 110 },
      { accessorKey: "Color", header: "Color", size: 70 },
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
          mode: globalTheme.palette.mode,
          primary: globalTheme.palette.secondary,
          delete: globalTheme.palette.success,
          info: {
            main: "rgb(255,122,0)",
          },
          background: {
            default:
              globalTheme.palette.mode === "light"
                ? "rgba(255,255, 255,1)"
                : "#000",
          },
          text: {
            primary: "#3b3b3bff",
          },
        },
        typography: {
          button: {
            textTransform: "none",
            fontSize: "1rem",
          },
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "1.1rem",
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              thumb: {
                color: "pink",
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: "#d9d4c5",
                "&.Mui-checked": {
                  color: "#1e88e5",
                },
              },
            },
          },
          MuiIcon: {
            styleOverrides: {
              root: {
                color: "#d9d4c5",
              },
            },
          },
          MuiSvgIcon: {
            styleOverrides: {
              root: {
                color: "#000000ff",
              },
            },
          },
          MuiInputAdornment: {
            styleOverrides: {
              root: {
                color: "#000",
              },
            },
          },
        },
      }),
    [globalTheme]
  );

  const handleDeleteSales = async (SID) => {
    console.log("Deleting sales SID:", SID);
    const data = {
      SID: SID,
    };
    try {
      await axios.post(`${BackEndURL}/sales/deleteSales`, data);
      fetchData();
      console.log("Sales Deleted");
    } catch (error) {
      console.error(
        "Error deleting sales:",
        error.response?.data?.message || error.message
      );
    }
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    return date.toLocaleDateString();
  };

  if (isLoading && allSales.length === 0) {
    return (
      <div className="flex w-full h-full justify-center items-center px-6 py-4 font-medium text-2xl text-gray-500 whitespace-nowrap dark:text-white">
        Loading...
      </div>
    );
  }

  // Calculate the total number of columns for the TableCell span in the footer
  const totalColumns = columns.length + 1; // +1 for the Actions column

  return (
    <>
      <div className="w-full mt-10 relative overflow-x-auto overflow-hidden no-scrollbar hover:overflow-y-scroll">
        <h1 className="text-gray-600 font-bold text-4xl">
          <span className="text-blue-500">Sales</span> Table
        </h1>
        {/* ADDED: Explicitly display the total count from the backend */}
        <p className="text-gray-500 text-sm mt-2 mb-4">
          Total Sales Records Found:{" "}
          <span className="font-semibold text-blue-600">{totalCount}</span>
        </p>
        {/* END ADDED BLOCK */}
        <div className="bg-black">
          <ThemeProvider theme={tableTheme}>
            {/* Standard MUI Table Implementation */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="sales table">
                {/* Table Header */}
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.accessorKey}
                        sx={{ fontWeight: "bold", minWidth: column.size }}
                      >
                        {column.header}
                      </TableCell>
                    ))}
                    {/* Header for Actions Column */}
                    <TableCell
                      sx={{ fontWeight: "bold", minWidth: 100 }}
                      align="center"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                  {allSales.map((row, index) => (
                    <TableRow
                      key={row.SID || index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.accessorKey}>
                          {/* Render content based on column definition, similar to how MRT's Cell works */}
                          {column.Cell
                            ? column.Cell({
                                cell: {
                                  getValue: () => row[column.accessorKey],
                                },
                              })
                            : row[column.accessorKey]}
                        </TableCell>
                      ))}

                      {/* Actions Cell - Reusing the renderRowActions logic */}
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "nowrap",
                            gap: "8px",
                            justifyContent: "center",
                          }}
                        >
                          <DialogForSalesEdit
                            salesData={row}
                            key={row.SID}
                            onUpdate={fetchData}
                          />
                          <IconButton
                            color="error"
                            onClick={() => {
                              handleDeleteSales(row.SID);
                            }}
                          >
                            <DeleteIcon sx={{ color: "#d44c3d" }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Fallback for no data */}
                  {allSales.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={totalColumns} align="center">
                        No sales data available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

                {/* Table Footer with Pagination */}
                <TableBody>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      colSpan={totalColumns}
                      count={totalCount}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default Sales;
