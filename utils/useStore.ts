import create from 'zustand';
import { TaxPlan, TaxScheme } from '@/types/taxTypes';
import { newPlan } from '@/constants/taxPlans';
import { supabase } from '@/utils/api';

export const saveLocalPlans = (plans: TaxPlan[]) => {
  const localPlans = plans.filter(plan => !plan.created_at);
  localStorage.setItem('myPlans', JSON.stringify(localPlans));
};

export const getLocalPlans = () => {
  let localPlans: TaxPlan[] = [];
  try {
    localPlans = JSON.parse(localStorage.getItem('myPlans') || '') as TaxPlan[];
  } catch (e) {
    localPlans = [];
  }
  return localPlans;
};

const appState = create((set: any, get: any) => ({
  plans: [newPlan()],
  currentPlanIndex: 0,
  user: null,
  taxRevenue: 0,
  setCurrentPlanIndex: (index: number) => set({ currentPlanIndex: index }),
  currentPlan: () => {
    return get().plans[get().currentPlanIndex];
  },
  setCurrentPlan: (plan: TaxPlan) => {
    const newPlans = [...get().plans];
    newPlans[get().currentPlanIndex] = plan;
    set({ plans: newPlans });
    saveLocalPlans(newPlans);
  },
  setRates: (newRates: TaxScheme) => {
    const newPlans = [...get().plans];
    newPlans[get().currentPlanIndex].scheme = newRates;
    set({ plans: newPlans });
    saveLocalPlans(newPlans);
  },
  setTaxRevenue: (val: number) => set({ taxRevenue: val }),
  setPlans: (newPlans: TaxPlan[]) => {
    set({ plans: newPlans });
    saveLocalPlans(newPlans);
  },
  updateUser: () => set({ user: supabase.auth.user() }),
}));

export default appState;
