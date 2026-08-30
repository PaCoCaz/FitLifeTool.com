import PublicHomepage from "@/components/public/PublicHomepage";
import { getPublicHomeMetadata } from "@/lib/publicWeb";

export const metadata = getPublicHomeMetadata("nl");

export default function DutchHomePage() {
  return <PublicHomepage locale="nl" />;
}
