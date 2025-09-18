import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';

// New interface for modal content
interface ConfirmationModalContent {
  title?: string;
  message?: string;
  confirmButtonText?: string;
}

// Data structure for backup
interface UserBackupData {
  credits: number;
  isSupporter: boolean;
  freeUses: { [key: string]: number };
}

// Define the shape of the context
interface CreditContextType {
  credits: number;
  isSupporter: boolean;
  getFreeUsesLeft: (serviceId: string) => number;
  getTotalFreeUses: (serviceId: string) => number;
  canUseService: (serviceId: string) => boolean;
  addCredits: (amount: number) => void;
  setAsSupporter: () => void;
  isModalOpen: boolean;
  showNoCreditsModal: () => void;
  closeNoCreditsModal: () => void;
  navigateToPurchase: () => void;

  // New fields for confirmation flow
  isConfirmationOpen: boolean;
  creditsAfterUse: number;
  isSuccessMessageVisible: boolean;
  confirmationContent: ConfirmationModalContent; // Expose content
  requestServiceUse: (serviceId: string, onConfirm: () => void, content?: ConfirmationModalContent) => void;
  confirmServiceUse: () => void;
  cancelServiceUse: () => void;

  // New functions for backup/restore
  exportData: () => string;
  importData: (backupCode: string) => boolean;
}

// Create the context with a default value
const CreditContext = createContext<CreditContextType | undefined>(undefined);

// Define the provider component
interface CreditProviderProps {
  children: ReactNode;
  onNavigate: (serviceId: string) => void;
}

const DEFAULT_FREE_USES = 5;
const SERVICE_SPECIFIC_FREE_USES: Record<string, number> = {
  'resume': 3,
};

const getTotalFreeUsesForService = (serviceId: string): number => {
  return SERVICE_SPECIFIC_FREE_USES[serviceId] ?? DEFAULT_FREE_USES;
};


export const CreditProvider: React.FC<CreditProviderProps> = ({ children, onNavigate }) => {
  const [credits, setCredits] = useState<number>(0);
  const [isSupporter, setIsSupporter] = useState<boolean>(false);
  const [freeUses, setFreeUses] = useState<{ [key: string]: number }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New state for confirmation flow
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    serviceId: string | null;
    onConfirm: (() => void) | null;
    content: ConfirmationModalContent; // Add content here
  }>({ isOpen: false, serviceId: null, onConfirm: null, content: {} });
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedCredits = localStorage.getItem('konicaCredits');
      const savedSupporter = localStorage.getItem('konicaIsSupporter');
      const savedFreeUses = localStorage.getItem('konicaFreeUses');
      
      if (savedCredits) setCredits(JSON.parse(savedCredits));
      if (savedSupporter) setIsSupporter(JSON.parse(savedSupporter));
      if (savedFreeUses) setFreeUses(JSON.parse(savedFreeUses));
    } catch (error) {
      console.error("Failed to load credit data from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('konicaCredits', JSON.stringify(credits));
      localStorage.setItem('konicaIsSupporter', JSON.stringify(isSupporter));
      localStorage.setItem('konicaFreeUses', JSON.stringify(freeUses));
    } catch (error) {
      console.error("Failed to save credit data to localStorage", error);
    }
  }, [credits, isSupporter, freeUses]);

  const getTotalFreeUses = useCallback((serviceId: string): number => {
    return getTotalFreeUsesForService(serviceId);
  }, []);

  const getFreeUsesLeft = useCallback((serviceId: string): number => {
    const used = freeUses[serviceId] || 0;
    const total = getTotalFreeUses(serviceId);
    return Math.max(0, total - used);
  }, [freeUses, getTotalFreeUses]);

  const canUseService = useCallback((serviceId: string): boolean => {
    if (isSupporter) return true;
    if (credits > 0) return true;
    return getFreeUsesLeft(serviceId) > 0;
  }, [isSupporter, credits, getFreeUsesLeft]);

  const useService = useCallback((serviceId: string) => {
    if (isSupporter) return;

    if (credits > 0) {
      setCredits(prev => prev - 1);
    } else if (getFreeUsesLeft(serviceId) > 0) {
      setFreeUses(prev => ({
        ...prev,
        [serviceId]: (prev[serviceId] || 0) + 1
      }));
    } else {
      console.error("useService called without checking canUseService first.");
    }
  }, [isSupporter, credits, getFreeUsesLeft]);

  const addCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };
  
  const setAsSupporter = () => {
    setIsSupporter(true);
  };

  const showNoCreditsModal = () => setIsModalOpen(true);
  const closeNoCreditsModal = () => setIsModalOpen(false);
  const navigateToPurchase = () => {
    closeNoCreditsModal();
    onNavigate('monetization');
  };

  // --- New functions for confirmation flow ---
  const requestServiceUse = (
    serviceId: string, 
    onConfirm: () => void,
    content: ConfirmationModalContent = {}
  ) => {
    if (!canUseService(serviceId)) {
      showNoCreditsModal();
      return;
    }

    // Skip confirmation for supporters or free uses, just perform the action
    if (isSupporter || credits === 0) {
        useService(serviceId);
        onConfirm();
        setIsSuccessMessageVisible(true);
        setTimeout(() => setIsSuccessMessageVisible(false), 2500);
        return;
    }
    
    // Show confirmation modal only when it costs a credit
    setConfirmationState({ isOpen: true, serviceId, onConfirm, content });
  };

  const confirmServiceUse = () => {
    if (confirmationState.serviceId && confirmationState.onConfirm) {
      useService(confirmationState.serviceId);
      confirmationState.onConfirm();
      setIsSuccessMessageVisible(true);
      setTimeout(() => setIsSuccessMessageVisible(false), 2500);
    }
    setConfirmationState({ isOpen: false, serviceId: null, onConfirm: null, content: {} });
  };

  const cancelServiceUse = () => {
    setConfirmationState({ isOpen: false, serviceId: null, onConfirm: null, content: {} });
  };
  
  const creditsAfterUse = isSupporter ? credits : Math.max(0, credits - 1);
  
  // --- New functions for backup/restore ---
  const exportData = (): string => {
    const dataToBackup: UserBackupData = {
      credits,
      isSupporter,
      freeUses,
    };
    const jsonString = JSON.stringify(dataToBackup);
    // Handle potential Unicode characters for robust base64 encoding
    return btoa(unescape(encodeURIComponent(jsonString)));
  };

  const importData = (backupCode: string): boolean => {
    try {
      // Handle potential Unicode characters for robust base64 decoding
      const jsonString = decodeURIComponent(escape(atob(backupCode)));
      const data: UserBackupData = JSON.parse(jsonString);

      // Basic validation
      if (
        typeof data.credits !== 'number' ||
        typeof data.isSupporter !== 'boolean' ||
        typeof data.freeUses !== 'object'
      ) {
        throw new Error('Invalid data structure');
      }

      setCredits(data.credits);
      setIsSupporter(data.isSupporter);
      setFreeUses(data.freeUses || {});
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };


  const value = {
    credits,
    isSupporter,
    getFreeUsesLeft,
    getTotalFreeUses,
    canUseService,
    addCredits,
    setAsSupporter,
    isModalOpen,
    showNoCreditsModal,
    closeNoCreditsModal,
    navigateToPurchase,
    // New values
    isConfirmationOpen: confirmationState.isOpen,
    creditsAfterUse,
    isSuccessMessageVisible,
    confirmationContent: confirmationState.content,
    requestServiceUse,
    confirmServiceUse,
    cancelServiceUse,
    // Backup/restore
    exportData,
    importData
  };

  return (
    <CreditContext.Provider value={value}>
      {children}
    </CreditContext.Provider>
  );
};

// Custom hook to use the credit context
export const useCredits = (): CreditContextType => {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
};