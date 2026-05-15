// ui.jsx — shared UI primitives + icons for Delicias Ayumi

// ── Icons (line, 1.5px, currentColor) ────────────────────────────
const Icon = ({ name, size = 18, ...rest }) => {
  const paths = {
    bag:        <><path d="M5 7h14l-1.2 12.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></>,
    search:     <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    plus:       <><path d="M12 5v14M5 12h14"/></>,
    minus:      <><path d="M5 12h14"/></>,
    close:      <><path d="M6 6l12 12M6 18 18 6"/></>,
    arrow:      <><path d="M5 12h14m-5-5 5 5-5 5"/></>,
    back:       <><path d="M19 12H5m5 5-5-5 5-5"/></>,
    cart:       <><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.5 11.5A2 2 0 0 0 9.5 17H18l2-9H6"/></>,
    pin:        <><path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></>,
    clock:      <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    insta:      <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></>,
    wpp:        <><path d="M20 12a8 8 0 1 1-15.3 3.3L4 20l4.8-.7A8 8 0 0 1 20 12Z"/><path d="M8.5 10.5c.4 2 2 3.6 4 4 .8.2 1.6-.2 1.8-.9l.3-.8-1.8-.8-.6.7c-.9-.3-1.6-1-1.9-1.9l.7-.6-.8-1.8-.8.3c-.7.2-1.1 1-.9 1.8Z"/></>,
    home:       <><path d="M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9Z"/></>,
    box:        <><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"/><path d="M3 7.5 12 12m0 0 9-4.5M12 12v9"/></>,
    receipt:    <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    cash:       <><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9v.01M18 15v.01"/></>,
    calc:       <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h4"/></>,
    chart:      <><path d="M4 19h16"/><path d="M7 16V9m5 7V5m5 11v-4"/></>,
    star:       <><path d="m12 3 2.7 5.6 6.2.9-4.5 4.3 1.1 6.2L12 17l-5.5 3 1.1-6.2L3 9.5l6.2-.9L12 3Z"/></>,
    edit:       <><path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="m14 6 4 4"/></>,
    trash:      <><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"/></>,
    sun:        <><circle cx="12" cy="12" r="4"/><path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m9.9 9.9 1.4 1.4M5.6 18.4 7 17m9.9-9.9 1.4-1.4"/></>,
    moon:       <><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/></>,
    check:      <><path d="m5 12 5 5 9-11"/></>,
    user:       <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    filter:     <><path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z"/></>,
    truck:      <><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
    leaf:       <><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z"/><path d="M5 19 14 10"/></>,
    package:    <><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"/></>,
    arrow_down: <><path d="M12 5v14m-5-5 5 5 5-5"/></>,
    arrow_up:   <><path d="M12 19V5m-5 5 5-5 5 5"/></>,
    settings:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .4 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.4 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .4-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.4H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.4 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></>,
    grid:       <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    list:       <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></>,
    sparkle:    <><path d="M12 3v6m0 6v6M3 12h6m6 0h6M6 6l3 3m6 6 3 3M6 18l3-3m6-6 3-3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden="true" {...rest}>
      {paths[name] || null}
    </svg>
  );
};

// ── Button ───────────────────────────────────────────────────────
const Button = ({ children, variant = "primary", size = "md", icon, iconRight, onClick, type, disabled, full, style, ...rest }) => {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "var(--font-ui)", fontWeight: 500, letterSpacing: "0.005em",
    borderRadius: "var(--r-sm)",
    transition: "transform .12s ease, background .15s ease, border-color .15s ease, color .15s ease",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    width: full ? "100%" : "auto",
    border: "1px solid transparent",
    whiteSpace: "nowrap",
  };
  const sizes = {
    sm: { padding: "6px 12px", fontSize: 13, height: 32 },
    md: { padding: "9px 16px", fontSize: 14, height: 40 },
    lg: { padding: "12px 22px", fontSize: 15, height: 48 },
  };
  const variants = {
    primary: { background: "var(--c-primary)", color: "#fff", boxShadow: "var(--shadow-sm)" },
    dark:    { background: "var(--c-fg)", color: "var(--c-bg)" },
    ghost:   { color: "var(--c-fg)", border: "1px solid var(--c-line)", background: "transparent" },
    soft:    { color: "var(--c-fg)", background: "var(--c-surface-2)" },
    link:    { color: "var(--c-primary)", padding: "0", height: "auto" },
    danger:  { color: "var(--c-danger)", background: "var(--c-danger-soft)", border: "1px solid transparent" },
  };
  return (
    <button type={type || "button"} onClick={onClick} disabled={disabled}
            style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={e => e.currentTarget.style.transform = "none"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
            {...rest}>
      {icon && <Icon name={icon} size={size === "lg" ? 18 : 16}/>}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 18 : 16}/>}
    </button>
  );
};

// ── Card / Surface ───────────────────────────────────────────────
const Card = ({ children, style, padded = true, hoverable = false, onClick, ...rest }) => (
  <div onClick={onClick}
       style={{
         background: "var(--c-surface)",
         border: "1px solid var(--c-line-soft)",
         borderRadius: "var(--r-lg)",
         padding: padded ? "calc(20px * var(--space))" : 0,
         transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
         cursor: hoverable || onClick ? "pointer" : "default",
         ...style,
       }}
       onMouseEnter={hoverable ? e => {
         e.currentTarget.style.boxShadow = "var(--shadow-md)";
         e.currentTarget.style.borderColor = "var(--c-line)";
       } : undefined}
       onMouseLeave={hoverable ? e => {
         e.currentTarget.style.boxShadow = "none";
         e.currentTarget.style.borderColor = "var(--c-line-soft)";
       } : undefined}
       {...rest}>
    {children}
  </div>
);

// ── Tag ─────────────────────────────────────────────────────────
const Tag = ({ children, tone = "neutral", style }) => {
  const tones = {
    neutral: { color: "var(--c-fg-soft)", background: "var(--c-surface-2)", border: "1px solid var(--c-line-soft)" },
    primary: { color: "var(--c-primary)", background: "var(--c-primary-soft)", border: "1px solid transparent" },
    accent:  { color: "oklch(0.4 0.09 145)", background: "var(--c-accent-soft)", border: "1px solid transparent" },
    danger:  { color: "var(--c-danger)", background: "var(--c-danger-soft)", border: "1px solid transparent" },
    warn:    { color: "oklch(0.45 0.1 70)", background: "oklch(0.96 0.05 80)", border: "1px solid transparent" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 999,
      fontSize: 11, fontWeight: 500, letterSpacing: "0.04em",
      textTransform: "uppercase",
      ...tones[tone], ...style,
    }}>{children}</span>
  );
};

// ── Input ───────────────────────────────────────────────────────
const Input = React.forwardRef(({ label, hint, prefix, suffix, error, style, wrapperStyle, ...rest }, ref) => {
  const id = React.useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...wrapperStyle }}>
      {label && <label htmlFor={id} style={{ fontSize: 12, fontWeight: 500, color: "var(--c-fg-soft)", letterSpacing: "0.02em" }}>{label}</label>}
      <div style={{
        display: "flex", alignItems: "center",
        background: "var(--c-surface)",
        border: `1px solid ${error ? "var(--c-danger)" : "var(--c-line)"}`,
        borderRadius: "var(--r-sm)",
        transition: "border-color .15s ease, box-shadow .15s ease",
        ...style,
      }}>
        {prefix && <span style={{ paddingLeft: 12, color: "var(--c-fg-muted)", fontSize: 13 }}>{prefix}</span>}
        <input ref={ref} id={id} {...rest}
               style={{ flex: 1, padding: "10px 12px", background: "transparent", border: 0, outline: "none", fontSize: 14, color: "var(--c-fg)", minWidth: 0 }}/>
        {suffix && <span style={{ paddingRight: 12, color: "var(--c-fg-muted)", fontSize: 13 }}>{suffix}</span>}
      </div>
      {hint && !error && <span style={{ fontSize: 11, color: "var(--c-fg-muted)" }}>{hint}</span>}
      {error && <span style={{ fontSize: 11, color: "var(--c-danger)" }}>{error}</span>}
    </div>
  );
});

// Plain textarea
const Textarea = ({ label, rows = 3, ...rest }) => {
  const id = React.useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label htmlFor={id} style={{ fontSize: 12, fontWeight: 500, color: "var(--c-fg-soft)" }}>{label}</label>}
      <textarea id={id} rows={rows} {...rest}
                style={{
                  padding: "10px 12px", background: "var(--c-surface)",
                  border: "1px solid var(--c-line)", borderRadius: "var(--r-sm)",
                  outline: "none", fontSize: 14, color: "var(--c-fg)",
                  fontFamily: "inherit", resize: "vertical",
                }}/>
    </div>
  );
};

// Select
const Select = ({ label, options, value, onChange, style }) => {
  const id = React.useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <label htmlFor={id} style={{ fontSize: 12, fontWeight: 500, color: "var(--c-fg-soft)" }}>{label}</label>}
      <select id={id} value={value} onChange={e => onChange(e.target.value)}
              style={{
                padding: "10px 12px", background: "var(--c-surface)",
                border: "1px solid var(--c-line)", borderRadius: "var(--r-sm)",
                fontSize: 14, color: "var(--c-fg)", appearance: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                paddingRight: 36,
              }}>
        {options.map(o => typeof o === "string"
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
};

// ── Product imagery placeholder (deterministic) ──────────────────
const ProductImage = ({ product, ratio = "4/3", style }) => {
  const sw = product.swatch || ["#f4a261", "#a0522d", "#fff3d6"];
  const [c1, c2, c3 = "#fff5e0"] = sw;
  const id = product.id;
  return (
    <div className="ph-img" style={{ aspectRatio: ratio, borderRadius: "var(--r-md)", ...style }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" width="100%" height="100%"
           style={{ position: "absolute", inset: 0, display: "block" }}>
        <defs>
          <radialGradient id={`g-${id}`} cx="35%" cy="30%" r="95%">
            <stop offset="0" stopColor={c3} stopOpacity="0.9" />
            <stop offset="0.55" stopColor={c1} stopOpacity="0.92" />
            <stop offset="1" stopColor={c2} stopOpacity="0.95" />
          </radialGradient>
          <linearGradient id={`v-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.18"/>
            <stop offset="1" stopColor="#000" stopOpacity="0.18"/>
          </linearGradient>
          <radialGradient id={`p-${id}`} cx="50%" cy="55%" r="38%">
            <stop offset="0" stopColor={c3} stopOpacity="0.4"/>
            <stop offset="1" stopColor={c2} stopOpacity="0"/>
          </radialGradient>
          <pattern id={`tx-${id}`} width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.4" fill={c2} fillOpacity="0.18"/>
          </pattern>
        </defs>
        {/* Background */}
        <rect width="100" height="100" fill={`url(#g-${id})`} />
        <rect width="100" height="100" fill={`url(#v-${id})`} />
        {/* Center "dish" — plate ring */}
        <ellipse cx="50" cy="58" rx="34" ry="32" fill={c3} fillOpacity="0.65"
                 stroke={c2} strokeOpacity="0.25" strokeWidth="0.5"/>
        {/* Food blob */}
        <ellipse cx="50" cy="56" rx="26" ry="24" fill={c2} fillOpacity="0.55"/>
        <ellipse cx="50" cy="54" rx="22" ry="20" fill={c1} fillOpacity="0.9"/>
        <rect width="100" height="100" fill={`url(#tx-${id})`} />
        {/* Highlight */}
        <ellipse cx="42" cy="44" rx="11" ry="6" fill={c3} fillOpacity="0.7"/>
        {/* Soft top vignette */}
        <ellipse cx="50" cy="58" rx="34" ry="32" fill={`url(#p-${id})`} />
      </svg>
      <span className="ph-label">{product.cat}</span>
    </div>
  );
};

// ── Modal ───────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, footer, width = 560 }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "oklch(0.18 0.012 55 / 0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "vFade .2s ease both",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
           style={{
             background: "var(--c-bg)", border: "1px solid var(--c-line)",
             borderRadius: "var(--r-lg)", width: "100%", maxWidth: width,
             maxHeight: "92vh", display: "flex", flexDirection: "column",
             boxShadow: "var(--shadow-lg)",
           }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 22px", borderBottom: "1px solid var(--c-line-soft)",
        }}>
          <h3 className="serif" style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 6, color: "var(--c-fg-soft)" }}>
            <Icon name="close" size={18}/>
          </button>
        </div>
        <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>{children}</div>
        {footer && (
          <div style={{
            padding: "14px 22px", borderTop: "1px solid var(--c-line-soft)",
            display: "flex", justifyContent: "flex-end", gap: 8,
          }}>{footer}</div>
        )}
      </div>
    </div>
  );
};

// ── Stat / KPI ───────────────────────────────────────────────────
const Stat = ({ label, value, delta, deltaTone = "accent", caption, icon }) => (
  <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <span style={{ fontSize: 12, color: "var(--c-fg-muted)", letterSpacing: "0.02em", textTransform: "uppercase" }}>{label}</span>
      {icon && (
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "var(--c-primary-soft)", color: "var(--c-primary)",
          display: "grid", placeItems: "center",
        }}>
          <Icon name={icon} size={16}/>
        </div>
      )}
    </div>
    <div className="serif" style={{ fontSize: 32, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.01em" }}>{value}</div>
    {(delta || caption) && (
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--c-fg-muted)" }}>
        {delta && <Tag tone={deltaTone} style={{ textTransform: "none", letterSpacing: 0, fontSize: 11 }}>{delta}</Tag>}
        {caption && <span>{caption}</span>}
      </div>
    )}
  </Card>
);

// ── Logo / wordmark ──────────────────────────────────────────────
const Logo = ({ size = 44, mono = false, withWordmark = true }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
    <img src="assets/logo-ayumi.png" alt="Delicias Ayumi"
         width={size} height={size}
         style={{
           width: size, height: size, borderRadius: "50%",
           filter: mono ? "grayscale(1) brightness(1.5)" : "none",
           boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
           flexShrink: 0,
         }}/>
    {withWordmark && (
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, whiteSpace: "nowrap" }}>
        <span style={{
          fontFamily: '"Caveat", "Sacramento", cursive',
          fontSize: size * 0.7, fontWeight: 700,
          color: mono ? "currentColor" : "var(--c-primary)",
          letterSpacing: "0.005em",
        }}>
          Delicias Ayumi
        </span>
        <span style={{
          fontFamily: "var(--font-ui)", fontSize: Math.max(9, size * 0.21), fontWeight: 500,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: mono ? "currentColor" : "var(--c-accent)",
          marginTop: 4, opacity: 0.85,
        }}>
          Feito com amor
        </span>
      </div>
    )}
  </div>
);

// ── Section header ───────────────────────────────────────────────
const SectionTitle = ({ eyebrow, title, sub, align = "left", style }) => (
  <div style={{ textAlign: align, display: "flex", flexDirection: "column", gap: 8, ...style }}>
    {eyebrow && (
      <span style={{
        fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
        color: "var(--c-primary)", fontWeight: 600,
      }}>{eyebrow}</span>
    )}
    <h2 className="serif" style={{ margin: 0, fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.015em" }}>{title}</h2>
    {sub && <p className="soft" style={{ margin: 0, fontSize: 15, maxWidth: 620, textWrap: "pretty" }}>{sub}</p>}
  </div>
);

Object.assign(window, {
  Icon, Button, Card, Tag, Input, Textarea, Select,
  ProductImage, Modal, Stat, Logo, SectionTitle,
});
