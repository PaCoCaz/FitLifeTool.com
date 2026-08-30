import PublicHomepage from "@/components/public/PublicHomepage";
import { getPublicHomeMetadata } from "@/lib/publicWeb";

export const metadata = getPublicHomeMetadata("de");

export default function GermanHomePage() {
  return <PublicHomepage locale="de" />;
}
