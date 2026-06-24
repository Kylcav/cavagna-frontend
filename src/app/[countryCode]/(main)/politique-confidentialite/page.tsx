export default function ConditionsGeneralesPage({
  params,
}: {
  params: { countryCode: string }
}) {
  const { countryCode } = params

  const sections = [
    {
      number: "01.",
      title: "Données collectées",
      text: "Nous pouvons collecter les informations nécessaires au traitement des commandes, notamment le nom, le prénom, l’adresse e-mail, l’adresse de livraison, l’adresse de facturation et le numéro de téléphone.",
    },
    {
      number: "02.",
      title: "Utilisation des données",
      text: "Les données sont utilisées pour traiter les commandes, assurer la livraison, gérer le service client, répondre aux demandes liées aux produits CAVAGNA et améliorer l’expérience utilisateur sur notre boutique.",
    },
    {
      number: "03.",
      title: "Paiement",
      text: "Les informations de paiement sont traitées par un prestataire sécurisé. CAVAGNA ne stocke pas directement les données complètes de carte bancaire.",
    },
    {
      number: "04.",
      title: "Cookies",
      text: "Le site peut utiliser des cookies nécessaires au bon fonctionnement de la boutique, ainsi que des cookies de mesure d’audience ou de marketing si ceux-ci sont activés.",
    },
    {
      number: "05.",
      title: "Conservation des données",
      text: "Les données sont conservées uniquement pendant la durée nécessaire au traitement des commandes, au support client, au suivi des produits et aux obligations légales applicables.",
    },
    {
      number: "06.",
      title: "Vos droits",
      text: "Vous pouvez demander l’accès, la modification ou la suppression de vos données personnelles en nous contactant.",
    },
    {
      number: "07.",
      title: "Contact",
      text: "Pour toute demande relative à vos données personnelles, contactez-nous à :",
      email: "contact@cavagna.shop",
    },
  ]

  return (
    <main className="min-h-screen bg-[#fbfaf8] text-[#171412]">
      <div className="mx-auto max-w-5xl px-6 py-14 small:px-10 small:py-20">
        <div className="mb-24 flex justify-end">
          <a
            href={`/${countryCode}/checkout?step=review`}
            className="rounded-full border border-[#e7ddd3] bg-white px-5 py-2.5 text-sm font-semibold text-[#6a5b50] shadow-sm transition hover:bg-[#f4ede6]"
          >
            ← Retour
          </a>
        </div>

        <section className="mb-28 max-w-4xl">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-[#b08a68]">
            CONFIDENTIALITÉ & CONFIANCE
          </p>

          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.08] tracking-tight small:text-7xl">
            Politique de confidentialité
          </h1>

          <p className="mt-10 max-w-3xl text-xl leading-9 text-[#665d57]">
            Votre confiance est essentielle. Cette page explique clairement
            quelles données nous collectons, pourquoi nous les utilisons et
            comment elles sont protégées.
          </p>
        </section>

        <section className="mb-24 grid gap-10 border-b border-[#eadfd5] pb-14 small:grid-cols-3">
          <div>
            <div className="mb-5 h-px w-16 bg-[#c7a589]" />

            <h2 className="text-xl font-bold">Données protégées</h2>

            <p className="mt-5 pb-4 text-base leading-8 text-[#665d57]">
              Vos informations sont utilisées uniquement pour traiter vos
              commandes et vous accompagner.
            </p>
          </div>

          <div>
            <div className="mb-5 h-px w-16 bg-[#c7a589]" />

            <h2 className="text-xl font-bold">Paiement sécurisé</h2>

            <p className="mt-5 pb-4 text-base leading-8 text-[#665d57]">
              CAVAGNA ne stocke jamais vos données complètes de carte bancaire.
            </p>
          </div>

          <div>
            <div className="mb-5 h-px w-16 bg-[#c7a589]" />

            <h2 className="text-xl font-bold">Contrôle de vos données</h2>

            <p className="mt-5 pb-4 text-base leading-8 text-[#665d57]">
              Vous gardez la possibilité de demander l’accès, la modification ou
              la suppression de vos données personnelles.
            </p>
          </div>
        </section>

        <section>
          {sections.map((section) => (
            <article
              key={section.title}
              className="border-b border-[#eadfd5] py-14"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl font-extrabold tracking-tight text-[#b08a68] small:text-4xl">
                  {section.number}
                </span>

                <h2 className="text-3xl font-extrabold tracking-tight small:text-4xl">
                  {section.title}
                </h2>
              </div>

              <p className="mt-5 mb-6 max-w-4xl text-lg leading-9 text-[#5f5a55]">
                {section.text}
              </p>

              {section.email && (
                <a
                  href={`mailto:${section.email}`}
                  className="mt-8 inline-flex rounded-full bg-[#171412] px-7 py-3.5 text-base font-bold text-white transition hover:bg-[#3a3029]"
                >
                  {section.email}
                </a>
              )}
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}