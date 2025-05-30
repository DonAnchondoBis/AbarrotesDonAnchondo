/**
 * Provides translations and adapters for Prisma enumerations,
 * converting them into options usable in the user interface.
 */

import {
  InventoryLogType,
  Role,
  Unit
} from '@prisma/client'

/**
 * Translations for enumeration keys.
 */
const translations = {
  INCREASE: 'Increase',
  DECREASE: 'Decrease',
  INCOME: 'Income',
  SHRINKAGE: 'Shrinkage',
  ADMIN: 'Administrador',
  CASHIER: 'Cashier',
  WAREHOUSE: 'Warehouse',
  KG: 'Kilogram',
  PIECE: 'Piece',
}

/**
 * Converts an enumeration into an array of options with text and value.
 * @param {Object} enums - Enumeration to convert, where the keys are the enumeration values.
 * @returns {Array<{text: string, value: string}>} Array of objects with `text` (translation) and `value` (original key).
 * @example
 * // Example usage:
 * // Input: { MALE: 'MALE', FEMALE: 'FEMALE' }
 * // Output: [{ text: 'Masculino', value: 'MALE' }, { text: 'Femenino', value: 'FEMALE' }]
 */
const enumAdapter = enums => (
  Object.keys(enums).map(key => ({
    label: translations[key] ?? '',
    value: key
  }))
)

export const InventoryLogTypeOptions = enumAdapter(InventoryLogType)
export const RoleOptions = enumAdapter(Role)
export const UnitOptions = enumAdapter(Unit)