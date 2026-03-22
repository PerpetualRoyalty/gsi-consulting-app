const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.document.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.agreement.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const clientPasswordHash = await bcrypt.hash('client123', 10);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'doug@goodsamaritaninstitute.org',
      name: 'Doug - Administrator',
      password: adminPasswordHash,
      role: 'ADMIN',
      company: 'Good Samaritan Institute',
      phone: '+1-555-0100',
      avatar: null,
    },
  });
  console.log('✓ Created admin user:', adminUser.email);

  // Create sample client users
  const client1 = await prisma.user.create({
    data: {
      email: 'sarah@techstartup.com',
      name: 'Sarah Johnson',
      password: clientPasswordHash,
      role: 'CLIENT',
      company: 'Tech Startup Inc',
      phone: '+1-555-0101',
      avatar: null,
    },
  });
  console.log('✓ Created client user:', client1.email);

  const client2 = await prisma.user.create({
    data: {
      email: 'michael@designco.com',
      name: 'Michael Chen',
      password: clientPasswordHash,
      role: 'CLIENT',
      company: 'Design Co',
      phone: '+1-555-0102',
      avatar: null,
    },
  });
  console.log('✓ Created client user:', client2.email);

  const client3 = await prisma.user.create({
    data: {
      email: 'jessica@ecommerce.net',
      name: 'Jessica Martinez',
      password: clientPasswordHash,
      role: 'CLIENT',
      company: 'E-commerce Solutions',
      phone: '+1-555-0103',
      avatar: null,
    },
  });
  console.log('✓ Created client user:', client3.email);

  // Create sample agreements
  const agreement1 = await prisma.agreement.create({
    data: {
      title: 'Q1 2026 Retainer Agreement',
      description: 'Monthly consulting retainer for strategic guidance and support',
      type: 'RETAINER',
      status: 'ACTIVE',
      content: 'This is a monthly retainer agreement for ongoing consulting services. The consultant will provide up to 40 hours per month of strategic guidance, planning, and technical support.',
      retainerAmount: 5000,
      billingCycle: 'MONTHLY',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-03-31'),
      signedAt: new Date('2025-12-15'),
      signatureData: 'Sarah Johnson - Digitally signed on 2025-12-15',
      clientId: client1.id,
    },
  });
  console.log('✓ Created agreement:', agreement1.title);

  const agreement2 = await prisma.agreement.create({
    data: {
      title: 'Website Redesign Project',
      description: 'Complete website redesign and development project',
      type: 'PROJECT',
      status: 'SENT',
      content: 'Project scope includes: user research, wireframing, UI/UX design, frontend development, backend integration, testing, and deployment. Total project timeline: 12 weeks.',
      billingCycle: 'ONE_TIME',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-06-30'),
      clientId: client2.id,
    },
  });
  console.log('✓ Created agreement:', agreement2.title);

  const agreement3 = await prisma.agreement.create({
    data: {
      title: 'Custom Consulting Engagement',
      description: 'Specialized consulting for business transformation',
      type: 'CUSTOM',
      status: 'DRAFT',
      content: 'Custom engagement to be negotiated with client. Areas of focus: organizational structure, process optimization, technology stack evaluation.',
      clientId: client3.id,
    },
  });
  console.log('✓ Created agreement:', agreement3.title);

  const agreement4 = await prisma.agreement.create({
    data: {
      title: 'Mobile App Development',
      description: 'Native iOS and Android app development',
      type: 'PROJECT',
      status: 'COMPLETED',
      content: 'Delivered a fully functional mobile application with cloud backend integration, user authentication, and payment processing.',
      billingCycle: 'ONE_TIME',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-11-30'),
      signedAt: new Date('2025-05-20'),
      signatureData: 'Michael Chen - Digitally signed on 2025-05-20',
      clientId: client2.id,
    },
  });
  console.log('✓ Created agreement:', agreement4.title);

  // Create sample payments
  const payment1 = await prisma.payment.create({
    data: {
      amount: 5000,
      status: 'COMPLETED',
      type: 'RETAINER',
      description: 'January 2026 Retainer Payment',
      agreementId: agreement1.id,
      clientId: client1.id,
      dueDate: new Date('2026-01-10'),
      paidAt: new Date('2026-01-08'),
    },
  });
  console.log('✓ Created payment:', payment1.description);

  const payment2 = await prisma.payment.create({
    data: {
      amount: 5000,
      status: 'COMPLETED',
      type: 'RETAINER',
      description: 'February 2026 Retainer Payment',
      agreementId: agreement1.id,
      clientId: client1.id,
      dueDate: new Date('2026-02-10'),
      paidAt: new Date('2026-02-09'),
    },
  });
  console.log('✓ Created payment:', payment2.description);

  const payment3 = await prisma.payment.create({
    data: {
      amount: 5000,
      status: 'PENDING',
      type: 'RETAINER',
      description: 'March 2026 Retainer Payment',
      agreementId: agreement1.id,
      clientId: client1.id,
      dueDate: new Date('2026-03-10'),
    },
  });
  console.log('✓ Created payment:', payment3.description);

  const payment4 = await prisma.payment.create({
    data: {
      amount: 35000,
      status: 'PROCESSING',
      type: 'PROJECT',
      description: 'Website Redesign - 50% Deposit',
      agreementId: agreement2.id,
      clientId: client2.id,
      dueDate: new Date('2026-04-15'),
    },
  });
  console.log('✓ Created payment:', payment4.description);

  const payment5 = await prisma.payment.create({
    data: {
      amount: 45000,
      status: 'COMPLETED',
      type: 'PROJECT',
      description: 'Mobile App Development - Final Payment',
      agreementId: agreement4.id,
      clientId: client2.id,
      dueDate: new Date('2025-12-01'),
      paidAt: new Date('2025-12-01'),
    },
  });
  console.log('✓ Created payment:', payment5.description);

  // Create sample messages
  const message1 = await prisma.message.create({
    data: {
      content: 'Hi Doug, could you review the Q1 strategy document? I have some questions about the timeline.',
      senderId: client1.id,
      receiverId: adminUser.id,
      threadId: 'thread-001',
      isRead: true,
    },
  });
  console.log('✓ Created message from', client1.name);

  const message2 = await prisma.message.create({
    data: {
      content: 'Of course! I\'ll review it today and send over my feedback by tomorrow.',
      senderId: adminUser.id,
      receiverId: client1.id,
      threadId: 'thread-001',
      isRead: true,
    },
  });
  console.log('✓ Created message from', adminUser.name);

  const message3 = await prisma.message.create({
    data: {
      content: 'When can we schedule a call to discuss the redesign project proposal?',
      senderId: client2.id,
      receiverId: adminUser.id,
      threadId: 'thread-002',
      isRead: false,
    },
  });
  console.log('✓ Created message from', client2.name);

  const message4 = await prisma.message.create({
    data: {
      content: 'Thanks for the completed mobile app! The team is very happy with the results.',
      senderId: client2.id,
      receiverId: adminUser.id,
      threadId: 'thread-003',
      isRead: true,
    },
  });
  console.log('✓ Created message from', client2.name);

  // Create sample documents
  const doc1 = await prisma.document.create({
    data: {
      name: 'Q1 2026 Strategy Document',
      fileName: 'Q1-2026-Strategy.pdf',
      fileType: 'application/pdf',
      fileSize: 2400000,
      filePath: '/documents/strategy/Q1-2026-Strategy.pdf',
      description: 'Strategic planning document for Q1 2026 with goals and milestones',
      category: 'REPORT',
      uploadedById: adminUser.id,
      sharedWithId: client1.id,
    },
  });
  console.log('✓ Created document:', doc1.name);

  const doc2 = await prisma.document.create({
    data: {
      name: 'Website Redesign Proposal',
      fileName: 'Website-Redesign-Proposal.pdf',
      fileType: 'application/pdf',
      fileSize: 1800000,
      filePath: '/documents/proposals/Website-Redesign-Proposal.pdf',
      description: 'Detailed proposal for the website redesign project including scope, timeline, and pricing',
      category: 'AGREEMENT',
      uploadedById: adminUser.id,
      sharedWithId: client2.id,
    },
  });
  console.log('✓ Created document:', doc2.name);

  const doc3 = await prisma.document.create({
    data: {
      name: 'Project Delivery Report - Mobile App',
      fileName: 'Mobile-App-Delivery-Report.pdf',
      fileType: 'application/pdf',
      fileSize: 3100000,
      filePath: '/documents/reports/Mobile-App-Delivery-Report.pdf',
      description: 'Final delivery and handoff report for the mobile app development project',
      category: 'DELIVERABLE',
      uploadedById: adminUser.id,
      sharedWithId: client2.id,
    },
  });
  console.log('✓ Created document:', doc3.name);

  const doc4 = await prisma.document.create({
    data: {
      name: 'Invoice - March 2026 Retainer',
      fileName: 'Invoice-2026-03.pdf',
      fileType: 'application/pdf',
      fileSize: 850000,
      filePath: '/documents/invoices/Invoice-2026-03.pdf',
      description: 'Invoice for March 2026 retainer services',
      category: 'INVOICE',
      uploadedById: adminUser.id,
      sharedWithId: client1.id,
    },
  });
  console.log('✓ Created document:', doc4.name);

  const doc5 = await prisma.document.create({
    data: {
      name: 'Design Mockups - Website Redesign',
      fileName: 'Design-Mockups.figma',
      fileType: 'application/figma',
      fileSize: 5200000,
      filePath: '/documents/designs/Design-Mockups.figma',
      description: 'Figma design mockups for the website redesign',
      category: 'DELIVERABLE',
      uploadedById: adminUser.id,
      sharedWithId: client2.id,
    },
  });
  console.log('✓ Created document:', doc5.name);

  console.log('\n✅ Database seed completed successfully!');
  console.log('\nTest credentials:');
  console.log('Admin: doug@goodsamaritaninstitute.org / admin123');
  console.log('Client 1: sarah@techstartup.com / client123');
  console.log('Client 2: michael@designco.com / client123');
  console.log('Client 3: jessica@ecommerce.net / client123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
