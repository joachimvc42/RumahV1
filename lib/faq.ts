import type { Locale } from './i18n';

export interface FaqItem {
  question: string;
  answer: string;
}

// ─────────────────────────────────────────────────────────────
// English — canonical source
// ─────────────────────────────────────────────────────────────
const en: FaqItem[] = [
  {
    question: 'Can a European (foreigner) buy property in Lombok?',
    answer: `Foreigners cannot hold the Indonesian freehold title (Hak Milik) directly in their own name. However, there are two fully legal and widely used pathways: (1) a <strong>leasehold arrangement</strong> (Hak Sewa), where you lease land or property from an Indonesian title holder for an extended term — typically structured as 25 + 25 + 10 years (up to 60 years total); and (2) purchasing via a <strong>PT PMA</strong> (foreign-owned Indonesian company), which can hold a commercial freehold title (Hak Guna Bangunan, or HGB). Both structures are commonly used by European buyers in Lombok and fully enforceable in Indonesian courts.`,
  },
  {
    question: 'What is the difference between leasehold and freehold in Indonesia?',
    answer: `<strong>Leasehold (Hak Sewa)</strong> gives you the right to use a property for a fixed period, typically 25 years with two renewal options of 25 and 10 years (60 years total). You do not own the underlying land — the Indonesian title holder retains ownership. It is simpler and cheaper to set up, and offers good protection when registered before a Notary (PPAT) and at the National Land Agency (BPN).<br/><br/><strong>Freehold via PT PMA</strong> gives a company you own and control the right to hold HGB title — an indefinitely renewable commercial ownership right over the land and building. It offers stronger long-term security, better resale value, and the ability to generate rental income legally. The trade-off is the cost and time of setting up an Indonesian company.`,
  },
  {
    question: 'Can I hold property in my own name with Hak Pakai (Right of Use)?',
    answer: `Yes — but only if you hold an Indonesian stay permit, and only for a home you live in yourself. <strong>Hak Pakai</strong> (Right of Use) is the one title issued directly to a foreign individual: your own name appears on the certificate, with no company in between. It sits alongside leasehold and the PT PMA route as a third ownership pathway.<br/><br/>
The trade-offs are real, so it suits a narrow profile:
<ul>
<li><strong>Residency required</strong> — you must hold a KITAS or KITAP stay permit (for example a retirement or work visa). A non-resident buying remotely from Europe generally cannot use Hak Pakai.</li>
<li><strong>One property, personal use only</strong> — limited to a single residential property. Commercial letting is not allowed: no Airbnb, no Booking.com, no nightly rates.</li>
<li><strong>Term</strong> — an initial term of around 30 years, extendable and renewable, so it suits medium-term holds and retirement homes rather than multi-generational investments.</li>
<li><strong>Low running cost</strong> — cheap to set up (roughly €300–€850) with no company accounting to maintain, only the standard annual land tax (PBB).</li>
</ul>
In short: Hak Pakai is the right tool for a European who will <em>live</em> in Lombok on a stay permit. If you want to rent the property out commercially, or you are investing from a distance, leasehold or a PT PMA is the better fit.`,
  },
  {
    question: 'How does a leasehold purchase work step by step?',
    answer: `<ol>
<li><strong>Title due diligence</strong> — verify that the Indonesian owner holds clean title (Hak Milik or HGB) with no encumbrances or disputes at the BPN.</li>
<li><strong>Lease agreement drafting</strong> — a bilingual (Indonesian/English) lease is drafted by a qualified Notary-Land Officer (PPAT), specifying duration, renewal rights, permitted use, and resale rights.</li>
<li><strong>Notarial signing</strong> — both parties sign before the Notary. The agreement becomes a public deed enforceable in Indonesian courts.</li>
<li><strong>BPN registration</strong> — the lease is registered at the National Land Agency, providing a further layer of legal protection.</li>
<li><strong>Payment</strong> — typically via bank transfer to a notary-held escrow account or directly upon deed signing.</li>
</ol>
Total timeline: <strong>4–8 weeks</strong> from offer accepted to registered deed. Notary and legal fees typically add 1–2% to the transaction cost.`,
  },
  {
    question: 'What is a PT PMA and when do I need one?',
    answer: `A <strong>PT PMA</strong> (Perseroan Terbatas Penanaman Modal Asing) is a foreign-owned limited liability company registered under Indonesian law. It is the legal vehicle that allows foreigners to hold freehold-equivalent title (HGB) over Indonesian land.<br/><br/>You need a PT PMA if you want to: own land in freehold rather than leasehold; operate a commercial short-term rental legally; or structure your investment for tax and estate planning purposes.<br/><br/>You do <em>not</em> need a PT PMA for a standard long-term leasehold purchase. A PT PMA is not just a formality — it is a fully operating Indonesian company with tax and reporting obligations. Setup typically takes <strong>4–8 weeks</strong> and costs approximately €1,200 in legal and government fees, with annual administrative costs of around €500/year.`,
  },
  {
    question: 'How do I set up a PT PMA in Indonesia?',
    answer: `The main steps are:
<ol>
<li><strong>Choose a business classification (KBLI)</strong> that permits property holding — typically hospitality or real estate services.</li>
<li><strong>Notarial deed of establishment</strong> — a qualified Indonesian Notary drafts and executes the company charter.</li>
<li><strong>OSS registration</strong> — online registration via the government's Single Submission system to obtain a Business Identification Number (NIB).</li>
<li><strong>Corporate bank account</strong> — open an account at an Indonesian bank in the company's name.</li>
<li><strong>Capital requirements</strong> — the stated minimum investment is IDR 10 billion, though actual paid-up capital requirements are lower in practice for property holding structures.</li>
</ol>
A qualified Indonesian Notary and business consultant handle the process end-to-end. RumahYa works with trusted partners who specialise in PT PMA setup for foreign property buyers.`,
  },
  {
    question: 'Why invest in Lombok rather than Bali?',
    answer: `Bali and Lombok offer the <em>same</em> legal ownership structures and similar transaction costs — the difference is the stage of the market. Lombok today looks much like Bali did 5–7 years ago, and that gap is the opportunity.<br/><br/>
<strong>Entry price.</strong> Prime-zone villas in Lombok typically run €140,000–€325,000, against roughly €280,000–€555,000 for comparable Bali villas. Prime land in Lombok's Mandalika corridor sits around €110–€200/m² — a fraction of the €1,400–€2,800/m² seen in Bali's hotspots.<br/><br/>
<strong>Yield and growth.</strong> Lombok gross rental yields run roughly 16–21% (versus 8–12% in Bali), and recent annual price appreciation has been far steeper — mid-teens to around 20% a year in Lombok against single digits in a maturing Bali market.<br/><br/>
<strong>Tourism trajectory.</strong> Bali draws around 4 million visitors a year growing at single-digit rates; Lombok is smaller (~750,000) but growing 25–35% a year, with arrivals projected to roughly double in the coming years as Mandalika and the international airport mature.<br/><br/>
<strong>The honest trade-off.</strong> Bali is the more liquid, better-documented, quicker-exit market — the safer choice if your horizon is under three years. Lombok rewards a 5–10 year horizon and a tolerance for lower liquidity in exchange for higher total return. RumahYa focuses on Lombok precisely because that risk/reward window is still open.`,
  },
  {
    question: 'Which areas of Lombok are best for investment?',
    answer: `There is no single "best" area — it depends on whether you are chasing rental income, capital growth, or a lifestyle base. The main investment zones:
<ul>
<li><strong>Kuta / Mandalika (south)</strong> — the engine of Lombok's growth, home to the Mandalika Special Economic Zone, the MotoGP circuit and the international airport. Highest rental demand and strongest appreciation, but also the highest entry prices.</li>
<li><strong>Selong Belanak (south-west)</strong> — a fast-emerging surf and beach hotspot with strong yields and still-rising land values, and a more relaxed feel than Kuta.</li>
<li><strong>Gili Islands (Trawangan, Air, Meno)</strong> — established, tourist-heavy markets with solid occupancy. Trawangan is the busiest and most competitive; Air and Meno are quieter, smaller-volume markets.</li>
<li><strong>Senggigi (west)</strong> — Lombok's older resort strip: more stable and lower-yielding, with infrastructure steadily improving.</li>
</ul>
As a rule of thumb, the south coast around Kuta/Mandalika offers the highest growth and rental potential, while the west and the Gilis offer steadier, more established income. RumahYa can match a specific zone to your budget and goals before you ever fly out.`,
  },
  {
    question: 'What rental yield can I realistically expect?',
    answer: `Yields vary widely by location, property tier and how actively the villa is managed. As a guide:
<ul>
<li><strong>Gross yields</strong> typically range from <strong>16–21%</strong> in prime zones (Kuta/Mandalika at the top end) down to 13–17% in more established areas like Senggigi.</li>
<li><strong>Net yields</strong>, after management, maintenance, insurance and local taxes, realistically land around <strong>10–15%</strong> — running costs typically absorb 25–28% of gross revenue.</li>
<li><strong>Occupancy</strong> runs roughly 60–75% a year for well-run properties, peaking above 85% in high season.</li>
</ul>
<strong>A worked example.</strong> A €215,000 two-bedroom villa in Kuta letting at about €150/night and 64% occupancy (≈233 nights) grosses around €35,000 a year — roughly 16% gross. After management, maintenance and insurance (around 26% of revenue), net income is about €25,800, or a <strong>~12% net yield</strong>. Add mid-teens annual capital appreciation and the five-year total return can exceed 150%.<br/><br/>
Two local quirks worth knowing: <strong>MotoGP race week</strong> can command 3–5× normal nightly rates and account for a meaningful slice of annual income for nearby villas; and a <strong>long-term let</strong> (6+ months) grosses a little less (~15%) but is far less management-intensive. These figures are illustrative, not guarantees — actual returns depend heavily on the specific property and operator.`,
  },
  {
    question: 'What taxes apply when buying property in Lombok?',
    answer: `The main transaction taxes in Indonesia are:
<ul>
<li><strong>BPHTB</strong> (Acquisition Tax, paid by the buyer): 5% of the acquisition value above a local tax-free threshold (typically around IDR 60 million). Calculated on whichever is higher — the agreed sale price or the government assessed value (NJOP).</li>
<li><strong>PPh</strong> (Income Tax on the transaction, paid by the seller): 2.5% of the gross transaction value. In practice, buyers often absorb this cost as part of negotiation.</li>
</ul>
<strong>Annual ownership costs:</strong>
<ul>
<li><strong>PBB</strong> (annual land and building tax) is very low in Lombok — typically IDR 500,000–2,000,000/year (€30–€120) for a villa.</li>
<li>No separate capital gains tax — gains on resale are treated as ordinary income for the selling entity.</li>
</ul>
If held through a PT PMA, Indonesian corporate income tax (22%) applies to taxable profits.`,
  },
  {
    question: 'What are the ongoing costs of owning property in Lombok?',
    answer: `<strong>For individually leased property:</strong>
<ul>
<li>Annual property tax (PBB): €30–€120/year</li>
<li>Utilities (PLN electricity, water): varies by usage, typically €60–€200/month for a villa</li>
<li>Property management if rented out: typically 15–25% of rental income, or a flat monthly fee</li>
<li>Staff costs (gardener, security, cleaner): IDR 2–5 million/month each (~€110–€280)</li>
<li>Maintenance reserve: budget 1–2% of property value per year</li>
</ul>
<strong>Additional costs for PT PMA holders:</strong>
<ul>
<li>Annual accounting and administration: around €500/year via a local accountant</li>
<li>Business licence renewal (NIB) and reporting obligations</li>
</ul>`,
  },
  {
    question: 'What is the typical purchase timeline?',
    answer: `<strong>Leasehold purchase (no PT PMA required):</strong>
<ul>
<li>Title due diligence: 1–2 weeks</li>
<li>Legal drafting and review: 1 week</li>
<li>Notarial signing: 1 day</li>
<li>BPN registration: 2–4 weeks</li>
<li><strong>Total: approximately 4–8 weeks</strong></li>
</ul>
<strong>Freehold purchase via PT PMA (company not yet in place):</strong>
<ul>
<li>PT PMA setup: 4–8 weeks (can run in parallel with due diligence)</li>
<li>Property acquisition: 4–8 weeks after company is established</li>
<li><strong>Total: approximately 8–16 weeks</strong></li>
</ul>
Payment is typically made by international bank transfer to a notary-managed account or directly to the seller upon deed execution. Wire transfers from Europe take 1–3 business days; budget for currency conversion costs.`,
  },
  {
    question: 'How do I make sure a property has clean title?',
    answer: `Title due diligence is the single most important step in a Lombok purchase, and it is where a buyer's agent earns their keep. A proper check covers:
<ul>
<li><strong>Certificate verification</strong> — confirm the certificate (Hak Milik, HGB or Hak Pakai) is authentic and registered at the National Land Agency (BPN).</li>
<li><strong>Title history</strong> — trace previous owners, ideally back 20+ years, to surface any break in the chain of ownership.</li>
<li><strong>Liens and encumbrances</strong> — verify there is no outstanding mortgage, charge or third-party claim over the land.</li>
<li><strong>Zoning</strong> — confirm the land permits your intended use (residential, tourism/commercial, and so on).</li>
<li><strong>Physical boundary survey</strong> — a licensed surveyor confirms the actual boundaries and area match the certificate.</li>
</ul>
<strong>New since 2026:</strong> Indonesia's land agency (ATR/BPN) now requires a <strong>physical land validation</strong> — checking on-site boundary markers against the official records — <em>before</em> an ownership transfer can be registered. Introduced in mid-2026 and applied across West Nusa Tenggara (which includes Lombok), it adds a useful layer of protection but can also lengthen the process, so factor it into your timeline.<br/><br/>
Budget roughly €2,800–€6,500 for thorough independent due diligence. RumahYa coordinates this end-to-end with trusted Notaries (PPATs) and surveyors before you commit a single euro.`,
  },
  {
    question: 'What are the most common mistakes European buyers make?',
    answer: `Most problems come from rushing, trusting the wrong people, or trying to shortcut the ownership rules. The big ones:
<ul>
<li><strong>Using a "nominee" arrangement</strong> — having an Indonesian friend or company hold the freehold title on your behalf. It is widely offered but legally unenforceable: on paper the property is <em>theirs</em>, and disputes have left foreign buyers with no recourse and total loss. Always use a proper legal structure (leasehold, Hak Pakai or PT PMA) instead.</li>
<li><strong>Skipping or rushing due diligence</strong> — committing before title, liens and boundaries have been independently verified.</li>
<li><strong>Falling for pressure and "too-good" prices</strong> — a price far below market, a seller pushing for a quick decision, or a certificate that is "being processed" or held by a third party are classic red flags.</li>
<li><strong>Ignoring the practicalities</strong> — legal road access and a reliable water source are easy to overlook and expensive to fix after the fact.</li>
<li><strong>Underbudgeting the extras</strong> — transfer tax, notary and legal fees, agent commission and due diligence together typically add 10–15% on top of the purchase price.</li>
</ul>
The common thread: a deal that looks too good usually is. Slow down, verify everything independently, and never let the title sit in a structure you do not legally control — exactly the buffer a buyer-side agent like RumahYa is there to provide.`,
  },
  {
    question: 'Can I legally rent out my Lombok property?',
    answer: `Yes, with the correct legal structure in place.
<br/><br/>
<strong>Short-term holiday rentals</strong> (Airbnb, Booking.com, etc.) require a commercial accommodation permit (<em>izin usaha akomodasi</em>). This permit is significantly easier to obtain when the property is held through a PT PMA, which provides the legal business entity needed for commercial activity.
<br/><br/>
<strong>Long-term rentals</strong> (6 months or more) face fewer regulatory requirements and can be done more straightforwardly.
<br/><br/>
Lombok has been actively promoting tourism investment and the regulatory environment around villa rentals is generally more accommodating than Bali's. RumahYa can connect you with property managers who handle both the rental operations and the compliance side.`,
  },
  {
    question: 'How does RumahYa help European buyers?',
    answer: `RumahYa acts as your local point of contact on the ground in Lombok. Specifically, we:
<ul>
<li><strong>Source and vet properties</strong> — we identify investment opportunities, visit sites in person, and filter out anything with unclear title or legal issues.</li>
<li><strong>Verify land titles</strong> — before presenting a property, we check for clean title, zoning compliance, and absence of disputes at the BPN.</li>
<li><strong>Coordinate due diligence</strong> — we work with trusted Notaries (PPATs) and local lawyers to handle the legal side of your transaction.</li>
<li><strong>Bridge the distance</strong> — for buyers who cannot be in Lombok full-time, we manage the on-the-ground logistics and keep you informed at every step.</li>
<li><strong>Connect you to the right partners</strong> — PT PMA setup, property management, construction oversight: we connect you with vetted local professionals.</li>
</ul>
We work exclusively for buyers — not sellers or developers — so our interests are fully aligned with yours. We do not replace a notary or lawyer, but we make sure you have the right team around you from day one.
<br/><br/>
<em>All information on this page is for educational purposes only and does not constitute legal or tax advice. Consult a qualified Indonesian lawyer before entering into any transaction.</em>`,
  },
];

// ─────────────────────────────────────────────────────────────
// Français
// ─────────────────────────────────────────────────────────────
const fr: FaqItem[] = [
  {
    question: 'Un Européen (étranger) peut-il acheter un bien à Lombok ?',
    answer: `Les étrangers ne peuvent pas détenir directement le titre de pleine propriété indonésien (Hak Milik) à leur propre nom. Il existe cependant deux voies parfaitement légales et largement utilisées : (1) un <strong>bail emphytéotique</strong> (leasehold, Hak Sewa), où vous louez un terrain ou un bien à un détenteur de titre indonésien pour une longue durée — généralement structurée en 25 + 25 + 10 ans (jusqu'à 60 ans au total) ; et (2) l'achat via une <strong>PT PMA</strong> (société indonésienne à capitaux étrangers), qui peut détenir un titre de propriété commercial (Hak Guna Bangunan, ou HGB). Ces deux structures sont couramment utilisées par les acheteurs européens à Lombok et pleinement opposables devant les tribunaux indonésiens.`,
  },
  {
    question: 'Quelle est la différence entre leasehold et freehold en Indonésie ?',
    answer: `Le <strong>leasehold (Hak Sewa)</strong> vous donne le droit d'utiliser un bien pour une durée déterminée, généralement 25 ans avec deux options de renouvellement de 25 et 10 ans (60 ans au total). Vous ne possédez pas le terrain sous-jacent — le détenteur du titre indonésien en conserve la propriété. C'est plus simple et moins coûteux à mettre en place, et cela offre une bonne protection lorsqu'il est enregistré devant un Notaire (PPAT) et auprès de l'Agence nationale foncière (BPN).<br/><br/>Le <strong>freehold via PT PMA</strong> donne à une société que vous possédez et contrôlez le droit de détenir un titre HGB — un droit de propriété commercial sur le terrain et le bâtiment, renouvelable indéfiniment. Il offre une meilleure sécurité à long terme, une meilleure valeur de revente et la possibilité de générer des revenus locatifs légalement. La contrepartie est le coût et le temps nécessaires pour créer une société indonésienne.`,
  },
  {
    question: 'Puis-je détenir un bien à mon propre nom avec le Hak Pakai (droit d\'usage) ?',
    answer: `Oui — mais uniquement si vous détenez un permis de séjour indonésien, et seulement pour un logement que vous habitez vous-même. Le <strong>Hak Pakai</strong> (droit d'usage) est le seul titre délivré directement à un particulier étranger : votre nom figure sur le certificat, sans société intermédiaire. Il constitue une troisième voie de propriété, aux côtés du leasehold et de la PT PMA.<br/><br/>
Les contreparties sont réelles, il convient donc à un profil restreint :
<ul>
<li><strong>Résidence exigée</strong> — vous devez détenir un permis de séjour KITAS ou KITAP (par exemple un visa retraite ou travail). Un non-résident achetant à distance depuis l'Europe ne peut généralement pas recourir au Hak Pakai.</li>
<li><strong>Un seul bien, usage personnel uniquement</strong> — limité à un unique bien résidentiel. La location commerciale n'est pas autorisée : pas d'Airbnb, pas de Booking.com, pas de tarifs à la nuitée.</li>
<li><strong>Durée</strong> — une durée initiale d'environ 30 ans, prolongeable et renouvelable, donc adaptée aux détentions de moyen terme et aux résidences de retraite plutôt qu'aux investissements sur plusieurs générations.</li>
<li><strong>Coût d'exploitation faible</strong> — peu coûteux à mettre en place (environ 300–850 €), sans comptabilité de société à tenir, seulement la taxe foncière annuelle standard (PBB).</li>
</ul>
En bref : le Hak Pakai est l'outil adapté pour un Européen qui va <em>vivre</em> à Lombok avec un permis de séjour. Si vous voulez louer le bien commercialement, ou si vous investissez à distance, le leasehold ou une PT PMA conviennent mieux.`,
  },
  {
    question: 'Comment se déroule un achat en leasehold, étape par étape ?',
    answer: `<ol>
<li><strong>Vérification du titre (due diligence)</strong> — confirmer que le propriétaire indonésien détient un titre clair (Hak Milik ou HGB), sans charges ni litiges auprès du BPN.</li>
<li><strong>Rédaction du contrat de bail</strong> — un bail bilingue (indonésien/anglais) est rédigé par un Notaire-Officier foncier qualifié (PPAT), précisant la durée, les droits de renouvellement, l'usage autorisé et les droits de revente.</li>
<li><strong>Signature notariale</strong> — les deux parties signent devant le Notaire. L'accord devient un acte public opposable devant les tribunaux indonésiens.</li>
<li><strong>Enregistrement au BPN</strong> — le bail est enregistré auprès de l'Agence nationale foncière, offrant une couche de protection juridique supplémentaire.</li>
<li><strong>Paiement</strong> — généralement par virement bancaire sur un compte séquestre détenu par le notaire ou directement à la signature de l'acte.</li>
</ol>
Délai total : <strong>4 à 8 semaines</strong> entre l'acceptation de l'offre et l'acte enregistré. Les frais de notaire et juridiques ajoutent généralement 1 à 2 % au coût de la transaction.`,
  },
  {
    question: 'Qu\'est-ce qu\'une PT PMA et quand en ai-je besoin ?',
    answer: `Une <strong>PT PMA</strong> (Perseroan Terbatas Penanaman Modal Asing) est une société à responsabilité limitée à capitaux étrangers enregistrée selon le droit indonésien. C'est le véhicule juridique qui permet aux étrangers de détenir un titre équivalent à la pleine propriété (HGB) sur un terrain indonésien.<br/><br/>Vous avez besoin d'une PT PMA si vous voulez : posséder un terrain en freehold plutôt qu'en leasehold ; exploiter légalement une location commerciale de courte durée ; ou structurer votre investissement à des fins fiscales et de transmission patrimoniale.<br/><br/>Vous n'avez <em>pas</em> besoin d'une PT PMA pour un achat standard en leasehold longue durée. Une PT PMA n'est pas une simple formalité — c'est une société indonésienne pleinement opérationnelle, avec des obligations fiscales et déclaratives. La création prend généralement <strong>4 à 8 semaines</strong> et coûte environ 1 200 € en frais juridiques et gouvernementaux, avec des coûts administratifs annuels d'environ 500 €/an.`,
  },
  {
    question: 'Comment créer une PT PMA en Indonésie ?',
    answer: `Les principales étapes sont :
<ol>
<li><strong>Choisir une classification d'activité (KBLI)</strong> autorisant la détention de biens — généralement l'hôtellerie ou les services immobiliers.</li>
<li><strong>Acte notarié de constitution</strong> — un Notaire indonésien qualifié rédige et exécute les statuts de la société.</li>
<li><strong>Enregistrement OSS</strong> — enregistrement en ligne via le système gouvernemental de soumission unique (Single Submission) pour obtenir un numéro d'identification d'entreprise (NIB).</li>
<li><strong>Compte bancaire professionnel</strong> — ouvrir un compte dans une banque indonésienne au nom de la société.</li>
<li><strong>Exigences de capital</strong> — l'investissement minimum annoncé est de 10 milliards IDR, bien que les exigences de capital effectivement libéré soient plus faibles en pratique pour les structures de détention immobilière.</li>
</ol>
Un Notaire indonésien qualifié et un consultant en affaires gèrent le processus de bout en bout. RumahYa travaille avec des partenaires de confiance spécialisés dans la création de PT PMA pour les acheteurs immobiliers étrangers.`,
  },
  {
    question: 'Pourquoi investir à Lombok plutôt qu\'à Bali ?',
    answer: `Bali et Lombok offrent les <em>mêmes</em> structures de propriété légales et des coûts de transaction similaires — la différence tient au stade de maturité du marché. Lombok ressemble aujourd'hui beaucoup à ce qu'était Bali il y a 5 à 7 ans, et c'est précisément cet écart qui constitue l'opportunité.<br/><br/>
<strong>Prix d'entrée.</strong> Les villas en zone prime à Lombok se situent généralement entre 140 000 € et 325 000 €, contre environ 280 000 € à 555 000 € pour des villas comparables à Bali. Le terrain prime dans le corridor de Mandalika à Lombok tourne autour de 110–200 €/m² — une fraction des 1 400–2 800 €/m² observés dans les zones les plus prisées de Bali.<br/><br/>
<strong>Rendement et croissance.</strong> Les rendements locatifs bruts à Lombok avoisinent 16–21 % (contre 8–12 % à Bali), et la récente appréciation annuelle des prix a été bien plus forte — de l'ordre de 15 à 20 % par an à Lombok contre quelques pourcents sur un marché balinais arrivé à maturité.<br/><br/>
<strong>Trajectoire touristique.</strong> Bali attire environ 4 millions de visiteurs par an, avec une croissance à un chiffre ; Lombok est plus petite (~750 000) mais croît de 25 à 35 % par an, les arrivées devant à peu près doubler dans les prochaines années à mesure que Mandalika et l'aéroport international montent en puissance.<br/><br/>
<strong>Le compromis, en toute honnêteté.</strong> Bali est le marché le plus liquide, le mieux documenté et le plus rapide à la revente — le choix le plus sûr si votre horizon est inférieur à trois ans. Lombok récompense un horizon de 5 à 10 ans et une tolérance à une moindre liquidité en échange d'un rendement total supérieur. RumahYa se concentre sur Lombok précisément parce que cette fenêtre risque/rendement est encore ouverte.`,
  },
  {
    question: 'Quelles zones de Lombok sont les meilleures pour investir ?',
    answer: `Il n'existe pas de « meilleure » zone unique — cela dépend de ce que vous recherchez : revenus locatifs, plus-value, ou cadre de vie. Les principales zones d'investissement :
<ul>
<li><strong>Kuta / Mandalika (sud)</strong> — le moteur de la croissance de Lombok, qui abrite la Zone économique spéciale de Mandalika, le circuit MotoGP et l'aéroport international. La plus forte demande locative et la plus forte appréciation, mais aussi les prix d'entrée les plus élevés.</li>
<li><strong>Selong Belanak (sud-ouest)</strong> — un spot de surf et de plage en plein essor, avec de bons rendements et des valeurs foncières encore en hausse, et une ambiance plus détendue que Kuta.</li>
<li><strong>Îles Gili (Trawangan, Air, Meno)</strong> — des marchés établis, très touristiques, avec un bon taux d'occupation. Trawangan est la plus animée et la plus concurrentielle ; Air et Meno sont plus calmes, avec des volumes plus réduits.</li>
<li><strong>Senggigi (ouest)</strong> — la plus ancienne zone balnéaire de Lombok : plus stable et à rendement plus faible, avec des infrastructures en amélioration constante.</li>
</ul>
En règle générale, la côte sud autour de Kuta/Mandalika offre le plus fort potentiel de croissance et de location, tandis que l'ouest et les Gili offrent des revenus plus réguliers et plus établis. RumahYa peut associer une zone précise à votre budget et à vos objectifs avant même que vous ne preniez l'avion.`,
  },
  {
    question: 'Quel rendement locatif puis-je raisonnablement espérer ?',
    answer: `Les rendements varient fortement selon l'emplacement, la gamme du bien et le niveau de gestion active de la villa. À titre indicatif :
<ul>
<li>Les <strong>rendements bruts</strong> vont généralement de <strong>16 à 21 %</strong> dans les zones prime (Kuta/Mandalika en haut de fourchette) à 13–17 % dans les zones plus établies comme Senggigi.</li>
<li>Les <strong>rendements nets</strong>, après gestion, entretien, assurance et taxes locales, se situent réalistement autour de <strong>10 à 15 %</strong> — les charges courantes absorbent généralement 25 à 28 % du revenu brut.</li>
<li>Le <strong>taux d'occupation</strong> tourne autour de 60 à 75 % par an pour les biens bien gérés, dépassant 85 % en haute saison.</li>
</ul>
<strong>Un exemple chiffré.</strong> Une villa de deux chambres à 215 000 € à Kuta, louée à environ 150 €/nuit avec 64 % d'occupation (≈233 nuits), génère un brut d'environ 35 000 € par an — soit à peu près 16 % brut. Après gestion, entretien et assurance (environ 26 % du revenu), le revenu net est d'environ 25 800 €, soit un <strong>rendement net d'environ 12 %</strong>. Ajoutez une appréciation annuelle du capital de l'ordre de 15 % et le rendement total sur cinq ans peut dépasser 150 %.<br/><br/>
Deux particularités locales à connaître : la <strong>semaine de course MotoGP</strong> peut faire grimper les tarifs à la nuitée de 3 à 5 fois la normale et représenter une part significative du revenu annuel des villas proches ; et une <strong>location longue durée</strong> (6 mois et plus) génère un peu moins (~15 %) mais demande bien moins de gestion. Ces chiffres sont indicatifs, pas des garanties — les rendements réels dépendent fortement du bien et de l'opérateur.`,
  },
  {
    question: 'Quelles taxes s\'appliquent à l\'achat d\'un bien à Lombok ?',
    answer: `Les principales taxes de transaction en Indonésie sont :
<ul>
<li><strong>BPHTB</strong> (taxe d'acquisition, payée par l'acheteur) : 5 % de la valeur d'acquisition au-delà d'un seuil local d'exonération (généralement autour de 60 millions IDR). Calculée sur le montant le plus élevé entre le prix de vente convenu et la valeur fiscale officielle (NJOP).</li>
<li><strong>PPh</strong> (impôt sur le revenu de la transaction, payé par le vendeur) : 2,5 % de la valeur brute de la transaction. En pratique, les acheteurs absorbent souvent ce coût dans le cadre de la négociation.</li>
</ul>
<strong>Coûts annuels de détention :</strong>
<ul>
<li>La <strong>PBB</strong> (taxe foncière annuelle sur le terrain et le bâtiment) est très faible à Lombok — généralement 500 000 à 2 000 000 IDR/an (30–120 €) pour une villa.</li>
<li>Pas d'impôt distinct sur les plus-values — les gains à la revente sont traités comme un revenu ordinaire de l'entité vendeuse.</li>
</ul>
En cas de détention via une PT PMA, l'impôt indonésien sur les sociétés (22 %) s'applique aux bénéfices imposables.`,
  },
  {
    question: 'Quels sont les coûts récurrents de la détention d\'un bien à Lombok ?',
    answer: `<strong>Pour un bien loué à titre individuel :</strong>
<ul>
<li>Taxe foncière annuelle (PBB) : 30–120 €/an</li>
<li>Charges (électricité PLN, eau) : variables selon la consommation, généralement 60–200 €/mois pour une villa</li>
<li>Gestion locative si le bien est loué : généralement 15–25 % du revenu locatif, ou un forfait mensuel</li>
<li>Coûts de personnel (jardinier, sécurité, ménage) : 2–5 millions IDR/mois chacun (~110–280 €)</li>
<li>Réserve d'entretien : prévoir 1 à 2 % de la valeur du bien par an</li>
</ul>
<strong>Coûts supplémentaires pour les détenteurs de PT PMA :</strong>
<ul>
<li>Comptabilité et administration annuelles : environ 500 €/an via un comptable local</li>
<li>Renouvellement de la licence d'activité (NIB) et obligations déclaratives</li>
</ul>`,
  },
  {
    question: 'Quel est le calendrier type d\'un achat ?',
    answer: `<strong>Achat en leasehold (sans PT PMA requise) :</strong>
<ul>
<li>Vérification du titre (due diligence) : 1–2 semaines</li>
<li>Rédaction et examen juridiques : 1 semaine</li>
<li>Signature notariale : 1 jour</li>
<li>Enregistrement au BPN : 2–4 semaines</li>
<li><strong>Total : environ 4 à 8 semaines</strong></li>
</ul>
<strong>Achat en freehold via PT PMA (société pas encore créée) :</strong>
<ul>
<li>Création de la PT PMA : 4–8 semaines (peut se faire en parallèle de la due diligence)</li>
<li>Acquisition du bien : 4–8 semaines après la création de la société</li>
<li><strong>Total : environ 8 à 16 semaines</strong></li>
</ul>
Le paiement se fait généralement par virement bancaire international sur un compte géré par le notaire ou directement au vendeur lors de la signature de l'acte. Les virements depuis l'Europe prennent 1 à 3 jours ouvrés ; prévoyez les frais de conversion de devises.`,
  },
  {
    question: 'Comment m\'assurer qu\'un bien a un titre clair ?',
    answer: `La vérification du titre (due diligence) est l'étape la plus importante d'un achat à Lombok, et c'est là qu'un agent côté acheteur prouve sa valeur. Une vérification sérieuse couvre :
<ul>
<li><strong>Vérification du certificat</strong> — confirmer que le certificat (Hak Milik, HGB ou Hak Pakai) est authentique et enregistré auprès de l'Agence nationale foncière (BPN).</li>
<li><strong>Historique du titre</strong> — retracer les propriétaires précédents, idéalement sur plus de 20 ans, pour déceler toute rupture dans la chaîne de propriété.</li>
<li><strong>Privilèges et charges</strong> — vérifier l'absence d'hypothèque, de gage ou de revendication d'un tiers sur le terrain.</li>
<li><strong>Zonage</strong> — confirmer que le terrain autorise l'usage prévu (résidentiel, tourisme/commercial, etc.).</li>
<li><strong>Bornage physique</strong> — un géomètre agréé confirme que les limites et la superficie réelles correspondent au certificat.</li>
</ul>
<strong>Nouveau depuis 2026 :</strong> l'agence foncière indonésienne (ATR/BPN) exige désormais une <strong>validation foncière physique</strong> — vérification des bornes sur site par rapport aux registres officiels — <em>avant</em> qu'un transfert de propriété puisse être enregistré. Introduite mi-2026 et appliquée dans toute la province de Nusa Tenggara Ouest (qui inclut Lombok), elle ajoute une couche de protection utile mais peut aussi allonger le processus ; tenez-en compte dans votre calendrier.<br/><br/>
Prévoyez environ 2 800 à 6 500 € pour une due diligence indépendante approfondie. RumahYa coordonne le tout de bout en bout avec des Notaires (PPAT) et des géomètres de confiance, avant que vous n'engagiez le moindre euro.`,
  },
  {
    question: 'Quelles sont les erreurs les plus fréquentes des acheteurs européens ?',
    answer: `La plupart des problèmes viennent de la précipitation, d'une mauvaise confiance, ou d'une tentative de contourner les règles de propriété. Les principales :
<ul>
<li><strong>Recourir à un montage « nominee »</strong> — faire détenir le titre de pleine propriété en votre nom par un ami ou une société indonésienne. C'est largement proposé mais juridiquement inopposable : sur le papier, le bien est <em>le leur</em>, et des litiges ont laissé des acheteurs étrangers sans recours et avec une perte totale. Utilisez toujours une structure juridique appropriée (leasehold, Hak Pakai ou PT PMA).</li>
<li><strong>Sauter ou bâcler la due diligence</strong> — s'engager avant que le titre, les charges et les limites n'aient été vérifiés de manière indépendante.</li>
<li><strong>Céder à la pression et aux prix « trop beaux »</strong> — un prix bien en dessous du marché, un vendeur qui pousse à une décision rapide, ou un certificat « en cours de traitement » ou détenu par un tiers sont des signaux d'alarme classiques.</li>
<li><strong>Négliger les aspects pratiques</strong> — un accès routier légal et une source d'eau fiable sont faciles à oublier et coûteux à corriger après coup.</li>
<li><strong>Sous-estimer les frais annexes</strong> — taxe de mutation, frais de notaire et juridiques, commission d'agence et due diligence ajoutent ensemble généralement 10 à 15 % au prix d'achat.</li>
</ul>
Le fil conducteur : une affaire qui semble trop belle l'est généralement. Prenez votre temps, vérifiez tout de manière indépendante, et ne laissez jamais le titre dans une structure que vous ne contrôlez pas légalement — exactement le rempart qu'un agent côté acheteur comme RumahYa est là pour offrir.`,
  },
  {
    question: 'Puis-je louer légalement mon bien à Lombok ?',
    answer: `Oui, avec la bonne structure juridique en place.
<br/><br/>
La <strong>location touristique de courte durée</strong> (Airbnb, Booking.com, etc.) nécessite un permis d'hébergement commercial (<em>izin usaha akomodasi</em>). Ce permis est nettement plus facile à obtenir lorsque le bien est détenu via une PT PMA, qui fournit l'entité commerciale légale nécessaire à l'activité commerciale.
<br/><br/>
La <strong>location longue durée</strong> (6 mois ou plus) est soumise à moins d'exigences réglementaires et peut se faire plus simplement.
<br/><br/>
Lombok promeut activement l'investissement touristique et l'environnement réglementaire autour de la location de villas est généralement plus accommodant qu'à Bali. RumahYa peut vous mettre en relation avec des gestionnaires immobiliers qui prennent en charge à la fois l'exploitation locative et la conformité.`,
  },
  {
    question: 'Comment RumahYa aide-t-il les acheteurs européens ?',
    answer: `RumahYa est votre point de contact local, sur le terrain à Lombok. Concrètement, nous :
<ul>
<li><strong>Identifions et sélectionnons les biens</strong> — nous repérons les opportunités d'investissement, visitons les sites en personne, et écartons tout ce qui présente un titre incertain ou des problèmes juridiques.</li>
<li><strong>Vérifions les titres fonciers</strong> — avant de présenter un bien, nous contrôlons la clarté du titre, la conformité du zonage et l'absence de litiges auprès du BPN.</li>
<li><strong>Coordonnons la due diligence</strong> — nous travaillons avec des Notaires (PPAT) et des avocats locaux de confiance pour gérer le volet juridique de votre transaction.</li>
<li><strong>Comblons la distance</strong> — pour les acheteurs qui ne peuvent pas être à Lombok à plein temps, nous gérons la logistique sur place et vous tenons informé à chaque étape.</li>
<li><strong>Vous mettons en relation avec les bons partenaires</strong> — création de PT PMA, gestion immobilière, supervision de construction : nous vous connectons à des professionnels locaux vérifiés.</li>
</ul>
Nous travaillons exclusivement pour les acheteurs — pas pour les vendeurs ni les promoteurs — de sorte que nos intérêts sont pleinement alignés sur les vôtres. Nous ne remplaçons pas un notaire ou un avocat, mais nous veillons à ce que vous ayez la bonne équipe autour de vous dès le premier jour.
<br/><br/>
<em>Toutes les informations de cette page sont fournies à titre éducatif uniquement et ne constituent pas un conseil juridique ou fiscal. Consultez un avocat indonésien qualifié avant de conclure toute transaction.</em>`,
  },
];

// ─────────────────────────────────────────────────────────────
// Español
// ─────────────────────────────────────────────────────────────
const es: FaqItem[] = [
  {
    question: '¿Puede un europeo (extranjero) comprar una propiedad en Lombok?',
    answer: `Los extranjeros no pueden poseer el título de plena propiedad indonesio (Hak Milik) directamente a su propio nombre. Sin embargo, existen dos vías totalmente legales y ampliamente utilizadas: (1) un <strong>arrendamiento a largo plazo</strong> (leasehold, Hak Sewa), en el que arriendas un terreno o una propiedad a un titular indonesio durante un plazo prolongado — normalmente estructurado como 25 + 25 + 10 años (hasta 60 años en total); y (2) la compra a través de una <strong>PT PMA</strong> (sociedad indonesia de capital extranjero), que puede poseer un título de propiedad comercial (Hak Guna Bangunan, o HGB). Ambas estructuras son habituales entre los compradores europeos en Lombok y plenamente exigibles ante los tribunales indonesios.`,
  },
  {
    question: '¿Cuál es la diferencia entre leasehold y freehold en Indonesia?',
    answer: `El <strong>leasehold (Hak Sewa)</strong> te da el derecho a usar una propiedad durante un periodo determinado, normalmente 25 años con dos opciones de renovación de 25 y 10 años (60 años en total). No eres dueño del terreno subyacente — el titular indonesio conserva la propiedad. Es más sencillo y barato de establecer, y ofrece una buena protección cuando se registra ante un Notario (PPAT) y en la Agencia Nacional del Suelo (BPN).<br/><br/>El <strong>freehold a través de PT PMA</strong> otorga a una sociedad que tú posees y controlas el derecho a poseer un título HGB — un derecho de propiedad comercial sobre el terreno y el edificio, renovable indefinidamente. Ofrece mayor seguridad a largo plazo, mejor valor de reventa y la capacidad de generar ingresos por alquiler legalmente. La contrapartida es el coste y el tiempo de crear una sociedad indonesia.`,
  },
  {
    question: '¿Puedo poseer una propiedad a mi propio nombre con el Hak Pakai (derecho de uso)?',
    answer: `Sí — pero solo si dispones de un permiso de residencia indonesio, y únicamente para una vivienda que habites tú mismo. El <strong>Hak Pakai</strong> (derecho de uso) es el único título emitido directamente a un particular extranjero: tu propio nombre figura en el certificado, sin ninguna sociedad de por medio. Constituye una tercera vía de propiedad, junto al leasehold y a la PT PMA.<br/><br/>
Las contrapartidas son reales, por lo que se ajusta a un perfil concreto:
<ul>
<li><strong>Se exige residencia</strong> — debes disponer de un permiso de residencia KITAS o KITAP (por ejemplo, un visado de jubilación o de trabajo). Un no residente que compra a distancia desde Europa, por lo general, no puede recurrir al Hak Pakai.</li>
<li><strong>Una sola propiedad, solo uso personal</strong> — limitado a una única propiedad residencial. No se permite el alquiler comercial: nada de Airbnb, Booking.com ni tarifas por noche.</li>
<li><strong>Plazo</strong> — un plazo inicial de unos 30 años, prorrogable y renovable, por lo que se ajusta a tenencias de medio plazo y a viviendas de jubilación más que a inversiones intergeneracionales.</li>
<li><strong>Bajo coste de mantenimiento</strong> — barato de establecer (aproximadamente 300–850 €), sin contabilidad de sociedad que mantener, solo el impuesto anual estándar sobre el suelo (PBB).</li>
</ul>
En resumen: el Hak Pakai es la herramienta adecuada para un europeo que va a <em>vivir</em> en Lombok con un permiso de residencia. Si quieres alquilar la propiedad comercialmente, o inviertes a distancia, el leasehold o una PT PMA encajan mejor.`,
  },
  {
    question: '¿Cómo funciona una compra en leasehold, paso a paso?',
    answer: `<ol>
<li><strong>Due diligence del título</strong> — verificar que el propietario indonesio posee un título limpio (Hak Milik o HGB), sin cargas ni litigios en el BPN.</li>
<li><strong>Redacción del contrato de arrendamiento</strong> — un Notario-Oficial del Suelo cualificado (PPAT) redacta un contrato bilingüe (indonesio/inglés) que especifica la duración, los derechos de renovación, el uso permitido y los derechos de reventa.</li>
<li><strong>Firma notarial</strong> — ambas partes firman ante el Notario. El acuerdo se convierte en una escritura pública exigible ante los tribunales indonesios.</li>
<li><strong>Registro en el BPN</strong> — el arrendamiento se registra en la Agencia Nacional del Suelo, lo que aporta una capa adicional de protección jurídica.</li>
<li><strong>Pago</strong> — normalmente mediante transferencia bancaria a una cuenta de depósito en garantía gestionada por el notario o directamente al firmar la escritura.</li>
</ol>
Plazo total: <strong>4 a 8 semanas</strong> desde la aceptación de la oferta hasta la escritura registrada. Los honorarios notariales y legales suelen añadir entre el 1 % y el 2 % al coste de la transacción.`,
  },
  {
    question: '¿Qué es una PT PMA y cuándo necesito una?',
    answer: `Una <strong>PT PMA</strong> (Perseroan Terbatas Penanaman Modal Asing) es una sociedad de responsabilidad limitada de capital extranjero registrada conforme a la legislación indonesia. Es el vehículo jurídico que permite a los extranjeros poseer un título equivalente a la plena propiedad (HGB) sobre suelo indonesio.<br/><br/>Necesitas una PT PMA si quieres: poseer terreno en freehold en lugar de leasehold; operar legalmente un alquiler comercial de corta duración; o estructurar tu inversión con fines fiscales y de planificación patrimonial.<br/><br/><em>No</em> necesitas una PT PMA para una compra estándar en leasehold a largo plazo. Una PT PMA no es una mera formalidad — es una sociedad indonesia plenamente operativa, con obligaciones fiscales y de información. La constitución suele tardar <strong>de 4 a 8 semanas</strong> y cuesta aproximadamente 1.200 € en honorarios legales y tasas gubernamentales, con costes administrativos anuales de unos 500 €/año.`,
  },
  {
    question: '¿Cómo creo una PT PMA en Indonesia?',
    answer: `Los pasos principales son:
<ol>
<li><strong>Elegir una clasificación de actividad (KBLI)</strong> que permita la tenencia de inmuebles — normalmente hostelería o servicios inmobiliarios.</li>
<li><strong>Escritura notarial de constitución</strong> — un Notario indonesio cualificado redacta y otorga los estatutos de la sociedad.</li>
<li><strong>Registro OSS</strong> — registro en línea a través del sistema gubernamental de ventanilla única (Single Submission) para obtener un número de identificación de empresa (NIB).</li>
<li><strong>Cuenta bancaria corporativa</strong> — abrir una cuenta en un banco indonesio a nombre de la sociedad.</li>
<li><strong>Requisitos de capital</strong> — la inversión mínima declarada es de 10.000 millones de IDR, aunque en la práctica los requisitos de capital efectivamente desembolsado son menores para las estructuras de tenencia inmobiliaria.</li>
</ol>
Un Notario indonesio cualificado y un consultor empresarial gestionan el proceso de principio a fin. RumahYa colabora con socios de confianza especializados en la constitución de PT PMA para compradores inmobiliarios extranjeros.`,
  },
  {
    question: '¿Por qué invertir en Lombok en lugar de Bali?',
    answer: `Bali y Lombok ofrecen las <em>mismas</em> estructuras legales de propiedad y costes de transacción similares — la diferencia está en la etapa del mercado. Lombok hoy se parece mucho a lo que era Bali hace 5 a 7 años, y ese desfase es la oportunidad.<br/><br/>
<strong>Precio de entrada.</strong> Las villas en zona prime de Lombok suelen costar entre 140.000 € y 325.000 €, frente a aproximadamente 280.000 € a 555.000 € por villas comparables en Bali. El suelo prime en el corredor de Mandalika, en Lombok, ronda los 110–200 €/m² — una fracción de los 1.400–2.800 €/m² que se ven en las zonas más cotizadas de Bali.<br/><br/>
<strong>Rentabilidad y crecimiento.</strong> Las rentabilidades brutas por alquiler en Lombok rondan el 16–21 % (frente al 8–12 % en Bali), y la reciente revalorización anual de precios ha sido mucho más pronunciada — entre el 15 % y el 20 % anual en Lombok frente a cifras de un solo dígito en un mercado balinés ya maduro.<br/><br/>
<strong>Trayectoria turística.</strong> Bali atrae a unos 4 millones de visitantes al año con un crecimiento de un solo dígito; Lombok es más pequeña (~750.000) pero crece entre el 25 % y el 35 % anual, y se prevé que las llegadas se dupliquen aproximadamente en los próximos años a medida que maduren Mandalika y el aeropuerto internacional.<br/><br/>
<strong>El compromiso, con honestidad.</strong> Bali es el mercado más líquido, mejor documentado y de salida más rápida — la opción más segura si tu horizonte es inferior a tres años. Lombok recompensa un horizonte de 5 a 10 años y una tolerancia a una menor liquidez a cambio de un mayor rendimiento total. RumahYa se centra en Lombok precisamente porque esa ventana de riesgo/rentabilidad aún está abierta.`,
  },
  {
    question: '¿Qué zonas de Lombok son las mejores para invertir?',
    answer: `No hay una única zona "mejor" — depende de si buscas ingresos por alquiler, revalorización del capital o una base de estilo de vida. Las principales zonas de inversión:
<ul>
<li><strong>Kuta / Mandalika (sur)</strong> — el motor del crecimiento de Lombok, sede de la Zona Económica Especial de Mandalika, el circuito de MotoGP y el aeropuerto internacional. La mayor demanda de alquiler y la mayor revalorización, pero también los precios de entrada más altos.</li>
<li><strong>Selong Belanak (suroeste)</strong> — un punto de surf y playa en rápido auge, con buenas rentabilidades y valores de suelo todavía en alza, y un ambiente más relajado que Kuta.</li>
<li><strong>Islas Gili (Trawangan, Air, Meno)</strong> — mercados establecidos, muy turísticos, con una ocupación sólida. Trawangan es la más concurrida y competitiva; Air y Meno son más tranquilas, con menor volumen.</li>
<li><strong>Senggigi (oeste)</strong> — la franja turística más antigua de Lombok: más estable y con menor rentabilidad, con infraestructuras en mejora constante.</li>
</ul>
Como regla general, la costa sur en torno a Kuta/Mandalika ofrece el mayor potencial de crecimiento y alquiler, mientras que el oeste y las Gili ofrecen ingresos más estables y consolidados. RumahYa puede ajustar una zona concreta a tu presupuesto y objetivos antes incluso de que tomes el avión.`,
  },
  {
    question: '¿Qué rentabilidad de alquiler puedo esperar de forma realista?',
    answer: `Las rentabilidades varían mucho según la ubicación, la categoría de la propiedad y lo activamente que se gestione la villa. A modo de guía:
<ul>
<li>Las <strong>rentabilidades brutas</strong> suelen ir del <strong>16 al 21 %</strong> en zonas prime (Kuta/Mandalika en el extremo alto) hasta el 13–17 % en zonas más consolidadas como Senggigi.</li>
<li>Las <strong>rentabilidades netas</strong>, tras gestión, mantenimiento, seguro e impuestos locales, se sitúan de forma realista en torno al <strong>10–15 %</strong> — los gastos corrientes absorben normalmente entre el 25 % y el 28 % de los ingresos brutos.</li>
<li>La <strong>ocupación</strong> ronda el 60–75 % anual en propiedades bien gestionadas, superando el 85 % en temporada alta.</li>
</ul>
<strong>Un ejemplo práctico.</strong> Una villa de dos dormitorios de 215.000 € en Kuta, alquilada a unos 150 €/noche y con un 64 % de ocupación (≈233 noches), genera unos 35.000 € brutos al año — alrededor del 16 % bruto. Tras gestión, mantenimiento y seguro (en torno al 26 % de los ingresos), el ingreso neto es de unos 25.800 €, es decir, una <strong>rentabilidad neta de ~12 %</strong>. Añade una revalorización anual del capital de en torno al 15 % y el rendimiento total a cinco años puede superar el 150 %.<br/><br/>
Dos peculiaridades locales que conviene conocer: la <strong>semana de la carrera de MotoGP</strong> puede multiplicar por 3 a 5 las tarifas habituales por noche y representar una parte significativa de los ingresos anuales de las villas cercanas; y un <strong>alquiler de larga duración</strong> (6 meses o más) rinde algo menos (~15 %) pero exige mucha menos gestión. Estas cifras son ilustrativas, no garantías — los rendimientos reales dependen en gran medida de la propiedad y del operador concretos.`,
  },
  {
    question: '¿Qué impuestos se aplican al comprar una propiedad en Lombok?',
    answer: `Los principales impuestos de transacción en Indonesia son:
<ul>
<li><strong>BPHTB</strong> (impuesto de adquisición, lo paga el comprador): 5 % del valor de adquisición por encima de un umbral local exento (normalmente en torno a 60 millones de IDR). Se calcula sobre el mayor de los dos: el precio de venta acordado o el valor fiscal oficial (NJOP).</li>
<li><strong>PPh</strong> (impuesto sobre la renta de la transacción, lo paga el vendedor): 2,5 % del valor bruto de la transacción. En la práctica, los compradores suelen asumir este coste como parte de la negociación.</li>
</ul>
<strong>Costes anuales de propiedad:</strong>
<ul>
<li>El <strong>PBB</strong> (impuesto anual sobre suelo y edificación) es muy bajo en Lombok — normalmente de 500.000 a 2.000.000 IDR/año (30–120 €) por una villa.</li>
<li>No hay un impuesto separado sobre plusvalías — las ganancias en la reventa se tratan como renta ordinaria de la entidad vendedora.</li>
</ul>
Si se posee a través de una PT PMA, se aplica el impuesto de sociedades indonesio (22 %) sobre los beneficios imponibles.`,
  },
  {
    question: '¿Cuáles son los costes recurrentes de poseer una propiedad en Lombok?',
    answer: `<strong>Para una propiedad arrendada a título individual:</strong>
<ul>
<li>Impuesto anual sobre la propiedad (PBB): 30–120 €/año</li>
<li>Suministros (electricidad PLN, agua): varían según el consumo, normalmente 60–200 €/mes por una villa</li>
<li>Gestión inmobiliaria si se alquila: normalmente del 15 al 25 % de los ingresos por alquiler, o una tarifa mensual fija</li>
<li>Costes de personal (jardinero, seguridad, limpieza): 2–5 millones IDR/mes cada uno (~110–280 €)</li>
<li>Reserva de mantenimiento: presupuestar el 1–2 % del valor de la propiedad al año</li>
</ul>
<strong>Costes adicionales para titulares de PT PMA:</strong>
<ul>
<li>Contabilidad y administración anuales: unos 500 €/año a través de un contable local</li>
<li>Renovación de la licencia de actividad (NIB) y obligaciones de información</li>
</ul>`,
  },
  {
    question: '¿Cuál es el calendario típico de una compra?',
    answer: `<strong>Compra en leasehold (sin necesidad de PT PMA):</strong>
<ul>
<li>Due diligence del título: 1–2 semanas</li>
<li>Redacción y revisión jurídica: 1 semana</li>
<li>Firma notarial: 1 día</li>
<li>Registro en el BPN: 2–4 semanas</li>
<li><strong>Total: aproximadamente 4 a 8 semanas</strong></li>
</ul>
<strong>Compra en freehold a través de PT PMA (sociedad aún no constituida):</strong>
<ul>
<li>Constitución de la PT PMA: 4–8 semanas (puede hacerse en paralelo a la due diligence)</li>
<li>Adquisición de la propiedad: 4–8 semanas tras la constitución de la sociedad</li>
<li><strong>Total: aproximadamente 8 a 16 semanas</strong></li>
</ul>
El pago se realiza normalmente mediante transferencia bancaria internacional a una cuenta gestionada por el notario o directamente al vendedor al otorgarse la escritura. Las transferencias desde Europa tardan de 1 a 3 días hábiles; presupuesta los costes de conversión de divisa.`,
  },
  {
    question: '¿Cómo me aseguro de que una propiedad tiene un título limpio?',
    answer: `La due diligence del título es el paso más importante de una compra en Lombok, y es donde un agente del comprador demuestra su valía. Una comprobación adecuada cubre:
<ul>
<li><strong>Verificación del certificado</strong> — confirmar que el certificado (Hak Milik, HGB o Hak Pakai) es auténtico y está registrado en la Agencia Nacional del Suelo (BPN).</li>
<li><strong>Historial del título</strong> — rastrear a los propietarios anteriores, idealmente más de 20 años atrás, para detectar cualquier ruptura en la cadena de propiedad.</li>
<li><strong>Gravámenes y cargas</strong> — verificar que no exista hipoteca pendiente, carga o reclamación de terceros sobre el terreno.</li>
<li><strong>Zonificación</strong> — confirmar que el terreno permite el uso previsto (residencial, turístico/comercial, etc.).</li>
<li><strong>Levantamiento físico de linderos</strong> — un topógrafo autorizado confirma que los límites y la superficie reales coinciden con el certificado.</li>
</ul>
<strong>Novedad desde 2026:</strong> la agencia del suelo de Indonesia (ATR/BPN) exige ahora una <strong>validación física del terreno</strong> — cotejar los mojones sobre el terreno con los registros oficiales — <em>antes</em> de poder registrar una transferencia de propiedad. Introducida a mediados de 2026 y aplicada en toda la provincia de Nusa Tenggara Occidental (que incluye Lombok), añade una capa útil de protección pero también puede alargar el proceso, así que tenlo en cuenta en tu calendario.<br/><br/>
Presupuesta aproximadamente 2.800–6.500 € para una due diligence independiente y exhaustiva. RumahYa coordina todo de principio a fin con Notarios (PPAT) y topógrafos de confianza, antes de que comprometas un solo euro.`,
  },
  {
    question: '¿Cuáles son los errores más comunes de los compradores europeos?',
    answer: `La mayoría de los problemas vienen de las prisas, de confiar en las personas equivocadas o de intentar saltarse las reglas de propiedad. Los principales:
<ul>
<li><strong>Usar un acuerdo "nominee"</strong> — que un amigo o una sociedad indonesia posea el título de plena propiedad en tu nombre. Se ofrece con frecuencia pero es jurídicamente inejecutable: sobre el papel, la propiedad es <em>suya</em>, y los litigios han dejado a compradores extranjeros sin recurso y con pérdida total. Usa siempre una estructura legal adecuada (leasehold, Hak Pakai o PT PMA).</li>
<li><strong>Saltarse o apresurar la due diligence</strong> — comprometerse antes de verificar de forma independiente el título, las cargas y los linderos.</li>
<li><strong>Caer en la presión y en precios "demasiado buenos"</strong> — un precio muy por debajo del mercado, un vendedor que presiona para una decisión rápida, o un certificado "en trámite" o en manos de un tercero son señales de alarma clásicas.</li>
<li><strong>Ignorar lo práctico</strong> — un acceso vial legal y una fuente de agua fiable son fáciles de pasar por alto y caros de resolver después.</li>
<li><strong>Subestimar los extras</strong> — el impuesto de transmisión, los honorarios notariales y legales, la comisión del agente y la due diligence suman normalmente entre un 10 % y un 15 % sobre el precio de compra.</li>
</ul>
El hilo conductor: un trato que parece demasiado bueno suele serlo. Tómate tu tiempo, verifica todo de forma independiente, y nunca dejes el título en una estructura que no controles legalmente — exactamente el resguardo que un agente del comprador como RumahYa está para ofrecer.`,
  },
  {
    question: '¿Puedo alquilar legalmente mi propiedad en Lombok?',
    answer: `Sí, con la estructura legal correcta en su lugar.
<br/><br/>
Los <strong>alquileres vacacionales de corta duración</strong> (Airbnb, Booking.com, etc.) requieren un permiso de alojamiento comercial (<em>izin usaha akomodasi</em>). Este permiso es bastante más fácil de obtener cuando la propiedad se posee a través de una PT PMA, que aporta la entidad comercial legal necesaria para la actividad comercial.
<br/><br/>
Los <strong>alquileres de larga duración</strong> (6 meses o más) están sujetos a menos requisitos regulatorios y pueden gestionarse de forma más sencilla.
<br/><br/>
Lombok ha promovido activamente la inversión turística y el entorno regulatorio en torno al alquiler de villas es, en general, más favorable que el de Bali. RumahYa puede ponerte en contacto con gestores inmobiliarios que se encargan tanto de la operación del alquiler como del lado del cumplimiento normativo.`,
  },
  {
    question: '¿Cómo ayuda RumahYa a los compradores europeos?',
    answer: `RumahYa actúa como tu punto de contacto local, sobre el terreno en Lombok. En concreto:
<ul>
<li><strong>Buscamos y filtramos propiedades</strong> — identificamos oportunidades de inversión, visitamos los emplazamientos en persona y descartamos todo lo que tenga un título poco claro o problemas legales.</li>
<li><strong>Verificamos los títulos de propiedad</strong> — antes de presentar una propiedad, comprobamos la limpieza del título, el cumplimiento de la zonificación y la ausencia de litigios en el BPN.</li>
<li><strong>Coordinamos la due diligence</strong> — trabajamos con Notarios (PPAT) y abogados locales de confianza para gestionar el lado legal de tu transacción.</li>
<li><strong>Salvamos la distancia</strong> — para los compradores que no pueden estar en Lombok a tiempo completo, gestionamos la logística sobre el terreno y te mantenemos informado en cada paso.</li>
<li><strong>Te conectamos con los socios adecuados</strong> — constitución de PT PMA, gestión inmobiliaria, supervisión de obra: te ponemos en contacto con profesionales locales verificados.</li>
</ul>
Trabajamos exclusivamente para los compradores — no para vendedores ni promotores — de modo que nuestros intereses están plenamente alineados con los tuyos. No sustituimos a un notario o abogado, pero nos aseguramos de que tengas el equipo adecuado a tu alrededor desde el primer día.
<br/><br/>
<em>Toda la información de esta página tiene únicamente fines educativos y no constituye asesoramiento legal o fiscal. Consulta a un abogado indonesio cualificado antes de formalizar cualquier transacción.</em>`,
  },
];

const byLocale: Record<Locale, FaqItem[]> = { en, fr, es };

export function getFaqs(locale: Locale): FaqItem[] {
  return byLocale[locale] ?? en;
}

// Backward-compatible default export (English) for non-localized consumers.
export const faqs: FaqItem[] = en;
