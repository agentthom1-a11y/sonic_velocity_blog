'use client';

import React from 'react';
import { AIProducerBot } from './AIProducerBot';
import { useAppContext } from './AppContext';

export function AIProducerBotWrapper() {
  const { userTier } = useAppContext();
  
  if (userTier === 'pro' || userTier === 'agency') {
    return <AIProducerBot />;
  }
  
  return null;
}
