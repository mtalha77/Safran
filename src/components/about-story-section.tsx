import Image from "next/image";
import Link from "next/link";
import restaurantImage from "../../public/images/hero-safran.jpg";
import foodImage from "../../public/images/menu/vorspeisen.webp";
import { Reveal } from "@/components/reveal";

function FoodMark() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-14 w-14 fill-none stroke-sage"
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current">
      <path
        d="M4 10h12m-5-5 5 5-5 5"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AboutStorySection() {
  return (
    <section
      id="ueber-uns"
      className="relative isolate overflow-hidden bg-paper px-5 py-24 sm:px-8 sm:py-32 lg:min-h-[680px] lg:py-36"
    >
      <Reveal
        className="absolute top-12 left-[4%] hidden h-52 w-36 lg:block xl:left-[6%] xl:h-60 xl:w-40"
      >
        <div className="relative h-full w-full rotate-[7deg] overflow-hidden rounded-2xl shadow-xl">
          <Image
            src={foodImage}
            alt=""
            fill
            sizes="160px"
            placeholder="blur"
            className="object-cover"
          />
        </div>
      </Reveal>

      <Reveal
        delay={120}
        className="absolute right-[4%] bottom-20 hidden h-52 w-36 lg:block xl:right-[6%] xl:h-60 xl:w-40"
      >
        <div className="relative h-full w-full -rotate-[8deg] overflow-hidden rounded-2xl shadow-xl">
          <Image
            src={restaurantImage}
            alt=""
            fill
            sizes="160px"
            placeholder="blur"
            className="object-cover object-center"
          />
        </div>
      </Reveal>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Reveal>
          <div className="flex justify-center">
            <FoodMark />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mx-auto mt-7 max-w-3xl space-y-6 font-serif text-2xl leading-[1.45] text-ink sm:text-3xl sm:leading-[1.45]">
            <p>
              Bei <em className="font-medium text-sage">Safran</em> begann alles
              mit einer einfachen Idee: authentische indische Küche mit frischen
              Zutaten zu servieren und Menschen an einem Tisch
              zusammenzubringen.
            </p>
            <p>
              Unsere Gerichte verbinden traditionelle Rezepte mit herzlicher
              Gastfreundschaft – sorgfältig zubereitet, ehrlich und voller
              Geschmack.
            </p>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <Link
            href="/speisekarte"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-sage px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-sage-dark"
          >
            Unsere Küche entdecken
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/55">
              <ArrowIcon />
            </span>
          </Link>
        </Reveal>

        <Reveal delay={240}>
          <div className="mx-auto mt-12 grid max-w-md grid-cols-2 gap-4 lg:hidden">
            <div className="relative aspect-[4/3] rotate-[-3deg] overflow-hidden rounded-xl shadow-lg">
              <Image
                src={foodImage}
                alt="Indische Vorspeisen bei Safran"
                fill
                sizes="(max-width: 1024px) 45vw, 200px"
                placeholder="blur"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] rotate-[3deg] overflow-hidden rounded-xl shadow-lg">
              <Image
                src={restaurantImage}
                alt="Caffé Restaurant Safran in Solothurn"
                fill
                sizes="(max-width: 1024px) 45vw, 200px"
                placeholder="blur"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
