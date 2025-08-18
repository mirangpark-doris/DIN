import React, { createContext, useContext, useState } from 'react';

interface BeginnerContextType {
  beginner: boolean;
  toggle: () => void;
}

const BeginnerContext = createContext<BeginnerContextType>({ 
  beginner: false, 
  toggle: () => {} 
});

export const useBeginnerMode = () => useContext(BeginnerContext);

interface BeginnerProviderProps {
  children: React.ReactNode;
}

export const BeginnerProvider: React.FC<BeginnerProviderProps> = ({ children }) => {
  const [beginner, setBeginner] = useState(true);

  const toggle = () => setBeginner(b => !b);

  return (
    <BeginnerContext.Provider value={{ beginner, toggle }}>
      {children}
    </BeginnerContext.Provider>
  );
};
