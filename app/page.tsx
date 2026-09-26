"use client";

import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, BookOpen, CalendarDays,
  Check, ChevronDown, ChevronRight, CircleUserRound, ClipboardCheck,
  Clock3, Download, Dumbbell, FileText, Gauge, HeartPulse, Import,
  Layers3, Menu, MoreHorizontal, Play, Plus, Search, ShieldCheck, Sparkles,
  Target, TrendingUp, Upload, UserRound, UsersRound, X, Zap, Home as HomeIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type View = "hoy" | "atletas" | "episodio" | "evaluar" | "rendimiento" | "tratar" | "retorno" | "reportes" | "biblioteca";

const nav: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "hoy", label: "Hoy", icon: HomeIcon },
  { id: "atletas", label: "Atletas", icon: UsersRound },
  { id: "episodio", label: "Episodio clínico", icon: HeartPulse },
  { id: "evaluar", label: "Evaluar", icon: ClipboardCheck },
  { id: "rendimiento", label: "Rendimiento", icon: Gauge },
  { id: "tratar", label: "Tratar", icon: Dumbbell },
  { id: "retorno", label: "Retorno", icon: Target },
  { id: "reportes", label: "Reportes", icon: FileText },
  { id: "biblioteca", label: "Biblioteca", icon: BookOpen },
];

const trend = [
  { date: "12 Jun", knee: 128, pain: 6 }, { date: "26 Jun", knee: 134, pain: 5 },
  { date: "10 Jul", knee: 139, pain: 4 }, { date: "24 Jul", knee: 143, pain: 3 },
  { date: "07 Ago", knee: 146, pain: 2 },
];

const battery = [
  { name: "Dolor y función", meta: "NPRS · PSFS", status: "done" },
  { name: "Movilidad de tobillo", meta: "Weight-bearing lunge", status: "done" },
  { name: "Flexión de rodilla", meta: "Goniometría bilateral", status: "active" },
  { name: "Sentadilla unipodal", meta: "Control de movimiento", status: "pending" },
  { name: "Heel raise", meta: "Resistencia de pantorrilla", status: "pending" },
  { name: "Single hop", meta: "Potencia horizontal", status: "pending" },
];

export default function Home() {
  const [view, setView] = useState<View>("hoy");
  const [mobile, setMobile] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [imported, setImported] = useState(false);
  const [toast, setToast] = useState("");
  const [query, setQuery] = useState("");

  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2400); };
  const go = (next: View) => { setView(next); setMobile(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <main className="shell">
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <div className="wordmark"><div className="mark">M</div><div><strong>MUVE</strong><span>THERAPY</span></div><button className="mobile-close" onClick={() => setMobile(false)} aria-label="Cerrar menú"><X /></button></div>
        <div className="workspace-name"><span>ESPACIO CLÍNICO</span><strong>Clínica principal</strong><ChevronDown /></div>
        <nav>{nav.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? "active" : ""} onClick={() => go(id)}><Icon /><span>{label}</span>{view === id && <i />}</button>)}</nav>
        <div className="data-card"><ShieldCheck /><div><strong>Entorno de demostración</strong><span>Los pacientes y resultados son ficticios.</span></div></div>
        <div className="user-card"><div className="avatar">NH</div><div><strong>Nahum H.</strong><span>Fisioterapeuta</span></div><MoreHorizontal /></div>
      </aside>
      {mobile && <button className="scrim" onClick={() => setMobile(false)} aria-label="Cerrar menú" />}

      <section className="main-area">
        <header className="topbar"><button className="menu" onClick={() => setMobile(true)}><Menu /></button><div className="global-search"><Search /><input placeholder="Buscar atleta, episodio o prueba..." value={query} onChange={e => setQuery(e.target.value)} /></div><div className="top-actions"><button className="ghost-btn" onClick={() => setImportOpen(true)}><Import /> Importar resultados</button><button className="primary-btn" onClick={() => { go("evaluar"); showToast("Nueva evaluación preparada"); }}><Plus /> Nueva evaluación</button></div></header>
        <div className="page">
          {view === "hoy" && <Today go={go} imported={imported} />}
          {view === "atletas" && <Athletes go={go} query={query} />}
          {view === "episodio" && <Episode go={go} />}
          {view === "evaluar" && <Evaluate onSave={() => showToast("Evaluación guardada en el episodio")} />}
          {view === "rendimiento" && <Performance imported={imported} openImport={() => setImportOpen(true)} />}
          {view === "tratar" && <Treat showToast={showToast} />}
          {view === "retorno" && <ReturnToSport go={go} />}
          {view === "reportes" && <Reports showToast={showToast} />}
          {view === "biblioteca" && <Library />}
        </div>
      </section>
      {importOpen && <ImportModal imported={imported} close={() => setImportOpen(false)} finish={() => { setImported(true); setImportOpen(false); showToast("187 resultados conciliados correctamente"); }} />}
      {toast && <div className="toast"><Check />{toast}</div>}
    </main>
  );
}

function Head({ eyebrow, title, text, actions }: { eyebrow: string; title: string; text: string; actions?: React.ReactNode }) {
  return <div className="head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{actions && <div className="head-actions">{actions}</div>}</div>;
}

function PatientBadge() { return <div className="patient-badge"><div className="avatar coral">ML</div><div><strong>Mariana López</strong><span>29 años · Running</span></div><ChevronRight /></div>; }

function Today({ go, imported }: { go: (v: View) => void; imported: boolean }) {
  return <>
    <Head eyebrow="JUEVES · 25 DE SEPTIEMBRE" title="Buenas tardes, Nahum" text="Tu jornada clínica en una sola vista." actions={<><button className="quiet-btn"><CalendarDays /> Agenda</button><PatientBadge /></>} />
    <section className="hero-grid">
      <article className="case-hero">
        <div className="case-top"><div><span className="pill mint">REEVALUACIÓN PRIORITARIA</span><h2>¿Mariana puede iniciar carrera continua?</h2><p>Dolor femoropatelar · Semana 8 · Episodio activo</p></div><div className="readiness"><strong>6</strong><span>de 8 dominios</span></div></div>
        <div className="clinical-path"><PathStep done label="Síntomas" value="2/10"/><PathStep done label="Movilidad" value="146°"/><PathStep done label="Capacidad" value="93%"/><PathStep label="Exposición" value="Pendiente"/><PathStep label="Confianza" value="7/10"/></div>
        <div className="case-bottom"><div><AlertTriangle /><span><strong>Brecha principal</strong> Falta documentar tolerancia a carrera de 20 minutos y respuesta a 24 h.</span></div><button className="primary-btn" onClick={() => go("retorno")}>Revisar retorno <ArrowRight /></button></div>
      </article>
      <article className="panel agenda"><div className="panel-title"><div><span className="eyebrow">AGENDA</span><h2>Próximas sesiones</h2></div><button>Ver día</button></div><Appointment time="16:30" initials="ML" name="Mariana López" type="Reevaluación" active/><Appointment time="18:00" initials="DR" name="Diego Ramírez" type="Movilidad de tobillo"/><Appointment time="19:15" initials="LT" name="Lucía Torres" type="Retorno a entrenamiento"/></article>
    </section>
    <section className="stats"><Stat icon={UsersRound} value="48" label="Atletas activos" note="6 episodios nuevos"/><Stat icon={ClipboardCheck} value="9" label="Reevaluaciones" note="3 pendientes esta semana"/><Stat icon={TrendingUp} value="87%" label="Metas en progreso" note="+8% este mes"/><Stat icon={Import} value={imported ? "187" : "0"} label="Datos conciliados" note={imported ? "MyJump01 · hoy" : "Listos para importar"}/></section>
    <section className="split"><article className="panel activity-panel"><div className="panel-title"><div><span className="eyebrow">SEGUIMIENTO</span><h2>Actividad clínica</h2></div><span className="soft-pill">Últimos 7 días</span></div><div className="timeline-row"><span className="event-icon"><ClipboardCheck /></span><div><strong>Evaluación completada</strong><p>Diego · Weight-bearing lunge bilateral</p></div><time>Hoy · 12:40</time></div><div className="timeline-row"><span className="event-icon"><TrendingUp /></span><div><strong>Objetivo alcanzado</strong><p>Lucía · Simetría de salto superior a 90%</p></div><time>Ayer · 18:10</time></div><div className="timeline-row"><span className="event-icon"><FileText /></span><div><strong>Informe compartido</strong><p>Mariana · Resumen para atleta</p></div><time>23 sep</time></div></article><article className="panel attention"><span className="eyebrow">REQUIEREN ATENCIÓN</span><h2>Decisiones pendientes</h2><Decision color="amber" title="Respuesta adversa" text="Diego registró dolor 5/10 a las 24 horas."/><Decision color="cyan" title="Protocolo incompleto" text="Mariana tiene una prueba pendiente en su batería."/><Decision color="violet" title="Revisión de importación" text="2 alias de MyROM requieren conciliación."/></article></section>
  </>;
}

function PathStep({ done, label, value }: { done?: boolean; label: string; value: string }) { return <div className={done ? "path-step done" : "path-step"}><span>{done ? <Check /> : ""}</span><div><small>{label}</small><strong>{value}</strong></div></div>; }
function Appointment({ time, initials, name, type, active }: { time:string; initials:string; name:string; type:string; active?:boolean }) { return <button className={`appointment ${active ? "active" : ""}`}><time>{time}</time><div className="avatar">{initials}</div><div><strong>{name}</strong><span>{type}</span></div><ChevronRight /></button>; }
function Stat({ icon:Icon, value, label, note }:{icon:LucideIcon; value:string; label:string; note:string}) { return <article className="stat"><span><Icon /></span><div><strong>{value}</strong><p>{label}</p><small>{note}</small></div></article>; }

function Athletes({ go, query }: { go:(v:View)=>void; query:string }) {
  const rows = useMemo(() => [["Mariana López","Running","Rodilla derecha","Reevaluación","Hoy"],["Diego Ramírez","Fútbol","Tobillo izquierdo","En tratamiento","24 sep"],["Lucía Torres","Pádel","ACL derecho","Retorno","23 sep"],["Emilio Vargas","Ciclismo","Lumbar","Evaluación","20 sep"]].filter(r => r.join(" ").toLowerCase().includes(query.toLowerCase())), [query]);
  return <><Head eyebrow="GESTIÓN CLÍNICA" title="Atletas" text="Personas, deportes y episodios sin mezclar historias." actions={<button className="primary-btn"><Plus /> Nuevo atleta</button>} /><article className="panel table-panel"><div className="table-toolbar"><div><Search /><span>{query || "Todos los atletas"}</span></div><span>{rows.length} resultados</span></div><div className="athlete-head"><span>Atleta</span><span>Deporte</span><span>Episodio activo</span><span>Estado</span><span>Última sesión</span><span /></div>{rows.map((r,i)=><button className="athlete-row" key={r[0]} onClick={()=>go(i===0?"episodio":"evaluar")}><span className="athlete-cell"><i className={`avatar tone-${i}`}>{r[0].split(" ").map(x=>x[0]).join("")}</i><span><strong>{r[0]}</strong><small>MUVE-00{24+i}</small></span></span><span>{r[1]}</span><span>{r[2]}</span><span><em>{r[3]}</em></span><span>{r[4]}</span><ChevronRight /></button>)}</article></>;
}

function Episode({ go }: { go:(v:View)=>void }) {
  return <><Head eyebrow="EPISODIO CLÍNICO · RODILLA DERECHA" title="Dolor femoropatelar" text="Inicio 12 junio 2026 · Episodio activo" actions={<PatientBadge />} />
    <div className="episode-grid"><article className="panel episode-summary"><div className="panel-title"><div><span className="eyebrow">RESUMEN CLÍNICO</span><h2>Hipótesis actual</h2></div><span className="version">Versión 3 · firmada</span></div><h3>Déficit de tolerancia a carga con control femoropélvico reducido</h3><p>Dolor anterior de rodilla asociado con carrera y descenso de escaleras. Evolución favorable con reducción de irritabilidad y mejoría de movilidad.</p><div className="evidence"><span><Check /> Apoya</span><b>Dolor reproducible en step-down</b><b>Dorsiflexión limitada al ingreso</b><b>Mejoría con ajuste de carga</b></div><div className="evidence muted"><span>○ No informa</span><b>Pruebas meniscales sin relevancia clínica</b></div></article><article className="panel goal-card"><span className="eyebrow">META DEL ATLETA</span><blockquote>“Volver a correr 10 km sin dolor durante ni al día siguiente.”</blockquote><div className="goal-date"><CalendarDays /><span><small>FECHA OBJETIVO</small><strong>15 octubre 2026</strong></span></div></article></div>
    <article className="panel episode-timeline"><div className="panel-title"><div><span className="eyebrow">LÍNEA DE TIEMPO</span><h2>Del ingreso a la decisión</h2></div><button className="quiet-btn" onClick={()=>go("evaluar")}><Plus /> Registrar sesión</button></div><div className="timeline-track"><EpisodeEvent date="12 JUN" title="Evaluación inicial" text="Dolor 6/10 · Flexión 128° · PSFS 4/10" tag="Ingreso"/><EpisodeEvent date="26 JUN" title="Respuesta a carga" text="Menor irritabilidad · Adherencia 86%" tag="Sesión 4"/><EpisodeEvent date="10 JUL" title="Reevaluación" text="Flexión 139° · Mejor control frontal" tag="Semana 4"/><EpisodeEvent date="07 AGO" title="Perfil de capacidad" text="Simetría 93% · Dolor 2/10" tag="Semana 8" active/></div></article>
  </>;
}
function EpisodeEvent({date,title,text,tag,active}:{date:string;title:string;text:string;tag:string;active?:boolean}) { return <div className={`episode-event ${active?"current":""}`}><span className="event-dot"/><time>{date}</time><div><small>{tag}</small><strong>{title}</strong><p>{text}</p></div></div>; }

function Evaluate({ onSave }: { onSave:()=>void }) {
  const [selected,setSelected]=useState(2); const [right,setRight]=useState(146); const [left,setLeft]=useState(149); const [quality,setQuality]=useState("Válido");
  const asym=Math.round(Math.abs(left-right)/Math.max(left,right)*1000)/10;
  return <><Head eyebrow="EVALUACIÓN · SEMANA 8" title="Batería de rodilla y carrera" text="Captura reproducible con protocolo, lado, intento y calidad." actions={<PatientBadge />} />
    <div className="evaluate-layout"><aside className="battery"><div className="battery-head"><div><span>PROGRESO DE BATERÍA</span><strong>3 de 6 pruebas</strong></div><b>50%</b></div><div className="progress"><i style={{width:"50%"}}/></div>{battery.map((b,i)=><button key={b.name} className={`${b.status} ${selected===i?"selected":""}`} onClick={()=>setSelected(i)}><span>{b.status==="done"?<Check/>:i+1}</span><div><strong>{b.name}</strong><small>{b.meta}</small></div>{b.status==="active"&&<i>Ahora</i>}</button>)}</aside>
      <section className="test-workspace"><div className="test-header"><div><span className="eyebrow">MOVILIDAD · INTENTO 2 DE 3</span><h2>{battery[selected].name}</h2><p>Decúbito supino · Eje femoral alineado · Medición activa</p></div><button className="protocol"><BookOpen /> Ver protocolo</button></div><div className="measurement-grid"><Measurement side="DERECHA" value={right} setValue={setRight} accent/><Measurement side="IZQUIERDA" value={left} setValue={setLeft}/><div className="asymmetry"><span>ASIMETRÍA</span><strong>{asym}%</strong><small>Dentro del rango individual</small></div></div><div className="quality-row"><div><span>Calidad del intento</span><div className="segmented">{["Válido","Dolor","Compensación"].map(x=><button className={quality===x?"active":""} key={x} onClick={()=>setQuality(x)}>{x==="Válido"&&<Check/>}{x}</button>)}</div></div><label><span>Dolor durante la prueba</span><select><option>2 / 10</option><option>3 / 10</option><option>Sin dolor</option></select></label></div><label className="notes"><span>Observación clínica</span><textarea defaultValue="Mejor control de la fase excéntrica. Ligera molestia anterior al final del rango, sin compensación visible." /></label><div className="test-footer"><button className="quiet-btn">Repetir intento</button><button className="primary-btn" onClick={onSave}>Guardar y continuar <ArrowRight /></button></div></section>
      <aside className="reference-panel"><span className="eyebrow">CONTEXTO</span><h2>Línea base y tendencia</h2><div className="baseline"><span>12 JUN · INICIAL</span><strong>128°</strong><small>Dolor 6/10</small></div><div className="change"><TrendingUp /><span><strong>+18°</strong> desde el ingreso</span></div><div className="mini-chart">{[25,38,51,68,82].map((h,i)=><i key={i} style={{height:`${h}%`}} className={i===4?"active":""}/>)}</div><div className="reference-note"><ShieldCheck /><p>El resultado apoya el razonamiento clínico. La interpretación y decisión corresponden al profesional.</p></div></aside></div>
  </>;
}
function Measurement({side,value,setValue,accent}:{side:string;value:number;setValue:(v:number)=>void;accent?:boolean}) { return <div className={`measurement ${accent?"accent":""}`}><span>{side}</span><div><button onClick={()=>setValue(value-1)}>−</button><strong>{value}<small>°</small></strong><button onClick={()=>setValue(value+1)}>+</button></div><small>Rango plausible 0–155°</small></div>; }

function Performance({ imported, openImport }: { imported:boolean; openImport:()=>void }) {
  return <><Head eyebrow="PERFIL FÍSICO" title="Capacidad y rendimiento" text="Síntomas, pruebas clínicas y datos externos en una misma tendencia." actions={<><button className="ghost-btn" onClick={openImport}><Upload /> Importar CSV</button><PatientBadge /></>} />
    <div className="performance-grid"><article className="panel chart-card"><div className="panel-title"><div><span className="eyebrow">MOVILIDAD</span><h2>Flexión de rodilla</h2></div><span className="gain"><TrendingUp /> +18°</span></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend}><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#18b98a" stopOpacity=".32"/><stop offset="1" stopColor="#18b98a" stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke="#e8eeeb" vertical={false}/><XAxis dataKey="date" axisLine={false} tickLine={false}/><YAxis domain={[120,155]} axisLine={false} tickLine={false}/><Tooltip/><Area dataKey="knee" type="monotone" stroke="#0d9c75" strokeWidth={3} fill="url(#a)"/></AreaChart></ResponsiveContainer></div></article><article className="panel capability"><span className="eyebrow">PERFIL ACTUAL</span><h2>Capacidades clave</h2><Capability label="Movilidad" value={94}/><Capability label="Fuerza" value={86}/><Capability label="Potencia" value={91}/><Capability label="Control" value={82}/><Capability label="Tolerancia" value={74}/></article></div>
    <div className="metrics-row"><Metric source="MyROM" label="Dorsiflexión" value="38°" delta="+6°"/><Metric source="MyJump01" label="CMJ" value={imported?"31.8 cm":"—"} delta={imported?"+3.2 cm":"Importar"}/><Metric source="Clínica" label="Heel raise" value="26 rep" delta="90% sim."/><Metric source="MyMocap" label="Valgo dinámico" value={imported?"7.4°":"—"} delta={imported?"−4.1°":"Importar"}/></div>
    <article className="panel data-origin"><div><span className="source-icon"><Layers3 /></span><div><h3>Trazabilidad en cada resultado</h3><p>Conservamos valor original, unidad, protocolo, equipo, versión y calidad. La normalización nunca reemplaza el dato de origen.</p></div></div><button className="quiet-btn" onClick={openImport}>Ver conciliación <ArrowRight /></button></article>
  </>;
}
function Capability({label,value}:{label:string;value:number}) { return <div className="capability-row"><div><span>{label}</span><strong>{value}%</strong></div><div><i style={{width:`${value}%`}}/></div></div>; }
function Metric({source,label,value,delta}:{source:string;label:string;value:string;delta:string}) { return <article className="metric"><span>{source}</span><h3>{label}</h3><strong>{value}</strong><small>{delta}</small></article>; }

function Treat({showToast}:{showToast:(s:string)=>void}) {
  const [done,setDone]=useState([0,1]); const exercises=[["Sentadilla isométrica","4 × 30 s","Control y analgesia"],["Step-down frontal","3 × 10","Control femoropélvico"],["Sóleo sentado","4 × 12","Capacidad de pantorrilla"],["Carrera–caminata","4 × 4 min","Exposición gradual"]];
  return <><Head eyebrow="INTERVENCIÓN" title="Plan terapéutico" text="Dosis planificada, ejecución real y respuesta a 24 horas." actions={<PatientBadge />} /><div className="treat-grid"><article className="panel plan"><div className="panel-title"><div><span className="eyebrow">SEMANA 8</span><h2>Control de carga y retorno a carrera</h2></div><span className="pill mint">ACTIVO</span></div><div className="plan-progress"><span><strong>{done.length}/{exercises.length}</strong> completados hoy</span><div><i style={{width:`${done.length/exercises.length*100}%`}}/></div></div>{exercises.map((x,i)=><button className={`exercise ${done.includes(i)?"done":""}`} key={x[0]} onClick={()=>setDone(done.includes(i)?done.filter(d=>d!==i):[...done,i])}><span>{done.includes(i)&&<Check/>}</span><div><strong>{x[0]}</strong><small>{x[1]} · {x[2]}</small></div><ChevronRight /></button>)}<button className="primary-btn wide" onClick={()=>showToast("Plan actualizado y listo para compartir")}>Guardar plan</button></article><aside className="panel response"><span className="eyebrow">RESPUESTA A 24 HORAS</span><h2>La dosis también se evalúa</h2><div className="response-score"><span>DOLOR</span><strong>2<small>/10</small></strong><em>Sin incremento</em></div><label>Sensación general<select><option>Mejor de lo esperado</option><option>Según lo esperado</option><option>Peor de lo esperado</option></select></label><label>Adherencia semanal<div className="range-label"><span>0%</span><b>86%</b><span>100%</span></div><input type="range" defaultValue="86" /></label><div className="coach-note"><Sparkles /><p><strong>Próxima decisión</strong> Aumentar 5 minutos de carrera si mantiene dolor ≤3/10 y vuelve a línea base en 24 h.</p></div></aside></div></>;
}

function ReturnToSport({go}:{go:(v:View)=>void}) {
  const domains=[{n:"Tejido y clínica",v:100,s:"Cumplido",d:"Dolor 2/10 · Sin derrame"},{n:"Capacidad",v:92,s:"Cumplido",d:"Fuerza y salto dentro de criterio"},{n:"Calidad",v:84,s:"En progreso",d:"Mejorar control bajo fatiga"},{n:"Función",v:88,s:"En progreso",d:"Pendiente tarea reactiva"},{n:"Carga",v:72,s:"Brecha",d:"Completar carrera continua 20 min"},{n:"Psicológico",v:78,s:"En progreso",d:"Confianza 7/10"},{n:"Contexto",v:100,s:"Cumplido",d:"Calendario y superficie definidos"},{n:"Exposición",v:68,s:"Brecha",d:"Respuesta a 24 h pendiente"}];
  return <><Head eyebrow="RETORNO AL DEPORTE" title="Decisión por dominios" text="Participación, deporte y rendimiento como un continuo; no como un solo porcentaje." actions={<PatientBadge />} /><div className="return-banner"><div><span className="return-stage">ETAPA ACTUAL</span><h2>Retorno a participación</h2><p>Puede iniciar exposición individual controlada. Aún no cumple criterios para carrera continua sin restricción.</p></div><div className="stage-track"><i className="done">1</i><span/><i>2</i><span/><i>3</i><small>Participación</small><small>Deporte</small><small>Rendimiento</small></div></div><div className="domain-grid">{domains.map(x=><article className="domain" key={x.n}><div className="domain-top"><span>{x.n}</span><em className={x.v<75?"gap":x.v<90?"progressing":"met"}>{x.s}</em></div><div className="domain-score"><strong>{x.v}</strong><small>/100</small></div><div className="domain-bar"><i style={{width:`${x.v}%`}}/></div><p>{x.d}</p></article>)}</div><div className="decision-bar"><div><ShieldCheck/><span><strong>La app organiza la evidencia; Nahum firma la decisión.</strong><small>Se requieren 2 dominios adicionales antes de progresar.</small></span></div><button className="primary-btn" onClick={()=>go("reportes")}>Preparar reporte <ArrowRight/></button></div></>;
}

function Reports({showToast}:{showToast:(s:string)=>void}) {
  const [audience,setAudience]=useState("Atleta");
  return <><Head eyebrow="COMUNICACIÓN" title="Reportes que hablan a cada destinatario" text="La misma evidencia, presentada con el nivel de detalle adecuado." actions={<PatientBadge />} /><div className="report-layout"><aside className="panel report-controls"><span className="eyebrow">DESTINATARIO</span><div className="audience-tabs">{["Atleta","Fisioterapeuta","Médico","Entrenador"].map(a=><button className={audience===a?"active":""} onClick={()=>setAudience(a)} key={a}><UserRound/>{a}<Check/></button>)}</div><div className="included"><span className="eyebrow">CONTENIDO</span>{["Resumen del episodio","Cambios desde la línea base","Metas y próximos pasos",audience==="Atleta"?"Lenguaje claro y señales de consulta":"Resultados, protocolos y calidad"].map(x=><p key={x}><Check/>{x}</p>)}</div><button className="primary-btn wide" onClick={()=>showToast(`Reporte para ${audience.toLowerCase()} generado`)}><Download/> Generar PDF</button></aside><section className="report-sheet"><div className="report-head"><div className="report-logo"><div className="mark">M</div><div><strong>MUVE</strong><span>THERAPY</span></div></div><span>REPORTE PARA {audience.toUpperCase()}</span></div><div className="report-person"><div><span>ATLETA</span><h2>Mariana López</h2><p>Running · Episodio de rodilla derecha</p></div><div><span>PERIODO</span><strong>12 jun — 25 sep 2026</strong></div></div><div className="report-summary"><div><span>Dolor</span><strong>2/10</strong><small>Antes 6/10</small></div><div><span>Flexión</span><strong>146°</strong><small>+18°</small></div><div><span>Simetría</span><strong>93%</strong><small>+15%</small></div></div><div className="report-section"><span>EVOLUCIÓN</span><h3>Progreso consistente en movilidad y capacidad</h3><p>La tolerancia a carga ha mejorado. El siguiente paso es confirmar respuesta a carrera continua y control bajo fatiga.</p><div className="report-bars"><i style={{width:"34%"}}/><i style={{width:"53%"}}/><i style={{width:"68%"}}/><i style={{width:"84%"}}/><i style={{width:"93%"}}/></div></div><div className="report-section"><span>PRÓXIMOS PASOS</span><p className="report-check"><Check/> Carrera–caminata: 4 bloques de 4 minutos.</p><p className="report-check"><Check/> Registrar dolor inmediato y respuesta a 24 horas.</p></div><footer><span>Recupera tu movimiento. Vuelve con confianza.</span><strong>Nahum H. · Fisioterapeuta</strong></footer></section></div></>;
}

function Library() {
  const groups=[["Rodilla","18 pruebas","ACL, PCL, menisco, patelofemoral"],["Tobillo y pie","16 pruebas","Movilidad, estabilidad y carga"],["Cadera e ingle","17 pruebas","ROM, aductor, glúteo e isquios"],["Hombro","19 pruebas","Manguito, inestabilidad y escápula"],["Rendimiento","24 pruebas","Salto, sprint, COD y balance"],["Cuestionarios","8 instrumentos","Dolor, función y confianza"]];
  return <><Head eyebrow="MOTOR DE PRUEBAS" title="Biblioteca clínica" text="Protocolos versionados para añadir conocimiento sin rehacer la plataforma." actions={<button className="primary-btn"><Plus/> Nueva prueba</button>} /><div className="library-callout"><BookOpen/><div><strong>30 pruebas núcleo listas para el piloto</strong><p>Cada prueba conserva protocolo, población, unidades, calidad, evidencia y versión.</p></div><span>Versión 1.0</span></div><div className="library-grid">{groups.map((g,i)=><article className="library-card" key={g[0]}><span className={`library-icon l${i}`}><Activity/></span><div><h3>{g[0]}</h3><strong>{g[1]}</strong><p>{g[2]}</p></div><button><ChevronRight/></button></article>)}</div></>;
}

function ImportModal({close,finish,imported}:{close:()=>void;finish:()=>void;imported:boolean}) {
  const [step,setStep]=useState(imported?3:1);
  return <div className="modal-backdrop"><section className="modal"><div className="modal-head"><div><span className="eyebrow">INTEGRACIÓN MY JUMP LAB</span><h2>Importar resultados</h2></div><button onClick={close}><X/></button></div><div className="steps"><span className={step>=1?"active":""}>1 <b>Archivo</b></span><i/><span className={step>=2?"active":""}>2 <b>Conciliar</b></span><i/><span className={step>=3?"active":""}>3 <b>Validar</b></span></div>{step===1&&<div className="upload-zone"><Upload/><h3>MyJump01_septiembre.csv</h3><p>UTF-8 · 187 registros · 48 atletas de origen</p><span>Archivo listo para previsualizar</span></div>}{step===2&&<div className="reconcile"><div><span className="avatar coral">ML</span><div><strong>Mariana Lopez</strong><small>Nombre en archivo</small></div><ArrowRight/><div><strong>Mariana López</strong><small>MUVE-0024 · 98% coincidencia</small></div><span className="pill mint"><Check/> Vinculado</span></div><div><span className="avatar">JR</span><div><strong>J. Ramirez</strong><small>Nombre en archivo</small></div><ArrowRight/><div><strong>Diego Ramírez</strong><small>MUVE-0025 · Revisión manual</small></div><span className="pill amber">Revisar</span></div></div>}{step===3&&<div className="validation"><div className="validation-score"><Check/><div><strong>187 resultados listos</strong><span>Los valores originales se conservarán sin cambios.</span></div></div><div className="validation-grid"><p><span>175</span> CMJ</p><p><span>12</span> SJ</p><p><span>7</span> valores no finitos</p><p><span>2</span> alias por revisar</p></div><div className="warning"><AlertTriangle/><span><strong>Control de calidad activo</strong> Los valores improbables se importarán con bandera y no entrarán en agregados.</span></div></div>}<div className="modal-footer"><button className="quiet-btn" onClick={close}>Cancelar</button><button className="primary-btn" onClick={()=>step<3?setStep(step+1):finish()}>{step===1?"Previsualizar":step===2?"Validar datos":"Confirmar importación"}<ArrowRight/></button></div></section></div>;
}

function Decision({color,title,text}:{color:string;title:string;text:string}) { return <div className="decision"><i className={color}/><div><strong>{title}</strong><p>{text}</p></div><ChevronRight/></div>; }
