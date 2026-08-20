import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting full-stack Hackathon Platform database seeding...");

  // Clean existing tables in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.scheduleEvent.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.score.deleteMany();
  await prisma.judgingCriteria.deleteMany();
  await prisma.prize.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamInvitation.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.hackathonRegistration.deleteMany();
  await prisma.judge.deleteMany();
  await prisma.hackathon.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing records.");

  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create Core Users across all roles
  const adminUser = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      username: "admin_alex",
      email: "admin@hackathon.dev",
      passwordHash: defaultPasswordHash,
      role: "ADMIN",
      bio: "Global Platform Administrator & Open Source Advocate.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      location: "San Francisco, CA",
      website: "https://hackathon.dev",
      github: "https://github.com/alexrivera",
      skills: JSON.stringify(["Platform Security", "Cloud Architecture", "DevOps", "Next.js"]),
    },
  });

  const organizerUser = await prisma.user.create({
    data: {
      name: "Elena Rostova",
      username: "elena_organizer",
      email: "organizer@hackathon.dev",
      passwordHash: defaultPasswordHash,
      role: "ORGANIZER",
      bio: "Lead Hackathon Director at DevGlobal Innovations. Organized 40+ premier tech events.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
      location: "New York, NY",
      website: "https://devglobal.io",
      github: "https://github.com/elenarostova",
      linkedin: "https://linkedin.com/in/elenarostova",
      skills: JSON.stringify(["Community Growth", "Event Management", "Product Strategy"]),
    },
  });

  const judgeUser = await prisma.user.create({
    data: {
      name: "Dr. Marcus Vance",
      username: "dr_marcus_judge",
      email: "judge@hackathon.dev",
      passwordHash: defaultPasswordHash,
      role: "JUDGE",
      bio: "Partner & AI Research Lead at VentureWave. Former Stanford AI Lab Scientist.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      location: "Palo Alto, CA",
      website: "https://marcusvance.ai",
      github: "https://github.com/marcusvance",
      linkedin: "https://linkedin.com/in/marcusvance",
      skills: JSON.stringify(["Deep Learning", "LLMs", "System Architecture", "Venture Capital"]),
    },
  });

  const mentorUser = await prisma.user.create({
    data: {
      name: "Sarah Chen",
      username: "sarah_mentor",
      email: "mentor@hackathon.dev",
      passwordHash: defaultPasswordHash,
      role: "MENTOR",
      bio: "Staff Cloud Architect & Google Developer Expert. Helping hackers build resilient systems.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      location: "Seattle, WA",
      website: "https://sarahchen.dev",
      github: "https://github.com/sarahchen",
      linkedin: "https://linkedin.com/in/sarahchen",
      skills: JSON.stringify(["Kubernetes", "TypeScript", "Distributed Systems", "GraphQL"]),
    },
  });

  const hackerUser = await prisma.user.create({
    data: {
      name: "Kai Tanaka",
      username: "kai_hacker",
      email: "hacker@hackathon.dev",
      passwordHash: defaultPasswordHash,
      role: "PARTICIPANT",
      bio: "Full-Stack Engineer & Generative AI Builder. Passionate about creating high-impact products.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      location: "Austin, TX",
      website: "https://kaitanaka.me",
      github: "https://github.com/kaitanaka",
      linkedin: "https://linkedin.com/in/kaitanaka",
      skills: JSON.stringify(["Next.js", "React", "Python", "PyTorch", "Tailwind CSS", "Prisma"]),
    },
  });

  const hacker2 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      username: "priya_dev",
      email: "priya@hackathon.dev",
      passwordHash: defaultPasswordHash,
      role: "PARTICIPANT",
      bio: "UI/UX Designer & Frontend Specialist. Crafting delightful user journeys.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      skills: JSON.stringify(["Figma", "Tailwind CSS", "React", "Design Systems"]),
    },
  });

  const hacker3 = await prisma.user.create({
    data: {
      name: "David Kim",
      username: "david_backend",
      email: "david@hackathon.dev",
      passwordHash: defaultPasswordHash,
      role: "PARTICIPANT",
      bio: "Rust & Go Backend Engineer. Building fast, resilient APIs.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
      skills: JSON.stringify(["Rust", "Go", "PostgreSQL", "Docker", "WebSockets"]),
    },
  });

  const hacker4 = await prisma.user.create({
    data: {
      name: "Zoe Martinez",
      username: "zoe_ai",
      email: "zoe@hackathon.dev",
      passwordHash: defaultPasswordHash,
      role: "PARTICIPANT",
      bio: "Machine Learning Researcher working on autonomous multi-agent systems.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      skills: JSON.stringify(["LangChain", "OpenAI", "Vector DBs", "Python", "FastAPI"]),
    },
  });

  // 2. Create Organizations
  const org1 = await prisma.organization.create({
    data: {
      name: "DevGlobal Innovations",
      slug: "devglobal",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
      description: "Premier global hackathon organizers connecting innovators with leading tech ecosystems.",
      website: "https://devglobal.io",
      ownerId: organizerUser.id,
    },
  });

  const org2 = await prisma.organization.create({
    data: {
      name: "Web3 Horizon Labs",
      slug: "web3-horizon",
      logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&auto=format&fit=crop&q=80",
      description: "Accelerating decentralized protocols, zero-knowledge proofs, and smart contract engineering.",
      website: "https://web3horizon.org",
      ownerId: organizerUser.id,
    },
  });

  const org3 = await prisma.organization.create({
    data: {
      name: "EcoTech Foundation",
      slug: "ecotech-foundation",
      logo: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=200&auto=format&fit=crop&q=80",
      description: "Harnessing deep technology and software to combat climate change and build clean energy futures.",
      website: "https://ecotech.earth",
      ownerId: organizerUser.id,
    },
  });

  // 3. Create 10 Comprehensive Hackathons with Diverse Statuses and Rich Data
  const now = new Date();

  // Hackathon 1: AI Agents (ACTIVE / Hacking in Progress)
  const h1 = await prisma.hackathon.create({
    data: {
      organizationId: org1.id,
      title: "Global AI & Agentic Innovation Hackathon 2026",
      slug: "global-ai-agents-2026",
      shortDescription: "Build autonomous AI agents, multi-agent workflows, and next-generation cognitive tools.",
      description: "Join over 5,000 developers worldwide in the premier AI hackathon of 2026. Explore cutting-edge LLMs, agentic orchestration frameworks, multimodal computer vision, and real-time reasoning engines to solve high-impact real-world challenges.",
      theme: "Artificial Intelligence",
      mode: "ONLINE",
      location: "Global Virtual",
      logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&auto=format&fit=crop&q=80",
      startDate: subDays(now, 2),
      endDate: addDays(now, 5),
      registrationStart: subDays(now, 20),
      registrationEnd: subDays(now, 1),
      submissionDeadline: addDays(now, 3),
      judgingStart: addDays(now, 3),
      judgingEnd: addDays(now, 5),
      minTeamSize: 1,
      maxTeamSize: 4,
      isFeatured: true,
      status: "ACTIVE",
      eligibility: "Open to all developers, students, researchers, and designers worldwide over the age of 18.",
      rules: "1. All code and assets must be developed during the hackathon period.\n2. Projects may use pre-existing open source libraries and public APIs.\n3. Plagiarism or duplicate submissions will result in immediate disqualification.",
      requirements: "Submissions must include a public GitHub repository with README, a live hosted demo URL, and a 2-3 minute walkthrough video.",
      prizes: {
        create: [
          { title: "Grand Champion", value: "$40,000 Cash + AWS & OpenAI Credits", rank: 1, description: "Top overall project demonstrating groundbreaking agentic autonomy and technical excellence." },
          { title: "1st Runner Up", value: "$25,000 Cash + Cloud Credits", rank: 2, description: "Outstanding innovation and robust architectural implementation." },
          { title: "Best Multimodal Agent", value: "$15,000 Cash", rank: 3, description: "Best integration of vision, audio, and reasoning in autonomous workflows." },
          { title: "Best Developer Tool", value: "$10,000 Cash", rank: 4, description: "Tool that significantly improves AI developer velocity and debugging." },
          { title: "Community Choice Award", value: "$5,000 Cash", rank: 5, description: "Most upvoted project by fellow hackathon participants." },
        ],
      },
      criteria: {
        create: [
          { name: "Technical Complexity & Architecture", description: "Depth of engineering, clean code, scalability, and agent reasoning.", maxScore: 10, weight: 1.2 },
          { name: "Innovation & Originality", description: "Uniqueness of the concept and novel problem-solving approach.", maxScore: 10, weight: 1.2 },
          { name: "Real-World Impact & Utility", description: "Practical value, usability, and market potential.", maxScore: 10, weight: 1.0 },
          { name: "UI/UX & Design Polish", description: "Intuitive user interface, responsiveness, and visual design.", maxScore: 10, weight: 0.8 },
          { name: "Demo & Presentation", description: "Clarity of video demo, documentation, and live walkthrough.", maxScore: 10, weight: 0.8 },
        ],
      },
      sponsors: {
        create: [
          { name: "Anthropic", tier: "TITLE", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120", website: "https://anthropic.com", description: "Pioneering AI safety and frontier research." },
          { name: "Google Cloud", tier: "PLATINUM", logo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=120", website: "https://cloud.google.com", description: "Providing scalable cloud compute and Vertex AI." },
          { name: "Vercel", tier: "GOLD", logo: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120", website: "https://vercel.com", description: "The platform for frontend developers." },
          { name: "Supabase", tier: "SILVER", logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=120", website: "https://supabase.com", description: "Open source Firebase alternative." },
        ],
      },
      scheduleEvents: {
        create: [
          { title: "Opening Ceremony & Keynote", description: "Welcome address, hackathon rules overview, and sponsor track announcements.", location: "Main Stage Zoom", startTime: subDays(now, 2), endTime: subDays(now, 2), type: "CEREMONY" },
          { title: "Building Autonomous Agents Workshop", description: "Live deep dive with lead engineers on LangGraph, AutoGen, and tool calling.", location: "Discord Stage", startTime: subDays(now, 1), endTime: subDays(now, 1), type: "WORKSHOP" },
          { title: "Mentor Office Hours & Architecture Review", description: "Get 1-on-1 feedback from senior AI researchers and cloud mentors.", location: "Mentorship Channels", startTime: now, endTime: addDays(now, 1), type: "MENTORING" },
          { title: "Project Submission Deadline", description: "Final submission cutoff. All repos and demo links must be finalized.", location: "Submission Portal", startTime: addDays(now, 3), endTime: addDays(now, 3), type: "DEADLINE" },
          { title: "Live Demo Day & Finalist Pitches", description: "Top 10 selected teams present live before the executive judging panel.", location: "YouTube Live Stream", startTime: addDays(now, 4), endTime: addDays(now, 4), type: "DEMO_DAY" },
          { title: "Closing Ceremony & Winner Announcements", description: "Celebration of all projects and live reveal of prize champions.", location: "Main Stage", startTime: addDays(now, 5), endTime: addDays(now, 5), type: "WINNER_ANNOUNCEMENT" },
        ],
      },
      announcements: {
        create: [
          { authorId: organizerUser.id, title: "🚀 Hackathon is Officially Live! Submission Portal Open", content: "Welcome builders! You can now start forming teams and creating your project drafts in the dashboard. Check out the schedule for upcoming workshops and mentor office hours.", isPinned: true },
          { authorId: organizerUser.id, title: "💡 $100k Cloud Credits Distributed to All Registered Teams", content: "Check your registered email address for sponsor promo codes providing $500 free credits across Google Cloud, Anthropic API, and Supabase Pro.", isPinned: false },
        ],
      },
      judges: {
        create: [{ userId: judgeUser.id, status: "ACTIVE" }],
      },
      mentors: {
        create: [{ userId: mentorUser.id, expertise: "Cloud Systems & AI Infra", availability: "Daily 2 PM - 6 PM UTC", bio: "Available on Discord #mentor-sarah" }],
      },
    },
  });

  // Hackathon 2: Web3 & ZK (REGISTRATION_OPEN)
  const h2 = await prisma.hackathon.create({
    data: {
      organizationId: org2.id,
      title: "Decentralized Future: Web3 & Zero-Knowledge Summit",
      slug: "web3-zk-summit-2026",
      shortDescription: "Pioneer next-generation DeFi protocols, zero-knowledge privacy circuits, and modular rollups.",
      description: "Build the decentralized internet of tomorrow. Focus areas include cross-chain interoperability, account abstraction, ZK-SNARKs for consumer privacy, and institutional-grade decentralization.",
      theme: "Web3 & Blockchain",
      mode: "HYBRID",
      location: "San Francisco, CA & Virtual",
      logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1400&auto=format&fit=crop&q=80",
      startDate: addDays(now, 7),
      endDate: addDays(now, 14),
      registrationStart: subDays(now, 10),
      registrationEnd: addDays(now, 6),
      submissionDeadline: addDays(now, 12),
      judgingStart: addDays(now, 12),
      judgingEnd: addDays(now, 14),
      minTeamSize: 1,
      maxTeamSize: 5,
      isFeatured: true,
      status: "REGISTRATION_OPEN",
      prizes: {
        create: [
          { title: "Grand Champion", value: "$30,000", rank: 1 },
          { title: "Best ZK Privacy Protocol", value: "$20,000", rank: 2 },
          { title: "Best Account Abstraction UX", value: "$15,000", rank: 3 },
          { title: "Community Favorite", value: "$10,000", rank: 4 },
        ],
      },
      criteria: {
        create: [
          { name: "Technical Solidity & Security", maxScore: 10, weight: 1.2 },
          { name: "Novelty & Cryptographic Design", maxScore: 10, weight: 1.0 },
          { name: "Consumer Usability", maxScore: 10, weight: 0.8 },
        ],
      },
      sponsors: {
        create: [
          { name: "Ethereum Foundation", tier: "TITLE", website: "https://ethereum.org" },
          { name: "Polygon Labs", tier: "PLATINUM", website: "https://polygon.technology" },
          { name: "Chainlink", tier: "GOLD", website: "https://chain.link" },
        ],
      },
    },
  });

  // Hackathon 3: ClimateTech & Clean Energy (JUDGING)
  const h3 = await prisma.hackathon.create({
    data: {
      organizationId: org3.id,
      title: "ClimateTech & Clean Energy Global Challenge",
      slug: "climatetech-clean-energy-2026",
      shortDescription: "Software, IoT, and AI solutions accelerating carbon removal, grid optimization, and conservation.",
      description: "Empowering developers to build actionable technologies for planetary impact. Hack on carbon accounting, renewable energy forecasting, supply chain transparency, and biodiversity monitoring.",
      theme: "Climate & Sustainability",
      mode: "ONLINE",
      location: "Global Virtual",
      logo: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1400&auto=format&fit=crop&q=80",
      startDate: subDays(now, 10),
      endDate: addDays(now, 2),
      registrationStart: subDays(now, 30),
      registrationEnd: subDays(now, 11),
      submissionDeadline: subDays(now, 1),
      judgingStart: subDays(now, 1),
      judgingEnd: addDays(now, 2),
      minTeamSize: 1,
      maxTeamSize: 4,
      isFeatured: false,
      status: "JUDGING",
      prizes: {
        create: [
          { title: "Grand Climate Impact Prize", value: "$35,000", rank: 1 },
          { title: "Best Grid Optimization Solution", value: "$15,000", rank: 2 },
        ],
      },
      criteria: {
        create: [
          { name: "Environmental Impact Potential", maxScore: 10, weight: 1.5 },
          { name: "Technical Feasibility", maxScore: 10, weight: 1.0 },
          { name: "UX & Scalability", maxScore: 10, weight: 0.8 },
        ],
      },
      judges: {
        create: [{ userId: judgeUser.id, status: "ACTIVE" }],
      },
    },
  });

  // Hackathon 4: HealthAI (COMPLETED with Winners & Certificates)
  const h4 = await prisma.hackathon.create({
    data: {
      organizationId: org1.id,
      title: "NextGen HealthTech AI & Diagnostics Hackathon",
      slug: "healthtech-ai-diagnostics",
      shortDescription: "Machine learning for medical imaging, patient triage, and drug discovery workflows.",
      description: "Revolutionizing modern medicine with privacy-preserving diagnostic models, clinical copilots, and wearable health tracking analytics.",
      theme: "Healthcare & Biotech",
      mode: "HYBRID",
      location: "Boston, MA & Virtual",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&auto=format&fit=crop&q=80",
      startDate: subDays(now, 30),
      endDate: subDays(now, 10),
      registrationStart: subDays(now, 60),
      registrationEnd: subDays(now, 31),
      submissionDeadline: subDays(now, 14),
      judgingStart: subDays(now, 14),
      judgingEnd: subDays(now, 10),
      minTeamSize: 1,
      maxTeamSize: 4,
      isFeatured: false,
      status: "COMPLETED",
      prizes: {
        create: [
          { title: "Grand HealthTech Innovation Prize", value: "$40,000", rank: 1 },
          { title: "Runner Up Medical Copilot", value: "$20,000", rank: 2 },
        ],
      },
      criteria: {
        create: [
          { name: "Clinical Precision & Accuracy", maxScore: 10, weight: 1.3 },
          { name: "Data Privacy & Compliance", maxScore: 10, weight: 1.0 },
          { name: "User Interface for Doctors", maxScore: 10, weight: 0.9 },
        ],
      },
    },
  });

  // Hackathon 5: FinTech Disruption (REGISTRATION_OPEN)
  const h5 = await prisma.hackathon.create({
    data: {
      organizationId: org1.id,
      title: "FinTech Disruption & Open Banking Sprint 2026",
      slug: "fintech-disruption-sprint",
      shortDescription: "Build intelligent wealth management, fraud detection algorithms, and instant settlement rails.",
      description: "Shape the next decade of financial technology with real-time payment APIs, algorithmic risk modeling, and financial inclusion apps.",
      theme: "FinTech",
      mode: "HYBRID",
      location: "London, UK & Virtual",
      logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1400&auto=format&fit=crop&q=80",
      startDate: addDays(now, 15),
      endDate: addDays(now, 22),
      registrationStart: subDays(now, 5),
      registrationEnd: addDays(now, 14),
      submissionDeadline: addDays(now, 20),
      judgingStart: addDays(now, 20),
      judgingEnd: addDays(now, 22),
      minTeamSize: 1,
      maxTeamSize: 4,
      isFeatured: true,
      status: "REGISTRATION_OPEN",
      prizes: {
        create: [
          { title: "Grand Prize", value: "$25,000", rank: 1 },
          { title: "Best Fraud Detection AI", value: "$15,000", rank: 2 },
        ],
      },
      criteria: {
        create: [
          { name: "Security & Encryption", maxScore: 10, weight: 1.2 },
          { name: "Market Applicability", maxScore: 10, weight: 1.0 },
        ],
      },
    },
  });

  // Hackathon 6: Autonomous Robotics (ACTIVE)
  const h6 = await prisma.hackathon.create({
    data: {
      organizationId: org1.id,
      title: "Autonomous Robotics & Edge AI Hack",
      slug: "autonomous-robotics-edge-ai",
      shortDescription: "Edge inference, SLAM navigation, ROS2 simulations, and smart embedded systems.",
      description: "Build hardware-software integrated robotics systems using modern computer vision, reinforcement learning, and edge hardware accelerators.",
      theme: "Robotics & Hardware",
      mode: "OFFLINE",
      location: "Seattle, WA - Innovation Center",
      logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1400&auto=format&fit=crop&q=80",
      startDate: subDays(now, 1),
      endDate: addDays(now, 4),
      registrationStart: subDays(now, 25),
      registrationEnd: subDays(now, 2),
      submissionDeadline: addDays(now, 3),
      judgingStart: addDays(now, 3),
      judgingEnd: addDays(now, 4),
      minTeamSize: 2,
      maxTeamSize: 5,
      isFeatured: false,
      status: "ACTIVE",
      prizes: {
        create: [
          { title: "Champion Maker", value: "$30,000 + Hardware Lab Grants", rank: 1 },
          { title: "Best ROS2 Integration", value: "$15,000", rank: 2 },
        ],
      },
    },
  });

  // Hackathon 7: CyberGuard Security (REGISTRATION_CLOSED)
  const h7 = await prisma.hackathon.create({
    data: {
      organizationId: org2.id,
      title: "CyberGuard Threat Defense & AppSec 2026",
      slug: "cyberguard-threat-defense",
      shortDescription: "Automated vulnerability detection, zero-day threat defense, and SIEM intelligence.",
      description: "Battle test application security with AI-augmented vulnerability discovery, automated penetration testing tools, and threat intelligence graphs.",
      theme: "Cybersecurity",
      mode: "ONLINE",
      location: "Global Virtual",
      logo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1400&auto=format&fit=crop&q=80",
      startDate: addDays(now, 2),
      endDate: addDays(now, 6),
      registrationStart: subDays(now, 20),
      registrationEnd: subDays(now, 1),
      submissionDeadline: addDays(now, 5),
      judgingStart: addDays(now, 5),
      judgingEnd: addDays(now, 6),
      minTeamSize: 1,
      maxTeamSize: 4,
      status: "REGISTRATION_CLOSED",
      prizes: {
        create: [{ title: "Grand Security Prize", value: "$35,000", rank: 1 }],
      },
    },
  });

  // Hackathon 8: Quantum Computing (REGISTRATION_OPEN)
  const h8 = await prisma.hackathon.create({
    data: {
      organizationId: org2.id,
      title: "Quantum Computing & Optimization Sprint",
      slug: "quantum-computing-sprint-2026",
      shortDescription: "Qiskit algorithms, quantum annealing, molecular modeling, and hybrid classical-quantum solvers.",
      description: "Tackle NP-hard logistics, molecular simulations, and quantum error mitigation with industry quantum cloud simulators.",
      theme: "Quantum",
      mode: "ONLINE",
      location: "Global Virtual",
      logo: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1400&auto=format&fit=crop&q=80",
      startDate: addDays(now, 20),
      endDate: addDays(now, 28),
      registrationStart: now,
      registrationEnd: addDays(now, 19),
      submissionDeadline: addDays(now, 26),
      judgingStart: addDays(now, 26),
      judgingEnd: addDays(now, 28),
      minTeamSize: 1,
      maxTeamSize: 4,
      status: "REGISTRATION_OPEN",
      prizes: {
        create: [{ title: "Grand Quantum Prize", value: "$50,000", rank: 1 }],
      },
    },
  });

  // Hackathon 9: Spatial Computing (COMPLETED)
  const h9 = await prisma.hackathon.create({
    data: {
      organizationId: org1.id,
      title: "Spatial Computing & VisionOS XR Sprint",
      slug: "spatial-computing-visionos-xr",
      shortDescription: "Immersive 3D interfaces, hand-tracking interactions, and WebXR applications.",
      description: "Build the future of spatial computing with VisionOS, Three.js, WebXR, and Unity immersive environments.",
      theme: "AR / VR & Gaming",
      mode: "ONLINE",
      location: "Global Virtual",
      logo: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1400&auto=format&fit=crop&q=80",
      startDate: subDays(now, 45),
      endDate: subDays(now, 38),
      registrationStart: subDays(now, 70),
      registrationEnd: subDays(now, 46),
      submissionDeadline: subDays(now, 40),
      judgingStart: subDays(now, 40),
      judgingEnd: subDays(now, 38),
      minTeamSize: 1,
      maxTeamSize: 4,
      status: "COMPLETED",
      prizes: {
        create: [{ title: "Best Spatial Experience", value: "$30,000", rank: 1 }],
      },
    },
  });

  // Hackathon 10: Open Source DevTools (ACTIVE)
  const h10 = await prisma.hackathon.create({
    data: {
      organizationId: org1.id,
      title: "Open Source Developer Tools & DevEx Hack",
      slug: "opensource-devtools-devex-hack",
      shortDescription: "CLI tools, linters, observability dashs, and instant local dev environments.",
      description: "Supercharge developer experience by creating blazing fast tooling, compiler plugins, and developer automation.",
      theme: "Developer Tools",
      mode: "ONLINE",
      location: "Global Virtual",
      logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&auto=format&fit=crop&q=80",
      startDate: subDays(now, 3),
      endDate: addDays(now, 4),
      registrationStart: subDays(now, 20),
      registrationEnd: subDays(now, 2),
      submissionDeadline: addDays(now, 2),
      judgingStart: addDays(now, 2),
      judgingEnd: addDays(now, 4),
      minTeamSize: 1,
      maxTeamSize: 4,
      status: "ACTIVE",
      prizes: {
        create: [{ title: "Best Open Source Tool", value: "$25,000", rank: 1 }],
      },
    },
  });

  console.log("✅ Seeded 10 Hackathons across all stages.");

  // 4. Registrations
  await prisma.hackathonRegistration.createMany({
    data: [
      { userId: hackerUser.id, hackathonId: h1.id, status: "REGISTERED" },
      { userId: hacker2.id, hackathonId: h1.id, status: "REGISTERED" },
      { userId: hacker3.id, hackathonId: h1.id, status: "REGISTERED" },
      { userId: hacker4.id, hackathonId: h1.id, status: "REGISTERED" },
      { userId: hackerUser.id, hackathonId: h2.id, status: "REGISTERED" },
      { userId: hackerUser.id, hackathonId: h4.id, status: "REGISTERED" },
      { userId: hacker2.id, hackathonId: h4.id, status: "REGISTERED" },
      { userId: hackerUser.id, hackathonId: h10.id, status: "REGISTERED" },
    ],
  });

  // 5. Teams and Team Members
  const team1 = await prisma.team.create({
    data: {
      hackathonId: h1.id,
      name: "NeuralFlow Labs",
      slug: "neuralflow-labs",
      description: "Building autonomous cognitive agents for real-time complex software refactoring and verification.",
      ownerId: hackerUser.id,
      joinCode: "TEAM-NFLOW",
      members: {
        create: [
          { userId: hackerUser.id, role: "OWNER" },
          { userId: hacker2.id, role: "MEMBER" },
          { userId: hacker3.id, role: "MEMBER" },
        ],
      },
    },
  });

  const team2 = await prisma.team.create({
    data: {
      hackathonId: h1.id,
      name: "CognitiveGuard AI",
      slug: "cognitive-guard-ai",
      description: "Real-time multimodal hallucination detection and truthfulness verification for enterprise LLMs.",
      ownerId: hacker4.id,
      joinCode: "TEAM-COGG",
      members: {
        create: [{ userId: hacker4.id, role: "OWNER" }],
      },
    },
  });

  const teamHealth = await prisma.team.create({
    data: {
      hackathonId: h4.id,
      name: "PulseAI Diagnostics",
      slug: "pulseai-diagnostics",
      description: "Sub-second ECG arrhythmia classification with explainable heatmaps for ICU physicians.",
      ownerId: hackerUser.id,
      joinCode: "TEAM-PULSE",
      members: {
        create: [
          { userId: hackerUser.id, role: "OWNER" },
          { userId: hacker2.id, role: "MEMBER" },
        ],
      },
    },
  });

  // 6. Projects & Submissions
  const project1 = await prisma.project.create({
    data: {
      teamId: team1.id,
      hackathonId: h1.id,
      title: "AutoRefactor: Autonomous Multi-Agent Code Migration Engine",
      tagline: "Instantly migrate and modernize entire monolithic codebases using coordinating specialized agents.",
      description: `AutoRefactor revolutionizes legacy software modernization by orchestrating an ensemble of specialized autonomous agents (Architect, Transpiler, Security Auditor, Test Generator, and Benchmark Verifier).
      
Instead of manual line-by-line conversions, our system analyzes full AST dependency graphs, establishes cross-language type contracts, performs formal semantic verification, and generates automated integration tests with 98% branch coverage.`,
      problem: "Enterprises spend hundreds of billions of dollars and years of developer time manually migrating legacy codebases from obsolete stacks to modern cloud-native architectures.",
      solution: "A hierarchical multi-agent reasoning loop that breaks down repository-scale codebases, plans dependency-safe refactoring steps, executes code transformations, and validates behavioral equivalence using AST diffing.",
      technologies: JSON.stringify(["Next.js 14", "TypeScript", "Python", "LangGraph", "Anthropic Claude 3.5", "Docker", "Tree-Sitter AST", "Tailwind CSS", "Prisma"]),
      repositoryUrl: "https://github.com/kaitanaka/autorefactor-agent",
      demoUrl: "https://autorefactor.dev",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      presentationUrl: "https://pitch.com/autorefactor-deck",
      screenshots: JSON.stringify([
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      ]),
      status: "SUBMITTED",
      submittedAt: subDays(now, 1),
    },
  });

  const project2 = await prisma.project.create({
    data: {
      teamId: team2.id,
      hackathonId: h1.id,
      title: "OmniShield: Multimodal Hallucination Guardrail",
      tagline: "Real-time verifiable citation and factual grounding for high-stakes enterprise AI.",
      description: "OmniShield provides inline claim extraction, evidence retrieval from trusted knowledge graphs, and semantic verification in under 80 milliseconds.",
      problem: "Enterprise AI adoption is blocked by untrusted hallucinations and compliance risks in finance and legal sectors.",
      solution: "A lightweight proxy middleware that verifies every generated sentence against live authoritative data sources with cryptographic verification proofs.",
      technologies: JSON.stringify(["Python", "FastAPI", "VectorDB", "React", "Rust"]),
      repositoryUrl: "https://github.com/zoem/omnishield-guardrail",
      demoUrl: "https://omnishield.ai",
      status: "SUBMITTED",
      submittedAt: subDays(now, 1),
    },
  });

  const projectHealth = await prisma.project.create({
    data: {
      teamId: teamHealth.id,
      hackathonId: h4.id,
      title: "PulseAI: Real-Time ICU Arrhythmia Early Warning",
      tagline: "Deep learning continuous cardiac telemetry analysis with 99.4% diagnostic accuracy.",
      description: "PulseAI analyzes live 12-lead ECG telemetry in real-time, detecting critical arrhythmias 45 minutes before clinical manifestation with full Grad-CAM visual explanations.",
      technologies: JSON.stringify(["PyTorch", "Next.js", "WebSockets", "FastAPI", "PostgreSQL"]),
      repositoryUrl: "https://github.com/kaitanaka/pulseai-cardio",
      demoUrl: "https://pulseai.health",
      status: "SUBMITTED",
      submittedAt: subDays(now, 15),
    },
  });

  // 7. Judging Criteria & Scores
  const h1Criteria = await prisma.judgingCriteria.findMany({ where: { hackathonId: h1.id } });

  // Judge Dr. Marcus Vance scores project 1
  for (const c of h1Criteria) {
    await prisma.score.create({
      data: {
        projectId: project1.id,
        judgeId: judgeUser.id,
        criteriaId: c.id,
        score: c.name.includes("Technical") ? 9.8 : c.name.includes("Innovation") ? 9.5 : 9.2,
        feedback: "Exceptional architecture! The multi-agent collaboration with AST verification is one of the cleanest implementations I have reviewed. Outstanding work.",
      },
    });
  }

  // Judge Dr. Marcus Vance scores project 2
  for (const c of h1Criteria) {
    await prisma.score.create({
      data: {
        projectId: project2.id,
        judgeId: judgeUser.id,
        criteriaId: c.id,
        score: c.name.includes("Technical") ? 8.8 : c.name.includes("Innovation") ? 8.5 : 8.7,
        feedback: "Very practical concept with great potential in regulated industries.",
      },
    });
  }

  // Assign Grand Prize for Health Hackathon
  const healthGrandPrize = await prisma.prize.findFirst({ where: { hackathonId: h4.id, rank: 1 } });
  if (healthGrandPrize) {
    await prisma.prize.update({
      where: { id: healthGrandPrize.id },
      data: { winnerProjectId: projectHealth.id },
    });
  }

  // 8. Certificates
  await prisma.certificate.create({
    data: {
      userId: hackerUser.id,
      hackathonId: h4.id,
      type: "WINNER",
      verificationCode: "HK-7F9A-4E2C-99B1",
      issuedAt: subDays(now, 10),
    },
  });

  await prisma.certificate.create({
    data: {
      userId: hacker2.id,
      hackathonId: h4.id,
      type: "WINNER",
      verificationCode: "HK-8B2D-11E4-55A3",
      issuedAt: subDays(now, 10),
    },
  });

  await prisma.certificate.create({
    data: {
      userId: hackerUser.id,
      hackathonId: h9.id,
      type: "PARTICIPANT",
      verificationCode: "HK-3C1A-88D2-44F0",
      issuedAt: subDays(now, 38),
    },
  });

  // 9. Notifications for hackerUser
  await prisma.notification.createMany({
    data: [
      {
        userId: hackerUser.id,
        type: "CERTIFICATE",
        title: "🏆 Grand Champion Award Issued!",
        message: "Your project 'PulseAI' was awarded Grand HealthTech Innovation Prize in NextGen HealthTech AI & Diagnostics.",
        link: "/certificates/verify/HK-7F9A-4E2C-99B1",
        createdAt: subDays(now, 10),
      },
      {
        userId: hackerUser.id,
        type: "JUDGING",
        title: "⭐ Judge Feedback Received",
        message: "Dr. Marcus Vance scored your project 'AutoRefactor' (9.5/10): 'Exceptional architecture!'",
        link: `/hackathons/${h1.slug}/leaderboard`,
        createdAt: subDays(now, 1),
      },
      {
        userId: hackerUser.id,
        type: "ANNOUNCEMENT",
        title: "📢 $100k Cloud Credits Distributed",
        message: "Check your email for sponsor promo codes providing $500 free credits across Google Cloud & Anthropic.",
        link: `/hackathons/${h1.slug}`,
        createdAt: subDays(now, 1),
      },
    ],
  });

  // 10. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: organizerUser.id,
        action: "HACKATHON_PUBLISHED",
        entity: "Hackathon",
        entityId: h1.id,
        detailsJson: JSON.stringify({ title: h1.title }),
      },
      {
        userId: judgeUser.id,
        action: "PROJECT_SCORED",
        entity: "Project",
        entityId: project1.id,
        detailsJson: JSON.stringify({ score: 9.5, judge: "Dr. Marcus Vance" }),
      },
      {
        userId: organizerUser.id,
        action: "PRIZE_AWARDED",
        entity: "Prize",
        entityId: healthGrandPrize?.id,
        detailsJson: JSON.stringify({ prize: "Grand HealthTech Innovation Prize", project: "PulseAI" }),
      },
    ],
  });

  console.log("🌟 Database seeded successfully with realistic data for all roles and scenarios!");
  console.log(`
  DEMO ACCOUNTS READY:
  ---------------------------------------------------------
  1. Platform Admin:    admin@hackathon.dev     (Pass: Password123!)
  2. Hackathon Org:     organizer@hackathon.dev (Pass: Password123!)
  3. Chief Judge:       judge@hackathon.dev     (Pass: Password123!)
  4. Senior Mentor:     mentor@hackathon.dev    (Pass: Password123!)
  5. Lead Hacker:       hacker@hackathon.dev    (Pass: Password123!)
  ---------------------------------------------------------
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
