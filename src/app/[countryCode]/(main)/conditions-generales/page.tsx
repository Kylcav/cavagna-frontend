export default function ConditionsGeneralesPage({
  params,
}: {
  params: { countryCode: string }
}) {
  const { countryCode } = params

  const sections = [
    {
      number: "01.",
      title: "Objet",
      text: "Les présentes conditions générales de vente régissent les commandes passées sur le site CAVAGNA.",
    },
    {
      number: "02.",
      title: "Produits",
      text: "CAVAGNA propose des maillots de bain premium, fabriqués et cousus main en Suisse. Certains modèles peuvent intégrer une pièce en or, élément distinctif de la marque. Les caractéristiques principales, matières, finitions et détails de chaque produit sont présentés sur la fiche produit correspondante.",
    },
    {
      number: "03.",
      title: "Prix",
      text: "Les prix sont indiqués en CHF. CAVAGNA se réserve le droit de modifier ses prix à tout moment, sans effet sur les commandes déjà validées. Les prix affichés tiennent compte du positionnement premium de la marque, de la fabrication artisanale et des finitions propres à chaque modèle.",
    },
    {
      number: "04.",
      title: "Commande",
      text: "En validant sa commande, le client confirme avoir vérifié le contenu de son panier, les tailles, les coloris et les informations de livraison. La validation de la commande implique l’acceptation pleine et entière des présentes conditions générales de vente.",
    },
    {
      number: "05.",
      title: "Paiement",
      text: "Le paiement est exigible au moment de la commande. Les transactions sont traitées via un prestataire sécurisé. CAVAGNA ne conserve pas les données complètes de carte bancaire.",
    },
    {
      number: "06.",
      title: "Livraison",
      text: "Les commandes sont préparées avec soin et livrées à l’adresse indiquée par le client lors du passage de commande. Les délais de livraison sont donnés à titre indicatif. En raison du caractère premium et artisanal de certains produits, des délais spécifiques peuvent s’appliquer selon les modèles ou les disponibilités.",
    },
    {
      number: "07.",
      title: "Retours",
      text: "Pour des raisons d’hygiène, les maillots de bain ne peuvent être retournés que s’ils sont complets, non portés, non lavés, avec leurs protections hygiéniques, étiquettes et emballages d’origine intacts. Le client dispose d’un délai de 14 jours après réception de la commande pour signaler un produit défectueux ou endommagé. Les demandes de retour ou de remboursement sont étudiées uniquement en cas de défaut avéré du produit ou de problème lié à la commande.",
    },
    {
      number: "08.",
      title: "Fabrication artisanale",
      text: "Les produits CAVAGNA sont fabriqués et cousus main en Suisse. De légères variations peuvent exister d’un modèle à l’autre en raison du travail artisanal. Ces variations ne constituent pas un défaut, mais témoignent du caractère unique de chaque pièce.",
    },
    {
      number: "09.",
      title: "Contact",
      text: "Pour toute question concernant une commande ou les présentes conditions générales de vente, contactez-nous à :",
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
            INFORMATIONS LÉGALES & COMMANDES
          </p>

          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.08] tracking-tight small:text-7xl">
            Conditions générales de vente
          </h1>

          <p className="mt-10 max-w-3xl text-xl leading-9 text-[#665d57]">
            Nous voulons que votre expérience d’achat soit simple, claire et
            rassurante. Vous trouverez ici les informations importantes liées à
            vos commandes, paiements, livraisons et retours.
          </p>
        </section>

        <section className="mb-24 grid gap-10 border-b border-[#eadfd5] pb-14 small:grid-cols-3">
          <div>
            <div className="mb-5 h-px w-16 bg-[#c7a589]" />

            <h2 className="text-xl font-bold">Paiement sécurisé</h2>

            <p className="mt-5 pb-4 text-base leading-8 text-[#665d57]">
              Vos transactions sont traitées par un prestataire de paiement
              sécurisé.
            </p>
          </div>

          <div>
            <div className="mb-5 h-px w-16 bg-[#c7a589]" />

            <h2 className="text-xl font-bold">Fabrication suisse</h2>

            <p className="mt-5 pb-4 text-base leading-8 text-[#665d57]">
              Nos maillots de bain sont fabriqués et cousus main en Suisse avec
              une attention particulière portée aux finitions.
            </p>
          </div>

          <div>
            <div className="mb-5 h-px w-16 bg-[#c7a589]" />

            <h2 className="text-xl font-bold">Pièces premium</h2>

            <p className="mt-5 pb-4 text-base leading-8 text-[#665d57]">
              Chaque pièce est pensée comme un produit haut de gamme, alliant
              élégance, confort et détails distinctifs.
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
