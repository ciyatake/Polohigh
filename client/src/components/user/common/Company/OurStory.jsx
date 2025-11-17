import {
  Heart,
  Sparkles,
  Users,
  Package,
  Target,
  Award,
  TrendingUp,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { useEffect } from "react";

const OurStory = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-[var(--color-primary-700)] to-[var(--color-primary-700)] text-white py-20 px-4 shadow-lg overflow-hidden">
          <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 font-semibold transition-all duration-200 border-2 border-white rounded-lg shadow-md sm:mb-8 hover:text-neutralc-900 hover:shadow-xl hover:scale-105 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </a>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-32 h-32 bg-white rounded-full top-10 left-10 blur-3xl"></div>
          <div className="absolute w-40 h-40 bg-white rounded-full bottom-10 right-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 animate-pulse" />
          <h1 className="mb-4 text-5xl font-bold">Our Story</h1>
          <p className="text-xl text-[var(--color-primary-100)] leading-relaxed max-w-2xl mx-auto">
            From a small dream to your trusted shopping companion — discover how
            Polohigh became a part of thousands of lives across India
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl px-4 py-12 mx-auto">
        {/* The Beginning */}
        <section className="p-8 mb-8 bg-white rounded-lg shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <Sparkles className="w-8 h-8 text-neutralc-900 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-3xl font-semibold text-neutralc-900 mb-4">
                Where It All Began
              </h2>
              <div className="space-y-4 text-neutralc-600 leading-relaxed">
                <p>
                  It started with a simple question:{" "}
                  <em>"Why can't shopping feel personal again?"</em>
                </p>
                <p>
                  In 2020, during a time when the world was rediscovering online
                  shopping, a small team of friends sat together with a shared
                  frustration. They loved shopping, but something felt missing.
                  The joy of discovering unique products, the trust of knowing
                  what you're getting, and the warmth of service that actually
                  cared — all seemed lost in the noise of massive marketplaces.
                </p>
                <p>
                  That's when <strong>Polohigh</strong> was born — not just as
                  another e-commerce platform, but as a promise to bring back
                  the human touch to online shopping.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Polohigh Means */}
        <section className="bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--color-primary-100)] rounded-lg p-8 mb-8 border-l-4 border-[var(--color-primary-700)]">
          <h2 className="text-2xl font-semibold text-neutralc-900 mb-4">
            What "Polohigh" Means
          </h2>
          <p className="text-neutralc-600 leading-relaxed mb-4">
            The name <strong>Polohigh</strong> is inspired by the Japanese
            concept of <em>"miyatake"</em> — meaning{" "}
            <strong>"to cherish and choose carefully."</strong>
          </p>
          <p className="text-neutralc-600 leading-relaxed">
            We believe every product you bring into your life should be chosen
            with care, and every shopping experience should feel thoughtful and
            intentional. That philosophy is woven into everything we do.
          </p>
        </section>

        {/* Our Journey */}
        <section className="p-8 mb-8 bg-white rounded-lg shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <TrendingUp className="w-8 h-8 text-neutralc-900 flex-shrink-0" />
            <h2 className="text-3xl font-semibold text-neutralc-900">
              The Journey So Far
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 h-24 bg-neutralc-900 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-md">
                2020
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutralc-900 mb-2">
                  The Humble Start
                </h3>
                <p className="text-neutralc-600 leading-relaxed">
                  We launched with just 50 handpicked products and a small
                  warehouse in Bangalore. Our first customer, Mrs. Sharma,
                  ordered a cotton kurta. She wrote us a heartfelt note saying
                  it reminded her of shopping at her neighborhood store. That
                  note still hangs in our office.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 h-24 bg-neutralc-900 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-md">
                2021
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutralc-900 mb-2">
                  Growing Together
                </h3>
                <p className="text-neutralc-600 leading-relaxed">
                  Word spread. Families started trusting us for their everyday
                  needs — from fashion to electronics to home essentials. We
                  expanded to 10 cities and built a team that genuinely cared
                  about making people smile with every delivery.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 h-24 bg-neutralc-900 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-md">
                2023
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutralc-900 mb-2">
                  Reaching Every Corner
                </h3>
                <p className="text-neutralc-600 leading-relaxed">
                  We now serve customers across India — from bustling metros to
                  quiet towns. Over 2 million happy customers have trusted us
                  with their shopping, and we've shipped over 5 million orders.
                  But numbers don't tell the full story; it's the relationships
                  we've built that matter most.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 h-24 bg-neutralc-900 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-md">
                2025
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutralc-900 mb-2">
                  Building the Future
                </h3>
                <p className="text-neutralc-600 leading-relaxed">
                  Today, Polohigh is more than a store. It's a community. We're
                  constantly listening to your feedback, adding products you
                  love, and ensuring every interaction feels warm and genuine.
                  Our goal? To be your trusted companion for life's everyday
                  moments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="p-8 mb-8 bg-white rounded-lg shadow-sm">
          <div className="flex items-start gap-4 mb-8">
            <Heart className="w-8 h-8 text-neutralc-900 flex-shrink-0" />
            <h2 className="text-3xl font-semibold text-neutralc-900">
              What We Stand For
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-neutralc-50 p-6 rounded-lg border-l-4 border-[var(--color-primary-700)]">
              <Target className="w-8 h-8 text-neutralc-900 mb-4" />
              <h3 className="text-xl font-semibold text-neutralc-900 mb-3">
                Quality You Can Trust
              </h3>
              <p className="text-neutralc-600">
                Every product is carefully selected and verified. We partner
                only with authentic brands and suppliers because your trust is
                everything to us.
              </p>
            </div>

            <div className="bg-neutralc-50 p-6 rounded-lg border-l-4 border-[var(--color-primary-700)]">
              <Users className="w-8 h-8 text-neutralc-900 mb-4" />
              <h3 className="text-xl font-semibold text-neutralc-900 mb-3">
                Customer First, Always
              </h3>
              <p className="text-neutralc-600">
                You're not a transaction to us. You're family. Whether it's
                answering questions, resolving issues, or just listening — we're
                here for you.
              </p>
            </div>

            <div className="bg-neutralc-50 p-6 rounded-lg border-l-4 border-[var(--color-primary-700)]">
              <Package className="w-8 h-8 text-neutralc-900 mb-4" />
              <h3 className="text-xl font-semibold text-neutralc-900 mb-3">
                Thoughtful Curation
              </h3>
              <p className="text-neutralc-600">
                We don't just add products to fill shelves. We carefully curate
                items that add value to your life — practical, beautiful, and
                meaningful.
              </p>
            </div>

            <div className="bg-neutralc-50 p-6 rounded-lg border-l-4 border-[var(--color-primary-700)]">
              <Award className="w-8 h-8 text-neutralc-900 mb-4" />
              <h3 className="text-xl font-semibold text-neutralc-900 mb-3">
                Transparent & Honest
              </h3>
              <p className="text-neutralc-600">
                No hidden fees. No false promises. What you see is what you get.
                We believe honesty builds lasting relationships.
              </p>
            </div>
          </div>
        </section>

        {/* Real Stories */}
        <section className="p-8 mb-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-3xl font-semibold text-neutralc-900 mb-6 text-center">
            Stories That Warm Our Hearts
          </h2>
          <p className="text-center text-neutralc-600 mb-8">
            These moments remind us why we do what we do
          </p>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[var(--color-primary-50)] to-white p-6 rounded-lg border border-[var(--color-primary-200)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neutralc-900 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  R
                </div>
                <div>
                  <h4 className="font-semibold text-neutralc-900 mb-2">
                    Rajesh from Mumbai
                  </h4>
                  <p className="text-neutralc-600 italic mb-2">
                    "I ordered a gift for my mother's birthday late at night. It
                    was supposed to arrive the next day, but I realized I
                    entered the wrong address. I called Polohigh at 11 PM, and
                    someone actually answered! They changed the address and made
                    sure it reached on time. My mom cried happy tears. Thank you
                    for caring."
                  </p>
                  <p className="text-sm text-neutralc-900">
                    — Real customer review, 2024
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[var(--color-primary-50)] to-white p-6 rounded-lg border border-[var(--color-primary-200)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neutralc-900 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  P
                </div>
                <div>
                  <h4 className="font-semibold text-neutralc-900 mb-2">
                    Priya from Jaipur
                  </h4>
                  <p className="text-neutralc-600 italic mb-2">
                    "I'm a small business owner and don't have time for long
                    shopping trips. Polohigh has become my go-to for everything
                    — from work clothes to kitchen gadgets. The quality is
                    always great, and delivery is super fast. It feels like
                    having a trusted friend who shops for you."
                  </p>
                  <p className="text-sm text-neutralc-900">
                    — Real customer review, 2024
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[var(--color-primary-50)] to-white p-6 rounded-lg border border-[var(--color-primary-200)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neutralc-900 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  A
                </div>
                <div>
                  <h4 className="font-semibold text-neutralc-900 mb-2">
                    Ananya from Bangalore
                  </h4>
                  <p className="text-neutralc-600 italic mb-2">
                    "I received a damaged product once, and honestly, I was
                    prepared for a long, frustrating process. But Polohigh
                    surprised me. They apologized sincerely, sent a replacement
                    the very next day, and followed up to make sure everything
                    was okay. This is how customer service should be."
                  </p>
                  <p className="text-sm text-neutralc-900">
                    — Real customer review, 2023
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Promise */}
        <section className="bg-gradient-to-br from-[var(--color-primary-700)] to-[var(--color-primary-700)] text-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4" />
            <h2 className="mb-4 text-3xl font-semibold">Our Promise to You</h2>
            <div className="max-w-2xl mx-auto space-y-4 text-[var(--color-primary-100)] leading-relaxed">
              <p>
                We promise to treat your orders like they're for our own
                families. We promise to listen when you have concerns and
                celebrate when you're happy. We promise to keep improving, keep
                caring, and keep earning your trust every single day.
              </p>
              <p className="text-lg font-semibold text-white">
                Because at Polohigh, you're not just a customer. You're part of
                our story.
              </p>
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="p-8 text-center bg-white rounded-lg shadow-sm">
          <h2 className="text-3xl font-semibold text-neutralc-900 mb-4">
            Be Part of Our Journey
          </h2>
          <p className="text-neutralc-600 leading-relaxed mb-6 max-w-2xl mx-auto">
            Every order, every review, every smile you share with us adds a new
            chapter to our story. We'd be honored to be part of yours too.
          </p>
          <button className="bg-neutralc-900 hover:bg-neutralc-800 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
            Start Shopping with Polohigh
          </button>
        </section>

        {/* Team Note */}
        <section className="mt-12 text-center">
          <div className="inline-block bg-neutralc-50 rounded-lg p-6 border border-[var(--color-primary-200)]">
            <p className="text-neutralc-600 italic">
              "Thank you for taking the time to read our story. We hope it gives
              you a glimpse of the heart behind Polohigh. We're real people,
              just like you, trying to make shopping a little more joyful, a
              little more personal."
            </p>
            <p className="text-neutralc-900 font-semibold mt-4">
              — The Polohigh Team
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutralc-900 text-neutralc-400 py-8 px-4 mt-12 border-t border-neutralc-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">© 2025 Polohigh. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Thoughtfully curated fashion and lifestyle essentials to help you
            celebrate everyday moments in style.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OurStory;
