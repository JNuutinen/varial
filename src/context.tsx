import React from 'react';
import {
  getDefaultVariant,
  getStyles,
  isDetectColorSchemeEnabled,
} from './config';
import { isServer, updateCssVariables } from './util';
import { getFromStorage, saveToStorage } from './storage';
import { STORAGE_KEY_VARIANT, Variant } from './constants';

const MATCH_MEDIA_DARK = '(prefers-color-scheme: dark)';

interface VariantContext {
  variant: string;
  setVariant: (variant: string) => void;
}

function createCtx<ContextType>() {
  const context = React.createContext<ContextType | undefined>(undefined);
  function useCtx() {
    const c = React.useContext(context);
    if (!c) {
      throw new Error('useVariant must be used inside a VariantProvider');
    }
    return c;
  }
  return [useCtx, context.Provider] as const;
}

const addColorSchemeListener = (listener: () => void) => {
  const mql = window.matchMedia(MATCH_MEDIA_DARK);
  mql.addListener(listener);
};

const prefersDark = () => window.matchMedia(MATCH_MEDIA_DARK).matches;

const getPreferredColorScheme = () =>
  prefersDark() ? Variant.DARK : Variant.LIGHT;

const getSavedVariant = () => getFromStorage(STORAGE_KEY_VARIANT);

const getDefaultOrDetectedVariant = (): string | undefined => {
  if (isServer()) {
    return getDefaultVariant();
  }
  const savedVariant = getSavedVariant();
  if (savedVariant) {
    return savedVariant;
  }
  if (isDetectColorSchemeEnabled()) return getPreferredColorScheme();
  return getDefaultVariant();
};

const [useVariantCtx, CtxProvider] = createCtx<VariantContext>();

const VariantProvider: React.FC = ({ children }) => {
  const [variant, rawSetVariant] = React.useState(Variant.LIGHT);

  const setVariant = React.useCallback(
    (value) => {
      if (value === variant) return undefined;
      saveToStorage(STORAGE_KEY_VARIANT, value);
      rawSetVariant(value);
      return undefined;
    },
    [variant]
  );

  React.useEffect(() => {
    const detectedVariant = getDefaultOrDetectedVariant();
    if (typeof detectedVariant === 'undefined')
      throw new Error(
        'To use VariantProvider you must configure defaultVariant or use detectColorScheme.'
      );
    updateCssVariables(getStyles(), detectedVariant);
    if (isDetectColorSchemeEnabled()) {
      addColorSchemeListener(() => setVariant(getPreferredColorScheme()));
    }
    setVariant(detectedVariant);
  }, [variant, setVariant]);

  const value = React.useMemo(() => ({ variant, setVariant }), [
    variant,
    setVariant,
  ]);

  return <CtxProvider value={value}>{children}</CtxProvider>;
};

const useVariant = (): VariantContext => useVariantCtx();

export { VariantProvider, useVariant };
