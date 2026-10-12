const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.post("/api/enroll", (req, res) => {
  const { name, email, course } = req.body;

  if (!name || !email || !course) {
    return res.status(400).json({
      success: false,
      message: "Name, email and course are required."
    });
  }
const file = path.join(__dirname, "enrollments.json");
let enrollments = [];

try {
  enrollments = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (error) {
  enrollments = [];
}

enrollments.push({
  name,
  email,
  course,
  date: new Date().toISOString()
});

fs.writeFileSync(file, JSON.stringify(enrollments, null, 2));

  res.status(201).json({
    success: true,
    message: "Enrollment request received.",
    student: { name, email, course }
  });
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required."
    });
  }

  res.status(201).json({
    success: true,
    message: "Your message has been received."
  });
});

app.listen(PORT, () => {
  console.log(
    `CYBERDEFEND server running at http://localhost:${PORT}`
  );
});
