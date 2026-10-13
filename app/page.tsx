import AuthForm from '@/components/auth-form';

interface HomeProps {
  searchParams: { mode?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const formMode = searchParams.mode || 'login';
  return <AuthForm mode={formMode} />;
}