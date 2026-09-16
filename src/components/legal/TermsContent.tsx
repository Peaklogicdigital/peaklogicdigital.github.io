"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TermsContent() {
  const { t } = useLanguage();

  return (
    <>
      <p>{t("legal.terms.intro")}</p>

      <h2>{t("legal.terms.usingHeading")}</h2>
      <p>{t("legal.terms.usingText")}</p>

      <h2>{t("legal.terms.offerHeading")}</h2>
      <p>{t("legal.terms.offerText")}</p>

      <h2>{t("legal.terms.ipHeading")}</h2>
      <p>{t("legal.terms.ipText")}</p>

      <h2>{t("legal.terms.warrantyHeading")}</h2>
      <p>{t("legal.terms.warrantyText")}</p>

      <h2>{t("legal.terms.changesHeading")}</h2>
      <p>{t("legal.terms.changesText")}</p>

      <h2>{t("legal.terms.contactHeading")}</h2>
      <p>
        {t("legal.terms.contactPre")}
        <Link href="/">{t("legal.terms.contactLink")}</Link>
        {t("legal.terms.contactPost")}
      </p>
    </>
  );
}
