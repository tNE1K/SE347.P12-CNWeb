import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { fetchAllUser } from "@/app/api/admin";

const columns: GridColDef[] = [
  { field: "index", headerName: "Index", width: 200 },
  { field: "_id", headerName: "ID", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "role", headerName: "Role", width: 150 }
];

export default function UserDataTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const onRowsSelectionHandler = (ids: any) => {
    // @ts-ignore
    const selectedRowsData = ids.map((id: any) => rows.find((row) => row.id === id));
    console.log(selectedRowsData);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllUser();
        const formattedData = data.data.map((user: any, index: number) => ({
          id: index + 1,
          index: index + 1,
          _id: user._id,
          email: user.email,
          role: user.role
        }));
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);


  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
