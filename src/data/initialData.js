// src/data/initialData.js - Initial Seed State for Chronomancy (Embedded Breaks & Zero False Overlap)

export const initialData = {
  user: {
    name: "Huitzil",
    partnerName: "Partner",
    dailyCapacityMinutes: 1440,
    wakingMinutesTarget: 960, // 16 hours waking, 8 hours sleep
    sleepMinutesBudget: 480
  },
  
  // 1. Recurring Anchors (Fixed Temporal Expenses with Embedded Lunch Deductions)
  recurringAnchors: [
    {
      id: "anchor-1",
      title: "Work Shift (Full Daytime Employment)",
      time: "07:30",
      duration: 540, // 9 hours total span
      type: "work",
      category: "Work",
      isRecurring: true,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      hasBreak: true,
      breakTitle: "Protected Work Lunch",
      breakStart: "11:30",
      breakDuration: 60, // 1 hour carved-out break
      description: "9h gross span with 1h protected lunch (8h net labor recorded without overlap)"
    },
    {
      id: "anchor-2",
      title: "Morning Transit Commute",
      time: "07:00",
      duration: 30,
      type: "friction",
      category: "Commute",
      isRecurring: true,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      hasBreak: false,
      description: "Fixed transit buffer before morning work/class"
    },
    {
      id: "anchor-3",
      title: "Evening Return Commute",
      time: "16:30",
      duration: 40,
      type: "friction",
      category: "Commute",
      isRecurring: true,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      hasBreak: false,
      description: "Return commute & transition buffer"
    }
  ],

  // 2. Academic Horizons & Syllabi
  academics: [
    {
      id: "course-1",
      code: "CS 301",
      name: "Algorithms & Systems",
      owner: "Huitzil",
      color: "#2ea890",
      assignments: [
        { id: "a-1", title: "Problem Set 4: Dynamic Programming", dueDate: "Friday, 11:59 PM", estMinutes: 180, loggedMinutes: 90, completed: false },
        { id: "a-2", title: "Lab 3: Cache Simulation", dueDate: "Next Tuesday", estMinutes: 120, loggedMinutes: 0, completed: false }
      ]
    },
    {
      id: "course-2",
      code: "STAT 200",
      name: "Applied Statistics",
      owner: "Partner",
      color: "#d48344",
      assignments: [
        { id: "a-3", title: "Midterm Exam Review Quiz", dueDate: "Thursday, 5:00 PM", estMinutes: 150, loggedMinutes: 60, completed: false },
        { id: "a-4", title: "R-Studio Regression Analysis", dueDate: "Sunday, 11:59 PM", estMinutes: 180, loggedMinutes: 0, completed: false }
      ]
    }
  ],

  // 3. Certification Long-Term Horizons
  certifications: [
    {
      id: "cert-1",
      title: "AWS Solutions Architect",
      targetExamDate: "March 15",
      totalRequiredHours: 80,
      loggedHours: 19.5,
      targetWeeklyHours: 6.0,
      floraSpecies: "Golden Redwood",
      color: "#f4a261"
    },
    {
      id: "cert-2",
      title: "CompTIA Security+",
      targetExamDate: "May 30",
      totalRequiredHours: 60,
      loggedHours: 8.0,
      targetWeeklyHours: 4.5,
      floraSpecies: "Ironwood Bonsai",
      color: "#2ea890"
    }
  ],

  // 4. Chilling / Incubator Projects
  chillingProjects: [
    { id: "p-1", name: "Financial Hub v2", nextAction: "Migrate budget categories to local SQLite", status: "Active" },
    { id: "p-2", name: "ThreadKeeper MVP", nextAction: "Define ISO laundry symbol enum and wash batching rules", status: "Incubating" },
    { id: "p-3", name: "CartLogic (Price Arbitrage)", nextAction: "Mock up receipt entry numpad interface", status: "Chilling" }
  ],

  // 5. Today's Tactical Runway Schedule (1,440 Minute Day with Embedded Lunch Demonstration)
  runwaySchedule: [
    { id: "s-1", time: "06:30", duration: 30, title: "Morning Sunlight & Preparation", type: "routine", category: "Life", status: "completed" },
    { 
      id: "s-2", 
      originAnchorId: "anchor-2",
      time: "07:00", 
      duration: 30, 
      title: "Morning Transit Commute", 
      type: "friction", 
      category: "Commute", 
      isRecurring: true,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      status: "completed" 
    },
    { 
      id: "s-3", 
      originAnchorId: "anchor-1",
      time: "07:30", 
      duration: 540, // 9 hours total span (7:30 AM to 4:30 PM)
      title: "Work Shift (Full Daytime Employment)", 
      type: "work", 
      category: "Work", 
      isRecurring: true,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      hasBreak: true,
      breakTitle: "Protected Work Lunch",
      breakStart: "11:30",
      breakDuration: 60, // 1 hour carved break
      status: "active" 
    },
    { 
      id: "s-4", 
      originAnchorId: "anchor-3",
      time: "16:30", 
      duration: 40, 
      title: "Evening Return Commute", 
      type: "friction", 
      category: "Commute", 
      isRecurring: true,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      status: "planned" 
    },
    { id: "s-5", time: "17:15", duration: 90, title: "CS 301 Problem Set 4 Study", type: "study", category: "Academic", status: "planned" },
    { id: "s-6", time: "19:00", duration: 35, title: "Unbudgeted Social Media Overdraft", type: "leak", category: "Leak", status: "overdraft" },
    { id: "s-7", time: "19:35", duration: 60, title: "AWS Cert Module: VPC & Security", type: "cert", category: "Certification", status: "planned" }
  ],

  // 6. The Grove (Gamified Garden Plot & Grind Attributes - No Emojis)
  grove: {
    trees: [
      { id: "t-1", name: "Ancient Oak", category: "CS 301 Lecture", minutes: 75, status: "healthy", iconType: "tree-deciduous", xp: 180 },
      { id: "t-2", name: "Bioluminescent Fern", category: "Morning Prep", minutes: 30, status: "healthy", iconType: "sprout", xp: 60 },
      { id: "t-3", name: "Redwood Sapling", category: "Work Deep Focus", minutes: 240, status: "growing", iconType: "tree-pine", xp: 450 },
      { id: "t-4", name: "Withered Stump", category: "Doomscroll Leak", minutes: 35, status: "withered", iconType: "stump", xp: -50 }
    ],
    grindStats: {
      int: { level: 14, currentXp: 340, nextLevelXp: 500, label: "Intelligence (Study & Classes)" },
      dex: { level: 9, currentXp: 180, nextLevelXp: 300, label: "Dexterity (Coding & Builds)" },
      wis: { level: 11, currentXp: 290, nextLevelXp: 400, label: "Wisdom (Certifications & Books)" },
      streakDays: 4,
      totalWitheredStumpsThisMonth: 3
    }
  }
};
