import { PlatformAssistant } from "@/components/assistant/PlatformAssistant";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { Analytics } from "@/components/site/Analytics";
import { platformJsonLd, platformMetadata } from "@/lib/platform-seo";
import { ldJson } from "@/lib/seo";

export const metadata = platformMetadata(
  "RVIOS Store — أنشئ متجرك الإلكتروني مجانًا في دقائق | منصة متاجر إلكترونية",
  "منصة متاجر إلكترونية عربية: أنشئ متجرك مجانًا بقالب يليق ببضاعتك، وشارك رابطًا واحدًا، واستقبل الطلبات عبر واتساب منظّمة في لوحة تحكم. 18 قالبًا، نطاق خاص، دفع عند الاستلام وتحويل محلي، بلا عمولة على مبيعاتك — في اليمن والسعودية والخليج.",
);
export default function Home() {
  return <><Analytics /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(platformJsonLd()) }} /><PlatformPage /><PlatformAssistant /></>;
}
