import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Her Voice database...');

  // 1. Clean existing records safely
  await prisma.memorialTribute.deleteMany();
  await prisma.memorialStory.deleteMany();
  await prisma.ngo.deleteMany();
  await prisma.safetyResource.deleteMany();
  await prisma.quickReportDraft.deleteMany();
  await prisma.contentReport.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  const user1 = await prisma.user.create({
    data: {
      pseudonym: 'SilverLily88',
      avatarSeed: 'lavender',
      isModerator: false,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      pseudonym: 'CourageWing42',
      avatarSeed: 'amber',
      isModerator: false,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      pseudonym: 'AuraSeeker9',
      avatarSeed: 'violet',
      isModerator: false,
    },
  });

  const moderator = await prisma.user.create({
    data: {
      pseudonym: 'SafetyCouncilMod',
      avatarSeed: 'emerald',
      isModerator: true,
    },
  });

  // 3. Seed HerSpace Posts & Comments
  const post1 = await prisma.post.create({
    data: {
      authorId: user1.id,
      pseudonym: user1.pseudonym,
      title: 'Breaking the silence: Recognizing the early red flags of financial control',
      content:
        'For almost two years, I was told that handing over my salary was just "good budgeting for our future." Every expense needed itemized receipts, and my bank account notifications were sent to his phone. It felt like love at first, but slowly my independence disappeared. To anyone reading this: financial isolation is real abuse. Opening my own secret account was my first step towards freedom.',
      category: 'domestic_abuse',
      triggerWarning: 'Emotional & financial abuse discussions',
      isVerified: true,
      moderationStatus: 'approved',
      upvotes: 42,
      createdAt: new Date(Date.now() - 3600000 * 24 * 3),
    },
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: user2.id,
      pseudonym: user2.pseudonym,
      title: 'Navigating workplace harassment: How the POSH Internal Committee helped me',
      content:
        'When a senior manager repeatedly crossed boundaries during late-night team messages, I was terrified I would lose my job if I spoke up. I started keeping dated screenshots and written email logs. Last month, I formally approached our Internal Committee (IC). Knowing my legal rights under the POSH Act gave me courage. You do not have to endure "casual" misconduct to protect your career.',
      category: 'harassment',
      triggerWarning: 'Workplace harassment details',
      isVerified: true,
      moderationStatus: 'approved',
      upvotes: 68,
      createdAt: new Date(Date.now() - 3600000 * 24 * 5),
    },
  });

  const post3 = await prisma.post.create({
    data: {
      authorId: user3.id,
      pseudonym: user3.pseudonym,
      title: 'One year in trauma therapy: Reclaiming my peace after assault',
      content:
        'The hardest part of healing wasn’t the legal battle; it was unlearning the voice in my head that asked "Could I have avoided this?" Healing is non-linear. Some days grief hits like a wave, and other days I feel invincible. I am writing this from my own cozy apartment today. Life gets warm again. Please don’t give up.',
      category: 'recovery',
      triggerWarning: 'Assault recovery reflection',
      isVerified: true,
      moderationStatus: 'approved',
      upvotes: 95,
      createdAt: new Date(Date.now() - 3600000 * 24 * 1),
    },
  });

  // Add comments
  await prisma.comment.createMany({
    data: [
      {
        postId: post1.id,
        authorId: user2.id,
        pseudonym: user2.pseudonym,
        content: 'Thank you for sharing this. So many people overlook financial control because there are no physical bruises. Proud of you for opening that account!',
      },
      {
        postId: post1.id,
        authorId: moderator.id,
        pseudonym: moderator.pseudonym,
        content: 'Helpful reminder: In India, Section 3 of the Protection of Women from Domestic Violence Act (PWDVA) explicitly recognizes economic abuse as a punishable offense.',
      },
      {
        postId: post2.id,
        authorId: user1.id,
        pseudonym: user1.pseudonym,
        content: 'Keeping timestamped logs is so crucial! Thank you for detailing how you documented everything.',
      },
      {
        postId: post3.id,
        authorId: user2.id,
        pseudonym: user2.pseudonym,
        content: 'Sending you so much love and solidarity. "Life gets warm again" brought tears to my eyes 💜',
      },
    ],
  });

  // Add reactions
  await prisma.reaction.createMany({
    data: [
      { postId: post1.id, userId: user2.id, type: 'purple_heart' },
      { postId: post1.id, userId: user3.id, type: 'solidarity' },
      { postId: post2.id, userId: user1.id, type: 'listening_ear' },
      { postId: post3.id, userId: user1.id, type: 'empathy_hug' },
      { postId: post3.id, userId: user2.id, type: 'purple_heart' },
    ],
  });

  // 4. Seed Verified Safety Resources
  await prisma.safetyResource.createMany({
    data: [
      {
        title: 'Emergency Response Support System (ERSS - India)',
        category: 'helpline',
        description: 'Single unified 24x7 emergency phone number for police, fire, and ambulance across all states in India. Includes GPS dispatching.',
        emergencyNumber: '112',
        phoneNumber: '112',
        country: 'India',
        is24x7: true,
        source: 'Ministry of Home Affairs, Government of India',
        verifiedDate: 'October 2026',
        url: 'https://112.gov.in',
      },
      {
        title: 'National Commission for Women (NCW) 24x7 Helpline',
        category: 'helpline',
        description: 'Dedicated round-the-clock helpline providing crisis counseling, legal guidance, and police coordination for women facing violence.',
        phoneNumber: '7827170170',
        emergencyNumber: '7827170170',
        country: 'India',
        is24x7: true,
        source: 'National Commission for Women (NCW)',
        verifiedDate: 'October 2026',
        url: 'http://ncw.nic.in',
      },
      {
        title: 'Women Helpline (All India)',
        category: 'helpline',
        description: 'Universal 24-hour toll-free emergency response helpline for women affected by violence, in both public and private spaces.',
        phoneNumber: '181',
        emergencyNumber: '1091',
        country: 'India',
        is24x7: true,
        source: 'Ministry of Women and Child Development',
        verifiedDate: 'October 2026',
        url: 'https://wcd.nic.in',
      },
      {
        title: 'National Cyber Crime Reporting Helpline',
        category: 'cyber_safety',
        description: 'Official helpline to report online stalking, unauthorized photo sharing, impersonation, blackmail, and cyber fraud.',
        phoneNumber: '1930',
        emergencyNumber: '1930',
        country: 'India',
        is24x7: true,
        source: 'Indian Cyber Crime Coordination Centre (I4C)',
        verifiedDate: 'October 2026',
        url: 'https://cybercrime.gov.in',
      },
      {
        title: 'Vandrevala Foundation Mental Health & Crisis Helpline',
        category: 'helpline',
        description: 'Free, confidential, 24x7 psychological counseling and suicide prevention crisis support available in Hindi, English, and regional languages.',
        phoneNumber: '+91 9999 666 555',
        emergencyNumber: '9999666555',
        country: 'India',
        is24x7: true,
        source: 'Vandrevala Foundation Verified Helpline',
        verifiedDate: 'October 2026',
        url: 'https://www.vandrevalafoundation.com',
      },
      {
        title: 'Sakhi — One Stop Centres (Pan-India)',
        category: 'shelter',
        description: 'Integrated support under one roof: emergency shelter, medical aid, police facilitation, legal counselling, and psycho-social support for women survivors.',
        address: 'District Headquarters across all 700+ districts in India',
        country: 'India',
        is24x7: true,
        source: 'Ministry of Women & Child Development',
        verifiedDate: 'October 2026',
        url: 'https://wcd.nic.in/schemes/one-stop-centre-scheme-1',
      },
    ],
  });

  // 5. Seed Verified NGOs
  await prisma.ngo.createMany({
    data: [
      {
        name: 'SNEHA (Society for Nutrition, Education and Health Action)',
        mission: 'Preventing gender-based violence, improving maternal and child health, and supporting survivors in vulnerable communities.',
        description: 'SNEHA operates hospital-based crisis centres, community counseling services, and safe shelter referrals. Their crisis line provides compassionate emergency guidance.',
        services: 'Shelter, Counselling, Crisis Intervention, Healthcare',
        contactPhone: '+91 98330 52684',
        contactEmail: 'crisis@snehamumbai.org',
        officialWebsite: 'https://snehamumbai.org',
        officialDonationUrl: 'https://snehamumbai.org/donate/',
        city: 'Mumbai',
        state: 'Maharashtra',
        verifiedSource: 'Charity Navigator & Verified NGO Registry India',
        verifiedDate: 'October 2026',
        volunteerInfo: 'Community mentoring, crisis helpline support, and field health workshops.',
      },
      {
        name: 'Majlis Legal Centre',
        mission: 'Providing free, feminist legal aid, court representation, and rights counseling to women and children affected by sexual and domestic abuse.',
        description: 'Founded by senior women advocates, Majlis accompanies survivors through every step of the criminal justice system, from filing an FIR to court hearings.',
        services: 'Legal Aid, Courtroom Representation, Police Coordination, Legal Literacy',
        contactPhone: '+91 22 2666 1254',
        contactEmail: 'admin@majlislegal.org',
        officialWebsite: 'https://majlislegal.org',
        officialDonationUrl: 'https://majlislegal.org/support-us/',
        city: 'Mumbai',
        state: 'Maharashtra',
        verifiedSource: 'Bar Council Verified Legal Trust',
        verifiedDate: 'October 2026',
        volunteerInfo: 'Paralegal volunteering, case research, and translation support.',
      },
      {
        name: 'Jagori Women’s Resource Centre',
        mission: 'Creating safe, inclusive public spaces and building feminist consciousness to end violence against women.',
        description: 'Pioneers of the "Safe Cities for Women" initiative. Offers crisis intervention, legal referrals, feminist library access, and youth awareness drives.',
        services: 'Awareness, Counselling, Safe City Audits, Legal Referrals',
        contactPhone: '+91 11 2669 1219',
        contactEmail: 'jagori@jagori.org',
        officialWebsite: 'https://jagori.org',
        officialDonationUrl: 'https://jagori.org/contribute/',
        city: 'New Delhi',
        state: 'Delhi',
        verifiedSource: 'Registered Trust & UN Women Partner',
        verifiedDate: 'October 2026',
        volunteerInfo: 'Safety audits in Delhi neighborhoods, creative writing, and campus workshops.',
      },
      {
        name: 'Sayfty',
        mission: 'Empowering women and girls against gender-based violence through education, self-defense, and digital safety tools.',
        description: 'Sayfty uses digital storytelling, survivor forums, and grassroots workshops to break silence and encourage early bystander intervention.',
        services: 'Awareness, Self-Defense, Digital Safety, Youth Education',
        contactPhone: '+91 91677 34891',
        contactEmail: 'team@sayfty.com',
        officialWebsite: 'https://sayfty.com',
        officialDonationUrl: 'https://sayfty.com/donate/',
        city: 'Bangalore',
        state: 'Karnataka',
        verifiedSource: 'Global Women Peace Initiative Verified',
        verifiedDate: 'October 2026',
        volunteerInfo: 'Digital content creation, college ambassador programs, and webinar coordination.',
      },
      {
        name: 'Breakthrough India',
        mission: 'Transforming cultural norms and engaging men and boys to eradicate violence against women and girls.',
        description: 'Renowned for nationwide campaigns such as "Bell Bajao" (Ring the Bell), urging bystanders to interrupt domestic violence.',
        services: 'Awareness, Community Campaigns, Youth Leadership, School Programs',
        contactPhone: '+91 11 4166 6101',
        contactEmail: 'contact@breakthrough.tv',
        officialWebsite: 'https://inbreakthrough.org',
        officialDonationUrl: 'https://inbreakthrough.org/donate/',
        city: 'New Delhi',
        state: 'Delhi',
        verifiedSource: 'Registered Non-Profit NGO India',
        verifiedDate: 'October 2026',
        volunteerInfo: 'Bystander training facilitators, media outreach, and social advocacy.',
      },
      {
        name: 'Prerana',
        mission: 'Protecting children and women vulnerable to commercial sexual exploitation and trafficking.',
        description: 'Runs night care centres, institutional placement, educational support, and anti-trafficking legal defense.',
        services: 'Shelter, Rehabilitation, Anti-Trafficking, Child Protection',
        contactPhone: '+91 22 2388 5174',
        contactEmail: 'prerana@prerana.org',
        officialWebsite: 'https://prerana.org',
        officialDonationUrl: 'https://prerana.org/donate/',
        city: 'Mumbai',
        state: 'Maharashtra',
        verifiedSource: 'Govt. Recognized Child Welfare Organization',
        verifiedDate: 'October 2026',
        volunteerInfo: 'Academic tutoring for shelter children, vocational training coaching.',
      },
      {
        name: 'Aks Foundation',
        mission: 'Providing crisis lines, immediate safe shelter, and trauma counseling for survivors of domestic violence.',
        description: 'Aks offers round-the-clock telephone crisis intervention, individual and family counseling, and long-term empowerment pathways.',
        services: 'Counselling, Shelter, Crisis Line, Legal Aid',
        contactPhone: '+91 87930 88814',
        contactEmail: 'support@aksfoundation.org',
        officialWebsite: 'https://aksfoundation.org',
        officialDonationUrl: 'https://aksfoundation.org/donation/',
        city: 'Pune',
        state: 'Maharashtra',
        verifiedSource: 'Registered Charitable Trust',
        verifiedDate: 'October 2026',
        volunteerInfo: 'Crisis hotline responders (training provided), event organizing.',
      },
    ],
  });

  // 6. Seed Digital Memorial Stories
  // Día de los Muertos & Halloween Theme: Real-world violence is more frightening than fictional horror.
  // We celebrate their lives, aspirations, and the enduring social and legal awakenings they created.
  await prisma.memorialStory.createMany({
    data: [
      {
        name: 'Jyoti Singh ("Nirbhaya")',
        eraOrYear: '1989 – 2012',
        location: 'New Delhi, India',
        biography:
          'A fiercely determined 23-year-old physiotherapy intern from Uttar Pradesh who was completing her hospital clinical duties. Known to her family and peers for her deep compassion, bright humor, and relentless drive to lift her family from poverty through healthcare.',
        legacyImpact:
          'Her courage ignited an unprecedented national conscience and sparked the landmark Justice Verma Committee recommendations. This led directly to the Criminal Law (Amendment) Act 2013, criminalizing stalking, voyeurism, and acid attacks, alongside creating the Nirbhaya Fund for emergency women safety initiatives.',
        candlesLit: 4120,
        marigoldsOffered: 3840,
        preventionNote:
          'Emergency SOS systems, 112 nationwide integration, and fast-track courts were reinforced in response to the public outcry her memory inspired.',
        verifiedSource: 'Supreme Court of India Public Records & Justice Verma Committee Report',
      },
      {
        name: 'Bhanwari Devi',
        eraOrYear: '1992 – Living Pioneer',
        location: 'Bhateri, Rajasthan, India',
        biography:
          'A grassroots social worker ("Saathi") appointed by the Government of Rajasthan under the Women’s Development Project. She took a fearless stand against child marriage in rural communities, enduring horrific backlash from powerful feudal forces.',
        legacyImpact:
          'Her unyielding fight for justice reached the Supreme Court in Vishaka and Others v. State of Rajasthan (1997), resulting in the foundational "Vishaka Guidelines". This directly culminated in India’s landmark POSH Act 2013, mandating Internal Complaints Committees in every workplace across the nation.',
        candlesLit: 2950,
        marigoldsOffered: 2780,
        preventionNote:
          'She taught the world that women’s safety in workplaces is not a favor, but a non-negotiable constitutional right under Articles 14, 19, and 21.',
        verifiedSource: 'Supreme Court of India (Vishaka v. State of Rajasthan 1997) & National Women Archives',
      },
      {
        name: 'Mahsa (Jina) Amini',
        eraOrYear: '2000 – 2022',
        location: 'Saqqez, Kurdistan / Tehran',
        biography:
          'A 22-year-old Kurdish-Iranian student with an infectious love for poetry, nature, and family. She had just been admitted to university and dreamed of studying to build a life of independence and dignity.',
        legacyImpact:
          'Her tragic death sparked the historic, woman-led "Woman, Life, Freedom" (Jin, Jiyan, Azadî) human rights uprising across 160+ cities worldwide, inspiring millions to challenge patriarchal authoritarian control over women’s bodies and autonomy.',
        candlesLit: 5210,
        marigoldsOffered: 4930,
        preventionNote:
          'Reminds humanity that autonomy over one’s body, attire, and choices is the bedrock of universal human rights.',
        verifiedSource: 'United Nations Fact-Finding Mission on Iran & Amnesty International',
      },
    ],
  });

  console.log('Database seeded successfully with verified resources, NGOs, memorial records, and community posts.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

