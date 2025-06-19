'use client';

import React from 'react';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const getClassPrefixer = (prefix) => (name) => `${prefix}-${name}`;
const classes = getClassPrefixer('InventoryTable');

const Container = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  [`& .${classes('table')}`]: {
    width: '100%',
    borderCollapse: 'collapse',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: '2rem',
  },
  [`& .${classes('headerCell')}`]: {
    borderBottom: '2px solid #7A5C40',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '16px',
    backgroundColor: '#D9C3AA',
  },
  [`& .${classes('cell')}`]: {
    padding: '1.2rem 1rem',
    borderBottom: '1px solid #7A5C40',
    backgroundColor: '#FEF7E5',
    textAlign: 'center',
  },
  [`& .${classes('actionCell')}`]: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
  },
  [`& .${classes('noData')}`]: {
    padding: '16px',
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'black',
  },
}));

const Table = ({ rows, onMenuClick }) => {
  return (
    <Container>
      <table className={classes('table')}>
        <thead>
          <tr>
            {['SKU', 'Product', 'Unit', 'Stock', 'Price'].map((header) => (
              <th key={header} className={classes('headerCell')}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className={classes('noData')}>
                No hay productos en el inventario.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                <td className={classes('cell')}>{row.sku}</td>
                <td className={classes('cell')}>{row.name}</td>
                <td className={classes('cell')}>{row.unit}</td>
                <td className={classes('cell')}>{row.stock}</td>
                <td className={classes('cell')}>
                  {row.price}
                  <IconButton
                    onClick={(e) => onMenuClick(e, index)}
                    size="small"
                    sx={{ marginLeft: '0.5rem' }}
                  >
                    <MoreVertIcon sx={{ color: '#7A5C40' }} />
                  </IconButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Container>
  );
};

export default Table;
