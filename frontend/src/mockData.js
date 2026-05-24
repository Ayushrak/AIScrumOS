// Mock database and simulation states for AI ScrumOS

export const initialData = {
  activeSprint: {
    name: "Sprint 24: Core Checkout & Auth",
    startDate: "2026-05-18",
    endDate: "2026-05-29",
    daysRemaining: 5,
    riskScore: 18, // Low
    riskLevel: "LOW",
    riskReasons: [
      "Historical estimation variance: Backend team has +/- 12% accuracy",
      "Minor velocity dip due to mid-week public holiday"
    ],
    statistics: {
      totalPoints: 84,
      completedPoints: 48,
      inProgressPoints: 24,
      blockedPoints: 12,
      velocity: "14.2 pts/dev",
      openPRs: 6,
      qaTickets: 2
    }
  },
  
  // 1. Engineering Digital Twin representation
  digitalTwin: {
    teams: [
      { id: "frontend", name: "Frontend Core", size: 4, lead: "Sarah" },
      { id: "backend", name: "Platform API", size: 5, lead: "Vikram" },
      { id: "qa", name: "Quality Assurance", size: 3, lead: "Elena" },
      { id: "infra", name: "DevOps & SRE", size: 2, lead: "David" }
    ],
    services: [
      { id: "fe_login", name: "Frontend Login", status: "healthy", owner: "frontend" },
      { id: "auth_api", name: "Authentication API", status: "healthy", owner: "backend" },
      { id: "db_migr", name: "Database Migration", status: "healthy", owner: "backend" },
      { id: "payment_gw", name: "Payment Gateway", status: "healthy", owner: "backend" },
      { id: "qa_regress", name: "QA Regression Suite", status: "healthy", owner: "qa" },
      { id: "k8s_infra", name: "K8s Deployment Infra", status: "healthy", owner: "infra" }
    ],
    dependencies: [
      { from: "fe_login", to: "auth_api", label: "REST Calls", isCritical: true, status: "healthy" },
      { from: "auth_api", to: "db_migr", label: "PostgreSQL Schema", isCritical: true, status: "healthy" },
      { from: "payment_gw", to: "db_migr", label: "Transaction Logs", isCritical: false, status: "healthy" },
      { from: "db_migr", to: "k8s_infra", label: "Helm Charts", isCritical: true, status: "healthy" },
      { from: "qa_regress", to: "fe_login", label: "E2E Testing", isCritical: false, status: "healthy" }
    ]
  },

  // 2. Silent Blocker Detection
  silentBlockers: [
    {
      id: "sb-1",
      title: "Docker container crash loop on Auth Testenv",
      developer: "Neha",
      confidence: 92,
      signals: ["3 repeated Dockerfile edits", "12 local build failures", "No git pushes in 4 hours"],
      status: "Investigating",
      suggestedExpert: "David (DevOps)",
      detectedTime: "2 hours ago"
    }
  ],

  // 4. Standups
  standups: [
    {
      developer: "Ayush",
      avatarColor: "#8b5cf6",
      yesterday: ["Fixed auth middleware JWT issues", "Reviewed payment gateway schema changes"],
      today: ["Working on Redis caching optimization for session store", "Syncing with frontend on token refresh"],
      blockers: ["None"]
    },
    {
      developer: "Sarah",
      avatarColor: "#3b82f6",
      yesterday: ["Implemented responsive login layout", "Integrated auth status hooks"],
      today: ["Styling the payment checkout form", "Fixing visual regression on mobile dashboard"],
      blockers: ["Waiting for Payment API endpoint schema to be finalized"]
    },
    {
      developer: "Rahul",
      avatarColor: "#10b981",
      yesterday: ["Configured ElasticSearch replica settings", "Optimized database index keys"],
      today: ["Refactoring Redis cache store handlers", "Configuring production cache cluster"],
      blockers: ["None"]
    }
  ],

  // 5. Engineering Memory System
  memoryDatabase: [
    {
      query: "Why did the team migrate from MongoDB to PostgreSQL?",
      answer: "The migration from MongoDB to PostgreSQL was approved in Sprint 18 (November 2025) to solve concurrency locks and ensure strict ACID compliance for transaction accounting. Vikram led the decision, citing that MongoDB's document model was causing race conditions during double-submit payments.",
      sources: {
        slack: "Discussed in #platform-architecture on 2025-11-12 (Vikram: 'MongoDB locks during checkout transactions are reaching 800ms. We need relations.')",
        jira: "Decision record JIRA-1092: 'DB Migration to Postgres'",
        pr: "GitHub PR #234: 'feat: add postgres connection pool & schema script'",
        retros: "Sprint 17 Retro: 'Identified MongoDB locks as our primary release bottleneck'"
      }
    },
    {
      query: "How did we resolve the S3 attachment upload timeout issue?",
      answer: "The timeout was resolved by migrating from raw payload streaming to S3 Presigned URLs. SRE David implemented the fix, which offloaded file upload bandwidth directly to AWS, reducing server memory overhead from 94% to 12%.",
      sources: {
        slack: "Incident channel #ops-incident-04: 'S3 timeouts on large attachments'",
        jira: "Hotfix ticket JIRA-841: 'Implement S3 Presigned URLs for attachments'",
        pr: "GitHub PR #412: 'S3 direct uploads client side'",
        retros: "Incident Post-Mortem 2026-02-18"
      }
    }
  ],

  // 6. Meeting Compression
  meetings: [
    {
      id: "m-1",
      title: "Checkout API & Caching Sync",
      duration: "18 mins",
      date: "Today, 10:30 AM",
      audioLength: "0:45", // Simulator length
      transcriptSummary: "Discussion centered on whether to cache checkout sessions in Redis. Ayush proposed a 10-minute TTL to keep auth status snappy. Vikram agreed but warned about database sync lag.",
      decisions: [
        "Payment retry logic approved with standard backoff strategy.",
        "Redis caching schema approved. Session keys will have a 10-minute expiration."
      ],
      actions: [
        { owner: "Ayush", task: "Write Redis connection logic and cache fallback handler" },
        { owner: "Vikram", task: "Setup PostgreSQL replication keys for checkout mirror" },
        { owner: "QA Team", task: "Draft regression scenarios for slow database fallbacks" }
      ]
    }
  ],

  // 7. Technical Debt
  techDebt: [
    {
      module: "Authentication Gateway",
      riskScore: 88,
      commitsCount: 142,
      hotfixes: "34 in last 2 months",
      rollbacks: "12%",
      busFactor: "1 Developer (Vikram)",
      issues: "Complex nested regex parsing, outdated JWT dependency, poor coverage (34%)"
    },
    {
      module: "Billing Engine & Invoice PDF",
      riskScore: 64,
      commitsCount: 78,
      hotfixes: "8 in last 2 months",
      rollbacks: "4%",
      busFactor: "2 Developers (Ayush, Sarah)",
      issues: "Legacy inline HTML templates, synchronous third-party payment requests"
    }
  ],

  // 10. Burnout Risk / Wellness Optimizer
  burnoutData: [
    {
      developer: "Vikram",
      riskScore: 28,
      riskLevel: "Normal",
      indicators: {
        contextSwitching: "Medium",
        weekendCommits: 0,
        lateNightCommits: 2,
        uncompletedTaskRatio: "12%"
      },
      recommendation: "Ensure backend tasks are balanced across other team members."
    },
    {
      developer: "Ayush",
      riskScore: 42,
      riskLevel: "Moderate",
      indicators: {
        contextSwitching: "High",
        weekendCommits: 1,
        lateNightCommits: 4,
        uncompletedTaskRatio: "18%"
      },
      recommendation: "Context switching index is elevated due to concurrent work on Auth and Payment modules."
    },
    {
      developer: "Neha",
      riskScore: 78,
      riskLevel: "High Risk",
      indicators: {
        contextSwitching: "Very High",
        weekendCommits: 3,
        lateNightCommits: 8,
        uncompletedTaskRatio: "35%"
      },
      recommendation: "Encourage offline time. Highlighted late commits (2 AM to 4 AM) and repeated Docker configuration loops."
    }
  ],

  // Activity feed logs
  activityFeed: [
    { time: "10:30 AM", type: "system", message: "Sprint 24 Daily Sync Meeting transcribed and archived." },
    { time: "09:15 AM", type: "github", message: "Sarah opened PR #401: 'feat: payment layout and mobile fixes'" },
    { time: "08:45 AM", type: "jira", message: "Vikram updated JIRA-723: 'Database transaction keys index added'" }
  ]
};

// Step by step simulation updates
export const simulatorSteps = [
  {
    step: 1,
    title: "Developer Opens PR",
    description: "Ayush opens PR #402 for payment retry logic containing the Redis caching module changes.",
    changes: (prev) => {
      const updatedFeed = [
        { time: "12:14 PM", type: "github", message: "Ayush Sharma opened PR #402: 'feat: implement payment retry logic and cache optimization'" },
        ...prev.activityFeed
      ];
      const updatedTwin = {
        ...prev.digitalTwin,
        services: prev.digitalTwin.services.map(s => 
          s.id === "payment_gw" ? { ...s, status: "pending" } : s
        )
      };
      return {
        ...prev,
        activityFeed: updatedFeed,
        digitalTwin: updatedTwin
      };
    }
  },
  {
    step: 2,
    title: "CI/CD Fails Repeatedly",
    description: "The automated build fails 3 times on the new PR branch with Redis connection timeouts. The developer starts pushing debug commits.",
    changes: (prev) => {
      const updatedFeed = [
        { time: "12:16 PM", type: "system", message: "❌ CI/CD Build #1085 failed on branch 'feature/payment-retry' (Reason: connection timeout)" },
        { time: "12:15 PM", type: "github", message: "Ayush pushed commit: 'fix: debug redis config #3' to branch 'feature/payment-retry'" },
        { time: "12:14 PM", type: "system", message: "❌ CI/CD Build #1084 failed on branch 'feature/payment-retry'" },
        ...prev.activityFeed
      ];
      return {
        ...prev,
        activityFeed: updatedFeed
      };
    }
  },
  {
    step: 3,
    title: "Silent Blocker Detected",
    description: "AI analyzes git patterns, commit notes, and repeated failures to identify a hidden block. It alerts that the issue is a Redis port mismatch.",
    changes: (prev) => {
      const updatedFeed = [
        { time: "12:17 PM", type: "ai", message: "🤖 AI Observer: Detected silent blocker (Redis caching issue). Ayush has pushed 3 hotfix commits in 15 mins." },
        ...prev.activityFeed
      ];
      const newBlocker = {
        id: "sb-2",
        title: "Redis caching connection timeout in Payment module",
        developer: "Ayush",
        confidence: 81,
        signals: ["3 consecutive hotfix commits", "2 failed CI pipelines", "No progress in 30 minutes"],
        status: "Blocked",
        suggestedExpert: "Rahul",
        detectedTime: "Just now"
      };
      // Mark graph nodes as blocked
      const updatedTwin = {
        ...prev.digitalTwin,
        services: prev.digitalTwin.services.map(s => 
          s.id === "payment_gw" ? { ...s, status: "error" } : s
        ),
        dependencies: prev.digitalTwin.dependencies.map(d => 
          d.from === "payment_gw" || d.to === "payment_gw" ? { ...d, status: "error" } : d
        )
      };
      return {
        ...prev,
        activityFeed: updatedFeed,
        silentBlockers: [newBlocker, ...prev.silentBlockers],
        digitalTwin: updatedTwin
      };
    }
  },
  {
    step: 4,
    title: "Sprint Delay Probability Escalates",
    description: "AI calculates risk propagation. Since payment blocks the frontend integration and delays QA, sprint risk jumps to HIGH (74%).",
    changes: (prev) => {
      const updatedFeed = [
        { time: "12:18 PM", type: "ai", message: "⚠️ Sprint Risk Alert: Failure risk updated to HIGH (74%). Release delayed due to critical path bottleneck." },
        ...prev.activityFeed
      ];
      const updatedSprint = {
        ...prev.activeSprint,
        riskScore: 74,
        riskLevel: "HIGH",
        riskReasons: [
          "Redis connection blocker in Payment module is on the critical release path",
          "QA team is currently bottlenecked waiting for Checkout API stability",
          "14 unresolved PRs (average resolution time has increased by 19%)"
        ],
        statistics: {
          ...prev.activeSprint.statistics,
          blockedPoints: 24,
          qaTickets: 5
        }
      };
      return {
        ...prev,
        activityFeed: updatedFeed,
        activeSprint: updatedSprint
      };
    }
  },
  {
    step: 5,
    title: "AI Auto-Coordination Triggered",
    description: "Without human action, AI creates a Jira task, tags expert Rahul, and posts a Slack warning with context.",
    changes: (prev) => {
      const updatedFeed = [
        { time: "12:19 PM", type: "ai", message: "🤖 Auto-Action: Created JIRA-892 for Redis Port verification, assigned to Rahul." },
        { time: "12:19 PM", type: "slack", message: "Slack notification sent to #sprint-alerts tagging @Rahul to support @Ayush." },
        ...prev.activityFeed
      ];
      // Update standup for Ayush to reflect blocker
      const updatedStandups = prev.standups.map(s => 
        s.developer === "Ayush" 
          ? { ...s, blockers: ["Redis caching issue (JIRA-892 created, @Rahul assisting)"] } 
          : s
      );
      return {
        ...prev,
        activityFeed: updatedFeed,
        standups: updatedStandups
      };
    }
  },
  {
    step: 6,
    title: "Risk Dashboard Updated",
    description: "The ScrumOS Dashboard highlights the resolved assignment, SRE metrics, and guides the manager to complete the sprint successfully.",
    changes: (prev) => {
      const updatedFeed = [
        { time: "12:20 PM", type: "system", message: "Rahul accepted JIRA-892. Working with Ayush on cache server tunnel." },
        ...prev.activityFeed
      ];
      // Mark service as in progress/warning, not critical error anymore
      const updatedTwin = {
        ...prev.digitalTwin,
        services: prev.digitalTwin.services.map(s => 
          s.id === "payment_gw" ? { ...s, status: "warning" } : s
        ),
        dependencies: prev.digitalTwin.dependencies.map(d => 
          d.from === "payment_gw" || d.to === "payment_gw" ? { ...d, status: "warning" } : d
        )
      };
      return {
        ...prev,
        activityFeed: updatedFeed,
        digitalTwin: updatedTwin
      };
    }
  }
];

export const memoryDatabase = initialData.memoryDatabase;
