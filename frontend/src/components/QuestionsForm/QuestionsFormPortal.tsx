'use client';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const QuestionsForm = dynamic(() => import('./QuestionsForm'), { ssr: false });

const QuestionsFormPortal = ({ onClose }: { onClose: () => void }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === 'undefined') return null;
  return createPortal(<QuestionsForm onClose={onClose} />, document.body);
};

export default QuestionsFormPortal;
