import { ConsultantCard } from "@/components/consultant";
import { WorkshopInfoCard } from "@/components/workshop-info";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-[1.55]">
          <ConsultantCard
            name="سارة أحمد"
            subtitle="مؤسس، مستثمر، شريك في أكبر شركات التقنية بالمملكة، خبرة 35 عاماً"
            avatarSrc="/Frame%209525.png"
            socialLinks={[
              {
                ariaLabel: "LinkedIn",
                href: "https://linkedin.com",
                iconSrc: "/social-link/linkedin%201.svg",
              },
              {
                ariaLabel: "Instagram",
                href: "https://instagram.com",
                iconSrc: "/social-link/instagram%201.svg",
              },
              {
                ariaLabel: "Twitter",
                href: "https://x.com",
                iconSrc: "/social-link/twitter%201.svg",
              },
            ]}
            availabilityText="متاح للجلسات"
            introTitle="نبذة تعريفية"
            introText={
              <>
                متخصص في تطوير وإدارة المنتجات الرقمية. مهتم بالبزنس ولدي عدة تجارب فيه.
                مستثمر. معد ومقدم بودكاست #سوالف_بزنس.
              </>
            }
            adviceTitle="أشياء يمكنني أن أنصح بها:"
            adviceItems={[
              "اشتراك e-com",
              "اعتماد الوسائط الرقمية / المنصة",
              "بناء + تحجيم SaaS",
              "الاستثمار المبكر",
              "استراتيجيات نمو تويتر",
              "بناء المجتمع",
            ]}
            footerText={
              <>
                أحب مساعدة الآخرين، وخاصة رواد الأعمال الجائعين.
                <br />
                توسيع نطاق مجتمع المؤسس الخاص حاليًا.
              </>
            }
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="ms-auto w-full max-w-[380px]">
            <WorkshopInfoCard />
          </div>
        </div>
    </div>
  );
}
