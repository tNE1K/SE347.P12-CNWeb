import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';

export default function StatisticTable() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'label', headerName: 'Statistic', width: 200 },
    { field: 'value', headerName: 'Value', width: 150 },
  ];

  const rows = [
    { id: 1, label: 'Total Users', value: 120 },
    { id: 3, label: 'Total Courses', value: 15 },
    { id: 8, label: 'Revenue Generated', value: '$3000' },
    { id: 11, label: 'Teachers', value: 10 }
  ];

  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pagination pageSizeOptions={[10,10]} />
    </Paper>
  );
}