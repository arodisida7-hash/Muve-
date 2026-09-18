"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, BarChart3, CalendarDays, Check, ChevronRight,
  CircleUserRound, Clock3, Download, Dumbbell, FileText, FolderHeart,
  Gauge, Home, LineChart, Menu, Pause, Play, Plus, Search, ShieldCheck,
  SkipBack, SkipForward, Sparkles, Target, TrendingUp, UsersRound, X,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

type View = "inicio" | "pacientes" | "analisis" | "evolucion" | "plan" | "reportes";

const nav = [
  { id: "inicio" as View, label: "Inicio", icon: Home },
  { id: "pacientes" as View, label: "Pacientes", icon: UsersRound },
  { id: "analisis" as View, label: "Análisis", icon: Activity },
  { id: "evolucion" as View, label: "Evolución", icon: LineChart },
  { id: "plan" as View, label: "Plan terapéutico", icon: Dumbbell },
  { id: "reportes" as View, label: "Reportes", icon: FileText },
];

const progress = [
  { fecha: "12 Jun", rodilla: 128, simetria: 71 },
  { fecha: "26 Jun", rodilla: 133, simetria: 76 },
  { fecha: "10 Jul", rodilla: 137, simetria: 82 },
  { fecha: "24 Jul", rodilla: 141, simetria: 88 },
  { fecha: "07 Ago", rodilla: 145, simetria: 93 },
];

const patients = [
  ["Paciente 001", "Dolor femoropatelar", "Hoy", "En seguimiento"],
  ["Paciente 002", "Movilidad de tobillo", "15 ago", "Activo"],
  ["Paciente 003", "Retorno a carrera", "12 ago", "Activo"],
  ["Paciente 004", "Control postural", "8 ago", "Reevaluar"],
];

export default function HomePage() {
  const [view, setView] = useState<View>("analisis");
  const [mobile, setMobile] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(46);
  const [compare, setCompare] = useState(false);
  const [saved, setSaved] = useState(false);
  const [report, setReport] = useState(false);
  const [search, setSearch] = useState("");
  const [done, setDone] = useState<number[]>([0]);

  useEffect(() => {
    const context = (document as unknown as { modelContext?: { registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: unknown) => Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined);
    void register({
      name: "open_clinical_section",
      title: "Abrir sección clínica",
      description: "Navega la demo hacia análisis, evolución, plan terapéutico, pacientes, reportes o inicio.",
      inputSchema: { type: "object", properties: { section: { type: "string", enum: ["inicio", "pacientes", "analisis", "evolucion", "plan", "reportes"] } }, required: ["section"], additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input: unknown) { const section = (input as { section?: View }).section; if (!section || !nav.some(n => n.id === section)) throw new Error("Sección no válida"); setView(section); return { section, status: "opened" }; },
    });
    void register({
      name: "save_demo_evaluation",
      title: "Guardar evaluación demo",
      description: "Guarda la evaluación biomecánica ficticia visible en la demo.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute() { setView("analisis"); setSaved(true); return { patient: "Paciente 001", status: "saved", demo: true }; },
    });
    void register({
      name: "generate_demo_report",
      title: "Generar reporte demo",
      description: "Abre Reportes y completa la generación simulada del PDF del Paciente 001.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute() { setView("reportes"); setReport(true); return { patient: "Paciente 001", status: "generated", format: "PDF", demo: true }; },
    });
    return () => lifecycle.abort();
  }, []);

  const visiblePatients = useMemo(() => patients.filter((p) => p.join(" ").toLowerCase().includes(search.toLowerCase())), [search]);

  function go(next: View) {
    setView(next);
    setMobile(false);
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobile ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><span>M</span></div>
          <div><strong>MUVE</strong><small>FISIOTERAPIA</small></div>
          <button className="close-mobile" onClick={() => setMobile(false)} aria-label="Cerrar menú"><X size={20} /></button>
        </div>
        <div className="nav-label">PLATAFORMA CLÍNICA</div>
        <nav>
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} className={view === id ? "nav-active" : ""} onClick={() => go(id)}>
              <Icon size={19} /><span>{label}</span>{view === id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-card">
          <Sparkles size={18} />
          <strong>Demo comercial</strong>
          <p>Datos ficticios para visualizar el potencial de la plataforma.</p>
        </div>
        <div className="profile-mini">
          <div className="avatar">NH</div><div><strong>Nahum H.</strong><span>Fisioterapeuta</span></div><ChevronRight size={17} />
        </div>
      </aside>

      {mobile && <button className="backdrop" aria-label="Cerrar menú" onClick={() => setMobile(false)} />}

      <section className="workspace">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobile(true)} aria-label="Abrir menú"><Menu /></button>
          <div className="search-global"><Search size={17} /><input aria-label="Buscar" placeholder="Buscar paciente, expediente o reporte..." /></div>
          <div className="top-actions"><span className="demo-pill"><span /> DEMO · DATOS FICTICIOS</span><button className="primary" onClick={() => go("analisis")}><Plus size={17} /> Nueva evaluación</button></div>
        </header>

        <div className="content">
          {view === "inicio" && <Dashboard go={go} />}
          {view === "pacientes" && <Patients search={search} setSearch={setSearch} patients={visiblePatients} go={go} />}
          {view === "analisis" && <Analysis playing={playing} setPlaying={setPlaying} frame={frame} setFrame={setFrame} compare={compare} setCompare={setCompare} saved={saved} setSaved={setSaved} />}
          {view === "evolucion" && <Evolution />}
          {view === "plan" && <Plan done={done} setDone={setDone} />}
          {view === "reportes" && <Reports generated={report} setGenerated={setReport} />}
        </div>
      </section>
    </main>
  );
}

function PageHead({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function PatientChip() {
  return <div className="patient-chip"><div className="avatar photo">P1</div><div><strong>Paciente 001</strong><span>29 años · Corredora recreativa</span></div><ChevronRight size={17} /></div>;
}

function Dashboard({ go }: { go: (v: View) => void }) {
  return <>
    <PageHead eyebrow="MIÉRCOLES, 19 DE AGOSTO" title="Buen día, Nahum" description="Tienes 4 sesiones programadas y una evaluación por completar." action={<button className="outline"><CalendarDays size={17} /> Ver agenda</button>} />
    <div className="stats-grid">
      <Stat icon={UsersRound} value="48" label="Pacientes activos" note="+6 este mes" />
      <Stat icon={Activity} value="12" label="Evaluaciones" note="Últimos 30 días" />
      <Stat icon={TrendingUp} value="87%" label="Progreso promedio" note="+9% vs. periodo anterior" />
      <Stat icon={FileText} value="9" label="Reportes enviados" note="2 pendientes" />
    </div>
    <div className="dashboard-grid">
      <section className="panel featured-case"><div className="panel-top"><div><span className="eyebrow">EVALUACIÓN EN CURSO</span><h2>Análisis de sentadilla</h2></div><span className="status">Borrador</span></div><PatientChip /><div className="mini-measures"><div><span>Flexión rodilla</span><strong>141°</strong></div><div><span>Simetría</span><strong>88%</strong></div><div><span>Dolor</span><strong>2/10</strong></div></div><button className="primary wide" onClick={() => go("analisis")}>Continuar análisis <ArrowRight size={17} /></button></section>
      <section className="panel"><div className="panel-top"><div><span className="eyebrow">HOY</span><h2>Próximas sesiones</h2></div><button className="text-button">Ver todas</button></div>{[["10:30", "Paciente 001", "Reevaluación"], ["12:00", "Paciente 002", "Movilidad"], ["16:30", "Paciente 003", "Retorno deportivo"]].map((a, i) => <div className="appointment" key={a[0]}><span className="time">{a[0]}</span><div className={`avatar tone-${i}`}>{a[1].split(" ").map(x => x[0]).join("")}</div><div><strong>{a[1]}</strong><small>{a[2]}</small></div><ChevronRight size={17} /></div>)}</section>
    </div>
  </>;
}

function Stat({ icon: Icon, value, label, note }: { icon: typeof Activity; value: string; label: string; note: string }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={20} /></div><strong>{value}</strong><span>{label}</span><small>{note}</small></div>;
}

function Patients({ search, setSearch, patients, go }: { search: string; setSearch: (s: string) => void; patients: string[][]; go: (v: View) => void }) {
  return <>
    <PageHead eyebrow="EXPEDIENTES" title="Pacientes" description="Historial clínico, evaluaciones y seguimiento en un solo lugar." action={<button className="primary"><Plus size={17} /> Nuevo paciente</button>} />
    <section className="panel patient-list"><div className="table-tools"><div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar paciente..." /></div><span>{patients.length} expedientes</span></div><div className="table-head"><span>Paciente</span><span>Motivo de consulta</span><span>Última sesión</span><span>Estado</span><span /></div>{patients.map((p, i) => <button className="patient-row" key={p[0]} onClick={() => go(i === 0 ? "analisis" : "evolucion")}><span className="person"><span className={`avatar tone-${i % 3}`}>{p[0].split(" ").map(x => x[0]).join("")}</span><span><strong>{p[0]}</strong><small>EXP-00{24 + i}</small></span></span><span>{p[1]}</span><span>{p[2]}</span><span><em className="status soft">{p[3]}</em></span><ChevronRight size={17} /></button>)}</section>
  </>;
}

function Analysis({ playing, setPlaying, frame, setFrame, compare, setCompare, saved, setSaved }: { playing: boolean; setPlaying: (v: boolean) => void; frame: number; setFrame: (v: number) => void; compare: boolean; setCompare: (v: boolean) => void; saved: boolean; setSaved: (v: boolean) => void }) {
  const knee = 132 + Math.round(frame / 6);
  const hip = 72 + Math.round(frame / 8);
  return <>
    <PageHead eyebrow="ANÁLISIS BIOMECÁNICO" title="Sentadilla · Vista lateral" description="Evaluación asistida mediante puntos anatómicos y mediciones angulares." action={<PatientChip />} />
    <div className="analysis-layout">
      <section className="video-card">
        <div className="video-top"><div><span className="live-dot" /> VIDEO DE EVALUACIÓN</div><div className="video-tags"><span>1080p</span><span>60 FPS</span></div></div>
        <div className="video-stage">
          <img src="/Muve-/biomech-squat.jpg" alt="Paciente realizando una sentadilla en vista lateral" />
          <div className="video-shade" />
          <svg className="bio-overlay" viewBox="0 0 1000 650" preserveAspectRatio="none" aria-label="Puntos y ángulos biomecánicos">
            <polyline points="470,150 500,282 550,410 510,530" />
            <polyline points="500,282 620,326" className="ghost-line" />
            {[[470,150],[500,282],[550,410],[510,530]].map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r="14" className="point-halo"/><circle cx={p[0]} cy={p[1]} r="6" /></g>)}
            <path d="M500 282 A96 96 0 0 1 548 407" className="angle-arc" />
          </svg>
          <div className="angle-label knee" style={{ transform: `translateY(${(frame - 46) * .08}px)` }}><span>RODILLA</span><strong>{knee}°</strong></div>
          <div className="angle-label hip"><span>CADERA</span><strong>{hip}°</strong></div>
          <div className="frame-tag">CUADRO {frame} / 128</div>
        </div>
        <div className="timeline"><input aria-label="Cuadro del video" type="range" min="1" max="128" value={frame} onChange={(e) => setFrame(Number(e.target.value))} style={{ "--progress": `${(frame / 128) * 100}%` } as React.CSSProperties} /><div className="controls"><div><button aria-label="Cuadro anterior" onClick={() => setFrame(Math.max(1, frame - 1))}><SkipBack size={18} /></button><button className="play" aria-label={playing ? "Pausar" : "Reproducir"} onClick={() => { setPlaying(!playing); if (!playing) setFrame(Math.min(128, frame + 4)); }}>{playing ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}</button><button aria-label="Cuadro siguiente" onClick={() => setFrame(Math.min(128, frame + 1))}><SkipForward size={18} /></button></div><span>00:01.53 / 00:04.26</span><span>Velocidad <strong>0.25×</strong></span></div></div>
      </section>

      <aside className="measure-panel">
        <div className="panel-top"><div><span className="eyebrow">MEDICIONES</span><h2>Cuadro actual</h2></div><Target size={21} /></div>
        <Measure label="Flexión de rodilla" value={`${knee}°`} note="Objetivo: 140–150°" state="good" />
        <Measure label="Flexión de cadera" value={`${hip}°`} note="Rango funcional" state="good" />
        <Measure label="Dorsiflexión tobillo" value="31°" note="Déficit leve: 4°" state="warn" />
        <Measure label="Simetría frontal" value="88%" note="+7% vs. inicial" state="good" />
        <div className="observation"><span>OBSERVACIÓN CLÍNICA</span><p>Ligera pérdida de control pélvico al superar los 90° de flexión. Mejoría visible en estabilidad de rodilla.</p></div>
        <button className="outline wide" onClick={() => setCompare(!compare)}><BarChart3 size={17} /> {compare ? "Ocultar comparación" : "Comparar con evaluación inicial"}</button>
      </aside>
    </div>
    {compare && <section className="comparison"><div><span className="eyebrow">COMPARATIVA</span><h2>Progreso en 8 semanas</h2></div><div className="compare-metrics"><div><span>12 JUN · INICIAL</span><strong>128°</strong><small>Flexión de rodilla</small></div><ArrowRight /><div className="highlight"><span>07 AGO · ACTUAL</span><strong>{knee}°</strong><small>+{knee - 128}° de movilidad</small></div><div><span>SIMETRÍA</span><strong>+17%</strong><small>Mejora acumulada</small></div></div></section>}
    <div className={`save-bar ${saved ? "saved" : ""}`}><div>{saved ? <Check /> : <ShieldCheck />}<span><strong>{saved ? "Evaluación guardada" : "Todo listo para documentar"}</strong><small>{saved ? "Los cambios quedaron registrados en el expediente." : "Guarda mediciones, observaciones y cuadro de referencia."}</small></span></div><button className="primary" onClick={() => setSaved(true)}>{saved ? "Guardado" : "Guardar evaluación"}</button></div>
  </>;
}

function Measure({ label, value, note, state }: { label: string; value: string; note: string; state: string }) {
  return <div className="measure"><div><span>{label}</span><small className={state}>{note}</small></div><strong>{value}</strong></div>;
}

function Evolution() {
  return <>
    <PageHead eyebrow="SEGUIMIENTO" title="Evolución clínica" description="Convierte cada evaluación en evidencia clara del progreso." action={<PatientChip />} />
    <div className="evolution-grid"><section className="panel chart-panel"><div className="panel-top"><div><span className="eyebrow">MOVILIDAD</span><h2>Flexión de rodilla</h2></div><span className="trend-up"><TrendingUp size={15} /> +17°</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={progress}><defs><linearGradient id="lime" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b6f43b" stopOpacity={.35}/><stop offset="100%" stopColor="#b6f43b" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#273834" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="fecha" tickLine={false} axisLine={false} stroke="#81918d" fontSize={12}/><YAxis domain={[120, 150]} tickLine={false} axisLine={false} stroke="#81918d" fontSize={12}/><Tooltip contentStyle={{ background: "#12201d", border: "1px solid #2c403b", borderRadius: 12 }} /><Area type="monotone" dataKey="rodilla" stroke="#b6f43b" strokeWidth={3} fill="url(#lime)" /></AreaChart></ResponsiveContainer></div></section><section className="panel summary-panel"><span className="eyebrow">RESUMEN</span><h2>8 semanas de progreso</h2><div className="score-ring"><div><strong>87</strong><span>/100</span></div></div><p>La paciente muestra una evolución favorable y consistente.</p><div className="summary-row"><span>Movilidad</span><strong>94%</strong></div><div className="summary-row"><span>Control motor</span><strong>83%</strong></div><div className="summary-row"><span>Dolor reportado</span><strong>2/10</strong></div></section></div>
    <section className="panel milestones"><div className="panel-top"><div><span className="eyebrow">HISTORIAL</span><h2>Hitos clínicos</h2></div></div>{[["12 JUN", "Evaluación inicial", "Dolor 6/10 · Flexión 128°"], ["10 JUL", "Control intermedio", "Mejor control de valgo dinámico"], ["07 AGO", "Reevaluación", "Dolor 2/10 · Flexión 145°"]].map((m, i) => <div className="milestone" key={m[0]}><span className={i === 2 ? "active" : ""}>{i === 2 ? <Check size={14} /> : i + 1}</span><small>{m[0]}</small><div><strong>{m[1]}</strong><p>{m[2]}</p></div></div>)}</section>
  </>;
}

function Plan({ done, setDone }: { done: number[]; setDone: (n: number[]) => void }) {
  const exercises = [["Sentadilla isométrica", "4 series · 30 segundos", "Control motor"], ["Step-down frontal", "3 series · 10 repeticiones", "Estabilidad"], ["Movilidad de tobillo", "3 series · 12 repeticiones", "Movilidad"], ["Puente unilateral", "3 series · 10 repeticiones", "Fuerza"]];
  return <>
    <PageHead eyebrow="TRATAMIENTO" title="Plan terapéutico" description="Prescribe, explica y da seguimiento a cada ejercicio." action={<button className="primary"><Plus size={17} /> Agregar ejercicio</button>} />
    <div className="plan-grid"><section className="panel"><div className="panel-top"><div><span className="eyebrow">SEMANA 5 DE 8</span><h2>Control de rodilla y retorno a carrera</h2></div><span className="status">Activo</span></div><PatientChip /><div className="progress-bar"><span style={{ width: `${(done.length / exercises.length) * 100}%` }} /></div><small className="progress-copy">{done.length} de {exercises.length} ejercicios completados hoy</small>{exercises.map((ex, i) => <button className={`exercise ${done.includes(i) ? "completed" : ""}`} key={ex[0]} onClick={() => setDone(done.includes(i) ? done.filter(x => x !== i) : [...done, i])}><span className="exercise-check">{done.includes(i) && <Check size={16} />}</span><span><strong>{ex[0]}</strong><small>{ex[1]}</small></span><em>{ex[2]}</em><ChevronRight size={17} /></button>)}</section><aside className="panel prescription"><div className="prescription-icon"><Dumbbell /></div><span className="eyebrow">ACCESO DEL PACIENTE</span><h2>Su plan, siempre disponible</h2><p>El paciente puede consultar indicaciones, registrar cumplimiento y compartir cómo se sintió.</p><div className="phone-preview"><div className="phone-head"><span>MUVE</span><small>Mi recuperación</small></div><div className="phone-score">75%<small>Semana completada</small></div><div className="phone-line"/><div className="phone-line short"/></div><button className="outline wide">Vista del paciente <ArrowRight size={16} /></button></aside></div>
  </>;
}

function Reports({ generated, setGenerated }: { generated: boolean; setGenerated: (v: boolean) => void }) {
  return <>
    <PageHead eyebrow="DOCUMENTACIÓN" title="Reporte de evaluación" description="Un resultado profesional, claro y listo para compartir." action={<button className="outline"><FolderHeart size={17} /> Historial de reportes</button>} />
    <div className="report-grid"><section className="report-paper"><div className="report-brand"><div className="brand-mark"><span>M</span></div><div><strong>MUVE</strong><small>FISIOTERAPIA</small></div><span>REPORTE BIOMECÁNICO</span></div><div className="report-title"><span>EVALUACIÓN FUNCIONAL</span><h2>Análisis de sentadilla</h2><p>Paciente 001 · 07 agosto 2026</p></div><div className="report-photo"><img src="/Muve-/biomech-squat.jpg" alt="Vista de análisis biomecánico" /><div className="report-angle">145°</div></div><div className="report-kpis"><div><span>RODILLA</span><strong>145°</strong><small>+17°</small></div><div><span>SIMETRÍA</span><strong>93%</strong><small>+22%</small></div><div><span>DOLOR</span><strong>2/10</strong><small>−4 puntos</small></div></div><div className="report-notes"><strong>Conclusión clínica</strong><p>Se observa mejoría significativa en movilidad, control motor y tolerancia a la carga. Se recomienda progresar hacia tareas de impacto controlado.</p></div><div className="report-footer">Recupera tu movimiento, mejora tu vida <span>Muve Fisioterapia</span></div></section><aside className="panel report-options"><span className="eyebrow">CONFIGURACIÓN</span><h2>Listo para compartir</h2><Option title="Identidad de marca" copy="Logotipo, colores y datos profesionales" /><Option title="Resumen de mediciones" copy="Ángulos, observaciones y comparativas" /><Option title="Plan terapéutico" copy="Ejercicios e indicaciones al paciente" /><div className="secure-note"><ShieldCheck size={18} /><span><strong>Documento protegido</strong><small>Generado desde el expediente clínico.</small></span></div><button className="primary wide" onClick={() => setGenerated(true)}>{generated ? <Check size={17} /> : <Download size={17} />}{generated ? "Reporte generado" : "Generar reporte PDF"}</button>{generated && <p className="success-copy">Vista demo completada. El archivo quedaría listo para descargar o enviar.</p>}</aside></div>
  </>;
}

function Option({ title, copy }: { title: string; copy: string }) { return <div className="option"><span><Check size={14} /></span><div><strong>{title}</strong><small>{copy}</small></div></div>; }
