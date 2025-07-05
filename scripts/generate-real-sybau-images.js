const fs = require('fs');
const path = require('path');

// 确保目录存在
const imagesDir = path.join(__dirname, '../public/images/blog');
const authorsDir = path.join(imagesDir, 'authors');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(authorsDir)) {
  fs.mkdirSync(authorsDir, { recursive: true });
}

// 基于真实Lazer Dim 700信息的更真实的SVG图片
const realSybauImages = {
  'sybau-comeback-story.svg': `
<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#16213e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#00ff88;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#00ff88;stop-opacity:0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="400" fill="url(#bg1)"/>

  <!-- Chaotic 808 waves (representing his signature sound) -->
  <path d="M0,200 Q100,150 200,200 T400,180 T600,220 T800,190" stroke="#00ff88" stroke-width="3" fill="none" opacity="0.7"/>
  <path d="M0,220 Q150,170 300,210 T600,190 T800,210" stroke="#ff0080" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M0,180 Q200,130 400,170 T800,160" stroke="#ffff00" stroke-width="2" fill="none" opacity="0.5"/>

  <!-- Microphone (representing his off-the-dome style) -->
  <g transform="translate(50,100)">
    <rect x="0" y="0" width="8" height="60" fill="#333" rx="4"/>
    <circle cx="4" cy="-10" r="15" fill="#666" stroke="#00ff88" stroke-width="2"/>
    <circle cx="4" cy="-10" r="8" fill="#00ff88" opacity="0.3"/>
  </g>

  <!-- BandLab app icon (he creates music using BandLab) -->
  <g transform="translate(100,50)">
    <rect x="0" y="0" width="40" height="40" fill="#ff6b35" rx="8"/>
    <circle cx="20" cy="20" r="12" fill="white"/>
    <circle cx="20" cy="20" r="6" fill="#ff6b35"/>
    <text x="20" y="55" text-anchor="middle" fill="#00ff88" font-size="8" font-family="Arial">BandLab</text>
  </g>

  <!-- Atlanta skyline silhouette -->
  <g transform="translate(200,250)">
    <rect x="0" y="0" width="20" height="80" fill="#1a1a2e"/>
    <rect x="25" y="20" width="15" height="60" fill="#1a1a2e"/>
    <rect x="45" y="10" width="25" height="70" fill="#1a1a2e"/>
    <rect x="75" y="30" width="18" height="50" fill="#1a1a2e"/>
    <rect x="98" y="5" width="22" height="75" fill="#1a1a2e"/>
    <rect x="125" y="25" width="16" height="55" fill="#1a1a2e"/>
    <rect x="146" y="15" width="20" height="65" fill="#1a1a2e"/>

    <!-- City lights -->
    <rect x="5" y="10" width="2" height="2" fill="#ffff00" opacity="0.8"/>
    <rect x="10" y="25" width="2" height="2" fill="#ffff00" opacity="0.8"/>
    <rect x="30" y="35" width="2" height="2" fill="#ffff00" opacity="0.8"/>
    <rect x="55" y="20" width="2" height="2" fill="#ffff00" opacity="0.8"/>
    <rect x="85" y="40" width="2" height="2" fill="#ffff00" opacity="0.8"/>
    <rect x="105" y="15" width="2" height="2" fill="#ffff00" opacity="0.8"/>
    <rect x="130" y="35" width="2" height="2" fill="#ffff00" opacity="0.8"/>
    <rect x="155" y="25" width="2" height="2" fill="#ffff00" opacity="0.8"/>
  </g>

  <!-- "LAZER DIM 700" text in his style -->
  <text x="400" y="100" text-anchor="middle" fill="#00ff88" font-size="32" font-family="Arial Black" font-weight="bold">LAZER DIM 700</text>
  <text x="400" y="130" text-anchor="middle" fill="#ff0080" font-size="14" font-family="Arial">COMEBACK STORY</text>

  <!-- Stream-of-consciousness visual (representing his no-hook style) -->
  <g transform="translate(500,150)">
    <circle cx="0" cy="0" r="3" fill="#00ff88"/>
    <circle cx="15" cy="5" r="2" fill="#ff0080"/>
    <circle cx="25" cy="-3" r="4" fill="#ffff00"/>
    <circle cx="40" cy="8" r="2" fill="#00ff88"/>
    <circle cx="55" cy="2" r="3" fill="#ff0080"/>
    <circle cx="70" cy="-5" r="2" fill="#ffff00"/>
    <circle cx="85" cy="10" r="4" fill="#00ff88"/>

    <!-- Connecting lines -->
    <path d="M0,0 L15,5 L25,-3 L40,8 L55,2 L70,-5 L85,10" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.5"/>
  </g>

  <!-- Phone icons (he used two phones to make music) -->
  <g transform="translate(600,200)">
    <rect x="0" y="0" width="25" height="45" fill="#333" rx="5"/>
    <rect x="2" y="5" width="21" height="30" fill="#000"/>
    <circle cx="12.5" cy="40" r="3" fill="#666"/>
    <text x="12.5" y="55" text-anchor="middle" fill="#00ff88" font-size="6">BEAT</text>
  </g>

  <g transform="translate(650,200)">
    <rect x="0" y="0" width="25" height="45" fill="#333" rx="5"/>
    <rect x="2" y="5" width="21" height="30" fill="#ff0080"/>
    <circle cx="12.5" cy="40" r="3" fill="#666"/>
    <text x="12.5" y="55" text-anchor="middle" fill="#ff0080" font-size="6">RECORD</text>
  </g>

  <!-- Cordele to Atlanta arrow -->
  <g transform="translate(50,300)">
    <text x="0" y="0" fill="#ffffff" font-size="10" font-family="Arial">Cordele, GA</text>
    <path d="M80,0 L150,0" stroke="#00ff88" stroke-width="2" marker-end="url(#arrowhead)"/>
    <text x="160" y="0" fill="#ffffff" font-size="10" font-family="Arial">Atlanta</text>
  </g>

  <!-- Arrow marker -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#00ff88"/>
    </marker>
  </defs>

  <!-- Glow effects -->
  <circle cx="400" cy="200" r="100" fill="url(#glow1)" opacity="0.3"/>
</svg>`,

  'sybau-motivation-guide.svg': `
<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2d1b69;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#11998e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#38ef7d;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="energy" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffff00;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#ffff00;stop-opacity:0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="400" fill="url(#bg2)"/>

  <!-- Trap music visualization -->
  <g transform="translate(100,200)">
    <!-- 808 bass pattern -->
    <rect x="0" y="0" width="8" height="40" fill="#ff0080" opacity="0.8"/>
    <rect x="20" y="10" width="8" height="30" fill="#ff0080" opacity="0.6"/>
    <rect x="40" y="5" width="8" height="35" fill="#ff0080" opacity="0.9"/>
    <rect x="60" y="15" width="8" height="25" fill="#ff0080" opacity="0.7"/>
    <rect x="80" y="0" width="8" height="40" fill="#ff0080" opacity="0.8"/>
    <rect x="100" y="8" width="8" height="32" fill="#ff0080" opacity="0.6"/>

    <!-- Hi-hat pattern -->
    <circle cx="10" cy="-10" r="2" fill="#ffff00"/>
    <circle cx="30" cy="-10" r="2" fill="#ffff00"/>
    <circle cx="50" cy="-10" r="2" fill="#ffff00"/>
    <circle cx="70" cy="-10" r="2" fill="#ffff00"/>
    <circle cx="90" cy="-10" r="2" fill="#ffff00"/>
    <circle cx="110" cy="-10" r="2" fill="#ffff00"/>
  </g>

  <!-- Motivational mountain climb -->
  <g transform="translate(300,250)">
    <path d="M0,100 L50,80 L100,60 L150,40 L200,20 L250,0" stroke="#ffffff" stroke-width="4" fill="none"/>
    <circle cx="0" cy="100" r="5" fill="#ff0080"/>
    <circle cx="250" cy="0" r="8" fill="#00ff88"/>
    <text x="125" y="130" text-anchor="middle" fill="#ffffff" font-size="12" font-family="Arial">GRIND TO SUCCESS</text>
  </g>

  <!-- "LAZER DIM 700" in graffiti style -->
  <text x="400" y="80" text-anchor="middle" fill="#ffff00" font-size="28" font-family="Arial Black" font-weight="bold" stroke="#000" stroke-width="1">LAZER DIM 700</text>
  <text x="400" y="110" text-anchor="middle" fill="#00ff88" font-size="16" font-family="Arial">MOTIVATION GUIDE</text>

  <!-- Plugg music elements -->
  <g transform="translate(50,50)">
    <rect x="0" y="0" width="60" height="40" fill="#333" rx="5"/>
    <rect x="5" y="5" width="50" height="30" fill="#000"/>
    <circle cx="15" cy="20" r="3" fill="#00ff88"/>
    <circle cx="30" cy="20" r="3" fill="#ff0080"/>
    <circle cx="45" cy="20" r="3" fill="#ffff00"/>
    <text x="30" y="55" text-anchor="middle" fill="#ffffff" font-size="8">PLUGG BEATS</text>
  </g>

  <!-- Success symbols -->
  <g transform="translate(600,100)">
    <!-- Crown -->
    <path d="M0,20 L10,0 L20,10 L30,0 L40,20 L35,30 L5,30 Z" fill="#ffff00" stroke="#ff0080" stroke-width="2"/>
    <circle cx="10" cy="5" r="2" fill="#ff0080"/>
    <circle cx="20" cy="15" r="2" fill="#ff0080"/>
    <circle cx="30" cy="5" r="2" fill="#ff0080"/>
  </g>

  <!-- Stream of consciousness flow -->
  <g transform="translate(200,150)">
    <path d="M0,0 Q50,-20 100,0 T200,10 T300,0" stroke="#00ff88" stroke-width="3" fill="none" opacity="0.8"/>
    <text x="150" y="-30" text-anchor="middle" fill="#ffffff" font-size="10">NO BREAKS, PURE FLOW</text>
  </g>

  <!-- Young Nudy x Playboi Carti influence -->
  <g transform="translate(50,350)">
    <text x="0" y="0" fill="#ff0080" font-size="12" font-family="Arial">"Young Nudy crossed with Playboi Carti"</text>
    <text x="0" y="15" fill="#ffffff" font-size="10" font-family="Arial">- Complex Magazine</text>
  </g>

  <!-- Energy burst -->
  <circle cx="400" cy="200" r="80" fill="url(#energy)" opacity="0.4"/>

  <!-- Maximalist elements (Lex Luger & Young Chop influence) -->
  <g transform="translate(500,250)">
    <rect x="0" y="0" width="4" height="60" fill="#ff0080"/>
    <rect x="8" y="10" width="4" height="50" fill="#00ff88"/>
    <rect x="16" y="5" width="4" height="55" fill="#ffff00"/>
    <rect x="24" y="15" width="4" height="45" fill="#ff0080"/>
    <rect x="32" y="0" width="4" height="60" fill="#00ff88"/>
    <rect x="40" y="20" width="4" height="40" fill="#ffff00"/>
    <text x="20" y="75" text-anchor="middle" fill="#ffffff" font-size="8">MAXIMALIST</text>
  </g>
</svg>`,

  'sybau-funny-moments.svg': `
<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fecfef;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fecfef;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="400" fill="url(#bg3)"/>

  <!-- SpongeBob reference (he sampled SpongeBob's laugh in "Injoyable") -->
  <g transform="translate(100,100)">
    <circle cx="0" cy="0" r="30" fill="#ffff00" stroke="#000" stroke-width="2"/>
    <circle cx="-8" cy="-8" r="4" fill="#000"/>
    <circle cx="8" cy="-8" r="4" fill="#000"/>
    <path d="M-10,8 Q0,15 10,8" stroke="#000" stroke-width="2" fill="none"/>
    <text x="0" y="45" text-anchor="middle" fill="#ff0080" font-size="10" font-family="Arial">"INJOYABLE" SAMPLE</text>

    <!-- Laugh bubbles -->
    <circle cx="40" cy="-20" r="3" fill="#ffffff" opacity="0.8"/>
    <circle cx="50" cy="-30" r="4" fill="#ffffff" opacity="0.6"/>
    <circle cx="60" cy="-25" r="2" fill="#ffffff" opacity="0.9"/>
    <text x="65" y="-20" fill="#ff0080" font-size="8">HA HA HA</text>
  </g>

  <!-- "LAZER DIM 700" in playful style -->
  <text x="400" y="80" text-anchor="middle" fill="#ff0080" font-size="32" font-family="Arial Black" font-weight="bold">LAZER DIM 700</text>
  <text x="400" y="110" text-anchor="middle" fill="#9b59b6" font-size="16" font-family="Arial">FUNNY MOMENTS</text>

  <!-- Chaotic 808s visualization -->
  <g transform="translate(300,200)">
    <circle cx="0" cy="0" r="15" fill="#ff0080" opacity="0.7"/>
    <circle cx="30" cy="10" r="12" fill="#9b59b6" opacity="0.8"/>
    <circle cx="60" cy="-5" r="18" fill="#ff0080" opacity="0.6"/>
    <circle cx="90" cy="15" r="10" fill="#9b59b6" opacity="0.9"/>
    <circle cx="120" cy="5" r="16" fill="#ff0080" opacity="0.7"/>

    <!-- Sound waves -->
    <path d="M0,0 Q15,20 30,10 Q45,-10 60,-5 Q75,25 90,15 Q105,-5 120,5" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8"/>
    <text x="60" y="50" text-anchor="middle" fill="#9b59b6" font-size="12" font-family="Arial">CHAOTIC 808s</text>
  </g>

  <!-- "Weirdo" beats reference -->
  <g transform="translate(500,150)">
    <rect x="0" y="0" width="80" height="50" fill="#9b59b6" rx="10" opacity="0.8"/>
    <text x="40" y="25" text-anchor="middle" fill="#ffffff" font-size="12" font-family="Arial">"WEIRDO"</text>
    <text x="40" y="40" text-anchor="middle" fill="#ffffff" font-size="12" font-family="Arial">BEATS</text>

    <!-- Musical notes -->
    <circle cx="90" cy="10" r="3" fill="#ff0080"/>
    <rect x="93" y="10" width="1" height="15" fill="#ff0080"/>
    <circle cx="100" cy="5" r="3" fill="#ff0080"/>
    <rect x="103" y="5" width="1" height="20" fill="#ff0080"/>
  </g>

  <!-- Brazilian funk influence -->
  <g transform="translate(50,250)">
    <text x="0" y="0" fill="#ff0080" font-size="14" font-family="Arial">🇧🇷 BRAZILIAN FUNK BASS</text>
    <rect x="0" y="10" width="200" height="20" fill="#00ff88" opacity="0.3"/>
    <rect x="10" y="12" width="8" height="16" fill="#ff0080"/>
    <rect x="30" y="14" width="8" height="12" fill="#ff0080"/>
    <rect x="50" y="11" width="8" height="18" fill="#ff0080"/>
    <rect x="70" y="15" width="8" height="10" fill="#ff0080"/>
    <rect x="90" y="12" width="8" height="16" fill="#ff0080"/>
  </g>

  <!-- Summer Smash performance -->
  <g transform="translate(600,250)">
    <rect x="0" y="0" width="100" height="60" fill="#333" rx="5"/>
    <text x="50" y="20" text-anchor="middle" fill="#ffff00" font-size="10" font-family="Arial">SUMMER SMASH</text>
    <text x="50" y="35" text-anchor="middle" fill="#ffffff" font-size="8" font-family="Arial">2024</text>
    <text x="50" y="50" text-anchor="middle" fill="#00ff88" font-size="8" font-family="Arial">PERFORMANCE</text>

    <!-- Crowd -->
    <circle cx="20" cy="70" r="2" fill="#ffff00"/>
    <circle cx="30" cy="70" r="2" fill="#ffff00"/>
    <circle cx="40" cy="70" r="2" fill="#ffff00"/>
    <circle cx="50" cy="70" r="2" fill="#ffff00"/>
    <circle cx="60" cy="70" r="2" fill="#ffff00"/>
    <circle cx="70" cy="70" r="2" fill="#ffff00"/>
    <circle cx="80" cy="70" r="2" fill="#ffff00"/>
  </g>

  <!-- Perpetual stream-of-consciousness -->
  <g transform="translate(200,350)">
    <path d="M0,0 L20,0 L25,-5 L35,5 L40,0 L60,0 L65,-5 L75,5 L80,0 L100,0" stroke="#9b59b6" stroke-width="3" fill="none"/>
    <text x="50" y="20" text-anchor="middle" fill="#9b59b6" font-size="10" font-family="Arial">NO HOOK, NO BREAK, JUST FLOW</text>
  </g>

  <!-- Laugh emojis -->
  <text x="150" y="50" font-size="24">😂</text>
  <text x="650" y="100" font-size="20">🤣</text>
  <text x="100" y="350" font-size="18">😭</text>
  <text x="700" y="350" font-size="22">💀</text>
</svg>`,

  'sybau-weird-culture.svg': `
<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>
    <filter id="glitch">
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="400" fill="url(#bg4)"/>

  <!-- Glitch effect title -->
  <text x="400" y="80" text-anchor="middle" fill="#00ff88" font-size="32" font-family="Arial Black" font-weight="bold" filter="url(#glitch)">LAZER DIM 700</text>
  <text x="402" y="82" text-anchor="middle" fill="#ff0080" font-size="32" font-family="Arial Black" font-weight="bold" opacity="0.7">LAZER DIM 700</text>
  <text x="400" y="110" text-anchor="middle" fill="#ffff00" font-size="16" font-family="Arial">WEIRD CULTURE</text>

  <!-- Internet/digital aesthetic -->
  <g transform="translate(50,150)">
    <!-- Computer/phone screens -->
    <rect x="0" y="0" width="60" height="40" fill="#000" rx="5"/>
    <rect x="5" y="5" width="50" height="25" fill="#00ff88"/>
    <rect x="10" y="10" width="40" height="15" fill="#000"/>
    <text x="30" y="20" text-anchor="middle" fill="#00ff88" font-size="6">BANDLAB</text>

    <rect x="80" y="10" width="40" height="60" fill="#333" rx="8"/>
    <rect x="85" y="15" width="30" height="45" fill="#ff0080"/>
    <circle cx="100" cy="70" r="3" fill="#666"/>
    <text x="100" y="85" text-anchor="middle" fill="#ffffff" font-size="6">PHONE 1</text>

    <rect x="130" y="10" width="40" height="60" fill="#333" rx="8"/>
    <rect x="135" y="15" width="30" height="45" fill="#ffff00"/>
    <circle cx="150" cy="70" r="3" fill="#666"/>
    <text x="150" y="85" text-anchor="middle" fill="#ffffff" font-size="6">PHONE 2</text>
  </g>

  <!-- Mysterious symbols and patterns -->
  <g transform="translate(300,150)">
    <!-- Sacred geometry meets trap -->
    <circle cx="0" cy="0" r="30" stroke="#00ff88" stroke-width="2" fill="none"/>
    <circle cx="0" cy="0" r="20" stroke="#ff0080" stroke-width="1" fill="none"/>
    <circle cx="0" cy="0" r="10" stroke="#ffff00" stroke-width="1" fill="none"/>

    <!-- Triangular patterns -->
    <path d="M0,-25 L22,12 L-22,12 Z" stroke="#ffffff" stroke-width="1" fill="none"/>
    <path d="M0,25 L-22,-12 L22,-12 Z" stroke="#ffffff" stroke-width="1" fill="none"/>

    <!-- Center dot -->
    <circle cx="0" cy="0" r="3" fill="#ffffff"/>
  </g>

  <!-- Subwoofer destruction visualization -->
  <g transform="translate(500,200)">
    <circle cx="0" cy="0" r="40" fill="#333" stroke="#ff0080" stroke-width="3"/>
    <circle cx="0" cy="0" r="25" fill="#000"/>
    <circle cx="0" cy="0" r="15" fill="#333"/>
    <circle cx="0" cy="0" r="8" fill="#ff0080"/>

    <!-- Sound waves -->
    <circle cx="0" cy="0" r="50" stroke="#ff0080" stroke-width="1" fill="none" opacity="0.5"/>
    <circle cx="0" cy="0" r="60" stroke="#ff0080" stroke-width="1" fill="none" opacity="0.3"/>
    <circle cx="0" cy="0" r="70" stroke="#ff0080" stroke-width="1" fill="none" opacity="0.1"/>

    <text x="0" y="55" text-anchor="middle" fill="#ffffff" font-size="8">SUBWOOFER</text>
    <text x="0" y="65" text-anchor="middle" fill="#ffffff" font-size="8">KILLER</text>
  </g>

  <!-- Weird song titles -->
  <g transform="translate(50,300)">
    <rect x="0" y="0" width="120" height="20" fill="#333" rx="10" opacity="0.8"/>
    <text x="60" y="13" text-anchor="middle" fill="#00ff88" font-size="8">"Greg Heffley"</text>

    <rect x="0" y="25" width="120" height="20" fill="#333" rx="10" opacity="0.8"/>
    <text x="60" y="38" text-anchor="middle" fill="#ff0080" font-size="8">"Fukk 26zombiez"</text>

    <rect x="0" y="50" width="120" height="20" fill="#333" rx="10" opacity="0.8"/>
    <text x="60" y="63" text-anchor="middle" fill="#ffff00" font-size="8">"Slithery Badge"</text>
  </g>

  <!-- Complex quote -->
  <g transform="translate(400,300)">
    <rect x="0" y="0" width="300" height="60" fill="#000" rx="10" opacity="0.7"/>
    <text x="150" y="20" text-anchor="middle" fill="#ffffff" font-size="10">"Atlanta's most chaotic</text>
    <text x="150" y="35" text-anchor="middle" fill="#ffffff" font-size="10">and fun new rapper"</text>
    <text x="150" y="50" text-anchor="middle" fill="#00ff88" font-size="8">- Complex</text>
  </g>

  <!-- Digital artifacts -->
  <rect x="200" y="50" width="2" height="20" fill="#ff0080" opacity="0.8"/>
  <rect x="600" y="100" width="3" height="15" fill="#00ff88" opacity="0.6"/>
  <rect x="100" y="200" width="1" height="25" fill="#ffff00" opacity="0.9"/>
  <rect x="700" y="250" width="2" height="18" fill="#ff0080" opacity="0.7"/>

  <!-- Mysterious eye -->
  <g transform="translate(650,150)">
    <ellipse cx="0" cy="0" rx="25" ry="15" fill="#333"/>
    <circle cx="0" cy="0" r="8" fill="#00ff88"/>
    <circle cx="0" cy="0" r="4" fill="#000"/>
    <circle cx="2" cy="-2" r="1" fill="#ffffff"/>
  </g>

  <!-- Data streams -->
  <g transform="translate(0,0)">
    <rect x="0" y="100" width="4" height="2" fill="#00ff88" opacity="0.8"/>
    <rect x="10" y="105" width="6" height="2" fill="#00ff88" opacity="0.6"/>
    <rect x="25" y="102" width="3" height="2" fill="#00ff88" opacity="0.9"/>
    <rect x="35" y="108" width="5" height="2" fill="#00ff88" opacity="0.7"/>
    <rect x="50" y="104" width="4" height="2" fill="#00ff88" opacity="0.8"/>
  </g>
</svg>`
};

// 作者头像（基于真实信息的风格）
const realAuthorAvatars = {
  'alex-weird.svg': `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="avatarBg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>

  <circle cx="50" cy="50" r="50" fill="url(#avatarBg1)"/>
  <circle cx="50" cy="50" r="45" fill="none" stroke="#00ff88" stroke-width="2"/>

  <!-- Face -->
  <circle cx="50" cy="45" r="25" fill="#ffdbac"/>

  <!-- Eyes -->
  <circle cx="42" cy="40" r="3" fill="#000"/>
  <circle cx="58" cy="40" r="3" fill="#000"/>
  <circle cx="43" cy="39" r="1" fill="#fff"/>
  <circle cx="59" cy="39" r="1" fill="#fff"/>

  <!-- Nose -->
  <circle cx="50" cy="47" r="1" fill="#ffb380"/>

  <!-- Mouth -->
  <path d="M45,52 Q50,57 55,52" stroke="#000" stroke-width="1" fill="none"/>

  <!-- Hair -->
  <path d="M30,35 Q50,15 70,35" fill="#4a4a4a"/>

  <!-- Headphones (representing music production) -->
  <rect x="25" y="35" width="8" height="15" fill="#333" rx="4"/>
  <rect x="67" y="35" width="8" height="15" fill="#333" rx="4"/>
  <path d="M33,42 Q50,30 67,42" stroke="#333" stroke-width="3" fill="none"/>

  <!-- Text -->
  <text x="50" y="85" text-anchor="middle" fill="#ffffff" font-size="8" font-family="Arial">WEIRD CULTURE</text>
  <text x="50" y="95" text-anchor="middle" fill="#00ff88" font-size="6" font-family="Arial">EXPERT</text>
</svg>`,

  'chris-martinez.svg': `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="avatarBg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fecfef;stop-opacity:1" />
    </linearGradient>
  </defs>

  <circle cx="50" cy="50" r="50" fill="url(#avatarBg2)"/>
  <circle cx="50" cy="50" r="45" fill="none" stroke="#ff0080" stroke-width="2"/>

  <!-- Face -->
  <circle cx="50" cy="45" r="25" fill="#d4a574"/>

  <!-- Eyes -->
  <circle cx="42" cy="40" r="3" fill="#000"/>
  <circle cx="58" cy="40" r="3" fill="#000"/>
  <circle cx="43" cy="39" r="1" fill="#fff"/>
  <circle cx="59" cy="39" r="1" fill="#fff"/>

  <!-- Smile -->
  <path d="M42,50 Q50,58 58,50" stroke="#000" stroke-width="2" fill="none"/>

  <!-- Hair -->
  <path d="M28,32 Q50,12 72,32" fill="#2c1810"/>

  <!-- Microphone -->
  <rect x="70" y="55" width="6" height="20" fill="#333" rx="3"/>
  <circle cx="73" cy="50" r="5" fill="#666" stroke="#ff0080" stroke-width="1"/>

  <!-- Musical notes -->
  <circle cx="20" cy="30" r="2" fill="#ff0080"/>
  <rect x="22" y="30" width="1" height="8" fill="#ff0080"/>
  <circle cx="80" cy="25" r="2" fill="#ff0080"/>
  <rect x="82" y="25" width="1" height="8" fill="#ff0080"/>

  <text x="50" y="85" text-anchor="middle" fill="#ffffff" font-size="8" font-family="Arial">COMEDY</text>
  <text x="50" y="95" text-anchor="middle" fill="#ff0080" font-size="6" font-family="Arial">SPECIALIST</text>
</svg>`,

  'jake-chen.svg': `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="avatarBg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2d1b69;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#11998e;stop-opacity:1" />
    </linearGradient>
  </defs>

  <circle cx="50" cy="50" r="50" fill="url(#avatarBg3)"/>
  <circle cx="50" cy="50" r="45" fill="none" stroke="#00ff88" stroke-width="2"/>

  <!-- Face -->
  <circle cx="50" cy="45" r="25" fill="#f4c2a1"/>

  <!-- Eyes -->
  <circle cx="42" cy="40" r="3" fill="#000"/>
  <circle cx="58" cy="40" r="3" fill="#000"/>
  <circle cx="43" cy="39" r="1" fill="#fff"/>
  <circle cx="59" cy="39" r="1" fill="#fff"/>

  <!-- Determined expression -->
  <path d="M45,52 L55,52" stroke="#000" stroke-width="2"/>

  <!-- Hair -->
  <path d="M30,30 Q50,10 70,30" fill="#1a1a1a"/>

  <!-- Success symbols -->
  <path d="M20,20 L25,10 L30,15 L35,10 L40,20 L35,25 L25,25 Z" fill="#ffff00" stroke="#00ff88" stroke-width="1"/>
  <path d="M60,20 L65,10 L70,15 L75,10 L80,20 L75,25 L65,25 Z" fill="#ffff00" stroke="#00ff88" stroke-width="1"/>

  <!-- Upward arrow -->
  <path d="M50,65 L50,75 M45,70 L50,65 L55,70" stroke="#00ff88" stroke-width="2" fill="none"/>

  <text x="50" y="85" text-anchor="middle" fill="#ffffff" font-size="8" font-family="Arial">SUCCESS</text>
  <text x="50" y="95" text-anchor="middle" fill="#00ff88" font-size="6" font-family="Arial">COACH</text>
</svg>`,

  'maya-rodriguez.svg': `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="avatarBg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
  </defs>

  <circle cx="50" cy="50" r="50" fill="url(#avatarBg4)"/>
  <circle cx="50" cy="50" r="45" fill="none" stroke="#ffff00" stroke-width="2"/>

  <!-- Face -->
  <circle cx="50" cy="45" r="25" fill="#e8b4a0"/>

  <!-- Eyes -->
  <circle cx="42" cy="40" r="3" fill="#000"/>
  <circle cx="58" cy="40" r="3" fill="#000"/>
  <circle cx="43" cy="39" r="1" fill="#fff"/>
  <circle cx="59" cy="39" r="1" fill="#fff"/>

  <!-- Confident smile -->
  <path d="M43,50 Q50,56 57,50" stroke="#000" stroke-width="2" fill="none"/>

  <!-- Hair -->
  <path d="M28,35 Q50,15 72,35" fill="#8b4513"/>

  <!-- Phoenix/comeback symbol -->
  <g transform="translate(50,20) scale(0.3)">
    <path d="M0,-20 Q-10,-10 -5,0 Q0,10 5,0 Q10,-10 0,-20" fill="#ff0080"/>
    <path d="M-8,-15 Q0,-5 8,-15" stroke="#ffff00" stroke-width="2" fill="none"/>
    <path d="M-6,-12 Q0,-8 6,-12" stroke="#ffff00" stroke-width="1" fill="none"/>
  </g>

  <!-- Rising arrow -->
  <path d="M20,70 L30,60 M25,65 L30,60 L35,65" stroke="#ffff00" stroke-width="2" fill="none"/>
  <path d="M70,70 L80,60 M75,65 L80,60 L85,65" stroke="#ffff00" stroke-width="2" fill="none"/>

  <text x="50" y="85" text-anchor="middle" fill="#ffffff" font-size="8" font-family="Arial">COMEBACK</text>
  <text x="50" y="95" text-anchor="middle" fill="#ffff00" font-size="6" font-family="Arial">QUEEN</text>
</svg>`
};

// 保存所有图片
console.log('正在生成真实的Sybau Lazer Dim 700风格图片...');

// 保存博客图片
Object.entries(realSybauImages).forEach(([filename, svgContent]) => {
  const filePath = path.join(imagesDir, filename);
  fs.writeFileSync(filePath, svgContent.trim());
  console.log(`✓ 已生成博客图片: ${filename}`);
});

// 保存作者头像
Object.entries(realAuthorAvatars).forEach(([filename, svgContent]) => {
  const filePath = path.join(authorsDir, filename);
  fs.writeFileSync(filePath, svgContent.trim());
  console.log(`✓ 已生成作者头像: ${filename}`);
});

console.log('\n🎉 所有真实Sybau Lazer Dim 700风格图片生成完成！');
console.log('基于真实信息：');
console.log('- Lazer Dim 700 (Devokeyous Keyshawn Hamilton)');
console.log('- 来自Georgia Cordele，现在在Atlanta');
console.log('- 使用BandLab制作音乐');
console.log('- 以"off-the-dome"说唱风格著名');
console.log('- 混乱的808s和maximalist制作风格');
console.log('- 曾在Summer Smash 2024表演');
console.log('- 受Young Nudy和Playboi Carti影响');
console.log('- 在"Injoyable"中采样了SpongeBob的笑声');
