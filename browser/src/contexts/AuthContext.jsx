import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '../common/firebase.js';

const AuthContext = createContext();

export function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    console.log('[AuthContext] onAuthStateChanged — subscribing');
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log('[AuthContext] auth state resolved — uid:', u?.uid ?? 'null (not logged in)');
      setUser(u);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, authReady }}>
      {props.children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

AuthProvider.defaultProps = {
  children: null,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
