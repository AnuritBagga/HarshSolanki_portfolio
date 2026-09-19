/* =========================================================
   HarshBot — a small, offline assistant that answers
   questions about Harsh Solanki.

   No API, no network. Everything below is matched locally by
   keyword with word-boundary scoring, so the longer and more
   specific a matched phrase is, the more it counts.

   To teach it something new: add an entry to KB with the
   phrases people might use in `k` and the reply in `a`.
   ========================================================= */
(function () {
  'use strict';

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return document.querySelector(s); };

  var KB = [
    { k: ['hi', 'hello', 'hey', 'yo', 'namaste', 'hola', 'good morning', 'good evening'],
      a: "Hey! I'm <b>HarshBot</b>. Ask me about Harsh's projects, skills, studies, awards, or whether he's free for an internship." },

    { k: ['who is harsh', 'who', 'about him', 'yourself', 'introduce', 'tell me about harsh', 'bio', 'summary', 'overview'],
      a: "<b>Harsh Solanki</b> is a Mechatronics Engineering undergraduate at <b>Chandigarh University, Mohali</b> (B.E., since August 2023). He works across pneumatics and sensor integration, CAD design, and control code. He has built a pick-and-place robot, a camera-calibrated sorting conveyor and a Tesla coil, and placed on the podium at Tekathon twice." },

    { k: ['skill', 'good at', 'strength', 'expertise', 'capabilities', 'what can he do', 'tech stack'],
      a: "Four areas:<br><b>Pneumatics &amp; sensors</b> — inductive, proximity, infrared, pressure and solenoid integration.<br><b>CAD</b> — Fusion 360, AutoCAD, SolidWorks.<br><b>Programming &amp; robotics</b> — Arduino, Python, ROS 2, image processing.<br><b>Power &amp; automation</b> — electric drives, axial flux motors, IC engines, basic PLC and automation concepts." },

    { k: ['project', 'portfolio', 'what has he built', 'builds', 'his work', 'show me his work'],
      a: "Three builds:<br><b>1. RPR pick-and-place robot</b> (Aug–Nov 2025, individual) — Arduino, motor control, sensor feedback.<br><b>2. Conveyor sorting with camera calibration</b> (Jan–Apr 2025, team) — image processing synced to belt movement.<br><b>3. Tesla coil</b> (Oct–Dec 2024, team) — wireless power, lit fluorescent bulbs across an air gap.<br>Ask me about any one of them." },

    { k: ['rpr', 'pick and place', 'pick-and-place', 'robot arm', 'robotic arm', 'gripper', 'arduino robot'],
      a: "The <b>RPR Robot</b> was his individual project from August to November 2025. It's an Arduino-based pick-and-place arm that moves objects to predefined locations using motor control and sensor feedback. He integrated the motors, sensors and the mechanical gripper to get precise positioning, smooth motion and reliable handling — the part that usually decides whether a part gets dropped or not." },

    { k: ['conveyor', 'sorting', 'camera calibration', 'vision', 'image processing', 'opencv', 'sort'],
      a: "The <b>conveyor sorting system</b> was a team project from January to April 2025. A camera identifies objects by their visual features and the system sorts them as they travel. The hard part was real-time camera calibration plus control logic that keeps detection synchronised with belt movement, so a part is diverted at exactly the right moment." },

    { k: ['tesla', 'coil', 'wireless power', 'high voltage', 'induction', 'electromagnetic'],
      a: "The <b>Tesla coil</b> was a team project from October to December 2024 — a miniature coil demonstrating electromagnetic induction and wireless energy transfer. Driven by high-frequency alternating current, it lit fluorescent bulbs across an air gap with no contact." },

    { k: ['education', 'study', 'studies', 'degree', 'college', 'university', 'chandigarh', 'qualification', 'academic', 'graduate'],
      a: "<b>B.E. Mechatronics Engineering</b> at <b>Chandigarh University, Mohali</b>, from August 2023 and ongoing." },

    { k: ['award', 'tekathon', 'competition', 'prize', 'win', 'won', 'achievement', 'hackathon'],
      a: "Two podiums at Chandigarh University's Tekathon: <b>2nd place at Tekathon 4.0 in 2025</b> and <b>3rd place at Tekathon 3.0 in 2024</b>." },

    { k: ['internship', 'intern', 'experience', 'job', 'worked', 'career', 'social internship'],
      a: "He did a <b>social internship</b> from June to July 2024 — field visits to nearby villages studying socio-economic conditions, and conversations with local vendors and small-scale workers about heat, dust and missing infrastructure. Alongside that, his engineering experience comes from three hands-on project builds." },

    { k: ['hire', 'hiring', 'available', 'availability', 'free', 'open to', 'recruit', 'opportunity', 'looking for', 'role', 'vacancy'],
      a: "Yes — Harsh is <b>open to internships and graduate roles</b> in automation, robotics and product engineering. Quickest route: <b>harshthakur6647@gmail.com</b> or <b>+91 87556 88171</b>." },

    { k: ['contact', 'email', 'reach', 'get in touch', 'connect', 'phone', 'call', 'number', 'linkedin'],
      a: "Email <b>harshthakur6647@gmail.com</b>, phone <b>+91 87556 88171</b>, or LinkedIn at <b>in/harsh-solanki-04441a34a</b>." },

    { k: ['resume', 'cv', 'download'],
      a: "There's a <b>Résumé</b> button at the top right of the page, and a download link in the Contact section." },

    { k: ['location', 'where', 'based', 'city', 'live', 'from', 'kasganj', 'mohali', 'relocate'],
      a: "Home is <b>Kasganj, Uttar Pradesh</b>; he studies at Chandigarh University in <b>Mohali, Punjab</b>. He's open to relocating." },

    { k: ['pneumatic', 'sensor', 'inductive', 'proximity', 'infrared', 'solenoid', 'pressure'],
      a: "Sensor and pneumatics work is his strongest area: <b>inductive, proximity, infrared and pressure sensors</b>, plus <b>solenoid</b> actuation. He's comfortable picking the right sensor for a job, wiring it cleanly and making the actuation repeatable." },

    { k: ['cad', 'fusion', 'solidworks', 'autocad', 'design software', 'modelling', 'drawing'],
      a: "CAD in <b>Fusion 360</b>, <b>AutoCAD</b> and <b>SolidWorks</b> — parts, assemblies and mechanism design drawn to be manufactured rather than just rendered." },

    { k: ['python', 'programming', 'code', 'coding', 'language', 'software'],
      a: "<b>Python</b> is his main language, used for control logic and image processing. He also writes <b>Arduino / embedded</b> code for the hardware side, and works with <b>ROS 2</b> for robot integration." },

    { k: ['ros', 'ros 2', 'ros2', 'robotics framework'],
      a: "He works with <b>ROS 2</b> for robot integration — it's on his résumé alongside Python as a core technical skill." },

    { k: ['plc', 'automation', 'scada', 'ladder', 'industrial'],
      a: "He has <b>basic PLC and automation concepts</b> under his belt, and is building toward industrial automation work — that's the direction he wants his career to go." },

    { k: ['motor', 'axial flux', 'electric drive', 'drives', 'ic engine', 'engine', 'power'],
      a: "On the power side he has working knowledge of <b>IC engines</b>, <b>electric drives</b> and <b>axial flux motors</b> — the part of mechatronics that turns current into torque." },

    { k: ['hobby', 'hobbies', 'fun', 'free time', 'outside', 'interests', 'cricket', 'chess', 'sudoku'],
      a: "<b>Cricket, chess and sudoku.</b> Two of those probably explain the patience for debugging." },

    { k: ['language', 'speak', 'languages', 'hindi', 'english'],
      a: "<b>Hindi and English.</b>" },

    { k: ['soft skill', 'personality', 'team', 'work style', 'teamwork'],
      a: "He describes himself as <b>confident, a fast learner, adaptable</b> and a <b>critical thinker</b> — and two of his three projects were team builds, including both Tekathon entries." },

    { k: ['why mechatronics', 'why did', 'passion', 'motivation', 'interested', 'love'],
      a: "His answer: he likes the moment a pile of parts stops being parts and starts behaving like one machine. Mechatronics is the only discipline that owns the mechanics, the electronics and the code at the same time." },

    { k: ['thank', 'thanks', 'thx', 'nice', 'cool', 'awesome', 'great', 'appreciate'],
      a: "Anytime. Anything else you'd like to know?" },

    { k: ['bye', 'goodbye', 'see you', 'later', 'cya'],
      a: "Take care. Harsh is at <b>harshthakur6647@gmail.com</b> whenever you need him." },

    { k: ['website', 'site', 'who made', 'built this', 'how was this made', 'this page'],
      a: "The page is hand-built with plain HTML, CSS and JavaScript — no framework and no template. The walking clip in the header is Harsh; so is the character standing in the corner, which is me." }
  ];

  var FALLBACK = "I don't have that one yet. Try asking about his <b>projects</b>, <b>skills</b>, <b>studies</b>, <b>awards</b>, or whether he's <b>available for work</b>.";

  function norm(s) {
    return ' ' + String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  }
  var cache = {};
  function hit(hay, key) {
    var re = cache[key];
    if (!re) {
      var esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      re = cache[key] = new RegExp('\\s' + esc + (key.length >= 4 ? '[a-z]{0,3}' : '') + '\\s');
    }
    return re.test(hay);
  }
  function answer(q) {
    var s = norm(q), best = null, top = 0;
    for (var i = 0; i < KB.length; i++) {
      var score = 0, keys = KB[i].k;
      for (var j = 0; j < keys.length; j++) {
        if (hit(s, keys[j])) score += keys[j].length + (keys[j].indexOf(' ') > -1 ? 4 : 0);
      }
      if (score > top) { top = score; best = KB[i]; }
    }
    return top >= 2 ? best.a : FALLBACK;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------- UI ---------------- */
  var panel = $('#chat'), log = $('#chatLog'), form = $('#chatForm'),
      input = $('#chatInput'), chips = $('#chatChips'),
      fig = $('#botBtn'), say = $('#botSay'), sayX = $('#sayX');
  var started = false;

  function push(text, who) {
    var d = document.createElement('div');
    d.className = 'm ' + who;
    d.innerHTML = who === 'me' ? esc(text) : text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function typing() {
    var d = document.createElement('div');
    d.className = 'm bot typing';
    d.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(d); log.scrollTop = log.scrollHeight;
    return d;
  }
  function reply(q) {
    var t = typing();
    setTimeout(function () {
      t.remove();
      push(answer(q), 'bot');
    }, RM ? 60 : 420 + Math.random() * 420);
  }

  var CHIPS = ['What are his projects?', 'Skills?', 'Is he available?',
    'Tell me about the RPR robot', 'What did he study?', 'Any awards?'];
  function buildChips() {
    chips.innerHTML = '';
    CHIPS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = c;
      b.addEventListener('click', function () { push(c, 'me'); reply(c); });
      chips.appendChild(b);
    });
  }

  function openChat() {
    panel.classList.add('open');
    fig.setAttribute('aria-expanded', 'true');
    if (say) say.classList.remove('show');
    if (!started) {
      started = true;
      buildChips();
      setTimeout(function () {
        push("Hi! I'm <b>HarshBot</b> — ask me anything about Harsh Solanki: his projects, his skills, what he studied, or whether he's open to work.", 'bot');
      }, 240);
    }
    setTimeout(function () { input.focus(); }, 300);
  }
  function closeChat() {
    panel.classList.remove('open');
    fig.setAttribute('aria-expanded', 'false');
  }

  fig.addEventListener('click', function () {
    panel.classList.contains('open') ? closeChat() : openChat();
  });
  $('#chatClose').addEventListener('click', closeChat);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closeChat();
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    push(v, 'me'); input.value = ''; reply(v);
  });

  var heroAsk = $('#heroAsk'), ask2 = $('#askBot2');
  if (heroAsk) heroAsk.addEventListener('click', openChat);
  if (ask2) ask2.addEventListener('click', function (e) { e.preventDefault(); openChat(); });
  if (sayX) sayX.addEventListener('click', function (e) {
    e.stopPropagation(); say.classList.remove('show');
  });

  /* greeting bubble, once */
  setTimeout(function () {
    if (say && !panel.classList.contains('open')) say.classList.add('show');
  }, RM ? 1200 : 6500);
  setTimeout(function () { if (say) say.classList.remove('show'); }, RM ? 6000 : 14000);

  /* the greeting gets out of the way as soon as the visitor starts reading */
  var dismissed = false;
  window.addEventListener('scroll', function () {
    if (dismissed || !say) return;
    if ((window.scrollY || 0) > 120) { dismissed = true; say.classList.remove('show'); }
  }, { passive: true });
})();
