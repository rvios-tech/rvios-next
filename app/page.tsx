import { PlatformPage } from "@/components/platform/PlatformPage";
import { Analytics } from "@/components/site/Analytics";
import { platformMetadata } from "@/lib/platform-seo";

export const metadata = platformMetadata(
  "RVIOS Store — أنشئ متجرك الإلكتروني مجانًا في دقائق | منصة متاجر إلكترونية",
  "منصة متاجر إلكترونية عربية: أنشئ متجرك مجانًا بقالب يليق ببضاعتك، وشارك رابطًا واحدًا، واستقبل الطلبات عبر واتساب منظّمة في لوحة تحكم. 18 قالبًا، نطاق خاص، دفع عند الاستلام وتحويل محلي، بلا عمولة على مبيعاتك — في اليمن والسعودية والخليج.",
);
export default function Home() {
  return <><Analytics /><PlatformPage /></>;
}
