const {
  useMemo,
  useState,
  useEffect
} = React;
const LINKS = {
  iq: "https://iq.blueoceanedu.com/",
  eq: "https://eq.blueoceanedu.com/",
  aptitude: "https://aptitude.blueoceanedu.com/",
  psychometric: "https://psychometric.blueoceanedu.com/",
  parentpsyche: "https://parentpsyche.blueoceanedu.com/",
  upload: "https://forms.gle/jpZ9nJXxgFGrS3V69"
};
const TASKS = [{
  id: "iq",
  who: "student",
  title: "IQ (Reasoning baseline)",
  url: LINKS.iq,
  time: "15–25 min",
  what: ["Complete the test in one sitting (no breaks).", "Quiet room, no music, no multitasking.", "Do not look up answers; we need your true baseline."],
  why: ["We use IQ-style reasoning as a baseline for how fast you learn new patterns and how you handle unfamiliar problems.", "It helps us calibrate workload, pace, and the type of academic environment where you’ll thrive (supportive vs high-speed).", "This is not about “smart vs not”;it’s about matching you to the right challenge level."],
  science: ["These tests mostly tap general cognitive ability (pattern recognition, working memory, processing efficiency).", "Scores can shift with sleep, stress, and test familiarity;so consistency and honest effort matter.", "We interpret results as a range and combine with your real performance + context."]
}, {
  id: "eq",
  who: "student",
  title: "EQ (Emotional skills for performance)",
  url: LINKS.eq,
  time: "12–20 min",
  what: ["Answer as you behave under pressure, not your ideal self.", "If unsure, choose what happens most weeks.", "Be honest;this is used to support you."],
  why: ["EQ predicts how you manage stress, feedback, conflict, and long timelines;basically, how you perform over months.", "It informs coaching: motivation style, support needs, confidence swings, and how you bounce back after setbacks.", "For admissions, it connects to leadership, teamwork, and sustained projects."],
  science: ["Emotional intelligence has both ability-like skills (perceiving/understanding emotions) and trait-like self-perceptions.", "Self-reports can be biased, so we look at patterns (regulation, empathy, resilience) rather than one number.", "We use it to build a practical support plan, not to label you."]
}, {
  id: "aptitude",
  who: "student",
  title: "Aptitude-first career assessment (Major direction)",
  url: LINKS.aptitude,
  time: "25–40 min",
  what: ["Answer for your real interests + strengths, not prestige.", "Don’t overthink; first instincts are often best.", "If you haven’t tried many things, answer based on curiosity."],
  why: ["We start with aptitudes and work backward to majors;this reduces major regret and improves narrative clarity.", "It identifies the types of problems you enjoy solving (systems, people, design, analysis, building).", "The output helps us shortlist majors and then map to extracurricular strategy."],
  science: ["Good career fit is a combination of: abilities, interests, values, and environment.", "Assessments are directional;meant to create hypotheses you validate with real experiences.", "We triangulate your results with your academic record and real projects."]
}, {
  id: "psychometric",
  who: "student",
  title: "Psychometric profile (Personality + work style)",
  url: LINKS.psychometric,
  time: "15–25 min",
  what: ["Answer as you are most of the year.", "Don’t answer based on what you think we want.", "If you are in an unusually stressful week, mention it later."],
  why: ["This helps us understand how you work: structure vs flexibility, planning style, social energy, and stress triggers.", "It guides how we coach you (check-ins, accountability, timelines, and communication).", "It also informs campus fit (collaborative vs competitive, small vs big ecosystem)."],
  science: ["Most modern psychometrics map to stable traits (often related to Big Five: conscientiousness, openness, etc.).", "Traits are probabilistic, not destiny: they predict tendencies, not fixed outcomes.", "We use your profile to design systems that make consistency easier."]
}, {
  id: "parentpsyche",
  who: "parent",
  title: "Parent Psyche (Values + expectations)",
  url: LINKS.parentpsyche,
  time: "12–18 min",
  what: ["Each parent completes it separately.", "Answer candidly (even if you disagree with the other parent).", "There are no “good” answers;only clarity."],
  why: ["College decisions are family decisions. Misalignment creates stress and delays.", "This helps us understand what parents care about: safety, prestige, ROI, independence, culture, discipline.", "We can then communicate in the language that builds trust and reduces conflict."],
  science: ["Parent expectations shape student motivation and stress (through autonomy support vs pressure).", "We use this to avoid guesswork: it lets us manage tradeoffs early (budget vs fit vs brand).", "The result improves family alignment and decision speed."]
}];
function loadState() {
  try {
    const raw = localStorage.getItem("bo_onboarding_v1");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
function saveState(state) {
  try {
    localStorage.setItem("bo_onboarding_v1", JSON.stringify(state));
  } catch (e) {}
}
function Badge({
  children,
  type
}) {
  const cls = "tag " + (type === "student" ? "student" : "parent");
  return /*#__PURE__*/React.createElement("span", {
    className: cls
  }, children);
}
function Button({
  children,
  variant = "default",
  onClick,
  href
}) {
  const cls = "btn" + (variant === "primary" ? " primary" : "");
  if (href) {
    return /*#__PURE__*/React.createElement("a", {
      className: cls,
      href: href,
      target: "_blank",
      rel: "noreferrer"
    }, children);
  }
  return /*#__PURE__*/React.createElement("button", {
    className: cls,
    onClick: onClick
  }, children);
}
function Pill({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "pill"
  }, children);
}
function Check({
  checked,
  onToggle,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "check" + (checked ? " on" : ""),
    onClick: onToggle,
    role: "button",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement("div", {
    className: "box"
  }, checked ? "✓" : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 850,
      fontSize: 13,
      color: "rgba(255,255,255,.92)"
    }
  }, label));
}
function App() {
  const [name, setName] = useState("");
  const [studentDone, setStudentDone] = useState({
    iq: false,
    eq: false,
    aptitude: false,
    psychometric: false
  });
  const [parentDone, setParentDone] = useState({
    parent1: false,
    parent2: false
  });
  const [uploaded, setUploaded] = useState(false);
  useEffect(() => {
    const s = loadState();
    if (!s) return;
    setName(s.name || "");
    setStudentDone(s.studentDone || studentDone);
    setParentDone(s.parentDone || parentDone);
    setUploaded(!!s.uploaded);
  }, []);
  useEffect(() => {
    saveState({
      name,
      studentDone,
      parentDone,
      uploaded
    });
  }, [name, studentDone, parentDone, uploaded]);
  const counts = useMemo(() => {
    const studentTotal = 4;
    const studentCompleted = Object.values(studentDone).filter(Boolean).length;
    const parentTotal = 2;
    const parentCompleted = Object.values(parentDone).filter(Boolean).length;
    const total = studentTotal + parentTotal + 1; // upload
    const completed = studentCompleted + parentCompleted + (uploaded ? 1 : 0);
    const pct = Math.round(completed / total * 100);
    return {
      studentTotal,
      studentCompleted,
      parentTotal,
      parentCompleted,
      total,
      completed,
      pct
    };
  }, [studentDone, parentDone, uploaded]);
  const reset = () => {
    if (!confirm("Reset onboarding progress?")) return;
    setName("");
    setStudentDone({
      iq: false,
      eq: false,
      aptitude: false,
      psychometric: false
    });
    setParentDone({
      parent1: false,
      parent2: false
    });
    setUploaded(false);
    try {
      localStorage.removeItem("bo_onboarding_v1");
    } catch (e) {}
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Blue Ocean Onboarding"), /*#__PURE__*/React.createElement("small", null, "Complete assessments \xB7 upload results \xB7 start strategy"))), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement(Pill, null, "Progress: ", counts.pct, "%"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => window.print()
  }, "Print"), /*#__PURE__*/React.createElement(Button, {
    onClick: reset
  }, "Reset"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    href: LINKS.upload
  }, "Upload Results"))), /*#__PURE__*/React.createElement("div", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("h2", null, "We don\u2019t guess. We ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--yellow)"
    }
  }, "measure"), " first."), /*#__PURE__*/React.createElement("p", null, "Before we build your college strategy, we collect a compact set of assessments. They help us understand ", /*#__PURE__*/React.createElement("b", null, "how you think"), ", ", /*#__PURE__*/React.createElement("b", null, "how you perform under stress"), ", and ", /*#__PURE__*/React.createElement("b", null, "what environment you\u2019ll thrive in"), ". This improves decision quality and reduces wasted effort."), /*#__PURE__*/React.createElement("div", {
    className: "quote"
  }, /*#__PURE__*/React.createElement("em", null, "\u201CThe goal is not a score. The goal is a plan that fits the person.\u201D"), /*#__PURE__*/React.createElement("div", {
    className: "tiny",
    style: {
      marginTop: 6
    }
  }, "Complete the tasks below, then upload your results.")), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sectionTitle"
  }, /*#__PURE__*/React.createElement("h3", null, "Start here"), /*#__PURE__*/React.createElement("span", null, "2 minutes")), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mini"
  }, /*#__PURE__*/React.createElement("b", null, "Student name (for our report)"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Enter student name",
    style: {
      marginTop: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "tiny",
    style: {
      marginTop: 8
    }
  }, "Saved on this device only (local storage).")), /*#__PURE__*/React.createElement("div", {
    className: "mini"
  }, /*#__PURE__*/React.createElement("b", null, "How to complete (do this once)"), /*#__PURE__*/React.createElement("ul", {
    className: "list"
  }, /*#__PURE__*/React.createElement("li", null, "One sitting per test (avoid interruptions)."), /*#__PURE__*/React.createElement("li", null, "Honest effort (no searching answers)."), /*#__PURE__*/React.createElement("li", null, "If sleep/stress is unusual, note it in upload form."))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sectionTitle"
  }, /*#__PURE__*/React.createElement("h3", null, "Status"), /*#__PURE__*/React.createElement("span", null, "live")), /*#__PURE__*/React.createElement("div", {
    className: "row3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mini"
  }, /*#__PURE__*/React.createElement("b", null, "Student tasks"), /*#__PURE__*/React.createElement("div", {
    className: "big"
  }, counts.studentCompleted, "/", counts.studentTotal), /*#__PURE__*/React.createElement("div", {
    className: "tiny",
    style: {
      marginTop: 6
    }
  }, "IQ, EQ, Aptitude, Psychometric")), /*#__PURE__*/React.createElement("div", {
    className: "mini"
  }, /*#__PURE__*/React.createElement("b", null, "Parent tasks"), /*#__PURE__*/React.createElement("div", {
    className: "big"
  }, counts.parentCompleted, "/", counts.parentTotal), /*#__PURE__*/React.createElement("div", {
    className: "tiny",
    style: {
      marginTop: 6
    }
  }, "Each parent separately")), /*#__PURE__*/React.createElement("div", {
    className: "mini"
  }, /*#__PURE__*/React.createElement("b", null, "Upload"), /*#__PURE__*/React.createElement("div", {
    className: "big"
  }, uploaded ? "Done" : "Pending"), /*#__PURE__*/React.createElement("div", {
    className: "tiny",
    style: {
      marginTop: 6
    }
  }, "Google form"))), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sectionTitle"
  }, /*#__PURE__*/React.createElement("h3", null, "Progress"), /*#__PURE__*/React.createElement("span", null, counts.completed, "/", counts.total)), /*#__PURE__*/React.createElement("div", {
    className: "progressBar",
    "aria-label": "progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progressFill",
    style: {
      width: `${counts.pct}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "tiny",
    style: {
      marginTop: 8
    }
  }, "After upload, we\u2019ll review results and prepare your next-step strategy call."))), /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sectionTitle"
  }, /*#__PURE__*/React.createElement("h3", null, "Student ; required"), /*#__PURE__*/React.createElement("span", null, "Complete all 4")), TASKS.filter(t => t.who === "student").map(t => /*#__PURE__*/React.createElement(Task, {
    key: t.id,
    task: t,
    checked: !!studentDone[t.id],
    onToggle: () => setStudentDone(s => ({
      ...s,
      [t.id]: !s[t.id]
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mutedBlock",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--yellow)"
    }
  }, "Note:"), " If you already completed one test earlier, you can still mark it done ; just make sure you upload the result file or screenshot in the form.")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sectionTitle"
  }, /*#__PURE__*/React.createElement("h3", null, "Parents ; required"), /*#__PURE__*/React.createElement("span", null, "Each parent completes separately")), /*#__PURE__*/React.createElement(Task, {
    task: TASKS.find(x => x.id === "parentpsyche"),
    checked: false,
    onToggle: () => {},
    showCheckbox: false
  }), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mini"
  }, /*#__PURE__*/React.createElement("b", null, "Parent #1"), /*#__PURE__*/React.createElement(Check, {
    checked: parentDone.parent1,
    onToggle: () => setParentDone(p => ({
      ...p,
      parent1: !p.parent1
    })),
    label: "Completed Parent Psyche"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tiny",
    style: {
      marginTop: 8
    }
  }, "Best practice: complete privately.")), /*#__PURE__*/React.createElement("div", {
    className: "mini"
  }, /*#__PURE__*/React.createElement("b", null, "Parent #2"), /*#__PURE__*/React.createElement(Check, {
    checked: parentDone.parent2,
    onToggle: () => setParentDone(p => ({
      ...p,
      parent2: !p.parent2
    })),
    label: "Completed Parent Psyche"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tiny",
    style: {
      marginTop: 8
    }
  }, "We compare alignment and tradeoffs.")))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sectionTitle"
  }, /*#__PURE__*/React.createElement("h3", null, "Final step"), /*#__PURE__*/React.createElement("span", null, "Upload results")), /*#__PURE__*/React.createElement("div", {
    className: "taskCard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "taskTop"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("h4", {
    className: "taskTitle",
    style: {
      margin: 0
    }
  }, "Upload your results"), /*#__PURE__*/React.createElement("span", {
    className: "tag student"
  }, "Student + Parents")), /*#__PURE__*/React.createElement("p", {
    className: "taskDesc"
  }, "Upload screenshots/PDFs/results for all completed assessments using the form below. This ensures we have everything in one place before the strategy review.")), /*#__PURE__*/React.createElement("div", {
    className: "tiny"
  }, uploaded ? "Marked done" : "Pending")), /*#__PURE__*/React.createElement("div", {
    className: "taskActions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "linkBtn",
    href: LINKS.upload,
    target: "_blank",
    rel: "noreferrer"
  }, "Open upload form"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 auto"
    }
  }), /*#__PURE__*/React.createElement(Check, {
    checked: uploaded,
    onToggle: () => setUploaded(u => !u),
    label: "I have uploaded all results"
  })), /*#__PURE__*/React.createElement("div", {
    className: "taskWhy"
  }, /*#__PURE__*/React.createElement("b", null, "Why we upload:"), " It prevents missing context and allows us to prepare a clean, accurate recommendation document.")), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mutedBlock"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 900,
      color: "rgba(255,255,255,.92)"
    }
  }, "What happens next?"), /*#__PURE__*/React.createElement("ul", {
    className: "list",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("li", null, "We review results + context notes."), /*#__PURE__*/React.createElement("li", null, "We identify fit hypotheses (majors, environments, workload, support systems)."), /*#__PURE__*/React.createElement("li", null, "We convert this into a shortlist + action plan for the next 4\u20138 weeks.")))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sectionTitle"
  }, /*#__PURE__*/React.createElement("h3", null, "FAQ"), /*#__PURE__*/React.createElement("span", null, "common questions")), /*#__PURE__*/React.createElement("div", {
    className: "mutedBlock"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 900,
      color: "rgba(255,255,255,.92)"
    }
  }, "Are these tests \u201Cperfect\u201D?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, "No. Assessments are ", /*#__PURE__*/React.createElement("b", null, "signals"), ". We use them to guide decisions, then validate using real academic performance and real projects. The advantage is reducing guesswork early.")), /*#__PURE__*/React.createElement("div", {
    className: "mutedBlock",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 900,
      color: "rgba(255,255,255,.92)"
    }
  }, "What if I had a bad day (sleep/stress)?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, "Mention it in the upload form. We interpret results as a range and look for patterns across tools.")), /*#__PURE__*/React.createElement("div", {
    className: "mutedBlock",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 900,
      color: "rgba(255,255,255,.92)"
    }
  }, "Will results be kept private?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, "Share only what you\u2019re comfortable sharing. These are used to improve guidance and planning.")), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tiny"
  }, "Generated on ", new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }), ". Use Print to save as PDF."))), /*#__PURE__*/React.createElement("div", {
    className: "stickyBottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stickyInner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tiny"
  }, /*#__PURE__*/React.createElement("b", null, "Progress:"), " ", counts.completed, "/", counts.total, " \xB7 ", counts.pct, "% complete", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8
    }
  }, "Upload when done")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "ghostLink",
    href: LINKS.iq,
    target: "_blank",
    rel: "noreferrer"
  }, "Start IQ"), /*#__PURE__*/React.createElement("a", {
    className: "ghostLink",
    href: LINKS.eq,
    target: "_blank",
    rel: "noreferrer"
  }, "Start EQ"), /*#__PURE__*/React.createElement("a", {
    className: "linkBtn",
    href: LINKS.upload,
    target: "_blank",
    rel: "noreferrer"
  }, "Upload results")))));
}
function Task({
  task,
  checked,
  onToggle,
  showCheckbox = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "taskCard",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "taskTop"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("h4", {
    className: "taskTitle"
  }, task.title), /*#__PURE__*/React.createElement(Badge, {
    type: task.who
  }, task.who === "student" ? "Student" : "Parent"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, task.time)), /*#__PURE__*/React.createElement("p", {
    className: "taskDesc"
  }, "Complete here: ", /*#__PURE__*/React.createElement("a", {
    href: task.url,
    target: "_blank",
    rel: "noreferrer",
    style: {
      textDecoration: "underline",
      textUnderlineOffset: 3
    }
  }, task.url))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 10
    }
  }, showCheckbox ? /*#__PURE__*/React.createElement("div", {
    className: "check" + (checked ? " on" : ""),
    onClick: onToggle,
    role: "button",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement("div", {
    className: "box"
  }, checked ? "✓" : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 850,
      fontSize: 13,
      color: "rgba(255,255,255,.92)"
    }
  }, "Mark done")) : null, /*#__PURE__*/React.createElement("div", {
    className: "tiny"
  }, "Opens in a new tab"))), /*#__PURE__*/React.createElement("div", {
    className: "taskActions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "linkBtn",
    href: task.url,
    target: "_blank",
    rel: "noreferrer"
  }, "Open assessment"), /*#__PURE__*/React.createElement("a", {
    className: "ghostLink",
    href: task.url,
    target: "_blank",
    rel: "noreferrer"
  }, "Copy link")), /*#__PURE__*/React.createElement("div", {
    className: "taskWhy"
  }, /*#__PURE__*/React.createElement("b", null, "Why this matters:"), /*#__PURE__*/React.createElement("ul", {
    className: "list",
    style: {
      marginTop: 8
    }
  }, task.why.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "taskWhy",
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("b", null, "How to do it (so the data is usable):"), /*#__PURE__*/React.createElement("ul", {
    className: "list",
    style: {
      marginTop: 8
    }
  }, task.what.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "taskWhy",
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("b", null, "Science / reasoning (quick, not academic):"), /*#__PURE__*/React.createElement("ul", {
    className: "list",
    style: {
      marginTop: 8
    }
  }, task.science.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, t)))));
}
