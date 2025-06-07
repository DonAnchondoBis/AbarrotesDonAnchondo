'use client'

import React from 'react'
import styled from 'styled-components'

const getClassPrefixer = (prefix) => (name) => `${prefix}-${name}`
const classes = getClassPrefixer('SalesPage')

const Container = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  [`& .${classes('tableGeneral')}`]: {
    width: '100%',
    borderCollapse: 'collapse',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    margin: '0rem 3.5rem'
  },
  [`& .${classes('headerCell')}`]: {
    borderBottom: '2px solid #7A5C40',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '16px',
    backgroundColor: '#D9C3AA',
  },
  [`& .${classes('cell')}`]: {
    padding: '1.4rem 1rem',
    borderBottom: '1px solid #7A5C40',
    backgroundColor: '#D9C3AA',
  },
  [`& .${classes('noData')}`]: {
    padding: '16px',
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'black',
  },
}))

const Table = ({ type, data = [] }) => {
  return (
    <Container>
      <table className={classes('tableGeneral')}>
        <thead>
          <tr>
            {type === 'goodsReceipt' && (
              <>
                <th className={classes('headerCell')}>Product</th>
                <th className={classes('headerCell')}>Quantity</th>
                <th className={classes('headerCell')}>Date</th>
              </>
            )}
            {type === 'suppliers' && (
              <>
                <th className={classes('headerCell')}>Name</th>
                <th className={classes('headerCell')}>Gmail</th>
                <th className={classes('headerCell')}>Number</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className={classes('noData')} colSpan={3}>
                No hay datos para mostrar.
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? classes('evenRow') : classes('oddRow')}
              >
                {type === 'goodsReceipt' && (
                  <>
                    <td className={classes('cell')}>{item.product}</td>
                    <td className={classes('cell')}>{item.quantity}</td>
                    <td className={classes('cell')}>{item.date}</td>
                  </>
                )}
                {type === 'suppliers' && (
                  <>
                    <td className={classes('cell')}>{item.name}</td>
                    <td className={classes('cell')}>{item.email}</td>
                    <td className={classes('cell')}>{item.number}</td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Container>
  )
}

export default Table
