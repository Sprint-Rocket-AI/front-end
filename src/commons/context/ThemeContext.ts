import { createContext, useContext } from 'react';

interface ThemeContextType {
    isDark: boolean;
    toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggle: () => { },
});

export const useTheme = () => useContext(ThemeContext);