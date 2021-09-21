import { Styles } from './interfaces';
import { getVariants } from './config';
import MissingVariantError from './errors/missing-variant';
import MissingValueError from './errors/missing-value';

export const isServer = (): boolean => typeof window === 'undefined';

export const updateCssVariables = (styles: Styles, variant?: string): void => {
  const root = document.documentElement;
  if (typeof variant === 'string' && !getVariants().includes(variant)) {
    throw new MissingVariantError(
      `Requested variant '${variant}' not found in variants.`
    );
  }
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
            'Encountered a style with variants, but no variant to use specified.'
          );
        if (!(variant in value)) {
          throw new MissingValueError(
            `Style '${name}' is missing value for requested variant '${variant}'.`
          );
        }
        cssValue = value[variant];
        break;
      default:
        throw new Error(`Cannot parse style value '${value}'.`);
    }
    root.style.setProperty(`--${name}`, cssValue.toString());
  });
};
