import React, { useState, useRef, useEffect } from 'react';
import { View, Text, PanResponder, LayoutChangeEvent } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface ColorSpectrumPickerProps {
  color: string;
  onChangeColor: (hex: string) => void;
}

// Convert HSL to Hex with strict NaN protection
function hslToHex(h: number, s: number, l: number): string {
  if (isNaN(h) || !isFinite(h)) h = 0;
  if (isNaN(s) || !isFinite(s)) s = 100;
  if (isNaN(l) || !isFinite(l)) l = 50;

  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));

  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    const byte = Math.max(0, Math.min(255, Math.round(255 * c)));
    return byte.toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Convert Hex to HSL with strict validation
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  if (!hex || typeof hex !== 'string') {
    return { h: 199, s: 100, l: 50 };
  }

  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return { h: 199, s: 100, l: 50 };
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }

  if (isNaN(h)) h = 0;
  if (isNaN(s)) s = 0;
  if (isNaN(l)) l = 0.5;

  return {
    h: Math.max(0, Math.min(360, h)),
    s: Math.max(0, Math.min(100, Math.round(s * 100))),
    l: Math.max(0, Math.min(100, Math.round(l * 100))),
  };
}

export const ColorSpectrumPicker: React.FC<ColorSpectrumPickerProps> = ({
  color,
  onChangeColor,
}) => {
  const initialHsl = hexToHsl(color);
  const [hue, setHue] = useState(initialHsl.h);
  const [lightness, setLightness] = useState(initialHsl.l);
  const [hueWidth, setHueWidth] = useState(260);
  const [lightWidth, setLightWidth] = useState(260);

  const hueRef = useRef(hue);
  const lightnessRef = useRef(lightness);
  const hueWidthRef = useRef(hueWidth);
  const lightWidthRef = useRef(lightWidth);

  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);

  useEffect(() => {
    lightnessRef.current = lightness;
  }, [lightness]);

  useEffect(() => {
    hueWidthRef.current = hueWidth;
  }, [hueWidth]);

  useEffect(() => {
    lightWidthRef.current = lightWidth;
  }, [lightWidth]);

  // Synchronize on external color change if it came from a preset
  useEffect(() => {
    const currentHex = hslToHex(hueRef.current, 100, lightnessRef.current);
    if (currentHex.toLowerCase() !== color.toLowerCase()) {
      const parsed = hexToHsl(color);
      setHue(parsed.h);
      hueRef.current = parsed.h;
      setLightness(parsed.l);
      lightnessRef.current = parsed.l;
    }
  }, [color]);

  const handleHueTouch = (x: number) => {
    const width = Math.max(1, hueWidthRef.current || 260);
    const clampedX = Math.max(0, Math.min(x, width));
    const newHue = Math.round((clampedX / width) * 360);
    setHue(newHue);
    hueRef.current = newHue;

    // Preserve the currently set brightness / lightness value
    const hex = hslToHex(newHue, 100, lightnessRef.current);
    onChangeColor(hex);
  };

  const handleLightTouch = (x: number) => {
    const width = Math.max(1, lightWidthRef.current || 260);
    const clampedX = Math.max(0, Math.min(x, width));
    // 0 = White (100%), 0.5 = Pure Hue (50%), 1.0 = Black (0%)
    const ratio = clampedX / width;
    let newLightness: number;
    if (ratio <= 0.5) {
      newLightness = Math.round(100 - (ratio / 0.5) * 50); // 100% -> 50%
    } else {
      newLightness = Math.round(50 - ((ratio - 0.5) / 0.5) * 50); // 50% -> 0%
    }
    setLightness(newLightness);
    lightnessRef.current = newLightness;

    const hex = hslToHex(hueRef.current, 100, newLightness);
    onChangeColor(hex);
  };

  // Hue Slider PanResponder
  const huePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleHueTouch(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => handleHueTouch(evt.nativeEvent.locationX),
    })
  ).current;

  // Lightness Slider PanResponder
  const lightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleLightTouch(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => handleLightTouch(evt.nativeEvent.locationX),
    })
  ).current;

  const pureHueHex = hslToHex(hue, 100, 50);
  const hueThumbX = (hue / 360) * hueWidth;

  // Calculate lightness thumb position (0 to lightWidth)
  let lightThumbX: number;
  if (lightness >= 50) {
    lightThumbX = ((100 - lightness) / 50) * 0.5 * lightWidth;
  } else {
    lightThumbX = (0.5 + ((50 - lightness) / 50) * 0.5) * lightWidth;
  }

  return (
    <View className="pt-2">
      {/* Hue Rainbow Spectrum Bar */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            Colour
          </Text>
        </View>

        <View
          {...huePanResponder.panHandlers}
          onLayout={(e: LayoutChangeEvent) => setHueWidth(e.nativeEvent.layout.width)}
          className="h-8 rounded-full justify-center relative"
        >
          <Svg height="24" width="100%">
            <Defs>
              <LinearGradient id="rainbowSpectrum" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#ef4444" />
                <Stop offset="17%" stopColor="#f59e0b" />
                <Stop offset="33%" stopColor="#eab308" />
                <Stop offset="50%" stopColor="#22c55e" />
                <Stop offset="67%" stopColor="#06b6d4" />
                <Stop offset="83%" stopColor="#3b82f6" />
                <Stop offset="92%" stopColor="#a855f7" />
                <Stop offset="100%" stopColor="#ef4444" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="24" rx="12" fill="url(#rainbowSpectrum)" />
          </Svg>

          {/* Draggable Hue Indicator Thumb */}
          <View
            style={{
              position: 'absolute',
              left: Math.max(0, Math.min(hueThumbX - 12, (hueWidth || 260) - 24)),
              top: 0,
            }}
            className="w-6 h-6 rounded-full bg-white border-2 border-slate-900 shadow-md pointer-events-none"
          />
        </View>
      </View>

      {/* Tone / Brightness Slider (White -> Pure Hue -> Black) */}
      <View className="mb-2">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            Brightness
          </Text>
        </View>

        <View
          {...lightPanResponder.panHandlers}
          onLayout={(e: LayoutChangeEvent) => setLightWidth(e.nativeEvent.layout.width)}
          className="h-8 rounded-full justify-center relative"
        >
          <Svg height="24" width="100%">
            <Defs>
              <LinearGradient id="toneSpectrum" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#ffffff" />
                <Stop offset="50%" stopColor={pureHueHex || '#0ea5e9'} />
                <Stop offset="100%" stopColor="#000000" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="24" rx="12" fill="url(#toneSpectrum)" />
          </Svg>

          {/* Draggable Brightness Indicator Thumb */}
          <View
            style={{
              position: 'absolute',
              left: Math.max(0, Math.min(lightThumbX - 12, (lightWidth || 260) - 24)),
              top: 0,
              backgroundColor: color || '#ffffff',
            }}
            className="w-6 h-6 rounded-full border-2 border-white shadow-md pointer-events-none"
          />
        </View>
      </View>
    </View>
  );
};

export default ColorSpectrumPicker;
