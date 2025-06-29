import { useState } from 'react';
import { requestApi } from '../api/request_api';

export function useCheckEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailConflict, setShowEmailConflict] = useState(false);
  const [emailToCheck, setEmailToCheck] = useState('');

  const checkEmail = async (email: string) => {
    try {
      setIsLoading(true);
      setEmailToCheck(email);
      const exists = await requestApi.checkEmailExists(email);
      if (exists) {
        setShowEmailConflict(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseEmailConflict = () => {
    setShowEmailConflict(false);
    setEmailToCheck('');
  };

  return {
    isLoading,
    showEmailConflict,
    emailToCheck,
    checkEmail,
    handleCloseEmailConflict,
  };
} 