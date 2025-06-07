import React from 'react'
import Modal from './Modal'

export default function MSuppliers({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <h2>New Supplier</h2>
      <form>
        <label>
          Nombre:
          <input type="text" name="name" />
        </label>
        <br />
        <label>
          Correo:
          <input type="email" name="email" />
        </label>
        <br />
        <label>
          Teléfono:
          <input type="text" name="phone" />
        </label>
        <br />
        <button type="submit">Guardar</button>
      </form>
    </Modal>
  )
}
