import { Navigate } from 'react-router-dom';
import { JSX, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: Props): JSX.Element {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;  // ← aquí el cambio importante
}
