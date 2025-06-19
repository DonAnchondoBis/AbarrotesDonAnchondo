'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Menu,
  MenuItem,
  TablePagination,
  InputAdornment,
  Button,
  OutlinedInput
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Table from './components/Table'; // asegúrate que tu archivo se llama Table.jsx
import EditProductModal from './components/EditProductModal';
import DeleteProductModal from './components/DeleteProductModal';
import WasteModal from './components/WasteModal';
import AdjustmentModal from './components/AdjustmentModal';
import { styled } from '@mui/material/styles';

const StyledInput = styled(OutlinedInput)(({ theme }) => ({
  minWidth: '250px',
  marginLeft: '1rem',
  backgroundColor: theme.palette.contrast.main,
  height: '48px',
  '& input::placeholder': {
    color: theme.palette.background.main,
    opacity: 0.7
  },
  '& .MuiInputBase-input': {
    color: theme.palette.background.main,
  }
}));

export default function InventoryPage() {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [wasteOpen, setWasteOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0); // reset page to 0 on new search
  };

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(index);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEditSave = (updatedProduct) => {
    const updatedRows = [...rows];
    updatedRows[selectedRow] = updatedProduct;
    setRows(updatedRows);
  };

  const handleDelete = () => {
    const updatedRows = [...rows];
    updatedRows.splice(selectedRow, 1);
    setRows(updatedRows);
    setDeleteOpen(false);
  };

  const handleRegisterWaste = (data) => {
    console.log('Registered waste:', data);
  };

  const handleAdjustment = (newStock) => {
    if (selectedRow !== null) {
      const updatedRows = [...rows];
      updatedRows[selectedRow].stock = newStock;
      setRows(updatedRows);
    }
    setAdjustOpen(false);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Aplicar filtro por nombre
  const filteredRows = rows.filter(row =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ bgcolor: '#FEF7E5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h6" sx={{ color: '#1F1F1F', fontWeight: 'bold' }}>
            Inventory
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StyledInput
              placeholder="Search by name"
              size="small"
              value={search}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon color="background" />
                </InputAdornment>
              }
            />

            <Button
              variant="contained"
              size="medium"
              sx={{
                height: '48px',
                width: '250px',
                bgcolor: '#5A7D2A',
                color: 'white',
                boxShadow: 3,
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#4C681F'
                }
              }}
              onClick={() => {
                setSelectedRow(null);
                setEditOpen(true);
              }}
            >
              + Add Product
            </Button>
          </Box>
        </Box>

        <Table rows={paginatedRows} onMenuClick={handleMenuClick} />

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Products per page"
        />

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => { setEditOpen(true); handleMenuClose(); }}>Edit</MenuItem>
          <MenuItem onClick={() => { setDeleteOpen(true); handleMenuClose(); }}>Delete</MenuItem>
          <MenuItem onClick={() => { setWasteOpen(true); handleMenuClose(); }}>Register Waste</MenuItem>
          <MenuItem onClick={() => { setAdjustOpen(true); handleMenuClose(); }}>Inventory Adjustment</MenuItem>
        </Menu>

        <EditProductModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          product={selectedRow !== null ? rows[selectedRow] : null}
          onSave={(data) => {
            if (selectedRow !== null) {
              handleEditSave(data);
            } else {
              setRows([...rows, data]);
            }
          }}
        />

        <DeleteProductModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onDelete={handleDelete}
        />

        <WasteModal
          open={wasteOpen}
          onClose={() => setWasteOpen(false)}
          onRegister={handleRegisterWaste}
        />

        <AdjustmentModal
          open={adjustOpen}
          onClose={() => setAdjustOpen(false)}
          onAdjust={handleAdjustment}
          product={selectedRow !== null ? rows[selectedRow] : null}
        />
      </Container>
    </Box>
  );
}
