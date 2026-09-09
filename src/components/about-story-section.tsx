import Image from "next/image";
import Link from "next/link";
import restaurantImage from "../../public/images/hero-safran.jpg";
import foodImage from "../../public/images/menu/tandoori.webp";
import { Reveal } from "@/components/reveal";

function FoodMark() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-14 w-14 fill-none stroke-cream"
      aria-hidden
    >
      <path
        d="M18 34c2 8 8 13 14 13s12-5 14-13H18Zm-3 0h34M25 51h14"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 12c-5 3-7 7-5 11 5-1 8-5 7-10m-15 7c2 1 4 4 4 7m18-8-8 9M45 13l4 4m-1-7 5 5"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="15" r="2.5" strokeWidth="1.6" />
    </svg>
  );
}

const values = [
  { number: "01", title: "Authentische Küche", label: "Indische Tradition" },
  { number: "02", title: "Frisch zubereitet", label: "Auf Bestellung" },
  { number: "03", title: "Historisches Zuhause", label: "Erbaut um 1852" },
  { number: "04", title: "Direkt am Hafen", label: "Romanshorn" },
];

export function AboutStorySection() {
  return (
    <section
      id="ueber-uns"
      className="relative isolate overflow-hidden bg-gradient-to-b from-ink via-[#24101f] to-sage-deep px-5 py-24 text-cream sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-serif text-4xl leading-tight text-white sm:text-6xl">
              Von bescheidenen Anfängen
            </h2>
            <div className="mt-5 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-cream/50" />
              <FoodMark />
              <span className="h-px w-12 bg-cream/50" />
            </div>
            <p className="mt-2 text-xs font-semibold tracking-[0.3em] text-cream/80 uppercase">
              Unsere Geschichte
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal className="reveal-left">
            <div className="max-w-xl text-base leading-8 text-cream/78 sm:text-lg">
              <p>
                Unsere Geschichte verbindet die Vergangenheit des Romanshorner
                Hafens mit der Wärme indischer Gastfreundschaft.
              </p>
              <p className="mt-6">
                Das Haus an der Hafenstrasse 31 wurde um 1852 vom Kanton
                Thurgau als Korn- und Zollhaus erbaut – noch vor der
                Eisenbahnzeit. Es gilt als das älteste Gebäude direkt am
                Hafenbecken.
              </p>
              <p className="mt-6">
                Wo einst Korn gelagert und Handel betrieben wurde, treffen heute
                gelebte Geschichte, traditionelle indische Rezepte und frisch
                zubereitete Gerichte aufeinander.
              </p>
              <Link
                href="/speisekarte"
                className="mt-8 inline-flex border-b border-cream pb-1 text-sm font-semibold text-cream transition hover:text-white"
              >
                Unsere Küche entdecken
              </Link>
            </div>
          </Reveal>

          <div className="relative mx-auto min-h-[390px] w-full max-w-[640px] sm:min-h-[540px]">
            <Reveal className="reveal-left absolute top-0 right-0 h-[88%] w-[78%]">
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/15">
                <Image
                  src={restaurantImage}
                  alt="Das Gebäude des Caffé Restaurant Safran in Romanshorn"
                  fill
                  sizes="(max-width: 1024px) 78vw, 500px"
                  placeholder="blur"
                  className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
            </Reveal>

            <Reveal
              delay={140}
              className="reveal-right absolute bottom-0 left-0 h-[46%] w-[48%]"
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-ink shadow-2xl">
                <Image
                  src={foodImage}
                  alt="Frisch zubereitete Tandoori-Spezialitäten bei Safran"
                  fill
                  sizes="(max-width: 1024px) 48vw, 300px"
                  placeholder="blur"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </Reveal>

            <Reveal
              delay={260}
              className="reveal-right absolute right-[6%] bottom-[3%]"
            >
              <div className="rounded-full border border-white/20 bg-ink/80 px-5 py-3 text-center">
                <span className="block font-serif text-2xl text-cream">
                  Romanshorn
                </span>
                <span className="text-[10px] tracking-[0.22em] text-cream/65 uppercase">
                  Hafenstrasse 31
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={150}>
          <div className="mt-16 grid grid-cols-2 border-y border-white/12 sm:mt-24 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={value.number}
                className={`px-4 py-8 text-center sm:px-6 sm:py-10 ${
                  index % 2 ? "border-l border-white/12" : ""
                } ${index > 1 ? "border-t border-white/12 lg:border-t-0" : ""} ${
                  index > 0 && index % 2 === 0
                    ? "lg:border-l lg:border-white/12"
                    : ""
                }`}
              >
                <span className="font-serif text-2xl text-cream">
                  {value.number}
                </span>
                <h3 className="mt-3 font-serif text-xl text-white">
                  {value.title}
                </h3>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-cream/55 uppercase">
                  {value.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div
        className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full border border-sage/15"
        aria-hidden
      >
        <div className="absolute inset-8 rounded-full border border-sage/10" />
        <div className="absolute inset-16 rounded-full border border-sage/10" />
      </div>
    </section>
  );
}
