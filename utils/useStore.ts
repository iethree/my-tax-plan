import create from 'zustand';
import { TaxScheme } from '@/types/taxTypes';

import jsonRates from '../data/rates.json';
const defaultRates: TaxScheme = JSON.parse(JSON.stringify(jsonRates));

export default create((set: any) => ({
  rates: defaultRates,
  taxRevenue: 0,
  setRates: (newRates: TaxScheme) => set((state: any) => ({
    rates: ({
      ...state.rates,
      ...newRates,
    })
  })),
  setTaxRevenue: (val: number) => set(() => ({ taxRevenue: val })),
}));
