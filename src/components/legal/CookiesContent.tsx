"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CookiesContent() {
  const { t } = useLanguage();

  return (
    <>
      <p>{t("legal.cookies.intro")}</p>

      <h2>{t("legal.cookies.useHeading")}</h2>
      <p>
        <strong>{t("legal.cookies.useStrong")}</strong>
        {t("legal.cookies.useText")}
      </p>
      <p>{t("legal.cookies.useOnly")}</p>

      <h2>{t("legal.cookies.changeHeading")}</h2>
      <p>{t("legal.cookies.changeText")}</p>

      <h2>{t("legal.cookies.thirdPartyHeading")}</h2>
      <p>
        {t("legal.cookies.thirdPartyPre")}
        <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">
          {t("legal.cookies.thirdPartyLink")}
        </a>
        {t("legal.cookies.thirdPartyPost")}
      </p>

      <h2>{t("legal.cookies.controlHeading")}</h2>
      <p>{t("legal.cookies.controlText")}</p>

      <h2>{t("legal.cookies.changesHeading")}</h2>
      <p>{t("legal.cookies.changesText")}</p>
    </>
  );
}
