import { useState } from 'react';
import { TaxPlan } from '@/types/taxTypes';
import useStore from '@/utils/useStore';
import LoginScreen from '@/components/LoginScreen';
import { useModal } from '@ebay/nice-modal-react';
import { supabase } from '@/utils/api';
import { newPlan } from '@/constants/taxPlans';
import { User } from '@supabase/supabase-js';
import Spinner from '@/components/Spinner';

export default function PlanSelect() {
  const plans: TaxPlan[] = useStore(state => state.plans);
  const setPlans = useStore(state => state.setPlans);
  const [loading, setLoading] = useState<boolean>(false);

  const currentPlan = useStore(state => state.currentPlan());
  const setCurrentPlan = useStore(state => state.setCurrentPlan);
  const currentPlanIndex = useStore(state => state.currentPlanIndex);
  const setCurrentPlanIndex = useStore(state => state.setCurrentPlanIndex);
  const user: null | User = useStore(state => state.user) as null | User;
  const LoginModal = useModal(LoginScreen);

  const addPlan = () => {
    setPlans([newPlan(), ...plans]);
    setCurrentPlanIndex(0);
  };

  const saveCurrentPlan = async () => {
    if (!user || !user?.id) {
      return;
    }
    setLoading(true);
    const savePlan = { ...currentPlan, user_id: user.id };

    if (!savePlan.created_at) {
      delete savePlan.id;
      delete savePlan.created_at;
    }

    supabase
      .from('tax_plans')
      .upsert([{
        ...savePlan,
      }])
      .then((res) => {
        setLoading(false)
        if (!res.error && res.data.length) {
          const newPlan = res.data[0];
          setCurrentPlan(newPlan);
        }
      });
  };

  const removeLocalPlan = (index: number) => {
    setCurrentPlanIndex(0);
    setPlans(plans.filter((_, i) => i !== index));
  };

  const deleteCurrentPlan = async () => {
    if (currentPlan.created_at) {
      supabase
        .from('tax_plans')
        .delete()
        .match({ id: currentPlan.id })
        .then(() => {
          removeLocalPlan(currentPlanIndex);
        });
    } else {
      removeLocalPlan(currentPlanIndex);
    }
  }

  if (!plans.length) {
    return null;
  }

  return (
    <div className="text-right">
      {!user?.id ? (
        <button id="login-modal" className="button small" onClick={() => LoginModal.show()}>
          <i className="fas fa-right-to-bracket mr-2" />
          Login to save
        </button>
      ) : (
        <>
          <button
            id="save-plan"
            className="button small"
            title="save plan"
            onClick={saveCurrentPlan}
            disabled={loading}
          >
            {!loading
              ? <i className="fas fa-save" />
              : <Spinner className="w-4 h-4" />
            }
          </button>
          <button id="delete-plan" className="button small ml-3" title="delete plan" onClick={deleteCurrentPlan}>
            <i className="fas fa-trash" />
          </button>
          <button id="add-plan" className="button small ml-3" title="add plan" onClick={addPlan}>
            <i className="fas fa-plus" />
          </button>
        </>
      )}
    </div>
  );
}
