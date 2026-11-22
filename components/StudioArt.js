// Original illustration created for WDB with native SVG shapes.
export function StudioArt({compact=false}){
  return <svg className={compact?'studio-art compact-art':'studio-art'} viewBox="0 0 660 440" role="img" aria-label="Illustration of a team building a digital dashboard">
    <defs>
      <linearGradient id="artWindow" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#e9f2ff"/></linearGradient>
      <linearGradient id="artLeaf" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dcb1ff"/><stop offset="1" stopColor="#9d6ceb"/></linearGradient>
    </defs>
    <ellipse cx="347" cy="397" rx="275" ry="21" fill="#1c2a94" opacity=".18"/>
    <path d="M190 373C92 353 80 301 111 238c23-46 0-94 43-112 59-24 63 55 88 65 44 18 40-70 88-54 54 18 4 92 50 131 38 32 20 87-2 105Z" fill="#b98af5" opacity=".65"/>
    <path d="M145 356c-53-71-70-124-45-132 23-8 62 48 75 76-30-87-9-130 12-116 24 15 36 89 27 146 25-94 56-106 70-88 18 25-20 87-47 119Z" fill="url(#artLeaf)"/>
    <path d="M174 354c-2-73-20-116-58-160m70 160c9-65 14-98 3-156m15 158c15-62 38-93 70-114" stroke="#f4d7ff" strokeWidth="3" fill="none" opacity=".8"/>
    <g transform="rotate(-2 410 206)">
      <rect x="233" y="62" width="402" height="270" rx="13" fill="#ff5c61"/>
      <rect x="224" y="55" width="402" height="270" rx="13" fill="url(#artWindow)"/>
      <path d="M237 55h376a13 13 0 0 1 13 13v25H224V68a13 13 0 0 1 13-13Z" fill="#ffad25"/>
      <circle cx="562" cy="74" r="5" fill="#fff"/><circle cx="583" cy="74" r="5" fill="#fff"/><circle cx="604" cy="74" r="5" fill="#fff"/>
      <rect x="244" y="111" width="151" height="100" rx="5" fill="#f7faff" stroke="#e1e9f4"/>
      <rect x="259" y="125" width="54" height="6" rx="3" fill="#c5d1e1"/><rect x="259" y="139" width="97" height="5" rx="2" fill="#e0e7f0"/>
      <path d="M259 192l21-24 21 9 22-25 22 11 31-20" fill="none" stroke="#fa84a9" strokeWidth="4"/>
      <rect x="409" y="111" width="91" height="100" rx="5" fill="#fff" stroke="#e1e9f4"/>
      <circle cx="455" cy="153" r="25" fill="none" stroke="#ecf1fa" strokeWidth="12"/><path d="M455 128a25 25 0 0 1 24 31" fill="none" stroke="#f980ae" strokeWidth="12"/>
      <rect x="513" y="111" width="95" height="100" rx="5" fill="#fff" stroke="#e1e9f4"/>
      <path d="M529 185v-31h10v31m8 0v-44h10v44m8 0v-20h10v20m8 0v-54h10v54" fill="#bdcce0"/>
      <rect x="244" y="225" width="167" height="77" rx="5" fill="#fff" stroke="#e1e9f4"/>
      <path d="M260 280l19-20 21 7 23-21 23 9 25-15 23 14" fill="none" stroke="#6f8cf5" strokeWidth="3"/>
      <rect x="424" y="225" width="184" height="77" rx="5" fill="#fff" stroke="#e1e9f4"/>
      <rect x="440" y="241" width="62" height="7" rx="3" fill="#c5d1e1"/><rect x="440" y="257" width="149" height="5" rx="2" fill="#e6ebf3"/><rect x="440" y="272" width="107" height="5" rx="2" fill="#e6ebf3"/>
    </g>
    <path d="M69 356c49-30 92-27 136-2 30 17 62 23 103 12-14 32-61 47-113 34-46-11-85 0-126-20Z" fill="#ff92b6"/>
    <circle cx="148" cy="260" r="17" fill="#ffbd8b"/><path d="M131 257c-3-15 8-23 20-20 11 3 13 12 10 19-10-2-17-8-19-14-3 7-6 11-11 15Z" fill="#242877"/>
    <path d="M132 279c16-10 34-4 44 10l17 43-40 14-29-42Z" fill="#6143bd"/>
    <path d="M166 289c11 5 24 17 34 25l27-10 4 8-28 19c-6 3-9 1-14-2l-25-16" fill="#ffbd8b"/>
    <path d="M160 344c-2 19-22 24-46 26l-27 11-7-6 25-18 27-21Z" fill="#202c83"/>
    <path d="M181 337c3 18 22 24 45 23l19 12-4 7-27-4c-31 2-49-4-61-19Z" fill="#2b328b"/>
    <path d="M182 312h69l-6 39h-59Z" fill="#34387e"/><path d="M182 351h70" stroke="#c2cfff" strokeWidth="4"/>
    <circle cx="469" cy="230" r="15" fill="#f6b58c"/><path d="M454 225c-3-17 21-24 30-9l-2 16c-6-1-11-6-14-12-4 5-8 7-14 5Z" fill="#252779"/>
    <path d="M451 248c13-8 33-6 40 8l-2 54-45 1 1-46Z" fill="#ff75a3"/>
    <path d="M450 257c-17-1-26-13-36-26l-6 5c7 18 19 37 35 42l12-4m33-13c13-9 24-21 30-36l7 4c-2 18-13 37-31 48l-9-5" fill="#f6b58c"/>
    <path d="M447 308l-1 55-8 31h12l15-32 7-35 5 36 14 31h12l-9-39-3-46Z" fill="#26317d"/>
    <path d="M438 394h13l-1 6h-20c0-3 4-5 8-6m53 0h12l7 6h-21Z" fill="#151c55"/>
  </svg>;
}
