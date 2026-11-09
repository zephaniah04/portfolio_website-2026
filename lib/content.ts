// All site copy lives here so it can be edited without touching components.

// Pages serves the site under a sub-path; next/image does not add it to
// unoptimized local images, so local image paths go through this helper.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const img = (path: string) => `${basePath}${path}`;

export const site = {
  name: "Zephaniah Raika",
  firstName: "Zephaniah",
  lastName: "Raika",
  role: "Creative Photographer & Amateur Videographer",
  email: "raikazephaniah44@gmail.com",
  location: "India",
  // Replace these files with your own photos.
  heroImage: img("/images/hero.jpg"), // full-screen first page background, landscape
  photo: img("/images/profile.jpg"), // portrait (~3:4) used in About
};

export type Accent = "lime" | "orange" | "pink" | "blue";

export const accentClass: Record<Accent, { bg: string; text: string; border: string }> = {
  lime: { bg: "bg-lime", text: "text-lime", border: "border-lime" },
  orange: { bg: "bg-orange", text: "text-orange", border: "border-orange" },
  pink: { bg: "bg-pink", text: "text-pink", border: "border-pink" },
  blue: { bg: "bg-blue", text: "text-blue", border: "border-blue" },
};

export type Service = {
  id: string;
  number: string;
  title: string;
  level: string;
  description: string;
  tags: string[];
  accent: Accent;
};

export const services: Service[] = [
  {
    id: "photography",
    number: "01",
    title: "Photography",
    level: "Creative",
    description:
      "Portraits, streets, events and products, shot with an eye for light, mood and the moment in between.",
    tags: ["Portraits", "Street", "Events", "Products"],
    accent: "lime",
  },
  {
    id: "videography",
    number: "02",
    title: "Videography",
    level: "Amateur",
    description:
      "Short films, reels and behind-the-scenes edits. Learning every frame, telling stories in motion.",
    tags: ["Reels", "Short Films", "BTS", "Editing"],
    accent: "orange",
  },
  {
    id: "design",
    number: "03",
    title: "Design",
    level: "Visual",
    description:
      "Posters, social graphics and visual identities that carry the same eye I bring behind the lens.",
    tags: ["Posters", "Social", "Branding", "Layouts"],
    accent: "pink",
  },
];

export type Work = {
  title: string;
  category: string;
  year: string;
  image: string;
};

export const work: Work[] = [
  { title: "Golden Hour", category: "Photography", year: "2026", image: img("/images/work/04.jpg") },
  { title: "City Lines", category: "Photography", year: "2026", image: img("/images/work/05.jpg") },
  { title: "Still Water", category: "Videography", year: "2025", image: img("/images/work/06.jpg") },
  { title: "Analog Days", category: "Design", year: "2025", image: img("/images/work/08.jpg") },
  { title: "Quiet Roads", category: "Photography", year: "2025", image: img("/images/work/09.jpg") },
  { title: "Night Shift", category: "Videography", year: "2024", image: img("/images/work/10.jpg") },
];

export const stats = [
  { value: 500, suffix: "+", label: "Photos delivered" },
  { value: 40, suffix: "+", label: "Shoots & projects" },
  { value: 25, suffix: "+", label: "Designs created" },
  { value: 5, suffix: "AM", label: "Gym alarm" },
];

export type JournalEntry = {
  id: string;
  label: string;
  title: string;
  excerpt: string;
  image: string;
  accent: Accent;
  // Set when the card opens a real page; otherwise the card shows "coming soon".
  href?: string;
  cta?: string;
};

// These are the sections the top-right menu links to.
export const journal: JournalEntry[] = [
  {
    id: "finance",
    label: "Finance",
    title: "Money as a creative",
    excerpt:
      "How I budget gear, price shoots and manage irregular income as a freelancer.",
    image: img("/images/work/11.jpg"),
    accent: "lime",
  },
  {
    id: "blog",
    label: "Blog",
    title: "Notes from the field",
    excerpt:
      "Stories behind the shots, editing breakdowns and lessons from every project.",
    image: img("/images/work/12.jpg"),
    accent: "orange",
    href: "/blog",
    cta: "Read the blog",
  },
  {
    id: "fitness",
    label: "Fitness",
    title: "Discipline in & out",
    excerpt:
      "Training logs, routines and how staying fit keeps me sharp behind the camera.",
    image: img("/images/work/07.jpg"),
    accent: "blue",
    href: "/fitness",
    cta: "See the training",
  },
];

// Blog page copy. Posts themselves come from Notion (see lib/notion.ts).
export const blog = {
  label: "Blog",
  title: ["Notes", "from the field"],
  intro:
    "Everything I am learning with a camera in hand — and the money, training and design that keep it going. Written in Notion, published straight to here.",
  topicsLabel: "Topics",
  empty: {
    title: "Nothing published yet",
    body: "The blog reads from my Notion workspace. As soon as a post is marked Published there, it shows up on this page.",
  },
};

// Each Notion topic gets one of the site accents.
const topicAccents: Record<string, Accent> = {
  Photography: "lime",
  Videography: "orange",
  Design: "pink",
  Finance: "blue",
  Fitness: "orange",
  Life: "lime",
};

export function accentForTopic(topic: string): Accent {
  return topicAccents[topic] ?? "lime";
}

// ---------------------------------------------------------------------------
// Fitness pages (/fitness and /fitness/gym)
// ---------------------------------------------------------------------------

export type FitnessItem = {
  id: string;
  name: string;
  meta: string;
  blurb: string;
  // Set when the item opens a page of its own.
  href?: string;
};

export type FitnessTrack = {
  id: string;
  label: string;
  tagline: string;
  accent: Accent;
  // Set when the whole track has a page behind it.
  href?: string;
  cta?: string;
  items: FitnessItem[];
};

export const fitness = {
  label: "Fitness",
  title: ["Strong", "on purpose"],
  intro:
    "Six sessions a week, two years deep. The gym is the base, sport is the reason, and recovery is what makes it repeatable. Here is everything I actually do — no secret program, just the work.",
  marquee: ["Strength", "Endurance", "Discipline", "Recovery"],
  stats: [
    { value: "05:00", label: "Alarm, most days" },
    { value: "6", label: "Sessions a week" },
    { value: "4", label: "Sports in rotation" },
    { value: "2 yrs", label: "Without a long break" },
  ],
  boardLabel: "Pick a lane",
  boardTitle: "What I train",
  boardHint: "Tap a lane to see what is inside it",
  tracks: [
    {
      id: "gym",
      label: "Gym",
      tagline:
        "The base everything else sits on. Four to five lifting days, split by movement pattern.",
      accent: "lime",
      href: "/fitness/gym",
      cta: "Open the full gym plan",
      items: [
        {
          id: "strength",
          name: "Strength Training",
          meta: "2× / week",
          blurb: "Heavy compounds in the 3–5 rep range. Squat, bench, deadlift, press.",
          href: "/fitness/gym#strength",
        },
        {
          id: "hypertrophy",
          name: "Hypertrophy",
          meta: "2–3× / week",
          blurb: "Volume work at 8–12 reps, taken close to failure on the last set.",
          href: "/fitness/gym#hypertrophy",
        },
        {
          id: "endurance",
          name: "Endurance Training",
          meta: "2× / week",
          blurb:
            "Zone 2 runs and long easy rides. The quiet work that makes everything else possible.",
          href: "/fitness/gym#endurance",
        },
        {
          id: "conditioning",
          name: "Conditioning",
          meta: "1× / week",
          blurb: "Short, ugly circuits. Sled, rower, kettlebell. Ten minutes that feel like thirty.",
          href: "/fitness/gym#conditioning",
        },
        {
          id: "mobility",
          name: "Mobility & Core",
          meta: "Daily, 10 min",
          blurb: "Hips, shoulders, thoracic spine. Carrying a camera bag all day is a load too.",
          href: "/fitness/gym#mobility",
        },
      ],
    },
    {
      id: "sports",
      label: "Sports",
      tagline: "Training has to cash out somewhere. This is where it does.",
      accent: "orange",
      items: [
        {
          id: "football",
          name: "Football",
          meta: "Sundays",
          blurb: "Five-a-side with the same crew. Competitive enough to hurt on Monday.",
        },
        {
          id: "badminton",
          name: "Badminton",
          meta: "2× / week",
          blurb: "Fast feet, fast hands. The best conditioning I never have to plan.",
        },
        {
          id: "basketball",
          name: "Basketball",
          meta: "Pick-up",
          blurb: "Half-court whenever the court is free. All jumping, all lateral.",
        },
        {
          id: "running",
          name: "Running",
          meta: "15–25 km / week",
          blurb: "Easy pace most days, one tempo run. Building toward a half marathon.",
        },
        {
          id: "cycling",
          name: "Cycling",
          meta: "Weekends",
          blurb: "Long rides out of the city. Doubles as a scouting trip for photos.",
        },
        {
          id: "swimming",
          name: "Swimming",
          meta: "Off-season",
          blurb: "Shoulder-friendly cardio and the one thing that fixes a stiff back.",
        },
        {
          id: "table-tennis",
          name: "Table Tennis",
          meta: "Whenever",
          blurb: "Reaction work disguised as messing about.",
        },
        {
          id: "trekking",
          name: "Trekking",
          meta: "Monthly",
          blurb: "A full day on the feet with a loaded pack — and the camera earns its keep.",
        },
      ],
    },
    {
      id: "recovery",
      label: "Recovery",
      tagline:
        "The half of training nobody posts about, and the half that decides whether you keep going.",
      accent: "blue",
      items: [
        {
          id: "sleep",
          name: "Sleep",
          meta: "7–8 hrs",
          blurb: "Non-negotiable. A 5 AM alarm only works if the night before does.",
        },
        {
          id: "food",
          name: "Food",
          meta: "3 meals + 1",
          blurb: "Protein at every meal, carbs around training, nothing complicated.",
        },
        {
          id: "walks",
          name: "Walking",
          meta: "8–10k steps",
          blurb: "Camera in hand, city on foot. Recovery and work at the same time.",
        },
        {
          id: "stretch",
          name: "Stretching",
          meta: "Every night",
          blurb: "Ten minutes before bed. Hips and hamstrings, mostly.",
        },
        {
          id: "deload",
          name: "Deload",
          meta: "Every 6 weeks",
          blurb: "Half the volume for a week. I come back stronger every time.",
        },
        {
          id: "rest",
          name: "Full rest",
          meta: "1 day",
          blurb: "One day with nothing scheduled, and I actually take it.",
        },
      ],
    },
  ] satisfies FitnessTrack[],
  principlesLabel: "What I follow",
  principles: [
    {
      number: "01",
      title: "Show up before you feel like it",
      body: "The alarm is not a decision. The session is already made, so all that is left is doing it. Motivation turns up somewhere in the warm-up.",
    },
    {
      number: "02",
      title: "Add a little, every week",
      body: "A kilo on the bar or one more rep. Progressive overload tracked in a notes app, not an expensive one.",
    },
    {
      number: "03",
      title: "Compounds first, always",
      body: "Squat, hinge, push, pull, carry. Accessories only get the time that is left over.",
    },
    {
      number: "04",
      title: "Train the sport, not the mirror",
      body: "If it does not help me last ninety minutes on a pitch or a full day on a shoot, it is decoration.",
    },
    {
      number: "05",
      title: "Never two missed days in a row",
      body: "One missed day is life. Two is the start of a new habit, so the second one does not happen.",
    },
  ],
  weekLabel: "A normal week",
  week: [
    { day: "Mon", focus: "Push — strength", detail: "Bench, overhead press, dips, triceps. Heavy, low reps." },
    { day: "Tue", focus: "Badminton + core", detail: "Ninety minutes on court, ten minutes of core after." },
    { day: "Wed", focus: "Pull — hypertrophy", detail: "Deadlift, rows, pull-ups, curls. Volume work." },
    { day: "Thu", focus: "Zone 2 run", detail: "An easy 6–8 km where I can still hold a conversation." },
    { day: "Fri", focus: "Legs — strength", detail: "Squat, split squat, hamstring curl, calves." },
    { day: "Sat", focus: "Conditioning + ride", detail: "Short circuit, then a long easy ride if the light is good." },
    { day: "Sun", focus: "Football", detail: "Five-a-side, then nothing at all." },
  ],
};

export type GymBlock = {
  // Matches the hash the /fitness lane items link to.
  id: string;
  name: string;
  meta: string;
  goal: string;
  accent: Accent;
  work: { move: string; prescription: string }[];
};

export const gym = {
  label: "Gym",
  title: ["The gym", "plan"],
  intro:
    "Five blocks, run on repeat. Nothing here is fancy — it is the same handful of lifts, done properly, with a little more weight than last week.",
  stats: [
    { value: "4–5", label: "Gym days a week" },
    { value: "60–75", label: "Minutes a session" },
    { value: "6 wks", label: "Per training block" },
    { value: "5", label: "Lifts that matter" },
  ],
  blocksLabel: "The blocks",
  blocks: [
    {
      id: "strength",
      name: "Strength Training",
      meta: "2× / week · 3–5 reps",
      goal: "Get stronger at the five lifts everything else hangs off. Long rests, low reps, full intent on every one.",
      accent: "lime",
      work: [
        { move: "Back squat", prescription: "4 × 5 @ RPE 8" },
        { move: "Bench press", prescription: "4 × 5 @ RPE 8" },
        { move: "Deadlift", prescription: "3 × 3 @ RPE 8" },
        { move: "Overhead press", prescription: "4 × 5 @ RPE 7" },
        { move: "Weighted pull-up", prescription: "4 × 5" },
      ],
    },
    {
      id: "hypertrophy",
      name: "Hypertrophy",
      meta: "2–3× / week · 8–12 reps",
      goal: "Volume for the muscle the heavy work does not cover. Last set of everything goes close to failure.",
      accent: "orange",
      work: [
        { move: "Incline dumbbell press", prescription: "3 × 10" },
        { move: "Chest-supported row", prescription: "4 × 10" },
        { move: "Romanian deadlift", prescription: "3 × 10" },
        { move: "Bulgarian split squat", prescription: "3 × 10 each side" },
        { move: "Lateral raise", prescription: "4 × 15" },
        { move: "Curl + triceps superset", prescription: "3 × 12 each" },
      ],
    },
    {
      id: "endurance",
      name: "Endurance Training",
      meta: "2× / week · zone 2",
      goal: "An engine that lasts ninety minutes on a pitch and a full day carrying a camera bag. Easy enough to hold a conversation.",
      accent: "blue",
      work: [
        { move: "Easy run", prescription: "6–8 km, conversational" },
        { move: "Tempo run", prescription: "20 min at a hard but steady pace" },
        { move: "Long ride", prescription: "40–60 km, weekends" },
        { move: "Incline walk", prescription: "20 min after lifting" },
      ],
    },
    {
      id: "conditioning",
      name: "Conditioning",
      meta: "1× / week · 10 min",
      goal: "Short and genuinely unpleasant. Ten minutes that make everything in sport feel slower.",
      accent: "pink",
      work: [
        { move: "Rower intervals", prescription: "8 × 250 m, 1 min rest" },
        { move: "Kettlebell swing", prescription: "10 × 10, every minute" },
        { move: "Sled push", prescription: "6 × 20 m" },
        { move: "Farmer's carry", prescription: "4 × 40 m heavy" },
      ],
    },
    {
      id: "mobility",
      name: "Mobility & Core",
      meta: "Daily · 10 min",
      goal: "Hips, shoulders and thoracic spine, plus a core that holds a heavy bar and a long lens equally well.",
      accent: "lime",
      work: [
        { move: "90/90 hip switch", prescription: "2 × 10 each side" },
        { move: "Dead hang", prescription: "3 × 30 s" },
        { move: "Thoracic opener", prescription: "2 × 10" },
        { move: "Hollow hold", prescription: "3 × 30 s" },
        { move: "Side plank", prescription: "3 × 30 s each side" },
      ],
    },
  ] satisfies GymBlock[],
  rulesLabel: "House rules",
  rules: [
    "Warm up for ten minutes, every single session. No exceptions on cold mornings.",
    "Log every set. If it is not written down, last week never happened.",
    "Add weight only when every rep of the last session was clean.",
    "Leave one rep in the tank on everything except the final set.",
    "A session cut short still counts. A session skipped does not.",
  ],
  prsLabel: "Current bests",
  prs: [
    { lift: "Back squat", value: "120 kg × 5" },
    { lift: "Deadlift", value: "150 kg × 3" },
    { lift: "Bench press", value: "85 kg × 5" },
    { lift: "Overhead press", value: "55 kg × 5" },
    { lift: "5 km run", value: "23:40" },
  ],
};

export const menuLinks = [
  { label: "Home", href: "#top" },
  { label: "What I Do", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Finance", href: "#finance" },
  { label: "Blog", href: "/blog" },
  { label: "Fitness", href: "/fitness" },
  { label: "Contact", href: "#contact" },
];

export const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];
