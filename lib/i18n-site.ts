export const SITE_STR = {
  ar: { features: "المزايا", how: "كيف يعمل", templates: "القوالب", pricing: "الأسعار", faq: "الأسئلة", login: "دخول", start: "ابدأ مجاناً",
    loginT: "أهلاً بك في RVIOS Store", google: "المتابعة بحساب Google", or: "أو", email: "البريد الإلكتروني", send: "أرسل رمز الدخول", code: "أدخل الرمز المرسل إلى بريدك", verify: "تأكيد", note: "بالمتابعة، أنت توافق على شروط الاستخدام.", signed: "تم تسجيل الدخول (معاينة)",
    by: "منصة متاجر إلكترونية من RVIOS Technologies.", city: "صنعاء", rights: "© ٢٠٢٦ RVIOS Technologies" },
  en: { features: "Features", how: "How it works", templates: "Templates", pricing: "Pricing", faq: "FAQ", login: "Log in", start: "Start free",
    loginT: "Welcome to RVIOS Store", google: "Continue with Google", or: "or", email: "Email address", send: "Send login code", code: "Enter the code sent to your email", verify: "Verify", note: "By continuing you agree to the terms of use.", signed: "Signed in (preview)",
    by: "An e-commerce store platform by RVIOS Technologies.", city: "Sana'a", rights: "© 2026 RVIOS Technologies" },
} as const;
export type SiteKey = keyof typeof SITE_STR.ar;
