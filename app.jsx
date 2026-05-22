const { useMemo, useState, useEffect } = React;

const LINKS = {
  iq: "https://iq.blueoceanedu.com/",
  eq: "https://eq.blueoceanedu.com/",
  aptitude: "https://aptitude.blueoceanedu.com/",
  psychometric: "https://psychometric.blueoceanedu.com/",
  parentpsyche: "https://parentpsyche.blueoceanedu.com/",
  upload: "https://forms.gle/jpZ9nJXxgFGrS3V69",
};

const TASKS = [
  {
    id:"iq",
    who:"student",
    title:"IQ (Reasoning baseline)",
    url: LINKS.iq,
    time:"15–25 min",
    what:[
      "Complete the test in one sitting (no breaks).",
      "Quiet room, no music, no multitasking.",
      "Do not look up answers; we need your true baseline."
    ],
    why:[
      "We use IQ-style reasoning as a baseline for how fast you learn new patterns and how you handle unfamiliar problems.",
      "It helps us calibrate workload, pace, and the type of academic environment where you’ll thrive (supportive vs high-speed).",
      "This is not about “smart vs not”;it’s about matching you to the right challenge level."
    ],
    science:[
      "These tests mostly tap general cognitive ability (pattern recognition, working memory, processing efficiency).",
      "Scores can shift with sleep, stress, and test familiarity;so consistency and honest effort matter.",
      "We interpret results as a range and combine with your real performance + context."
    ],
  },
  {
    id:"eq",
    who:"student",
    title:"EQ (Emotional skills for performance)",
    url: LINKS.eq,
    time:"12–20 min",
    what:[
      "Answer as you behave under pressure, not your ideal self.",
      "If unsure, choose what happens most weeks.",
      "Be honest;this is used to support you."
    ],
    why:[
      "EQ predicts how you manage stress, feedback, conflict, and long timelines;basically, how you perform over months.",
      "It informs coaching: motivation style, support needs, confidence swings, and how you bounce back after setbacks.",
      "For admissions, it connects to leadership, teamwork, and sustained projects."
    ],
    science:[
      "Emotional intelligence has both ability-like skills (perceiving/understanding emotions) and trait-like self-perceptions.",
      "Self-reports can be biased, so we look at patterns (regulation, empathy, resilience) rather than one number.",
      "We use it to build a practical support plan, not to label you."
    ],
  },
  {
    id:"aptitude",
    who:"student",
    title:"Aptitude-first career assessment (Major direction)",
    url: LINKS.aptitude,
    time:"25–40 min",
    what:[
      "Answer for your real interests + strengths, not prestige.",
      "Don’t overthink; first instincts are often best.",
      "If you haven’t tried many things, answer based on curiosity."
    ],
    why:[
      "We start with aptitudes and work backward to majors;this reduces major regret and improves narrative clarity.",
      "It identifies the types of problems you enjoy solving (systems, people, design, analysis, building).",
      "The output helps us shortlist majors and then map to extracurricular strategy."
    ],
    science:[
      "Good career fit is a combination of: abilities, interests, values, and environment.",
      "Assessments are directional;meant to create hypotheses you validate with real experiences.",
      "We triangulate your results with your academic record and real projects."
    ],
  },
  {
    id:"psychometric",
    who:"student",
    title:"Psychometric profile (Personality + work style)",
    url: LINKS.psychometric,
    time:"15–25 min",
    what:[
      "Answer as you are most of the year.",
      "Don’t answer based on what you think we want.",
      "If you are in an unusually stressful week, mention it later."
    ],
    why:[
      "This helps us understand how you work: structure vs flexibility, planning style, social energy, and stress triggers.",
      "It guides how we coach you (check-ins, accountability, timelines, and communication).",
      "It also informs campus fit (collaborative vs competitive, small vs big ecosystem)."
    ],
    science:[
      "Most modern psychometrics map to stable traits (often related to Big Five: conscientiousness, openness, etc.).",
      "Traits are probabilistic, not destiny: they predict tendencies, not fixed outcomes.",
      "We use your profile to design systems that make consistency easier."
    ],
  },
  {
    id:"parentpsyche",
    who:"parent",
    title:"Parent Psyche (Values + expectations)",
    url: LINKS.parentpsyche,
    time:"12–18 min",
    what:[
      "Each parent completes it separately.",
      "Answer candidly (even if you disagree with the other parent).",
      "There are no “good” answers;only clarity."
    ],
    why:[
      "College decisions are family decisions. Misalignment creates stress and delays.",
      "This helps us understand what parents care about: safety, prestige, ROI, independence, culture, discipline.",
      "We can then communicate in the language that builds trust and reduces conflict."
    ],
    science:[
      "Parent expectations shape student motivation and stress (through autonomy support vs pressure).",
      "We use this to avoid guesswork: it lets us manage tradeoffs early (budget vs fit vs brand).",
      "The result improves family alignment and decision speed."
    ],
  },
];

function loadState(){
  try{
    const raw = localStorage.getItem("bo_onboarding_v1");
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}
function saveState(state){
  try{
    localStorage.setItem("bo_onboarding_v1", JSON.stringify(state));
  }catch(e){}
}

function Badge({children, type}){
  const cls = "tag " + (type==="student" ? "student" : "parent");
  return <span className={cls}>{children}</span>;
}
function Button({children, variant="default", onClick, href}){
  const cls = "btn" + (variant==="primary" ? " primary" : "");
  if(href){
    return <a className={cls} href={href} target="_blank" rel="noreferrer">{children}</a>;
  }
  return <button className={cls} onClick={onClick}>{children}</button>;
}
function Pill({children}){ return <span className="pill">{children}</span>; }

function Check({checked, onToggle, label}){
  return (
    <div className={"check"+(checked?" on":"")} onClick={onToggle} role="button" tabIndex={0}>
      <div className="box">{checked ? "✓" : ""}</div>
      <div style={{fontWeight:850, fontSize:13, color:"rgba(255,255,255,.92)"}}>{label}</div>
    </div>
  );
}

function App(){
  const [name,setName]=useState("");
  const [studentDone,setStudentDone]=useState({iq:false, eq:false, aptitude:false, psychometric:false});
  const [parentDone,setParentDone]=useState({parent1:false, parent2:false});
  const [uploaded,setUploaded]=useState(false);

  useEffect(()=>{
    const s = loadState();
    if(!s) return;
    setName(s.name||"");
    setStudentDone(s.studentDone||studentDone);
    setParentDone(s.parentDone||parentDone);
    setUploaded(!!s.uploaded);
  },[]);

  useEffect(()=>{
    saveState({name, studentDone, parentDone, uploaded});
  },[name, studentDone, parentDone, uploaded]);

  const counts = useMemo(()=>{
    const studentTotal = 4;
    const studentCompleted = Object.values(studentDone).filter(Boolean).length;
    const parentTotal = 2;
    const parentCompleted = Object.values(parentDone).filter(Boolean).length;
    const total = studentTotal + parentTotal + 1; // upload
    const completed = studentCompleted + parentCompleted + (uploaded?1:0);
    const pct = Math.round((completed/total)*100);
    return {studentTotal, studentCompleted, parentTotal, parentCompleted, total, completed, pct};
  },[studentDone, parentDone, uploaded]);

  const reset = ()=>{
    if(!confirm("Reset onboarding progress?")) return;
    setName("");
    setStudentDone({iq:false, eq:false, aptitude:false, psychometric:false});
    setParentDone({parent1:false, parent2:false});
    setUploaded(false);
    try{ localStorage.removeItem("bo_onboarding_v1"); }catch(e){}
    window.scrollTo({top:0,behavior:"smooth"});
  };

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand">
          <div className="logo" />
          <div>
            <h1>Blue Ocean Onboarding</h1>
            <small>Complete assessments · upload results · start strategy</small>
          </div>
        </div>
        <div className="actions">
          <Pill>Progress: {counts.pct}%</Pill>
          <Button onClick={()=>window.print()}>Print</Button>
          <Button onClick={reset}>Reset</Button>
          <Button variant="primary" href={LINKS.upload}>Upload Results</Button>
        </div>
      </div>

      <div className="hero">
        <div className="card">
          <h2>We don’t guess. We <span style={{color:"var(--yellow)"}}>measure</span> first.</h2>
          <p>
            Before we build your college strategy, we collect a compact set of assessments.
            They help us understand <b>how you think</b>, <b>how you perform under stress</b>, and <b>what environment you’ll thrive in</b>.
            This improves decision quality and reduces wasted effort.
          </p>
          <div className="quote">
            <em>“The goal is not a score. The goal is a plan that fits the person.”</em>
            <div className="tiny" style={{marginTop:6}}>Complete the tasks below, then upload your results.</div>
          </div>
          <div className="divider"></div>

          <div className="sectionTitle"><h3>Start here</h3><span>2 minutes</span></div>
          <div className="row">
            <div className="mini">
              <b>Student name (for our report)</b>
              <input
                value={name}
                onChange={e=>setName(e.target.value)}
                placeholder="Enter student name"
                style={{marginTop:4}}
              />
              <div className="tiny" style={{marginTop:8}}>Saved on this device only (local storage).</div>
            </div>
            <div className="mini">
              <b>How to complete (do this once)</b>
              <ul className="list">
                <li>One sitting per test (avoid interruptions).</li>
                <li>Honest effort (no searching answers).</li>
                <li>If sleep/stress is unusual, note it in upload form.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="sectionTitle"><h3>Status</h3><span>live</span></div>
          <div className="row3">
            <div className="mini">
              <b>Student tasks</b>
              <div className="big">{counts.studentCompleted}/{counts.studentTotal}</div>
              <div className="tiny" style={{marginTop:6}}>IQ, EQ, Aptitude, Psychometric</div>
            </div>
            <div className="mini">
              <b>Parent tasks</b>
              <div className="big">{counts.parentCompleted}/{counts.parentTotal}</div>
              <div className="tiny" style={{marginTop:6}}>Each parent separately</div>
            </div>
            <div className="mini">
              <b>Upload</b>
              <div className="big">{uploaded ? "Done" : "Pending"}</div>
              <div className="tiny" style={{marginTop:6}}>Google form</div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="sectionTitle"><h3>Progress</h3><span>{counts.completed}/{counts.total}</span></div>
          <div className="progressBar" aria-label="progress">
            <div className="progressFill" style={{width: `${counts.pct}%`}} />
          </div>
          <div className="tiny" style={{marginTop:8}}>
            After upload, we’ll review results and prepare your next-step strategy call.
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="sectionTitle"><h3>Student ; required</h3><span>Complete all 4</span></div>

          {TASKS.filter(t=>t.who==="student").map(t=>(
            <Task
              key={t.id}
              task={t}
              checked={!!studentDone[t.id]}
              onToggle={()=>setStudentDone(s=>({...s,[t.id]:!s[t.id]}))}
            />
          ))}

          <div className="mutedBlock" style={{marginTop:12}}>
            <b style={{color:"var(--yellow)"}}>Note:</b> If you already completed one test earlier, you can still mark it done ; just make sure you upload the result file or screenshot in the form.
          </div>
        </div>

        <div className="card">
          <div className="sectionTitle"><h3>Parents ; required</h3><span>Each parent completes separately</span></div>

          <Task
            task={TASKS.find(x=>x.id==="parentpsyche")}
            checked={false}
            onToggle={()=>{}}
            showCheckbox={false}
          />

          <div className="row" style={{marginTop:12}}>
            <div className="mini">
              <b>Parent #1</b>
              <Check
                checked={parentDone.parent1}
                onToggle={()=>setParentDone(p=>({...p,parent1:!p.parent1}))}
                label="Completed Parent Psyche"
              />
              <div className="tiny" style={{marginTop:8}}>Best practice: complete privately.</div>
            </div>
            <div className="mini">
              <b>Parent #2</b>
              <Check
                checked={parentDone.parent2}
                onToggle={()=>setParentDone(p=>({...p,parent2:!p.parent2}))}
                label="Completed Parent Psyche"
              />
              <div className="tiny" style={{marginTop:8}}>We compare alignment and tradeoffs.</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="sectionTitle"><h3>Final step</h3><span>Upload results</span></div>

          <div className="taskCard">
            <div className="taskTop">
              <div>
                <div style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
                  <h4 className="taskTitle" style={{margin:0}}>Upload your results</h4>
                  <span className="tag student">Student + Parents</span>
                </div>
                <p className="taskDesc">
                  Upload screenshots/PDFs/results for all completed assessments using the form below.
                  This ensures we have everything in one place before the strategy review.
                </p>
              </div>
              <div className="tiny">{uploaded ? "Marked done" : "Pending"}</div>
            </div>

            <div className="taskActions">
              <a className="linkBtn" href={LINKS.upload} target="_blank" rel="noreferrer">Open upload form</a>
              <div style={{flex:"1 1 auto"}} />
              <Check
                checked={uploaded}
                onToggle={()=>setUploaded(u=>!u)}
                label="I have uploaded all results"
              />
            </div>

            <div className="taskWhy">
              <b>Why we upload:</b> It prevents missing context and allows us to prepare a clean, accurate recommendation document.
            </div>
          </div>

          <div className="divider"></div>

          <div className="mutedBlock">
            <div style={{fontWeight:900, color:"rgba(255,255,255,.92)"}}>What happens next?</div>
            <ul className="list" style={{marginTop:8}}>
              <li>We review results + context notes.</li>
              <li>We identify fit hypotheses (majors, environments, workload, support systems).</li>
              <li>We convert this into a shortlist + action plan for the next 4–8 weeks.</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="sectionTitle"><h3>FAQ</h3><span>common questions</span></div>

          <div className="mutedBlock">
            <div style={{fontWeight:900, color:"rgba(255,255,255,.92)"}}>Are these tests “perfect”?</div>
            <div style={{marginTop:6}}>
              No. Assessments are <b>signals</b>. We use them to guide decisions, then validate using real academic performance and real projects.
              The advantage is reducing guesswork early.
            </div>
          </div>

          <div className="mutedBlock" style={{marginTop:12}}>
            <div style={{fontWeight:900, color:"rgba(255,255,255,.92)"}}>What if I had a bad day (sleep/stress)?</div>
            <div style={{marginTop:6}}>
              Mention it in the upload form. We interpret results as a range and look for patterns across tools.
            </div>
          </div>

          <div className="mutedBlock" style={{marginTop:12}}>
            <div style={{fontWeight:900, color:"rgba(255,255,255,.92)"}}>Will results be kept private?</div>
            <div style={{marginTop:6}}>
              Share only what you’re comfortable sharing. These are used to improve guidance and planning.
            </div>
          </div>

          <div className="divider"></div>
          <div className="tiny">
            Generated on {new Date().toLocaleDateString(undefined,{year:"numeric",month:"short",day:"2-digit"})}. Use Print to save as PDF.
          </div>
        </div>
      </div>

      <div className="stickyBottom">
        <div className="stickyInner">
          <div className="tiny">
            <b>Progress:</b> {counts.completed}/{counts.total} · {counts.pct}% complete
            <span style={{marginLeft:8}}>·</span>
            <span style={{marginLeft:8}}>Upload when done</span>
          </div>
          <div style={{display:"flex", gap:10, alignItems:"center"}}>
            <a className="ghostLink" href={LINKS.iq} target="_blank" rel="noreferrer">Start IQ</a>
            <a className="ghostLink" href={LINKS.eq} target="_blank" rel="noreferrer">Start EQ</a>
            <a className="linkBtn" href={LINKS.upload} target="_blank" rel="noreferrer">Upload results</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Task({task, checked, onToggle, showCheckbox=true}){
  return (
    <div className="taskCard" style={{marginTop:12}}>
      <div className="taskTop">
        <div>
          <div style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
            <h4 className="taskTitle">{task.title}</h4>
            <Badge type={task.who}>{task.who==="student" ? "Student" : "Parent"}</Badge>
            <span className="tag">{task.time}</span>
          </div>
          <p className="taskDesc">
            Complete here: <a href={task.url} target="_blank" rel="noreferrer" style={{textDecoration:"underline", textUnderlineOffset:3}}>{task.url}</a>
          </p>
        </div>

        <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10}}>
          {showCheckbox ? (
            <div className={"check"+(checked?" on":"")} onClick={onToggle} role="button" tabIndex={0}>
              <div className="box">{checked ? "✓" : ""}</div>
              <div style={{fontWeight:850, fontSize:13, color:"rgba(255,255,255,.92)"}}>Mark done</div>
            </div>
          ) : null}
          <div className="tiny">Opens in a new tab</div>
        </div>
      </div>

      <div className="taskActions">
        <a className="linkBtn" href={task.url} target="_blank" rel="noreferrer">Open assessment</a>
        <a className="ghostLink" href={task.url} target="_blank" rel="noreferrer">Copy link</a>
      </div>

      <div className="taskWhy">
        <b>Why this matters:</b>
        <ul className="list" style={{marginTop:8}}>
          {task.why.map((t,i)=><li key={i}>{t}</li>)}
        </ul>
      </div>

      <div className="taskWhy" style={{marginTop:10}}>
        <b>How to do it (so the data is usable):</b>
        <ul className="list" style={{marginTop:8}}>
          {task.what.map((t,i)=><li key={i}>{t}</li>)}
        </ul>
      </div>

      <div className="taskWhy" style={{marginTop:10}}>
        <b>Science / reasoning (quick, not academic):</b>
        <ul className="list" style={{marginTop:8}}>
          {task.science.map((t,i)=><li key={i}>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}
