'use client';

import React, { createContext, useContext, useState, PropsWithChildren } from 'react';

interface VerificationState {
  specialization: string;
  yearsOfExperience: string;
  hospitalName: string;
  address: string;
  city: string;
  state: string;
  passportPhoto: File | null;
  nin: string;
  medicalDegree: File | null;
  mdcnLicense: File | null;
}

interface VerificationContextType {
  state: VerificationState;
  updateState: (updates: Partial<VerificationState>) => void;
  clearState: () => void;
}

const defaultState: VerificationState = {
  specialization: '',
  yearsOfExperience: '',
  hospitalName: '',
  address: '',
  city: '',
  state: '',
  passportPhoto: null,
  nin: '',
  medicalDegree: null,
  mdcnLicense: null,
};

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<VerificationState>(defaultState);

  const updateState = (updates: Partial<VerificationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const clearState = () => {
    setState(defaultState);
  };

  return (
    <VerificationContext.Provider value={{ state, updateState, clearState }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}
