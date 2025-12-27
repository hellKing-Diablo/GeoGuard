import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = (): JSX.Element => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
};

export default ThemeToggle;
