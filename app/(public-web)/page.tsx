import PublicHomepage from "@/components/public/PublicHomepage";
import { getPublicHomeMetadata } from "@/lib/publicWeb";

export const metadata = getPublicHomeMetadata("en");

export default function EnglishHomePage() {
  return <PublicHomepage locale="en" />;
}
