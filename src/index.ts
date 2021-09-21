import { init, clearSavedVariant } from './config';

import ThemeScript from './theme-script';
import { useVariant, VariantProvider } from './context';

const varial = { init, clearSavedVariant };

export { useVariant, VariantProvider, ThemeScript };

export default varial;
