import { Metadata } from 'next';
import LoginContent from './login-content';

export const metadata: Metadata = {
  title: 'Log In | Clinsight',
  description: 'Log in to your Clinsight doctor dashboard.',
};

export default function LoginPage() {
  return <LoginContent />;
}
