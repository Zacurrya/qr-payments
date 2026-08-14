import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ColorContextProps {
  qrColor: string;
  setQrColor: (color: string) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  isLoadingColors: boolean;
}

export const ColorContext = createContext<ColorContextProps>({
  qrColor: '#0ea5e9',
  setQrColor: () => {},
  bgColor: '#ffffff',
  setBgColor: () => {},
  isLoadingColors: true,
});

export const ColorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [qrColor, setQrColorState] = useState('#0ea5e9');
  const [bgColor, setBgColorState] = useState('#ffffff');
  const [isLoadingColors, setIsLoadingColors] = useState(true);

  useEffect(() => {
    const loadColors = async () => {
      try {
        const storedQrColor = await AsyncStorage.getItem('qrColor');
        const storedBgColor = await AsyncStorage.getItem('bgColor');
        
        if (storedQrColor) setQrColorState(storedQrColor);
        if (storedBgColor) setBgColorState(storedBgColor);
      } catch (e) {
        console.error('Failed to load colors from storage', e);
      } finally {
        setIsLoadingColors(false);
      }
    };
    loadColors();
  }, []);

  const setQrColor = async (color: string) => {
    setQrColorState(color);
    try {
      await AsyncStorage.setItem('qrColor', color);
    } catch (e) {
      console.error('Failed to save qrColor', e);
    }
  };

  const setBgColor = async (color: string) => {
    setBgColorState(color);
    try {
      await AsyncStorage.setItem('bgColor', color);
    } catch (e) {
      console.error('Failed to save bgColor', e);
    }
  };

  return (
    <ColorContext.Provider value={{ qrColor, setQrColor, bgColor, setBgColor, isLoadingColors }}>
      {children}
    </ColorContext.Provider>
  );
};
