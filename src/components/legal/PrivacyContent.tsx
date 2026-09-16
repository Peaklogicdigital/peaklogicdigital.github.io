"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PrivacyContent() {
  const { t, dict } = useLanguage();
  const rightsList = dict.legal.privacy.rightsList;

  return (
    <>
      <p>{t("legal.privacy.intro")}</p>

      <h2>{t("legal.privacy.collectHeading")}</h2>
      <p>
        <strong>{t("legal.privacy.collectFormStrong")}</strong>
        {t("legal.privacy.collectFormText")}
      </p>
      <p>
        <strong>{t("legal.privacy.collectCookieStrong")}</strong>
        {t("legal.privacy.collectCookieText")}
      </p>
      <p>
        {t("legal.privacy.noAnalyticsPre")}
        <Link href="/cookies">{t("legal.privacy.noAnalyticsLink")}</Link>
        {t("legal.privacy.noAnalyticsPost")}
      </p>

      <h2>{t("legal.privacy.thirdPartyHeading")}</h2>
      <p>
        {t("legal.privacy.thirdPartyPre")}
        <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">
          {t("legal.privacy.thirdPartyLink")}
        </a>
        {t("legal.privacy.thirdPartyPost")}
      </p>

      <h2>{t("legal.privacy.retentionHeading")}</h2>
      <p>{t("legal.privacy.retentionText")}</p>

      <h2>{t("legal.privacy.rightsHeading")}</h2>
      <p>{t("legal.privacy.rightsIntro")}</p>
      <ul>
        {rightsList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>{t("legal.privacy.rightsOutro")}</p>

      <h2>{t("legal.privacy.securityHeading")}</h2>
      <p>{t("legal.privacy.securityText")}</p>

      <h2>{t("legal.privacy.changesHeading")}</h2>
      <p>{t("legal.privacy.changesText")}</p>

      <h2>{t("legal.privacy.contactHeading")}</h2>
      <p>
        {t("legal.privacy.contactPre")}
        <Link href="/">{t("legal.privacy.contactLink")}</Link>
        {t("legal.privacy.contactPost")}
      </p>
    </>
  );
}
