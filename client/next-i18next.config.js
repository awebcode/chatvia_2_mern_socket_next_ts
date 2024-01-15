module.exports = {
  i18n: {
    locales: ["en", "vi", "bn", "hindi", "german", "russian"],
    defaultLocale: "en",
    localeDetection: false,
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/public/locales",
};
