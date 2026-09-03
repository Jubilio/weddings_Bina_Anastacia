import type { Metadata } from "next";

export const PUBLIC_INVITATION_URL =
  "https://weddings-bina-anastacia.nexovibe.workers.dev";

const SOCIAL_PREVIEW_VERSION = "20260903";
const SOCIAL_IMAGE_PATH = "/convite-anastacia-bina-2026.jpg";
const SOCIAL_TITLE = "Anastácia & Bina | Convite de Casamento";
const SOCIAL_DESCRIPTION =
  "Celebre connosco o casamento de Anastácia e Bina, no dia 19 de dezembro de 2026, na Cidade de Nampula.";
const SOCIAL_IMAGE_ALT = "Anastácia e Bina — 19 de dezembro de 2026";

export function personalizedInvitationPath(code: string) {
  return `/?convite=${encodeURIComponent(code)}&partilha=${SOCIAL_PREVIEW_VERSION}`;
}

export function invitationSocialMetadata(
  path = `/?partilha=${SOCIAL_PREVIEW_VERSION}`,
): Metadata {
  const pageUrl = new URL(path, PUBLIC_INVITATION_URL).toString();
  const imageUrl = new URL(SOCIAL_IMAGE_PATH, PUBLIC_INVITATION_URL).toString();

  return {
    metadataBase: new URL(PUBLIC_INVITATION_URL),
    title: SOCIAL_TITLE,
    description: SOCIAL_DESCRIPTION,
    referrer: "no-referrer",
    alternates: { canonical: "/" },
    openGraph: {
      title: SOCIAL_TITLE,
      description: SOCIAL_DESCRIPTION,
      type: "website",
      locale: "pt_MZ",
      url: pageUrl,
      siteName: "Casamento de Anastácia & Bina",
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          type: "image/jpeg",
          width: 1200,
          height: 630,
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SOCIAL_TITLE,
      description: SOCIAL_DESCRIPTION,
      images: [
        {
          url: imageUrl,
          type: "image/jpeg",
          width: 1200,
          height: 630,
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}
