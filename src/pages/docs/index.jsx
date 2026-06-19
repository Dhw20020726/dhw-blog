import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function DocsIndex() {
  const defaultDocPath = useBaseUrl('/docs/category/angular');
  useEffect(() => { window.location.replace(defaultDocPath); }, [defaultDocPath]);
  return <Layout title="Redirecting"><main style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Redirecting...</main></Layout>;
}
