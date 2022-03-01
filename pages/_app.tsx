import { useEffect } from 'react';
import '../styles/globals.css'
import Layout from '../components/Layout'
import type { AppProps } from 'next/app'
import NiceModal from '@ebay/nice-modal-react';
import useStore, { getLocalPlans } from '@/utils/useStore';
import { supabase } from '@/utils/api';
import { User } from '@supabase/supabase-js';
import { newPlan } from '@/constants/taxPlans';

function MyApp({ Component, pageProps }: AppProps) {
  const updateUser = useStore(state => state.updateUser);
  const user = useStore<null|User>(state => state.user);
  const setPlans = useStore(state => state.setPlans);
  const setCurrentPlanIndex = useStore(state => state.setCurrentPlanIndex);

  useEffect(() => {
    updateUser();
    supabase.auth.onAuthStateChange(() => {
      updateUser();
      setCurrentPlanIndex(0);
    });
  }, [updateUser, setCurrentPlanIndex]);

  // load plans from api and/or local storage
  useEffect(() => {
    const localPlans = getLocalPlans();

    if (user?.id) {
      supabase
        .from('tax_plans')
        .select()
        .eq('user_id', user?.id)
        .then((res) => {
          if (res?.data?.length) {
            setPlans([
              ...res.data,
              ...localPlans,
            ]);
          } else if (localPlans.length) {
            setPlans(localPlans);
          } else {
            setPlans([newPlan()]);
          }
        });
    } else {
      if (localPlans.length) {
        setPlans(localPlans);
      } else {
        setPlans([newPlan()]);
      }
    }
  }, [user, setPlans]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NiceModal.Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NiceModal.Provider>
  );
}

export default MyApp;
