export interface Config {
  variants: string[];
  styles: Styles;
  defaultVariant: string | undefined;
  detectColorScheme: boolean;
}

export interface Styles {
  [cssVariable: string]: StylesByVariant | string | number;
}

// TODO: Support other value types than string and number
export interface StylesByVariant {
  [themeName: string]: string | number;
}

export interface InternalState {
  variant: string | undefined;
  styles: Styles;
}
