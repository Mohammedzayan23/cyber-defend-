const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

app.use(express.json());
app.use(express.static("."));
const cyberDefend = {
  brand: "CYBERDEFEND",

  hero: {
    title: "Build Real-World Cybersecurity Skills",
    buttons: ["Explore Courses", "Talk to an Expert"]
  },

  partners: [
    "TechCorp",
    "SecureNet",
    "CyberLab",
    "CloudX",
    "InfoTech"
  ],

  whyCyberDefend: [
    "Hands-on Labs",
    "Expert Mentorship",
    "Real Projects",
    "Career-Focused Learning"
  ],

  courses: [
    { id: 1, name: "Cybersecurity Fundamentals", level: "Beginner" },
    { id: 2, name: "SOC Analyst", level: "Intermediate" },
    { id: 3, name: "Ethical Hacking", level: "Intermediate" },
    { id: 4, name: "VAPT", level: "Advanced" },
    { id: 5, name: "Cloud Security", level: "Advanced" }
  ],

  roadmaps: [
    "Networking",
    "Linux",
    "Cybersecurity Fundamentals",
    "Ethical Hacking",
    "Specialization"
  ],

  cyberLabs: [
    "Network Defense Lab",
    "SOC Simulation",
    "Web Security Lab"
  ],

  studentProjects: [
    "Secure Login System",
    "Network Monitoring System",
    "Threat Detection System"
  ],

  successStories: [
    "Completed SOC Analyst Roadmap",
    "Built a Cybersecurity Project"
  ],

  certifications: [
    "CyberDefend Certified",
    "SOC Analyst Certificate",
    "VAPT Certificate"
  ],

  corporateServices: [
    "Security Assessment",
    "Employee Cybersecurity Training",
    "Cybersecurity Consulting"
  ],

  blog: [
    "What is Phishing?",
    "What is a SOC?",
    "Cloud Security Basics"
  ],

  faq: [
    {
      question: "Do I need coding experience?",
      answer: "No. Beginners can start with cybersecurity fundamentals."
    },
    {
      question: "Are the courses practical?",
      answer: "Yes. Courses include practical labs and projects."
    },
    {
      question: "Can students join?",
      answer: "Yes. Different skill levels are supported."
    }
  ]
};

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CYBERDEFEND API",
    website: cyberDefend
  });
});

app.get("/api/hero", (req, res) => {
  res.json(cyberDefend.hero);
});

app.get("/api/partners", (req, res) => {
  res.json(cyberDefend.partners);
});

app.get("/api/why-cyberdefend", (req, res) => {
  res.json(cyberDefend.whyCyberDefend);
});

app.get("/api/courses", (req, res) => {
  res.json(cyberDefend.courses);
});

app.get("/api/courses/:id", (req, res) => {
  const id = Number(req.params.id);

  const course = cyberDefend.courses.find(
    course => course.id === id
  );

  if (!course) {
    return res.status(404).json({
      error: "Course not found"
    });
  }

  res.json(course);
});

app.get("/api/roadmaps", (req, res) => {
  res.json(cyberDefend.roadmaps);
});

app.get("/api/labs", (req, res) => {
  res.json(cyberDefend.cyberLabs);
});

app.get("/api/projects", (req, res) => {
  res.json(cyberDefend.studentProjects);
});

app.get("/api/success-stories", (req, res) => {
  res.json(cyberDefend.successStories);
});

app.get("/api/certifications", (req, res) => {
  res.json(cyberDefend.certifications);
});

app.get("/api/corporate-services", (req, res) => {
  res.json(cyberDefend.corporateServices);
});

app.get("/api/blog", (req, res) => {
  res.json(cyberDefend.blog);
});

app.get("/api/faq", (req, res) => {
  res.json(cyberDefend.faq);
});

app.post("/api/enroll", async (req, res) => {
  const { name, email, course } = req.body;

  if (![name, email, course].every(value => typeof value === "string" && value.trim())) {
    return res.status(400).json({
      success: false,
      message: "Name, email and course are required."
    });
  }

  if (!pool) {
    return res.status(503).json({
      success: false,
      message: "Database is not configured yet."
    });
  }

  try {
    await pool.query(
      "INSERT INTO enrollments (name, email, course) VALUES ($1, $2, $3)",
      [name.trim(), email.trim(), course.trim()]
    );
    res.status(201).json({
      success: true,
      message: "Enrollment request received.",
      student: { name: name.trim(), email: email.trim(), course: course.trim() }
    });
  } catch (error) {
    console.error("Failed to save enrollment:", error);
    res.status(500).json({ success: false, message: "Could not save enrollment." });
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (![name, email, message].every(value => typeof value === "string" && value.trim())) {
    return res.status(400).json({
      success: false,
      message: "All fields are required."
    });
  }

  if (!pool) {
    return res.status(503).json({
      success: false,
      message: "Database is not configured yet."
    });
  }

  try {
    await pool.query(
      "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)",
      [name.trim(), email.trim(), message.trim()]
    );
    res.status(201).json({
      success: true,
      message: "Your message has been received."
    });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    res.status(500).json({ success: false, message: "Could not save your message." });
  }
});

async function initializeDatabase() {
  if (!pool) {
    console.warn("DATABASE_URL is not set; form submissions will not be stored.");
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      course TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`CYBERDEFEND server running at http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });
