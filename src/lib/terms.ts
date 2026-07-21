// Service Terms copy. Hard-coded rather than CMS-managed: the governing text is
// a legal document, so it's versioned with the code and changes deliberately
// (see §15 — the version in effect at deposit payment governs an engagement).

export const TERMS_VERSION = "1.0";
export const TERMS_EFFECTIVE = "21 July 2026";

// A paragraph, or a bulleted list of items.
export type Block = string | string[];

export type Section = { id: string; number: number; title: string; blocks: Block[] };

export const TERMS_PREAMBLE: string[] = [
  'These Service Terms (the "Terms") govern all services provided by Atelier Archives Appliquées (operating as Applied Archive Atelier), a coopérative de producteurs incorporated under the laws of the Province of Quebec, Canada ("AAA", "we", "us").',
  'By submitting payment of any invoice issued by AAA, the client ("you", "Client") confirms having read these Terms in full and agrees to be bound by them. These Terms apply to all engagements, regardless of whether a separate service agreement has been signed. Where a signed agreement exists and conflicts with these Terms, the signed agreement prevails.',
];

export const TERMS_SECTIONS: Section[] = [
  {
    id: "services",
    number: 1,
    title: "Services",
    blocks: [
      "AAA provides creative services including but not limited to brand strategy, visual identity, web design and development, UX/UI design, motion design, photography and visual content direction, pitch deck and presentation design, copywriting, content strategy, and amplification services.",
      "The specific scope of services for each engagement is defined in a proposal, statement of work, or invoice issued to the Client. Services not explicitly listed in that document are out of scope and will be quoted separately if requested.",
      "AAA reserves the right to determine which member or collaborator performs the work, provided the quality and scope commitments are met.",
    ],
  },
  {
    id: "engagement",
    number: 2,
    title: "Proposals and Engagement",
    blocks: [
      "A proposal issued by AAA is valid for thirty (30) days from the date of issue. After that period, rates and scope may be subject to revision.",
      "An engagement is confirmed when the Client submits payment of the deposit invoice. No work begins before the deposit is received. AAA is not obligated to reserve capacity or begin preparation prior to that payment.",
      "For multi-phase engagements, each phase is governed by its own scope and pricing. Confirmation of a later phase does not occur automatically and requires a separate proposal or written confirmation from both parties.",
    ],
  },
  {
    id: "payment",
    number: 3,
    title: "Fees and Payment",
    blocks: [
      "All fees are stated in the currency specified on the invoice. Unless otherwise noted, fees are exclusive of applicable taxes (GST/HST, QST, or US sales tax where applicable).",
      "Standard payment structure: 50% deposit due on engagement confirmation (receipt of payment), 50% balance due on delivery of final files or at the milestone specified in the proposal. Alternative structures may be agreed in writing.",
      "Invoices are due within seven (7) business days of the invoice date unless otherwise stated. Payments not received within that window may result in work being paused until the account is settled.",
      "Late payments are subject to interest at 1.5% per month (18% per annum) on the outstanding balance, calculated from the due date.",
      "For engagements billed in USD to clients outside Canada, payment by wire transfer to AAA's designated USD account is preferred. Wire instructions will be provided on each invoice.",
      "External production costs (photography crews, printing, sound licensing, stock assets, third-party software, and similar pass-through expenses) are billed at cost with zero markup, unless otherwise agreed, and are invoiced separately from AAA service fees.",
    ],
  },
  {
    id: "revisions",
    number: 4,
    title: "Revisions",
    blocks: [
      "Each engagement includes a defined number of revision rounds as stated in the proposal. A revision round is a single, consolidated set of feedback addressed in one pass.",
      "Feedback must be provided in written form (email or shared document). Verbal feedback is not considered a revision submission.",
      "Revision requests that represent a material change in direction, scope, or concept (as distinct from refinements within the established direction) are considered new scope and will be quoted separately.",
      "Additional revision rounds beyond those included are billed at the applicable hourly rate for the discipline involved, as stated in AAA's current rate card.",
    ],
  },
  {
    id: "timeline",
    number: 5,
    title: "Timeline and Delays",
    blocks: [
      "AAA will provide an estimated timeline at the start of each engagement. Timelines are contingent on timely receipt of Client feedback, approvals, and materials.",
      "If the Client does not respond to a request for feedback or approval within ten (10) business days without prior notice, AAA may pause the engagement. Restarting a paused engagement may affect the delivery timeline and, in cases where a significant gap has occurred, may incur a restart fee.",
      "Delays caused by AAA that are not attributable to Client actions or force majeure will not result in additional charges to the Client.",
      "Neither party is liable for delays caused by circumstances beyond reasonable control, including but not limited to natural disasters, platform outages, or government action.",
    ],
  },
  {
    id: "client-responsibilities",
    number: 6,
    title: "Client Responsibilities",
    blocks: [
      "The Client is responsible for providing accurate and complete information, materials, and access necessary for AAA to perform the services. AAA is not liable for errors or delays resulting from incomplete, inaccurate, or late-supplied materials.",
      "The Client represents and warrants that any materials, content, logos, images, or other assets provided to AAA are owned by the Client or that the Client has the right to use them, and that their use by AAA in the course of the engagement does not infringe any third-party rights.",
      "The Client is responsible for final review and approval of all deliverables before launch, publication, or production. AAA is not liable for errors that were present in approved deliverables.",
    ],
  },
  {
    id: "intellectual-property",
    number: 7,
    title: "Intellectual Property",
    blocks: [
      "All work product, deliverables, source files, and materials created under an engagement remain the property of AAA until full payment of all invoices related to that engagement has been received.",
      "Upon receipt of full and final payment, AAA assigns to the Client all rights, title, and interest in the final deliverables produced under that engagement, excluding the following:",
      [
        "Pre-existing AAA assets, frameworks, methodologies, or templates that were adapted for the engagement",
        "Third-party assets (stock photography, licensed typefaces, open-source code, etc.) which are governed by their own licenses",
        "Work product from any unpaid invoices within the engagement",
      ],
      "AAA retains the right to display completed work in its portfolio, case studies, award submissions, and marketing materials, including on social media and the AAA website, unless the Client has requested confidentiality in writing prior to the start of the engagement. Confidential clients will not be named or featured without explicit written consent.",
      "AAA also retains a non-exclusive, perpetual license to use general techniques, skills, and knowledge developed during any engagement.",
    ],
  },
  {
    id: "confidentiality",
    number: 8,
    title: "Confidentiality",
    blocks: [
      "Both parties agree to keep confidential any proprietary, sensitive, or non-public information shared in connection with an engagement, and not to disclose such information to third parties without prior written consent.",
      "This obligation does not apply to information that is or becomes publicly available through no fault of the receiving party, is independently developed by the receiving party, or is required to be disclosed by law or regulatory authority.",
      "Confidentiality obligations survive the termination of an engagement for a period of three (3) years.",
    ],
  },
  {
    id: "termination",
    number: 9,
    title: "Termination",
    blocks: [
      "Either party may terminate an engagement with written notice.",
      "If the Client terminates after work has commenced:",
      [
        "The deposit is non-refundable",
        "AAA will invoice for all work completed beyond the deposit amount at the time of termination, based on hours logged at the applicable rates",
        "All completed work product for which payment has been received transfers to the Client; work product for which payment has not been received remains AAA's property",
      ],
      "If AAA terminates without cause:",
      [
        "The unused portion of the deposit will be refunded within fourteen (14) business days",
        "AAA will provide a handoff of all completed work to date",
      ],
      "Termination does not affect any accrued payment obligations.",
    ],
  },
  {
    id: "warranties",
    number: 10,
    title: "Warranties and Representations",
    blocks: [
      "AAA warrants that the services will be performed with reasonable skill and care, consistent with professional standards in the creative industry.",
      "AAA does not warrant that deliverables will be error-free, or that websites, applications, or digital products will be compatible with all devices, browsers, or future platform updates beyond those specified in the scope.",
      "AAA does not guarantee specific business outcomes (increased revenue, conversion rates, search rankings, or similar metrics) as a result of its services.",
      "The Client warrants that it has the authority to enter into this engagement and that the engagement does not violate any agreement with a third party.",
    ],
  },
  {
    id: "liability",
    number: 11,
    title: "Limitation of Liability",
    blocks: [
      "To the fullest extent permitted by applicable law, AAA's total liability to the Client for any claim arising out of or related to an engagement shall not exceed the total fees paid by the Client under that engagement in the twelve (12) months preceding the claim.",
      "AAA is not liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of revenue, loss of data, loss of business opportunity, or reputational harm, even if AAA has been advised of the possibility of such damages.",
      "These limitations apply regardless of the legal theory under which the claim is brought.",
    ],
  },
  {
    id: "independent-contractor",
    number: 12,
    title: "Independent Contractor",
    blocks: [
      "AAA operates as an independent contractor. Nothing in these Terms creates an employment, agency, partnership, or joint venture relationship between AAA and the Client.",
      "AAA members and collaborators are not employees of the Client and are not entitled to any employee benefits, workers' compensation, or similar protections from the Client.",
    ],
  },
  {
    id: "credit",
    number: 13,
    title: "Portfolio and Credit",
    blocks: [
      "Unless confidentiality has been agreed in writing, AAA may credit its work publicly. This includes crediting AAA on published websites (typically a small footer credit or link), in press materials, and in award submissions.",
      "The Client will not remove or obscure such credits without prior written agreement. Where removal is requested, the parties will agree on an appropriate alternative acknowledgment.",
    ],
  },
  {
    id: "subcontracting",
    number: 14,
    title: "Subcontracting and Collaborators",
    blocks: [
      "AAA may engage collaborators, contractors, or specialized contributors to perform portions of the services. AAA remains responsible for the quality and delivery of all work performed under these Terms, regardless of who performs it.",
      "Collaborators engaged by AAA are bound by confidentiality obligations consistent with these Terms.",
    ],
  },
  {
    id: "amendments",
    number: 15,
    title: "Amendments",
    blocks: [
      "AAA may update these Terms from time to time. The version in effect at the time of deposit payment governs that engagement. Updated versions will be published at appliedarchiveatelier.com/terms with a new version number and effective date.",
      "For ongoing retainer engagements, AAA will provide thirty (30) days written notice before updated Terms take effect.",
    ],
  },
  {
    id: "governing-law",
    number: 16,
    title: "Governing Law and Disputes",
    blocks: [
      "These Terms are governed by the laws of the Province of Quebec, Canada, without regard to conflict of law principles.",
      "Any dispute arising under or in connection with these Terms shall first be addressed through good-faith negotiation between the parties. If the dispute cannot be resolved within thirty (30) days of written notice, either party may pursue resolution through the courts of Montreal, Quebec, to whose jurisdiction both parties consent.",
      "For clients based outside Canada, the parties agree that English is the governing language of these Terms and any dispute resolution proceedings, regardless of any French-language version of communications.",
    ],
  },
  {
    id: "entire-agreement",
    number: 17,
    title: "Entire Agreement",
    blocks: [
      "These Terms, together with any proposal, statement of work, or invoice issued for a specific engagement, constitute the entire agreement between AAA and the Client with respect to that engagement, and supersede all prior discussions, representations, and understandings.",
      "Where a separate signed service agreement exists for a specific engagement and conflicts with these Terms, the signed agreement prevails for that engagement only.",
      "If any provision of these Terms is found to be unenforceable, the remaining provisions remain in full force.",
    ],
  },
];
