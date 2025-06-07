import React from 'react'

export default function Modal({ children, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
      />
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1010,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            fontSize: '1.5rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </>
  )
}
