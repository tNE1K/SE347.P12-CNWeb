import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const columns: GridColDef[] = [
  { field: "index", headerName: "Index", width: 200 },
  { field: "_id", headerName: "ID", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "role", headerName: "Role", width: 150 },
];

const fetchAllUsers = async () => {
  const response = await axios.get("http://127.0.0.1:5000/admin/get_all_user", {
    withCredentials: true,
  });
  return response.data.data.map((user: any, index: number) => ({
    id: index + 1,
    index: index + 1,
    _id: user._id,
    email: user.email,
    role: user.role,
  }));
};

export default function UserDataTable() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
