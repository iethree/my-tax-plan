
export function calculateBracketRevenue(): number {
  return 1;
}

export function calculateCapGainsRevenue(): number {
  return 1;

export function calculatePayrollRevenue(): number {
  return 1;
}

export function calculateTaxRevenue(): number {
  return (
    calculateBracketRevenue() +
    calculateCapGainsRevenue() +
    calculatePayrollRevenue()
  )
}
