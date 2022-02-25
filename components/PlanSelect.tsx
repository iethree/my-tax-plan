import { TaxPlan, TaxScheme } from '@/types/taxTypes';
import useStore from '@/utils/useStore';

export default function PlanSelect() {
  const plans: TaxPlan[] = useStore(state => state.plans);
  const setRates = useStore(state => state.setRates);

  if (!plans.length) {
    return null;
  }

  return (
    <select
      onChange={(e) => {
        setRates(plans.find(plan => plan.id === Number(e.target.value))?.scheme as TaxScheme);
      }}
    >
      {plans.map((plan: TaxPlan) => (
        <option
          key={plan.id}
          value={plan.id}
        >
          {plan.title}
        </option>
      ))}
    </select>
  );
}
