import { TaxPlan } from "@/types/taxTypes";
import useStore from "@/utils/useStore";

export default function PlanSelect() {
  const plans: TaxPlan[] = useStore((state) => state.plans);
  const currentPlanIndex = useStore((state) => state.currentPlanIndex);
  const setCurrentPlanIndex = useStore((state) => state.setCurrentPlanIndex);

  if (!plans.length) {
    return null;
  }

  return (
    <select
      className="w-full"
      value={currentPlanIndex}
      onChange={(e) => setCurrentPlanIndex(Number(e.target.value))}
    >
      {plans.map((plan: TaxPlan, index: number) => (
        <option key={plan.id} value={index}>
          {plan.title}
          {plan.created_at && " ☁️"}
        </option>
      ))}
    </select>
  );
}
