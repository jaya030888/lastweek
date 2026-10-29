import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  userId: string;
  pseudonym: string;
  avatarSeed: string;
  sessionId: string;
  locationConsent: boolean;
  isModerator: boolean;
  setPseudonym: (name: string) => void;
  setAvatarSeed: (seed: string) => void;
  setLocationConsent: (consent: boolean) => void;
  toggleModerator: () => void;
  regeneratePseudonym: () => void;
  wipeAllLocalData: () => void;
}

const ADJECTIVES = ['Courageous', 'Silver', 'Brave', 'Kind', 'Resilient', 'Serene', 'Gentle', 'Golden', 'Radiant', 'Starlight'];
const NOUNS = ['Lotus', 'Sparrow', 'Echo', 'Horizon', 'River', 'Shield', 'Phoenix', 'Willow', 'Dawn', 'Haven'];
const SEEDS = ['lavender', 'violet', 'amber', 'rose', 'emerald', 'teal'];

function generateRandomPseudonym(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${adj}${noun}${num}`;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>(() => {
    return localStorage.getItem('hv_user_id') || `usr_${Math.random().toString(36).substring(2, 11)}`;
  });

  const [pseudonym, setPseudonymState] = useState<string>(() => {
    return localStorage.getItem('hv_pseudonym') || generateRandomPseudonym();
  });

  const [avatarSeed, setAvatarSeedState] = useState<string>(() => {
    return localStorage.getItem('hv_avatar_seed') || SEEDS[Math.floor(Math.random() * SEEDS.length)];
  });

  const [sessionId] = useState<string>(() => {
    const existing = sessionStorage.getItem('hv_session_id');
    if (existing) return existing;
    const fresh = `sess_${Math.random().toString(36).substring(2, 12)}`;
    sessionStorage.setItem('hv_session_id', fresh);
    return fresh;
  });

  const [locationConsent, setLocationConsentState] = useState<boolean>(() => {
    return localStorage.getItem('hv_location_consent') === 'true';
  });

  const [isModerator, setIsModerator] = useState<boolean>(() => {
    return localStorage.getItem('hv_is_mod') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('hv_user_id', userId);
    localStorage.setItem('hv_pseudonym', pseudonym);
    localStorage.setItem('hv_avatar_seed', avatarSeed);
    localStorage.setItem('hv_location_consent', String(locationConsent));
    localStorage.setItem('hv_is_mod', String(isModerator));
  }, [userId, pseudonym, avatarSeed, locationConsent, isModerator]);

  const setPseudonym = (name: string) => {
    const trimmed = name.trim();
    if (trimmed) setPseudonymState(trimmed);
  };

  const setAvatarSeed = (seed: string) => {
    setAvatarSeedState(seed);
  };

  const setLocationConsent = (consent: boolean) => {
    setLocationConsentState(consent);
  };

  const toggleModerator = () => {
    setIsModerator(prev => !prev);
  };

  const regeneratePseudonym = () => {
    const fresh = generateRandomPseudonym();
    setPseudonymState(fresh);
  };

  const wipeAllLocalData = () => {
    localStorage.clear();
    sessionStorage.clear();
    const newId = `usr_${Math.random().toString(36).substring(2, 11)}`;
    const newPseudo = generateRandomPseudonym();
    setUserId(newId);
    setPseudonymState(newPseudo);
    setLocationConsentState(false);
    setIsModerator(false);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        pseudonym,
        avatarSeed,
        sessionId,
        locationConsent,
        isModerator,
        setPseudonym,
        setAvatarSeed,
        setLocationConsent,
        toggleModerator,
        regeneratePseudonym,
        wipeAllLocalData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

