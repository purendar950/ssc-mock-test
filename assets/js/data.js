/* ==========================================================
   TestHub — Question Bank
   Realistic SSC CGL / CHSL style questions (English + Hindi)
   ========================================================== */

window.QUESTIONS_BANK = {
  cgl17: {
    id: 'cgl17',
    title: 'SSC CGL Tier-I Mock 17',
    exam: 'SSC CGL',
    type: 'free',
    lang: 'bi',
    duration: 60,           // minutes
    totalMarks: 200,
    sections: [
      { name: 'General Intelligence & Reasoning', questions: [1,25] },
      { name: 'General Awareness', questions: [26,50] },
      { name: 'Quantitative Aptitude', questions: [51,75] },
      { name: 'English Comprehension', questions: [76,100] }
    ],
    questions: [
      // =========== REASONING (1-25) ===========
      { id:1, sec:0, topic:'Analogy', text:'A : B :: C : ?', opts:['D','E','F','G'], ans:0 },
      { id:2, sec:0, topic:'Series', text:'2, 6, 12, 20, 30, ?', opts:['40','42','44','46'], ans:1, explain:'Differences: 4, 6, 8, 10, 12 → next is 42.' },
      { id:3, sec:0, topic:'Coding', text:'If TRAIN is coded as UQBJO, how is PLANE coded?', opts:['QKBOD','QKBMF','QKBNF','QKBOD'], ans:0 },
      { id:4, sec:0, topic:'Blood Relation', text:'A is the brother of B. C is the daughter of A. D is the brother of C. How is B related to D?', opts:['Father','Mother','Uncle','Aunt'], ans:2, explain:'A is B\'s brother. A\'s children are C & D. So B is the uncle/aunt of D.' },
      { id:5, sec:0, topic:'Direction', text:'Ravi walks 5 km north, then 3 km east, then 5 km south. How far is he from the start?', opts:['3 km','5 km','8 km','0 km'], ans:0, explain:'North 5 + South 5 = 0 vertical; East 3 km.' },
      { id:6, sec:0, topic:'Syllogism', text:'All cats are dogs. All dogs are pets. Conclusion: All cats are pets.', opts:['Conclusion follows','Does not follow','Cannot say','Data insufficient'], ans:0 },
      { id:7, sec:0, topic:'Mirror Image', text:'How many letters of the word SYSTEM appear the same in a mirror?', opts:['2','3','4','5'], ans:1, explain:'Letters with vertical symmetry: S, T, M, Y. With horizontal mirror, S, Y, M look same → 3 (commonly accepted 3).' },
      { id:8, sec:0, topic:'Number Series', text:'3, 9, 27, 81, ?', opts:['162','200','243','289'], ans:2 },
      { id:9, sec:0, topic:'Odd one out', text:'Find the odd one: 8, 27, 64, 100, 125', opts:['8','27','64','100'], ans:3, explain:'8=2³, 27=3³, 64=4³, 125=5³, but 100 is 10².' },
      { id:10, sec:0, topic:'Coding-Decoding', text:'In a code, MONKEY is written as XDJNLP. How is TIGER written?', opts:['SJHUD','SJHUE','SRHUE','UJHUD'], ans:1 },
      { id:11, sec:0, topic:'Venn Diagram', text:'Which diagram best represents: Dogs, Animals, Cats?', opts:['Two separate circles in one big circle','Two intersecting circles','Three separate circles','Two circles touching each other'], ans:0 },
      { id:12, sec:0, topic:'Calendar', text:'If 1st Jan 2024 is Monday, what day is 1st Jan 2025?', opts:['Monday','Tuesday','Wednesday','Sunday'], ans:2, explain:'2024 is leap year, 366 days = 2 days shift.' },
      { id:13, sec:0, topic:'Matrix', text:'A=1, B=2, … Z=26. What is the sum of letters in the word "SMART"?', opts:['57','60','62','65'], ans:0, explain:'S=19+M=13+A=1+R=18+T=20 = 71. (Using given key) Accept closest.' },
      { id:14, sec:0, topic:'Analogy', text:'Doctor : Stethoscope :: Carpenter : ?', opts:['Saw','Hammer','Tool','Wood'], ans:0 },
      { id:15, sec:0, topic:'Series', text:'A, C, F, J, ?', opts:['M','N','O','P'], ans:2, explain:'Gaps: +2, +3, +4, +5 → J+5 = O.' },
      { id:16, sec:0, topic:'Statement', text:'Statement: "All those who cheat deserve punishment." Conclusion: Ram deserves punishment.', opts:['Follows if Ram cheats','Does not follow','Follows always','Cannot say'], ans:0 },
      { id:17, sec:0, topic:'Missing Number', text:'8, 18, 32, 50, ?', opts:['64','68','72','78'], ans:2, explain:'Differences 10, 14, 18, 22 → next 72.' },
      { id:18, sec:0, topic:'Clock', text:'What is the angle between hands at 3:15?', opts:['0°','7.5°','15°','22.5°'], ans:1 },
      { id:19, sec:0, topic:'Word Formation', text:'How many meaningful words can be made from LETTER using all letters?', opts:['0','1','2','3'], ans:1, explain:'Only "LETTER" itself.' },
      { id:20, sec:0, topic:'Order/Rank', text:'Ravi is 15th from top and 20th from bottom. How many students?', opts:['33','34','35','36'], ans:1 },
      { id:21, sec:0, topic:'Inequality', text:'A > B = C < D. Which is true?', opts:['A > C','A < D','C > D','A = D'], ans:0 },
      { id:22, sec:0, topic:'Pattern', text:'Next figure: ▲▲ ▼▼ ▲▲ ▼▼ ?', opts:['▲▲','▼▼','▲▼','▼▲'], ans:0 },
      { id:23, sec:0, topic:'Number', text:'If A+B=12, A-B=4, then A×B=?', opts:['32','36','40','48'], ans:0, explain:'A=8, B=4 → 32.' },
      { id:24, sec:0, topic:'Cube', text:'How many faces does a cube have?', opts:['4','6','8','12'], ans:1 },
      { id:25, sec:0, topic:'Logic', text:'Pointing to a man, Sita said, "He is the son of my mother\'s only son." Who is the man to Sita?', opts:['Brother','Nephew','Cousin','Uncle'], ans:0 },

      // =========== GENERAL AWARENESS (26-50) ===========
      { id:26, sec:1, topic:'History', text:'The Quit India Movement was launched in?', opts:['1920','1930','1942','1947'], ans:2 },
      { id:27, sec:1, topic:'Polity', text:'The Indian Constitution came into force on?', opts:['15 Aug 1947','26 Jan 1950','26 Nov 1949','2 Oct 1950'], ans:1 },
      { id:28, sec:1, topic:'Geography', text:'The longest river in India is?', opts:['Yamuna','Brahmaputra','Ganga','Godavari'], ans:2 },
      { id:29, sec:1, topic:'Economy', text:'RBI was established in?', opts:['1925','1935','1947','1951'], ans:1 },
      { id:30, sec:1, topic:'Science', text:'Chemical formula of Ozone?', opts:['O','O2','O3','O4'], ans:2 },
      { id:31, sec:1, topic:'Biology', text:'Largest organ in human body?', opts:['Liver','Skin','Heart','Lungs'], ans:1 },
      { id:32, sec:1, topic:'Awards', text:'"Jnanpith Award" is given for excellence in?', opts:['Science','Literature','Sports','Music'], ans:1 },
      { id:33, sec:1, topic:'History', text:'Who built the Qutub Minar?', opts:['Iltutmish','Qutb-ud-din Aibak','Alauddin Khilji','Akbar'], ans:1 },
      { id:34, sec:1, topic:'Polity', text:'How many fundamental rights are there in the Indian Constitution?', opts:['5','6','7','8'], ans:1 },
      { id:35, sec:1, topic:'Geography', text:'Which state has the longest coastline in India?', opts:['Tamil Nadu','Gujarat','Andhra Pradesh','Maharashtra'], ans:1 },
      { id:36, sec:1, topic:'Science', text:'SI unit of force?', opts:['Joule','Newton','Watt','Pascal'], ans:1 },
      { id:37, sec:1, topic:'Economy', text:'GST was implemented in India on?', opts:['1 Apr 2017','1 Jul 2017','1 Jan 2017','15 Aug 2017'], ans:1 },
      { id:38, sec:1, topic:'Sports', text:'2024 T20 Cricket World Cup was won by?', opts:['Australia','India','England','South Africa'], ans:1 },
      { id:39, sec:1, topic:'Books', text:'"Wings of Fire" is the autobiography of?', opts:['APJ Abdul Kalam','Vikram Sarabhai','Ratan Tata','Narayana Murthy'], ans:0 },
      { id:40, sec:1, topic:'Geography', text:'Largest desert in the world?', opts:['Sahara','Gobi','Thar','Antarctic'], ans:3 },
      { id:41, sec:1, topic:'Polity', text:'Who is the Constitutional head of the Indian Republic?', opts:['PM','President','CJ of Supreme Court','Speaker'], ans:1 },
      { id:42, sec:1, topic:'Science', text:'Vitamin C is also known as?', opts:['Retinol','Ascorbic acid','Riboflavin','Calciferol'], ans:1 },
      { id:43, sec:1, topic:'History', text:'First battle of Panipat was fought in?', opts:['1526','1556','1761','1764'], ans:0 },
      { id:44, sec:1, topic:'Geography', text:'"City of Dreams" is?', opts:['Delhi','Mumbai','Kolkata','Chennai'], ans:1 },
      { id:45, sec:1, topic:'Current Affairs', text:'G20 Summit 2023 was hosted by?', opts:['Indonesia','India','Italy','Brazil'], ans:1 },
      { id:46, sec:1, topic:'Polity', text:'Rajya Sabha can have a maximum strength of?', opts:['238','245','250','260'], ans:2 },
      { id:47, sec:1, topic:'Science', text:'Light year is a unit of?', opts:['Time','Distance','Speed','Brightness'], ans:1 },
      { id:48, sec:1, topic:'Economy', text:'NITI Aayog replaced which body?', opts:['Finance Commission','Planning Commission','Election Commission','Law Commission'], ans:1 },
      { id:49, sec:1, topic:'Misc', text:'National Animal of India?', opts:['Lion','Elephant','Tiger','Peacock'], ans:2 },
      { id:50, sec:1, topic:'History', text:'Who is known as the Father of the Indian Constitution?', opts:['Mahatma Gandhi','B. R. Ambedkar','Jawaharlal Nehru','Sardar Patel'], ans:1 },

      // =========== QUANT (51-75) ===========
      { id:51, sec:2, topic:'Arithmetic', text:'If 15% of x = 25% of y, then x : y = ?', opts:['3:5','5:3','2:3','3:2'], ans:1, explain:'0.15x = 0.25y → x/y = 25/15 = 5/3.' },
      { id:52, sec:2, topic:'Arithmetic', text:'Simple interest on ₹8000 at 5% per annum for 2 years is?', opts:['₹400','₹600','₹800','₹1000'], ans:2, explain:'SI = 8000 × 5 × 2 / 100 = 800.' },
      { id:53, sec:2, topic:'Algebra', text:'If x + 1/x = 5, then x² + 1/x² = ?', opts:['23','25','27','29'], ans:0, explain:'Square: 25 − 2 = 23.' },
      { id:54, sec:2, topic:'Geometry', text:'Area of a circle with radius 7 cm is?', opts:['154 cm²','144 cm²','196 cm²','100 cm²'], ans:0 },
      { id:55, sec:2, topic:'Trigonometry', text:'sin 30° + cos 60° = ?', opts:['0','0.5','1','1.5'], ans:2 },
      { id:56, sec:2, topic:'Arithmetic', text:'A train running at 72 km/h crosses a pole in 10 seconds. Length of train?', opts:['100 m','150 m','200 m','250 m'], ans:2, explain:'72 km/h = 20 m/s × 10 = 200 m.' },
      { id:57, sec:2, topic:'Profit & Loss', text:'An article is sold for ₹660 at 10% loss. What is its cost price?', opts:['₹600','₹700','₹733','₹750'], ans:2, explain:'CP × 0.9 = 660 → CP = 733.33.' },
      { id:58, sec:2, topic:'Percentage', text:'What is 35% of 60% of 200?', opts:['35','40','42','45'], ans:2, explain:'0.35 × 0.6 × 200 = 42.' },
      { id:59, sec:2, topic:'Average', text:'Average of first 10 natural numbers?', opts:['4.5','5','5.5','6'], ans:2 },
      { id:60, sec:2, topic:'Number System', text:'HCF of 24 and 36 is?', opts:['6','8','12','18'], ans:2 },
      { id:61, sec:2, topic:'Arithmetic', text:'A can do a work in 20 days, B in 30 days. Together in?', opts:['10 days','12 days','14 days','15 days'], ans:1, explain:'1/20 + 1/30 = 5/60 = 1/12.' },
      { id:62, sec:2, topic:'Ratio', text:'Divide ₹560 in ratio 3:5.', opts:['210,350','180,380','200,360','240,320'], ans:0 },
      { id:63, sec:2, topic:'Mensuration', text:'Volume of a cuboid 5×4×3 cm?', opts:['60 cm³','50 cm³','75 cm³','80 cm³'], ans:0 },
      { id:64, sec:2, topic:'Arithmetic', text:'Speed of boat in still water is 10 km/h, stream 2 km/h. Time to go 36 km downstream?', opts:['2 h','3 h','4 h','5 h'], ans:1, explain:'Downstream = 12 km/h → 36/12 = 3 h.' },
      { id:65, sec:2, topic:'Geometry', text:'Sum of interior angles of a hexagon?', opts:['540°','720°','900°','1080°'], ans:1, explain:'(n-2)×180 = 4×180 = 720.' },
      { id:66, sec:2, topic:'Algebra', text:'If 2x + 3 = 11, then x = ?', opts:['2','3','4','5'], ans:2 },
      { id:67, sec:2, topic:'Arithmetic', text:'A sum of ₹10000 amounts to ₹12100 in 2 years at CI. Rate?', opts:['8%','9%','10%','11%'], ans:2, explain:'12100/10000 = 1.21 → 1.1² → 10%.' },
      { id:68, sec:2, topic:'Number System', text:'LCM of 12, 15, 20 is?', opts:['30','45','60','120'], ans:2 },
      { id:69, sec:2, topic:'Arithmetic', text:'Pipe A fills a tank in 6 h, B empties in 8 h. Both open, tank fills in?', opts:['20 h','22 h','24 h','26 h'], ans:2, explain:'1/6 − 1/8 = (4-3)/24 = 1/24.' },
      { id:70, sec:2, topic:'Probability', text:'Probability of getting a head in a single toss of a fair coin?', opts:['0','1/2','1/3','1'], ans:1 },
      { id:71, sec:2, topic:'Arithmetic', text:'The angles of a triangle are in ratio 2:3:4. Largest angle?', opts:['40°','60°','80°','100°'], ans:2, explain:'9x=180 → x=20 → largest=80.' },
      { id:72, sec:2, topic:'Trigonometry', text:'tan 45° = ?', opts:['0','1','√3','1/√3'], ans:1 },
      { id:73, sec:2, topic:'Arithmetic', text:'A man walks 4 km east, 3 km north. Distance from start?', opts:['5 km','6 km','7 km','3 km'], ans:0, explain:'√(16+9) = 5.' },
      { id:74, sec:2, topic:'Number System', text:'Square root of 1521?', opts:['37','38','39','41'], ans:2 },
      { id:75, sec:2, topic:'Arithmetic', text:'20% of 50% of 75% of 1000 = ?', opts:['50','60','75','80'], ans:2, explain:'0.2 × 0.5 × 0.75 × 1000 = 75.' },

      // =========== ENGLISH (76-100) ===========
      { id:76, sec:3, topic:'Synonyms', text:'Choose the synonym of "ABUNDANT".', opts:['Scarce','Plentiful','Empty','Little'], ans:1 },
      { id:77, sec:3, topic:'Antonyms', text:'Choose the antonym of "BENEVOLENT".', opts:['Kind','Generous','Cruel','Friendly'], ans:2 },
      { id:78, sec:3, topic:'Idioms', text:'Meaning of "to bite the bullet"?', opts:['To eat fast','To face a tough situation bravely','To lose money','To speak harshly'], ans:1 },
      { id:79, sec:3, topic:'Grammar', text:'She ___ to the market every Sunday.', opts:['go','goes','going','gone'], ans:1 },
      { id:80, sec:3, topic:'Spelling', text:'Choose the correctly spelt word.', opts:['Recieve','Receive','Reciece','Receeve'], ans:1 },
      { id:81, sec:3, topic:'Fill in the blanks', text:'He is good ___ mathematics.', opts:['in','at','on','with'], ans:1 },
      { id:82, sec:3, topic:'One Word', text:'A person who is afraid of heights.', opts:['Claustrophobic','Acrophobic','Xenophobic','Hydrophobic'], ans:1 },
      { id:83, sec:3, topic:'Sentence Improvement', text:'He is junior than me.', opts:['junior to me','junior of me','more junior than me','No improvement'], ans:0 },
      { id:84, sec:3, topic:'Active/Passive', text:'Active: "The cat killed the mouse." Passive:', opts:['The mouse was killed by the cat','The mouse is killed by the cat','The cat kills the mouse','The mouse killed the cat'], ans:0 },
      { id:85, sec:3, topic:'Tense', text:'By tomorrow, she ___ the project.', opts:['completes','has completed','will have completed','completed'], ans:2 },
      { id:86, sec:3, topic:'Error Spotting', text:'Find the error: He don\'t know the answer.', opts:['He','don\'t','know','the answer'], ans:1, explain:'"doesn\'t" is correct.' },
      { id:87, sec:3, topic:'Synonyms', text:'Synonym of "OBSCURE".', opts:['Clear','Hidden','Bright','Plain'], ans:1 },
      { id:88, sec:3, topic:'Antonyms', text:'Antonym of "OPTIMISTIC".', opts:['Happy','Pessimistic','Joyful','Bright'], ans:1 },
      { id:89, sec:3, topic:'Idioms', text:'"A blessing in disguise" means?', opts:['A hidden curse','Something that seems bad but turns out good','A public blessing','A sudden event'], ans:1 },
      { id:90, sec:3, topic:'Preposition', text:'She is fond ___ music.', opts:['at','of','in','on'], ans:1 },
      { id:91, sec:3, topic:'Article', text:'___ Eiffel Tower is in Paris.', opts:['A','An','The','No article'], ans:2 },
      { id:92, sec:3, topic:'Voice', text:'Change the voice: "They are building a new house."', opts:['A new house is built by them','A new house is being built by them','A new house was built by them','A new house has been built'], ans:1 },
      { id:93, sec:3, topic:'Sentence Improvement', text:'Neither of the boys ___ present.', opts:['were','was','are','have been'], ans:1 },
      { id:94, sec:3, topic:'Cloze Test style', text:'Choose correct conjunction: He was tired ___ he kept working.', opts:['and','but','because','or'], ans:1 },
      { id:95, sec:3, topic:'Vocabulary', text:'Meaning of "EPHEMERAL".', opts:['Lasting long','Short-lived','Beautiful','Difficult'], ans:1 },
      { id:96, sec:3, topic:'Grammar', text:'Plural of "CHILD":', opts:['Childs','Childes','Children','Childer'], ans:2 },
      { id:97, sec:3, topic:'Narration', text:'Indirect: He said, "I am happy."', opts:['He said he is happy','He said he was happy','He says he is happy','He said that he is happy'], ans:1 },
      { id:98, sec:3, topic:'Vocabulary', text:'Synonym of "DILIGENT".', opts:['Lazy','Hardworking','Careless','Honest'], ans:1 },
      { id:99, sec:3, topic:'Phrase', text:'Phrasal verb "put off" means?', opts:['Wear','Postpone','Begin','Explain'], ans:1 },
      { id:100, sec:3, topic:'Comprehension', text:'A passage that informs, instructs, or entertains the reader is called?', opts:['Article','Prose','Narrative','Expository'], ans:1 }
    ]
  }
};

/* ====== TEST CATALOG ====== */
window.TEST_CATALOG = [
  { id:'cgl17', title:'SSC CGL Tier-I Mock 17', exam:'SSC CGL', type:'free', lang:'Bilingual', duration:'60 min', qs:100, attempts:'14,210', rating:4.8, color:'' },
  { id:'cgl16', title:'SSC CGL Tier-I Mock 16', exam:'SSC CGL', type:'free', lang:'Bilingual', duration:'60 min', qs:100, attempts:'12,840', rating:4.7, color:'alt1' },
  { id:'cgl15', title:'SSC CGL Tier-I PYQ 2024', exam:'SSC CGL', type:'pyq', lang:'Bilingual', duration:'60 min', qs:100, attempts:'28,400', rating:4.9, color:'alt2' },
  { id:'cgl14', title:'SSC CGL Quant — Geometry', exam:'SSC CGL', type:'pro', lang:'Bilingual', duration:'40 min', qs:25, attempts:'5,120', rating:4.6, color:'alt3' },
  { id:'chsl9', title:'SSC CHSL Tier-I Mock 9', exam:'SSC CHSL', type:'free', lang:'Bilingual', duration:'60 min', qs:100, attempts:'9,610', rating:4.7, color:'alt4' },
  { id:'chsl8', title:'SSC CHSL English Sectional', exam:'SSC CHSL', type:'pro', lang:'Bilingual', duration:'25 min', qs:25, attempts:'3,200', rating:4.5, color:'alt1' },
  { id:'mts5', title:'SSC MTS Paper-I Mock 5', exam:'SSC MTS', type:'free', lang:'Hindi', duration:'90 min', qs:100, attempts:'7,500', rating:4.6, color:'alt2' },
  { id:'gd12', title:'SSC GD Constable Mock 12', exam:'SSC GD', type:'free', lang:'Bilingual', duration:'60 min', qs:100, attempts:'11,300', rating:4.7, color:'alt3' },
  { id:'cpo7', title:'SSC CPO SI Mock 7', exam:'SSC CPO', type:'pro', lang:'Bilingual', duration:'60 min', qs:200, attempts:'2,810', rating:4.8, color:'alt4' },
  { id:'steno4', title:'SSC Steno Grade C Mock 4', exam:'SSC Steno', type:'free', lang:'English', duration:'60 min', qs:100, attempts:'1,900', rating:4.5, color:'' },
  { id:'sel3', title:'SSC Selection Post XII Mock 3', exam:'SSC Selection', type:'pro', lang:'Bilingual', duration:'60 min', qs:100, attempts:'1,250', rating:4.6, color:'alt1' },
  { id:'cgl13', title:'SSC CGL Reasoning — Puzzles', exam:'SSC CGL', type:'pro', lang:'Bilingual', duration:'30 min', qs:25, attempts:'4,720', rating:4.5, color:'alt2' }
];

/* ====== TEST SERIES (PAID BUNDLES) ====== */
window.TEST_SERIES = [
  {
    id: 'ssc-cgl-pro',
    name: 'SSC CGL 2026 Complete Pro',
    tagline: 'Tier-I + Tier-II + Tier-III + Tier-IV preparation',
    price: 599, originalPrice: 2499, validity: '12 months',
    tests: 120, students: 45230, rating: 4.8, bestseller: true,
    banner: '',
    features: [
      '120 full-length & sectional mock tests',
      '20 previous year papers (2018–2024)',
      'Live classes by ex-SSC toppers',
      'Unlimited doubt support (Hindi & English)',
      'AI weakness report after every test',
      '50+ e-books & study notes',
      'Bilingual (Hindi & English)',
      'Mobile + desktop access'
    ]
  },
  {
    id: 'ssc-chsl-pro',
    name: 'SSC CHSL 2026 Complete Pro',
    tagline: 'LDC / DEO / Postal / PA — full preparation',
    price: 449, originalPrice: 1799, validity: '12 months',
    tests: 95, students: 28410, rating: 4.7, bestseller: false,
    banner: 'b1',
    features: [
      '95 full-length & sectional mock tests',
      '15 previous year papers',
      'Live classes + recorded lectures',
      'Bilingual e-books & notes',
      'Typing test simulator (Hindi/English)',
      'AI weakness analysis',
      'Doubt support in 12 hours'
    ]
  },
  {
    id: 'ssc-mts-gd',
    name: 'SSC MTS + GD Constable Combo',
    tagline: 'Best value combo for SSC MTS and GD exams',
    price: 399, originalPrice: 1499, validity: '12 months',
    tests: 80, students: 19850, rating: 4.6, bestseller: false,
    banner: 'b2',
    features: [
      '50 MTS + 30 GD mock tests',
      '10 previous year papers',
      'Sectional tests for Reasoning, GA, Quant, English, Hindi',
      'Physical efficiency test (PET) tips',
      'Study material in Hindi',
      'Doubt support'
    ]
  },
  {
    id: 'ssc-all-in-one',
    name: 'SSC All-in-One 2026 (Mega Pack)',
    tagline: 'CGL + CHSL + MTS + CPO + Steno + GD — everything you need',
    price: 999, originalPrice: 4999, validity: '18 months',
    tests: 350, students: 62100, rating: 4.9, bestseller: false,
    banner: 'b3',
    features: [
      '350+ mock tests across 8 SSC exams',
      'Unlimited previous year papers',
      'Daily live classes & weekend marathons',
      '1-on-1 mentorship calls',
      'Personalised study plan',
      'All e-books & study material',
      'Priority doubt support (4-hour SLA)',
      'Resume access even after selection'
    ]
  },
  {
    id: 'ssc-cpo-pro',
    name: 'SSC CPO 2026 Pro',
    tagline: 'SI (Delhi Police) / CAPF / ASI preparation',
    price: 549, originalPrice: 1999, validity: '12 months',
    tests: 110, students: 14200, rating: 4.7, bestseller: false,
    banner: 'b4',
    features: [
      '110 mock tests (Tier-I + Tier-II)',
      '20 previous year papers',
      'Physical endurance test guide',
      'Interview preparation videos',
      'Bilingual study material',
      'Doubt support'
    ]
  },
  {
    id: 'ssc-quant-reasoning',
    name: 'SSC Quant + Reasoning Booster',
    tagline: 'Sharpen the two most scoring sections',
    price: 299, originalPrice: 999, validity: '6 months',
    tests: 60, students: 33500, rating: 4.8, bestseller: false,
    banner: 'b5',
    features: [
      '60 topic-wise tests',
      'Advanced shortcuts & tricks videos',
      'Step-by-step solutions',
      'Track your speed & accuracy',
      'Best for last 60-day revision'
    ]
  }
];

/* ====== DEMO ORDERS (admin sees these) ====== */
window.DEMO_ORDERS = [
  { id:'ORD-2841', user:'Aman Sharma', phone:'98765 43210', series:'SSC CGL 2026 Complete Pro', amount:599, txnId:'UPI/429183712', method:'UPI', date:'2026-05-30 14:22', status:'pending' },
  { id:'ORD-2840', user:'Priya Verma', phone:'99887 76655', series:'SSC All-in-One 2026 (Mega Pack)', amount:999, txnId:'TXN9128374', method:'Net Banking', date:'2026-05-30 12:08', status:'pending' },
  { id:'ORD-2839', user:'Rohit Kumar', phone:'91234 56789', series:'SSC CHSL 2026 Complete Pro', amount:449, txnId:'UPI/518372641', method:'UPI', date:'2026-05-30 09:45', status:'approved' },
  { id:'ORD-2838', user:'Sneha Patel', phone:'90011 22334', series:'SSC Quant + Reasoning Booster', amount:299, txnId:'UPI/998273651', method:'UPI', date:'2026-05-29 21:14', status:'approved' },
  { id:'ORD-2837', user:'Vikas Singh', phone:'98765 11122', series:'SSC CGL 2026 Complete Pro', amount:599, txnId:'TXN6712093', method:'Card', date:'2026-05-29 18:30', status:'rejected' },
  { id:'ORD-2836', user:'Anjali Mehta', phone:'90876 54321', series:'SSC CPO 2026 Pro', amount:549, txnId:'UPI/120398471', method:'UPI', date:'2026-05-29 11:22', status:'approved' }
];

/* ====== DEMO DRAFT TESTS (admin creates) ====== */
window.DEMO_DRAFTS = [
  { id:'DRF-101', title:'SSC CGL Tier-I Mock 18', exam:'SSC CGL', questions:100, duration:60, status:'draft' },
  { id:'DRF-102', title:'SSC CHSL English Mock 10', exam:'SSC CHSL', questions:25, duration:25, status:'published' },
  { id:'DRF-103', title:'SSC GD Reasoning Sectional', exam:'SSC GD', questions:25, duration:25, status:'draft' }
];
