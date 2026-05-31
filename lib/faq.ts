export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'Can a European (foreigner) buy property in Lombok?',
    answer: `Foreigners cannot hold the Indonesian freehold title (Hak Milik) directly in their own name. However, there are two fully legal and widely used pathways: (1) a <strong>leasehold arrangement</strong> (Hak Sewa), where you lease land or property from an Indonesian title holder for an extended term — typically structured as 25 + 25 + 10 years (up to 60 years total); and (2) purchasing via a <strong>PT PMA</strong> (foreign-owned Indonesian company), which can hold a commercial freehold title (Hak Guna Bangunan, or HGB). Both structures are commonly used by European buyers in Lombok and fully enforceable in Indonesian courts.`,
  },
  {
    question: 'What is the difference between leasehold and freehold in Indonesia?',
    answer: `<strong>Leasehold (Hak Sewa)</strong> gives you the right to use a property for a fixed period, typically 25 years with two renewal options of 25 and 10 years (60 years total). You do not own the underlying land — the Indonesian title holder retains ownership. It is simpler and cheaper to set up, and offers good protection when registered before a Notary (PPAT) and at the National Land Agency (BPN).<br/><br/><strong>Freehold via PT PMA</strong> gives a company you own and control the right to hold HGB title — an indefinitely renewable commercial ownership right over the land and building. It offers stronger long-term security, better resale value, and the ability to generate rental income legally. The trade-off is the cost and time of setting up an Indonesian company.`,
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
    answer: `A <strong>PT PMA</strong> (Perseroan Terbatas Penanaman Modal Asing) is a foreign-owned limited liability company registered under Indonesian law. It is the legal vehicle that allows foreigners to hold freehold-equivalent title (HGB) over Indonesian land.<br/><br/>You need a PT PMA if you want to: own land in freehold rather than leasehold; operate a commercial short-term rental legally; or structure your investment for tax and estate planning purposes.<br/><br/>You do <em>not</em> need a PT PMA for a standard long-term leasehold purchase. A PT PMA is not just a formality — it is a fully operating Indonesian company with tax and reporting obligations. Setup typically takes <strong>4–8 weeks</strong> and costs approximately €1,500–€3,000 in legal and government fees, with annual maintenance costs of €500–€1,500/year.`,
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
<li>Annual accounting and tax filing: €500–€1,500/year via a local accountant</li>
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
