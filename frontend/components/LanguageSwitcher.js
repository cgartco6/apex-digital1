import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
      <option value="en">English</option>
      <option value="af">Afrikaans</option>
      <option value="zu">Zulu</option>
    </select>
  );
    }
