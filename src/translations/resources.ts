
import { enTranslations } from './en';
import { hiTranslations } from './hi';
import { TranslationKeys } from './types';

/**
 * Interface for i18n resources configuration
 */
export interface Resources {
  [lang: string]: {
    translation: Partial<TranslationKeys>;
  };
}

/**
 * Resources configuration for i18next
 */
export const resources: Resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  }
};
