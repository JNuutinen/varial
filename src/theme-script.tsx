import React from 'react';
import {
  getDefaultVariant,
  getStyles,
  isDetectColorSchemeEnabled,
} from './config';
import { Styles } from './interfaces';

function setThemeMode() {
  const styles = ('🌈' as unknown) as Styles;
  const localSetting = window.localStorage.getItem(
    `varial-${window.location.host}-variant`
  );
  let variant = '⭐️';
  const detectColorScheme = ('🔎' as unknown) as boolean;
  if (localSetting) {
    variant = localSetting;
  } else if (detectColorScheme) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    variant = mql.matches ? 'dark' : 'light';
  }
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
}

const getThemeScript = (): string => {
  const styles = getStyles();
  const defaultVariant = getDefaultVariant();
  const themeScript = String(setThemeMode)
    .replace("'🌈'", JSON.stringify(styles))
    .replace("'⭐'", defaultVariant ? `"${defaultVariant}"` : 'undefined')
    .replace("'🔎'", isDetectColorSchemeEnabled().toString());
  // TODO: Minify `setThemeMode`
  //   Cannot use Terser.minify on `setThemeMode` no longer because it is async :(
  return `(${themeScript})()`;
};

const ThemeScript = (): JSX.Element => {
  const themeScript = getThemeScript();
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
};

export default ThemeScript;
