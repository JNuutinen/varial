import { Config, InternalState, Styles } from './interfaces';

const USER_CONFIG: Config = {
  styles: {},
  defaultVariant: undefined,
  detectColorScheme: false,
};

const STATE: InternalState = {
  variant: undefined,
  styles: {},
  clear() {
    this.variant = undefined;
    this.styles = {};
  },
};

const saveUserConfiguration = (options: Partial<Config>) => {
  if (!('styles' in options)) {
    throw new Error("init is missing required option 'styles'");
  }
  Object.assign(USER_CONFIG, { ...options });
  STATE.styles = USER_CONFIG.styles;
  STATE.variant = USER_CONFIG.defaultVariant;
};

export const init = (options: Partial<Config>): void => {
  saveUserConfiguration(options);
  if (USER_CONFIG.defaultVariant) {
    STATE.variant = USER_CONFIG.defaultVariant;
  }
};

export const isDetectColorSchemeEnabled = (): boolean =>
  USER_CONFIG.detectColorScheme;

export const getDefaultVariant = (): string | undefined =>
  USER_CONFIG.defaultVariant;

export const getStyles = (): Styles => STATE.styles;
