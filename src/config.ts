import { Config, InternalState, Styles } from './interfaces';
import { removeFromStorage } from './storage';
import { STORAGE_KEY_VARIANT } from './constants';

const USER_CONFIG: Config = {
  variants: [],
  styles: {},
  defaultVariant: undefined,
  detectColorScheme: false,
};

const STATE: InternalState = {
  variant: undefined,
  styles: {},
};

export const init = (options: Partial<Config>): void => {
  if (!('styles' in options)) {
    throw new Error("init is missing required option 'styles'");
  }
  if (!('variants' in options)) {
    throw new Error("init is missing required option 'variants'");
  }
  Object.assign(USER_CONFIG, { ...options });
  STATE.styles = USER_CONFIG.styles;
  STATE.variant = USER_CONFIG.defaultVariant;
};

export const clearSavedVariant = (): void =>
  removeFromStorage(STORAGE_KEY_VARIANT);

export const isDetectColorSchemeEnabled = (): boolean =>
  USER_CONFIG.detectColorScheme;

export const getDefaultVariant = (): string | undefined =>
  USER_CONFIG.defaultVariant;

export const getStyles = (): Styles => STATE.styles;

export const getVariants = (): string[] => USER_CONFIG.variants;
