import PublicHomepage from "@/components/public/PublicHomepage";
import { getPublicHomeMetadata } from "@/lib/publicWeb";

export const metadata = getPublicHomeMetadata("pl");

export default function PolishHomePage() {
  return <PublicHomepage locale="pl" />;
}
