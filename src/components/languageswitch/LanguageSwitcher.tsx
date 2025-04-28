import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageOption {
  code: string;
  name: string;
}

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
  ];

  const changeLanguage = (languageCode: string): void => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    changeLanguage(e.target.value);
  };

  return (
    <div className="language-switcher fixed top-4 right-4 z-50">
      <select
        value={i18n.language}
        onChange={handleSelectChange}
        className="px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
