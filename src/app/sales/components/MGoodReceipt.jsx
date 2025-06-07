'use client'

import React from 'react'
import { styled } from '@mui/material/styles'
import Modal from './Modal'

const classes = {
  container: 'container',
  pOne: 'pOne',
  selectP: 'selectP',
  quan: 'quan',
  pTwo: 'pTwo',
}

const Container = styled('div')(() => ({
  [`& .${classes.pOne}`]: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  [`& .${classes.selectP}, .${classes.quan}`]: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  [`& .${classes.pTwo}`]: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
}))

export default function MGoodReceipt({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <Container className={classes.container}>
        <h2>New Product</h2>
        <form>
          <div className={classes.pOne}>
            <div className={classes.selectP}>
              <label>Select Product</label>
              <input type="text" />
            </div>
            <div className={classes.quan}>
              <label>Quantity</label>
              <input type="number" />
            </div>
          </div>
          <div className={classes.pTwo}>
            <label>Expiration Date</label>
            <input type="date" />
          </div>
        </form>
      </Container>
    </Modal>
  )
}
