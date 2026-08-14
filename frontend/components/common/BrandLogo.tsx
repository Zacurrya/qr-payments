import React from 'react';
import { View, Image } from 'react-native';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensionClass = 
    size === 'sm' ? 'w-8 h-8 rounded-xl' :
    size === 'lg' ? 'w-16 h-16 rounded-3xl' :
    'w-11 h-11 rounded-2xl';

  return (
    <View className={`${dimensionClass} bg-white border border-sky-500/40 items-center justify-center shadow-lg shadow-sky-500/10 overflow-hidden p-1 ${className}`}>
      <Image source={require('../../public/logo.png')} className="w-full h-full" resizeMode="contain" />
    </View>
  );
};

export default BrandLogo;
