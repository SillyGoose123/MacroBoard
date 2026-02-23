export interface MouseReport {
  buttons: number //unsinged
  x: number,
  y: number,
  wheel: number, // Scroll down (negative) or up (positive) this many units
  pan: number    // Scroll left (negative) or right (positive) this many units
}