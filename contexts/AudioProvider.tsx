"use client";

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AudioSettings } from '@/types/settings';

export type SpeechState = 'idle' | 'playing' | 'paused';

interface AudioContextType {
  speechState: SpeechState;
  settings: AudioSettings;
  voices: SpeechSynthesisVoice[];
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  setSettings: (settings: Partial<AudioSettings>) => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(undefined);

const defaultSettings: AudioSettings = {
  voice: null,
  rate: 1,
  pitch: 1,
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettingsState] = useState<AudioSettings>(defaultSettings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speechState, setSpeechState] = useState<SpeechState>('idle');

  useEffect(() => {
    const handleVoicesChanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Set a default voice if not already set
      if (!settings.voice && availableVoices.length > 0) {
        const defaultVoice = availableVoices.find(v => v.lang.startsWith('pt')) || availableVoices[0];
        if (defaultVoice) {
          setSettingsState(prev => ({ ...prev, voice: defaultVoice.name }));
        }
      }
    };

    // Load settings from localStorage
    try {
      const savedSettings = localStorage.getItem('audioSettings');
      if (savedSettings) {
        setSettingsState(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Failed to load audio settings from localStorage", error);
    }


    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
        handleVoicesChanged(); // Initial load
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
        cancel(); // Stop any speech on unmount
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSettings = (newSettings: Partial<AudioSettings>) => {
    setSettingsState(prev => {
      const updatedSettings = { ...prev, ...newSettings };
      try {
        localStorage.setItem('audioSettings', JSON.stringify(updatedSettings));
      } catch (error) {
        console.error("Failed to save audio settings to localStorage", error);
      }
      return updatedSettings;
    });
  };

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    cancel(); // Cancel any previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find(v => v.name === settings.voice);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;

    utterance.onstart = () => setSpeechState('playing');
    utterance.onpause = () => setSpeechState('paused');
    utterance.onresume = () => setSpeechState('playing');
    utterance.onend = () => setSpeechState('idle');
    utterance.onerror = () => setSpeechState('idle');

    window.speechSynthesis.speak(utterance);
  }, [settings, voices]);

  const pause = () => {
    if (speechState === 'playing') {
      window.speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (speechState === 'paused') {
      window.speechSynthesis.resume();
    }
  };

  const cancel = () => {
    if (speechState !== 'idle') {
      window.speechSynthesis.cancel();
      setSpeechState('idle');
    }
  };

  return (
    <AudioContext.Provider value={{ speechState, settings, voices, speak, pause, resume, cancel, setSettings }}>
      {children}
    </AudioContext.Provider>
  );
};
