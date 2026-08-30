import PublicHomepage from "@/components/public/PublicHomepage";
import { getPublicHomeMetadata } from "@/lib/publicWeb";

export const metadata = getPublicHomeMetadata("fr");

export default function FrenchHomePage() {
  return <PublicHomepage locale="fr" />;
}
