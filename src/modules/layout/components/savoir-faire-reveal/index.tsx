"use client"

export default function SavoirFaireReveal() {
  return (
    <section className="relative h-[560px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
        style={{
          backgroundImage: "url('/savoir-faire.jpg')",
          backgroundAttachment: "fixed",
          backgroundPosition: "center bottom",
        }}
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h2 className="text-4xl font-light tracking-wide md:text-6xl">
          Découvrez notre savoir-faire
        </h2>

        <div className="mt-10">
          <a
            href="/notre-savoir-faire"
            className="inline-block border border-white bg-transparent px-8 py-3 text-sm text-white transition-all duration-300 hover:bg-white/20 hover:text-white md:text-base"
          >
            En savoir plus
          </a>
        </div>
      </div>
    </section>
  )
}