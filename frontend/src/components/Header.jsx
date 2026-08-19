import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="header-bar">
      <h1 className="header-bar__title">
        <img src="/logo.jpg" alt="" className="header-bar__logo" />
        {t("common.appTitle")}
      </h1>
      <div className="header-bar__actions">
        <LanguageToggle />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleLogout}
        >
          {t("common.logout")}
        </button>
      </div>
    </header>
  );
}
