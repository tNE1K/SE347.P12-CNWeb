import { fetchAllTeacherRequest } from "@/app/api/admin";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const handleAccept = (id: string) => {
    // Implement the logic to accept the teacher request
    console.log("Accepted:", id);
    // Add your acceptance logic here (e.g., API call)
  };

const handleDecline = (id: string) => {
    // Implement the logic to decline the teacher request
    console.log("Declined:", id);
    // Add your decline logic here (e.g., API call)
  };

const columns: GridColDef[] = [
  { field: "index", headerName: "Index", width: 200 },
  { field: "_id", headerName: "ID", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "role", headerName: "Role", width: 150 },
  {
    field: "actions",
    headerName: "Actions",
    width: 200,
    renderCell: (params) => (
      <div>
        <button onClick={() => handleAccept(params.row._id)}>Accept</button>
        <button onClick={() => handleDecline(params.row._id)}>Decline</button>
      </div>
    ),
  },
];

export default function TeacherRequestTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const onRowClickHandler = (params: any) => {
    const id = params.row._id;
    router.push(`/teacherRequest/${id}`);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllTeacherRequest();
        const formattedData = data.data.map((user: any, index: number) => ({
          id: index + 1,
          index: index + 1,
          _id: user._id,
          email: user.email,
          role: user.role,
        }));
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10]}
        onRowClick={onRowClickHandler}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
