import { Styles } from './interfaces';

export const isServer = (): boolean => typeof window === 'undefined';

export const updateCssVariables = (styles: Styles, variant?: string): void => {
  const root = document.documentElement;
  Object.entries(styles).forEach(([name, value]) => {
    let cssValue;
    switch (typeof value) {
      case 'string':
      case 'number':
        cssValue = value;
        break;
      case 'object':
        if (typeof variant === 'undefined')
          throw new Error(
            'Encountered a style with variants in styles, but no variant to use specified.'
          );
        cssValue = value[variant];
        break;
      default:
        throw new Error(`Cannot parse style value '${value}'`);
    }
    root.style.setProperty(`--${name}`, cssValue.toString());
  });
};
