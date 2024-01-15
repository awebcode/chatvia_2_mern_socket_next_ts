import { Box, MenuItem, SelectChangeEvent, Typography } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { theme } from "@theme";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import CASelect from "@components/Select";

enum Languages {
  English = "English",
  Bangla = "Bangla",
  Hindi = "Hindi",
  German = "German",
  Russian = "Russian",
  Vietnamese = "Tiếng Việt",
}

const SwitchLanguage = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const [language, setLanguage] = useState<Languages>(
    i18n.language === "vi"
      ? Languages.Vietnamese
      : i18n.language === "bn"
      ? Languages.Bangla
      : i18n.language === "hindi"
      ? Languages.Hindi
      : i18n.language === "german"
      ? Languages.German
      : i18n.language === "russian"
      ? Languages.Bangla
      : Languages.English
  );

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as Languages);
  };

  const switchToEnglish = () => {
    router.push(router.pathname, router.asPath, { locale: "en" });
  };

  const switchToVietnamese = () => {
    router.push(router.pathname, router.asPath, { locale: "vi" });
  };

  const switchToBangla = () => {
    router.push(router.pathname, router.asPath, { locale: "bn" });
  };
  const switchToHindi = () => {
    router.push(router.pathname, router.asPath, { locale: "hindi" });
  };
  const switchToRussian = () => {
    router.push(router.pathname, router.asPath, { locale: "russian" });
  };
  const switchToGerman = () => {
    router.push(router.pathname, router.asPath, { locale: "german" });
  };

  return (
    <Box display="flex" mt={3} alignItems="center">
      <Typography color={darkMode ? theme.palette.common.white : undefined} flex={1}>
        {t("language")}
      </Typography>
      <CASelect value={language} handleChange={handleChange}>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          onClick={switchToEnglish}
          value={Languages.English}
        >
          <Image src="/images/eng.jpeg" width={16} height={10} alt="english" />
          <Typography color={darkMode ? theme.palette.common.white : undefined} ml={1}>
            {Languages.English}
          </Typography>
        </MenuItem>
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={switchToBangla}
          value={Languages.Bangla}
        >
          <Image src="/images/bd.png" width={16} height={10} alt="bn" />
          <Typography color={darkMode ? theme.palette.common.white : undefined} ml={1}>
            {Languages.Bangla}
          </Typography>
        </MenuItem>
        {/* Hindi */}
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={switchToHindi}
          value={Languages.Hindi}
        >
          <Image src="/images/india.png" width={16} height={10} alt="hindi" />
          <Typography color={darkMode ? theme.palette.common.white : undefined} ml={1}>
            {Languages.Hindi}
          </Typography>
        </MenuItem>
        {/* German */}
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={switchToGerman}
          value={Languages.German}
        >
          <Image src="/images/german.png" width={16} height={10} alt="German" />
          <Typography color={darkMode ? theme.palette.common.white : undefined} ml={1}>
            {Languages.German}
          </Typography>
        </MenuItem>
        {/* Russian */}

        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={switchToRussian}
          value={Languages.Russian}
        >
          <Image src="/images/russian.png" width={16} height={10} alt="Russian" />
          <Typography color={darkMode ? theme.palette.common.white : undefined} ml={1}>
            {Languages.Russian}
          </Typography>
        </MenuItem>
        {/* Vietnam */}
        <MenuItem
          sx={{ display: "flex", alignItems: "center" }}
          onClick={switchToVietnamese}
          value={Languages.Vietnamese}
        >
          <Image src="/images/vietnam.png" width={16} height={10} alt="vietnam" />
          <Typography color={darkMode ? theme.palette.common.white : undefined} ml={1}>
            {Languages.Vietnamese}
          </Typography>
        </MenuItem>
      </CASelect>
    </Box>
  );
};

export default SwitchLanguage;
