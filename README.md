# Varial

Varial provides UI theme support for React apps using CSS variables.

```jsx
varial.init({
  styles: { background: { light: 'white', dark: 'black' } },
});

function App() {
  const { variant, setVariant } = useVariant();
  const onClick = () => setVariant(variant === 'light' ? 'dark' : 'light');
  return (
    <button style={{ backgroundColor: 'var(--background)' }} onClick={onClick}>
      Toggle theme
    </button>
  );
}

ReactDOM.render(
  <VariantProvider>
    <App />
  </VariantProvider>,
  document.getElementById('root'),
);
```

## Features

* Multi-theme support using CSS variables – integrates with your preferred UI toolkit
* Automatic user dark preference detection
* Theme switch with React Context
* Smooth initial theme load with pre-rendered React pages – avoid the "white flash"

## Initialization

The library must be initialized before use by providing a `styles` object that contains a mapping of global CSS variables. Both regular key-value pairs as well as different values for each theme variant can be provided.

`varial.init` must be called before using any other features of the library.

```jsx
import varial from "varial";

const styles = {
  greyDark: "hsl(215, 22%, 15%)",
  greyLight: "hsl(210, 17%, 98%)",
  background: {
    light: "var(--greyLight)",
    dark: "var(--greyDark)",
  },
  text: {
    light: "black",
    dark: "white",
  },
};

varial.init({ styles, defaultVariant: "dark" });
```

This will create the following global CSS variables:

```
{
    --greyDark: hsl(215, 22%, 15%);
    --greyLight: hsl(210, 17%, 98%);
    --background: var(--greyDark);
    --text: white;
}
```

Calling `varial.init` is the bare minimum of using this library. Rest of the functionalities are optional.

## Theme Control

The library exposes the current theme using React Context. Wrap your `App` with a `VariantProvider`:

```jsx
import varial, { VariantProvider } from "react-varial";

varial.init({ styles });

ReactDOM.render(
  <VariantProvider>
    <App />
  </VariantProvider>
  document.getElementById("root")
);
```

Access and change theme in function components with the `useVariant` hook:

```jsx
import { useVariant } from "react-varial";

function App() {
  const { variant, setVariant } = useVariant();
  return (
    <button onClick={setVariant(variant === 'light' ? 'dark' : 'light')}>
      Toggle theme
    </button>
  );
}
```

`setVariant` updates all the CSS variables created using your `styles` object with the values of the given variant.

## Automatic Darkmode

Automatic darkmode is supported if your `styles` object contains variants named `light` and `dark`. Color preference detection can be enabled with the `detectColorScheme` option:

```javascript
varial.init({ styles, detectColorScheme: true });
```

The color scheme will update real-time if the user changes their color preference in OS settings.

## Avoid the "White Flash" With SSR

Regular SPAs that are not server rendered suffer from a brief flash of white on the initial load of the page. This can be somewhat jarring especially if the page has a dark theme. The flash happens because the HTML page is empty when it arrives to the browser, and it gets populated with markup only after some code has been executed.

Pre-rendered apps have existing HTML already when they arrive to the browser, so we can leverage some well timed scripting to update the page theme to match the user's preference before rendering anything.

The library provides a mechanism for injecting a script to the beginning of your page that will update the CSS variables to the selected variant before any other code is executed. That way your pre-rendered and contentful page will have the user's preferred color scheme on the very first render.

For example with Next.js, place `ThemeScript` before `NextScript` in your custom `Document`:

```jsx
import Document, { Head, Html, Main, NextScript } from "next/document";
import { ThemeScript } from "react-varial";

class MyDocument extends Document {
  /* ... */
  render() {
    return (
      <Html>
        <Head />
        <body>
          <ThemeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```
