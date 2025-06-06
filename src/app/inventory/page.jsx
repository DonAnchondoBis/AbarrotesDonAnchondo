// page.jsx
'use client';

import React, { useState } from 'react';
import {
  Box, Button, Container, InputBase, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, IconButton, Menu, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import EditProductModal from './components/EditProductModal';
import DeleteProductModal from './components/DeleteProductModal';
import WasteModal from './components/WasteModal';
import AdjustmentModal from './components/AdjustmentModal';

export default function InventoryPage() {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [wasteOpen, setWasteOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

  const handleRegisterWaste = (quantity) => {
    alert(`Registered waste: ${quantity} units`);
  };

  const handleAdjustment = (newStock) => {
    if (selectedRow !== null) {
      const updatedRows = [...rows];
      updatedRows[selectedRow].stock = newStock;
      setRows(updatedRows);
    }
    setAdjustOpen(false);
  };

  return (
    <Box sx={{ bgcolor: '#FEF7E5', minHeight: '100vh', p: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#1F1F1F', fontWeight: 'bold' }}>
            Inventory
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Paper
              component="form"
              sx={{
                display: 'flex', alignItems: 'center', width: 320, height: 48,
                p: '2px 8px', bgcolor: '#B19A7B', color: '#fff', borderRadius: '24px', boxShadow: 3
              }}
            >
              <InputBase placeholder="Search product" sx={{ ml: 1, flex: 1, color: 'white' }} />
              <IconButton type="submit" sx={{ p: '10px', color: 'white' }}>
                <SearchIcon />
              </IconButton>
            </Paper>

            <Button
              variant="contained"
              sx={{ width: 300, height: 48, bgcolor: '#84c27c', textTransform: 'none', borderRadius: '24px', boxShadow: 3 }}
              onClick={() => { setSelectedRow(null); setEditOpen(true); }}
            >
              + Add Product
            </Button>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ mt: 2, backgroundColor: '#D4B08C', border: '2px solid #7A5C40', borderRadius: '8px' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Unit</strong></TableCell>
                <TableCell><strong>Stock</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell align="right">...</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.sku}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.stock}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, index)}>
                      <MoreVertIcon sx={{ color: '#7A5C40' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
