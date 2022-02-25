import { useEffect } from 'react';
import { supabase } from '../utils/api';
import useStore from '../utils/useStore';
import '../styles/globals.css'
import Layout from '../components/Layout'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp
