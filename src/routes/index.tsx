import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CircleCheck,
  FileCheck2,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  Phone,
  Plus,
  X,
  Zap,
  Building2,
  Clock3,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OFFER, daysRemaining, enquirySchema, offerActive } from "@/lib/offer";
import { submitEnquiry } from "@/lib/enquiries.functions";
import hero from "@/assets/hero.jpg.asset.json";
import logo from "@/assets/logo.svg.asset.json";
import qarawa from "@/assets/qarawa.jpg.asset.json";
import farkha from "@/assets/farkha.jpg.asset.json";
import mazraa from "@/assets/mazraa.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "عروض طابو لنهاية 2026 | خصم 10% على أرضك في فلسطين" },
      {
        name: "description",
        content:
          "خصم 10% على سعر الأرض الكلي في قراوة بني زيد وفرخة والمزرعة الغربية. اطلب خيارات الأراضي والأسعار بعد الخصم مع طابو.",
      },
      { property: "og:title", content: "طابو | عروض نهاية 2026 — خصم 10%" },
      {
        property: "og:description",
        content:
          "أرضك في فلسطين بسند ملكية وتقسيط حتى 5 سنوات. اترك اسمك ورقمك واطلب تفاصيل العرض.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});
const CTA = "اطلب تفاصيل العرض الآن";
const PHONE = "tel:+97222974992";
const WHATSAPP = "https://wa.me/97222974992";
const photos = [qarawa.url, farkha.url, mazraa.url];
const faqs = [
  ["هل إرسال بياناتي يلزمني بشراء الأرض؟", "لا، الطلب للاستفسار فقط."],
  [
    "على ماذا يُطبّق الخصم، ومتى ينتهي؟",
    "يُطبّق خصم 10% على سعر الأرض الكلي في قراوة بني زيد وفرخة والمزرعة الغربية، حتى نهاية يوم 31 كانون الأول 2026 أو حتى نفاد القطع المتاحة، أيهما أسبق.",
  ],
  [
    "ما طريقة الدفع والتقسيط؟",
    "دفعة أولى من 5,000 دولار في قراوة بني زيد وفرخة، أو 5,000 دينار في المزرعة الغربية. ويُقسّط الباقي مباشرة مع الشركة حتى 5 سنوات، بلا فوائد ولا وسطاء. تختلف التفاصيل حسب القطعة.",
  ],
  [
    "هل سند الملكية جاهز؟",
    "نعم، سندات الملكية جاهزة، وتتولى الشركة إجراءات التسجيل حتى يصدر السند باسمك. يشرح لك المستشار الإجراءات الخاصة بالقطعة التي تختارها.",
  ],
  [
    "ما تصنيف الأراضي؟",
    "أراضي قراوة بني زيد وفرخة مصنّفة (أ). أما المزرعة الغربية، فسيشرح لك المستشار وضعها التنظيمي بالتفصيل قبل أي خطوة.",
  ],
  [
    "لماذا لا تظهر أسعار القطع في الصفحة؟",
    "يختلف سعر كل قطعة بحسب مساحتها وإطلالتها وموقعها في المخطط. بعد تسجيل بياناتك، يطلعك مستشارنا الاستثماري على الخيارات المتاحة والأسعار بعد الخصم.",
  ],
  [
    "هل الأراضي قريبة من مستوطنات؟",
    "اطلب من مستشار طابو خريطة الموقع وتفاصيل محيط كل قطعة، وقارن الخيارات خلال زيارة الأرض قبل اتخاذ قرارك.",
  ],
];
const steps = [
  ["سجّل اسمك ورقمك", "اطلب تفاصيل العرض، دون أي التزام بالشراء."],
  ["تواصل مع مستشارنا", "اطّلع على الأسعار والقطع المتاحة، ورتّب زيارة للأرض."],
  ["اختر أرضك", "قارن الخيارات واطّلع على إجراءات التملّك."],
  [
    "ادفع الدفعة الأولى وتملّك",
    "قسّط الباقي مباشرة مع الشركة، ونتولى التسجيل حتى يصدر السند باسمك.",
  ],
];
function Index() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [active, setActive] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; submit?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const key = useRef<string | null>(null);
  const busy = useRef(false);
  const send = useServerFn(submitEnquiry);
  useEffect(() => {
    const update = () => {
      setRemaining(daysRemaining(new Date()));
      setActive(offerActive(new Date()));
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);
  function chooseLocation(id: string) {
    setSelected([id]);
    document.getElementById("request")?.scrollIntoView({ behavior: "smooth" });
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    key.current ??= crypto.randomUUID();
    const result = enquirySchema.safeParse({
      name,
      phone,
      locations: selected,
      requestKey: key.current,
      website: new FormData(event.currentTarget).get("website") || "",
    });
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    busy.current = true;
    try {
      await send({ data: result.data });
      setSubmittedName(result.data.name.split(" ")[0] ?? result.data.name);
      setSuccess(true);
      setName("");
      setPhone("");
      setSelected([]);
      key.current = null;
    } catch {
      setErrors({ submit: "تعذّر إرسال طلبك. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة." });
    } finally {
      setSubmitting(false);
      busy.current = false;
    }
  }
  return (
    <>
      <div className="offer-bar">
        <div className="container offer-inner">
          {active ? (
            <>
              <strong className="offer-highlight" aria-label="خصم 10%">
                <span>خصم</span>
                <bdi>10<span>%</span></bdi>
              </strong>
              <div className="offer-details">
                <span>على سعر الأرض الكلي</span>
                <span className="offer-deadline">
                  ينتهي العرض <time dateTime="2026-12-31">31 كانون الأول 2026</time>
                </span>
              </div>
            </>
          ) : (
            <strong className="offer-ended">انتهى عرض نهاية 2026 – اطلب تفاصيل الخيارات الحالية</strong>
          )}
          <span className="countdown-badge" aria-live="polite">
            <Clock3 aria-hidden="true" />
            {active
              ? remaining !== null
                ? `متبقّي ${remaining} يومًا`
                : "حتى نهاية السنة"
              : "انتهى العرض"}
          </span>
        </div>
      </div>
      <header className="campaign-header">
        <div className="container header">
          <a href="#" aria-label="طابو — أعلى الصفحة">
            <img src={logo.url} alt="طابو — الوطن… إلنا أصحابه" className="logo" />
          </a>
          <div className="header-contact">
            <Button asChild variant="outline" className="header-whatsapp">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                واتساب
              </a>
            </Button>
            <Button asChild className="header-phone">
              <a href={PHONE}>
                <Phone />
                <span dir="ltr">02 297 4992</span>
              </a>
            </Button>
          </div>
        </div>
      </header>
      <main>
        <section id="offer" className="hero">
          <img
            src={hero.url}
            alt="عائلة فلسطينية في أرض طابو بين أشجار الزيتون والتلال"
            className="hero-image"
            fetchPriority="high"
          />
          <div className="container hero-inner">
            <div className="hero-copy">
              <div className="campaign-tag">
                <CalendarDays />
                عروض نهاية العام 2026
              </div>
              <h1>
                أرضك في فلسطين،
                <br />
                <span>بسند طابو باسمك.</span>
              </h1>
              <div className="hero-discount">
                <strong className="discount-lockup" aria-label="خصم 10%">
                  <span className="discount-label">خصم</span>
                  <bdi className="discount-number">10<span>%</span></bdi>
                </strong>
                <div className="discount-copy">
                  على سعر الأرض الكلي
                  <br />
                  <strong>وبداية لمستقبل إلك ولعيلتك</strong>
                </div>
              </div>
              <p className="hero-description">
                أراضٍ سكنية قرب رام الله وسلفيت، بطرق معبّدة وشبكة كهرباء. دفعة أولى من 5,000 وتقسيط
                حتى 5 سنوات، بلا فوائد ولا وسطاء.
              </p>
            </div>
            <form
              id="request"
              className="lead-form"
              onSubmit={handleSubmit}
              noValidate
              aria-label="طلب تفاصيل العرض"
            >
              <h3 className="form-heading">خلّينا نحكي عن أرضك</h3>
              <p className="form-copy">
                اترك اسمك ورقم هاتفك، وسيتواصل معك مستشارنا الاستثماري لاطلاعك على الخيارات المتاحة
                والأسعار بعد الخصم.
              </p>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="name">الاسم</label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="اسمك الكامل"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="field-error">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="phone">رقم الجوال</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    dir="ltr"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="05X XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={25}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="field-error">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
              <fieldset className="location-options">
                <legend>
                  وين بتفضّل تكون أرضك؟ <span>(اختياري)</span>
                </legend>
                <div className="checks">
                  {OFFER.locations.map((location) => (
                    <label className="check-label" key={location.id}>
                      <input
                        type="checkbox"
                        checked={selected.includes(location.id)}
                        onChange={(e) =>
                          setSelected(
                            e.target.checked
                              ? [...selected, location.id]
                              : selected.filter((id) => id !== location.id),
                          )
                        }
                      />
                      {location.name}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="website">الموقع</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              {errors.submit && (
                <p className="field-error" role="alert">
                  {errors.submit}
                </p>
              )}
              <Button variant="cta" type="submit" className="submit-button" disabled={submitting}>
                {submitting ? (
                  <>
                    <LoaderCircle className="spinner" />
                    جارٍ إرسال طلبك…
                  </>
                ) : (
                  <>
                    {CTA}
                    <ArrowLeft />
                  </>
                )}
              </Button>
              <p className="privacy-note">
                <LockKeyhole />
                الطلب للاستفسار فقط، ولا يُلزمك بالشراء
              </p>
            </form>
          </div>
          <div className="image-caption">
            <MapPin size={12} />
            من أراضي طابو في فلسطين
          </div>
        </section>
        <div className="trust-strip">
          <div className="container trust-inner">
            {[
              { Icon: FileCheck2, title: "سند ملكية جاهز", sub: "نتولى إجراءات التسجيل" },
              { Icon: Zap, title: "طرق معبّدة وكهرباء", sub: "بنية تحتية جاهزة" },
              {
                Icon: CalendarDays,
                title: "تقسيط حتى 5 سنوات",
                sub: "مباشرة مع الشركة، بلا فوائد",
              },
            ].map(({ Icon, title, sub }) => (
              <div className="trust-item" key={title}>
                <Icon />
                <div>
                  <strong>{title}</strong>
                  <small>{sub}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <section id="lands" className="section container">
          <div className="section-top">
            <div>
              <div className="eyebrow">ثلاثة مواقع… وحلم واحد</div>
              <h2 className="section-heading">مخططات منظمة وإطلالات مميزة</h2>
            </div>
            <span className="section-index">01 / مواقع الأراضي</span>
          </div>
          <div className="land-grid">
            {OFFER.locations.map((land, i) => (
              <article className="land-card" key={land.id}>
                <div className="land-photo">
                  <img src={photos[i]} alt={`أراضي طابو في ${land.name}`} loading="lazy" />
                  <span className="land-badge">خصم 10%</span>
                  {land.classification && (
                    <span className="classification">{land.classification}</span>
                  )}
                </div>
                <div className="land-content">
                  <div className="location-meta">
                    <MapPin />
                    {land.region}
                  </div>
                  <h3>{land.name}</h3>
                  <p>{land.description}</p>
                  <div className="land-details">
                    <div>
                      <small>المساحات</small>
                      <strong>
                        <bdi>{land.area}</bdi> م²
                      </strong>
                    </div>
                    <div>
                      <small>دفعة أولى</small>
                      <strong>
                        <bdi>5,000</bdi> {land.currency}
                      </strong>
                    </div>
                  </div>
                  <Button
                    variant="cta"
                    className="land-cta"
                    onClick={() => chooseLocation(land.id)}
                  >
                    {CTA}
                    <ArrowLeft />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="steps" className="section steps-section">
          <div className="container">
            <div className="center-heading">
              <div className="eyebrow">طريق واضح لملكية حقيقية</div>
              <h2 className="section-heading">
                من التسجيل إلى السند باسمك 
              </h2>
            </div>
            <div className="steps-grid">
              {steps.map(([title, description], i) => (
                <div className="step" key={title}>
                  <span className="step-number">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section container">
          <div className="proof-layout">
            <div>
              <div className="eyebrow">ثقة مبنية على أرض الواقع</div>
              <h2 className="section-heading">
                أكثر من 800 عائلة
                <br />
                صار إلها أرض ببلادها
              </h2>
              <p className="section-description">حكايات تملّك حقيقية، وأحلام صارت سندات ملكية.</p>
              <div className="proof-stats">
                <div>
                  <strong>800+</strong>
                  <span>عائلة فلسطينية استثمرت</span>
                </div>
                <div>
                  <strong>1,000+</strong>
                  <span>قطعة أرض تملّكتها العائلات</span>
                </div>
              </div>
            </div>
            <div className="quote">
              <div className="quote-mark">“</div>
              <blockquote>
                لطالما حلمت بامتلاك قطعة أرض في رام الله، وقد منحني مشروع طابو الفرصة لتحقيق حلمي
                بفضل التسهيلات غير المسبوقة التي يقدمها المشروع للراغبين في التملك في وطنهم.
              </blockquote>
              <cite>أحمد كشكش — لاعب كرة قدم فلسطيني</cite>
              <div>
                <Button asChild variant="ghost">
                  <a
                    href="https://www.tabo.ps/ar/testimonials-reviews"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    شاهد حكايات عملاء طابو
                    <ArrowLeft />
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <div className="uci-line">
            <Building2 />
            مشروع طابو تابع لشركة الاتحاد للإعمار والاستثمار (UCI)، المدرجة في فلسطين.
          </div>
        </section>
        <section id="faq" className="section faq-section">
          <div className="container faq-layout">
            <div className="faq-intro">
              <div className="eyebrow">كل التفاصيل، بكل وضوح</div>
              <h2 className="section-heading">
                أسئلة بتهمّك
                <br />
                قبل ما تختار
              </h2>
              <p>خذ وقتك بالقرار، وخلّي استفساراتك علينا.</p>
              <Button asChild variant="cta">
                <a href="#request">
                  {CTA}
                  <ArrowLeft />
                </a>
              </Button>
            </div>
            <div className="faq-list">
              {faqs.map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <Plus />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="final-cta">
          <div className="container final-inner">
            <div>
              <div className="eyebrow">
                <Clock3 size={15} />
                {active
                  ? remaining !== null
                    ? `متبقّي ${remaining} يومًا على نهاية العرض`
                    : "حتى نهاية العام 2026"
                  : "اسأل عن عروض طابو الحالية"}
              </div>
              <h2>
                {active ? "نهاية السنة… ممكن تكون بداية أرضك." : "ابدأ خطوتك نحو أرضك في فلسطين."}
              </h2>
              <p>
                {active
                  ? "خصم 10% على السعر الكلي حتى 31 كانون الأول 2026 أو نفاد القطع المتاحة."
                  : "تواصل مع مستشارنا للاطلاع على الخيارات والأسعار الحالية."}
              </p>
            </div>
            <div className="final-actions">
              <Button asChild variant="cta">
                <a href="#request">
                  {CTA}
                  <ArrowLeft />
                </a>
              </Button>
              <small>اسمك ورقمك فقط. بلا أي التزام بالشراء.</small>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                اسألنا عبر واتساب
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer container">
        <div className="footer-bottom">
          <span>© 2026 طابو — شركة الاتحاد للإعمار والاستثمار. جميع الحقوق محفوظة.</span>
          <div className="footer-links">
            <a href={PHONE} dir="ltr">
              +972 2 297 4992
            </a>
          </div>
        </div>
      </footer>
      <div className="mobile-cta">
        <Button asChild variant="cta">
          <a href="#request">
            {CTA}
            <ArrowLeft />
          </a>
        </Button>
        <Button asChild variant="outline">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل مع طابو عبر واتساب"
          >
            <MessageCircle />
          </a>
        </Button>
      </div>
      <Dialog.Root open={success} onOpenChange={setSuccess}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="success-dialog" dir="rtl">
            <Dialog.Close asChild>
              <Button variant="ghost" className="dialog-close" aria-label="إغلاق رسالة النجاح">
                <X />
              </Button>
            </Dialog.Close>
            <div className="success-icon">
              <CircleCheck />
            </div>
            <Dialog.Title>وصلنا طلبك، {submittedName}</Dialog.Title>
            <Dialog.Description>
              شكرًا لاهتمامك بطابو. سيتواصل معك مستشارنا الاستثماري لاطلاعك على الخيارات المتاحة
              والأسعار بعد الخصم.
            </Dialog.Description>
            <small>طلبك للاستفسار فقط، ولا يُلزمك بشراء الأرض.</small>
            <Dialog.Close asChild>
              <Button>
                تمام، شكرًا
                <Check />
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
