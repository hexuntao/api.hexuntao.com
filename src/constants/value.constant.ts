/**
 * @file Value constant
 * @module constant/value

 */

export const NULL = null
export const UNDEFINED = void 0

export const isNull = (value) => value === NULL
export const isUndefined = (value) => value === UNDEFINED
export const isVoid = (value) => isNull(value) || isUndefined(value)
