"use client";

import { useState } from "react";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BookOpen, Check,
  ChevronRight, CircleDot, Clock3, Download, FileText, Grid2X2, Layers3,
  Menu, MoreHorizontal, Play, Plus, ScanLine, Search, ShieldCheck,
  SlidersHorizontal, Upload, UserRound, UsersRound, Zap,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart,
  Line, PolarAngleAxis, PolarGrid, Radar, RadarChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

type View = "hub" | "assessment" | "report";

const forceData = [
  { t: "0.0", right: 0, left: 0, total: 0 }, { t: "0.4", right: 410, left: 386, total: 796 },
  { t: "0.8", right: 615, left: 582, total: 1197 }, { t: "1.2", right: 534, left: 505, total: 1039 },
  { t: "1.6", right: 190, left: 172, total: 362 }, { t: "2.0", right: 45, left: 39, total: 84 },
  { t: "2.4", right: 522, left: 476, total: 998 }, { t: "2.8", right: 731, left: 674, total: 1405 },
  { t: "3.2", right: 448, left: 421, total: 869 }, { t: "3.6", right: 303, left: 288, total: 591 },
  { t: "4.0", right: 244, left: 231, total: 475 },
];

const progressData = [
  { date: "12 JUN", right: 24.8, left: 21.9 }, { date: "26 JUN", right: 26.1, left: 23.8 },
  { date: "10 JUL", right: 27.6, left: 25.4 }, { date: "24 JUL", right: 29.8, left: 27.9 },
  { date: "07 AGO", right: 31.8, left: 29.6 },
];

const profile = [
  { k: "MOV", now: 94, base: 61 }, { k: "FZA", now: 86, base: 58 },
  { k: "POT", now: 91, base: 65 }, { k: "CTRL", now: 82, base: 56 },
  { k: "TOL", now: 74, base: 42 },
];

const asymmetry = [
  { name: "CMJ", value: 6.9, color: "#78f0c3" }, { name: "Single hop", value: 8.6, color: "#70a5ff" },
  { name: "Heel raise", value: 9.8, color: "#f4bd62" }, { name: "Dorsiflexión", value: 4.2, color: "#b494ff" },
];

const nav = [
  { id: "hub" as View, label: "Centro de rendimiento", icon: Grid2X2 },
  { id: "assessment" as View, label: "Evaluación biomecánica", icon: ScanLine },
  { id: "report" as View, label: "Informe clínico", icon: FileText },
];

export default function Home() {
  const [view, setView] = useState<View>("hub");
  const [mobile, setMobile] = useState(false);
  const [toast, setToast] = useState("");
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };

  return <main className="lab-shell">
    <aside className={`lab-rail ${mobile ? "open" : ""}`}>
      <button className="rail-brand" onClick={() => setView("hub")} aria-label="MUVETHERAPY">M</button>
      <nav>
        {nav.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? "active" : ""} onClick={() => { setView(id); setMobile(false); }} aria-label={label} title={label}><Icon /><span>{label}</span></button>)}
        <i className="rail-separator" />
        <button aria-label="Atletas" title="Atletas"><UsersRound /><span>Atletas</span></button>
        <button aria-label="Biblioteca" title="Biblioteca"><BookOpen /><span>Biblioteca</span></button>
      </nav>
      <div className="rail-profile">NH</div>
    </aside>
    {mobile && <button className="lab-scrim" onClick={() => setMobile(false)} aria-label="Cerrar navegación" />}

    <section className="lab-main">
      <header className="lab-topbar">
        <button className="lab-menu" onClick={() => setMobile(true)} aria-label="Abrir navegación"><Menu /></button>
        <div className="lab-wordmark"><strong>MUVE</strong><span>THERAPY / PERFORMANCE OS</span></div>
        <div className="lab-search"><Search /><input aria-label="Buscar" placeholder="Buscar atleta, prueba o protocolo" /></div>
        <div className="lab-top-actions"><span className="live-state"><i /> SISTEMA ACTIVO</span><button aria-label="Notificaciones"><Bell /><b>2</b></button><div className="top-user">NH</div></div>
      </header>

      <section className="athlete-strip">
        <div className="athlete-core"><div className="athlete-monogram">ML</div><div><span>ATLETA · MUVE-0024</span><h1>Mariana López</h1><p>Running · 29 años · Pierna dominante: derecha</p></div></div>
        <div className="active-case"><span><i /> EPISODIO ACTIVO</span><strong>Dolor femoropatelar · rodilla derecha</strong><small>Semana 8 · Reevaluación hoy 16:30</small></div>
        <div className="athlete-actions"><button className="lab-secondary" onClick={() => flash("Importador preparado")}><Upload />Importar</button><button className="lab-primary" onClick={() => setView("assessment")}><Plus />Nueva evaluación</button></div>
      </section>

      <div className="lab-canvas">
        {view === "hub" && <PerformanceHub setView={setView} />}
        {view === "assessment" && <Biomechanics flash={flash} />}
        {view === "report" && <ClinicalReport flash={flash} />}
      </div>
    </section>
    {toast && <div className="lab-toast"><Check />{toast}</div>}
  </main>;
}

function PerformanceHub({ setView }: { setView: (v: View) => void }) {
  return <>
    <div className="screen-title"><div><span>PERFORMANCE INTELLIGENCE</span><h2>Centro de rendimiento</h2><p>Lectura longitudinal de capacidad, carga y respuesta clínica.</p></div><div className="title-tools"><button><SlidersHorizontal /> Configurar vista</button><button><MoreHorizontal /></button></div></div>
    <section className="kpi-grid">
      <Kpi code="CMJ / ALTURA" value="31.8" unit="CM" delta="+28%" positive series={[22,25,24,28,29,32]} />
      <Kpi code="SIMETRÍA" value="93.1" unit="%" delta="+15.2" positive series={[78,81,84,87,90,93]} />
      <Kpi code="FLEXIÓN RODILLA" value="146" unit="°" delta="+18°" positive series={[128,134,139,141,143,146]} />
      <Kpi code="DOLOR / NPRS" value="2" unit="/10" delta="−4" positive series={[6,5,5,4,3,2]} inverse />
      <Kpi code="EXPOSICIÓN" value="16" unit="MIN" delta="Meta 20" series={[0,4,6,8,12,16]} />
    </section>

    <section className="performance-layout">
      <article className="lab-panel force-panel">
        <PanelHead eyebrow="FORCE TRACE · ÚLTIMO TEST" title="Countermovement jump" meta="07 AGO 2026 · 240 FPS" />
        <div className="force-main"><ResponsiveContainer width="100%" height="100%"><AreaChart data={forceData} margin={{ top: 12, right: 16, left: -10, bottom: 0 }}><defs><linearGradient id="totalForce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d7e653" stopOpacity=".22"/><stop offset="1" stopColor="#d7e653" stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke="#23313d" vertical={false}/><XAxis dataKey="t" stroke="#52616c" tick={{fill:"#71818d",fontSize:10}} tickLine={false}/><YAxis stroke="#52616c" tick={{fill:"#71818d",fontSize:10}} tickLine={false}/><Tooltip contentStyle={{background:"#111b24",border:"1px solid #34434f",borderRadius:6,color:"#fff"}}/><ReferenceLine y={1200} stroke="#6f7d87" strokeDasharray="4 5"/><Area dataKey="total" stroke="#d7e653" strokeWidth={2.5} fill="url(#totalForce)"/><Line dataKey="right" stroke="#42bde8" strokeWidth={1.7} dot={false}/><Line dataKey="left" stroke="#f27f69" strokeWidth={1.7} dot={false}/></AreaChart></ResponsiveContainer></div>
        <div className="trace-legend"><span><i className="total"/>Fuerza total</span><span><i className="right"/>Derecha</span><span><i className="left"/>Izquierda</span><strong>Despegue 2.03 s</strong><strong>Aterrizaje 2.46 s</strong></div>
      </article>

      <article className="lab-panel profile-panel-dark"><PanelHead eyebrow="PERFIL DE CAPACIDAD" title="Actual vs. ingreso" meta="5 DOMINIOS" /><div className="dark-radar"><ResponsiveContainer width="100%" height="100%"><RadarChart data={profile} outerRadius="69%"><PolarGrid stroke="#2a3945"/><PolarAngleAxis dataKey="k" tick={{fill:"#84939e",fontSize:10,fontWeight:700}}/><Radar dataKey="base" stroke="#566672" fill="#566672" fillOpacity={.12}/><Radar dataKey="now" stroke="#6de8bc" strokeWidth={2} fill="#6de8bc" fillOpacity={.2}/></RadarChart></ResponsiveContainer></div><div className="profile-key"><span><i/>Actual</span><span><i/>Ingreso</span><strong>Brecha: tolerancia</strong></div></article>

      <article className="lab-panel progress-panel"><PanelHead eyebrow="EVOLUCIÓN · 8 SEMANAS" title="CMJ bilateral" meta="ALTURA EN CM" /><div className="progress-chart"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={progressData} margin={{top:10,right:12,left:-12,bottom:0}}><CartesianGrid stroke="#23313d" vertical={false}/><XAxis dataKey="date" tick={{fill:"#71818d",fontSize:9}} axisLine={false} tickLine={false}/><YAxis domain={[20,34]} tick={{fill:"#71818d",fontSize:9}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#111b24",border:"1px solid #34434f",borderRadius:6,color:"#fff"}}/><ReferenceLine y={30} stroke="#4e5d68" strokeDasharray="4 5"/><Line dataKey="right" name="Derecha" stroke="#70a5ff" strokeWidth={2.5} dot={{r:3,fill:"#0d151c",strokeWidth:2}}/><Line dataKey="left" name="Izquierda" stroke="#6de8bc" strokeWidth={2.5} dot={{r:3,fill:"#0d151c",strokeWidth:2}}/></ComposedChart></ResponsiveContainer></div></article>

      <article className="lab-panel asymmetry-panel-dark"><PanelHead eyebrow="CONTROL BILATERAL" title="Asimetría por prueba" meta="UMBRAL 10%" /><div className="dark-bars"><ResponsiveContainer width="100%" height="100%"><BarChart data={asymmetry} layout="vertical" margin={{top:5,right:24,left:12,bottom:0}}><XAxis type="number" domain={[0,12]} hide/><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={82} tick={{fill:"#87949e",fontSize:10}}/><ReferenceLine x={10} stroke="#e89e46" strokeDasharray="3 4"/><Tooltip contentStyle={{background:"#111b24",border:"1px solid #34434f",borderRadius:6,color:"#fff"}}/><Bar dataKey="value" radius={[0,4,4,0]} barSize={9}>{asymmetry.map(x=><Cell key={x.name} fill={x.color}/>)}</Bar></BarChart></ResponsiveContainer></div><div className="criterion-ok"><ShieldCheck/><span><strong>4/4 pruebas</strong> dentro de criterio</span></div></article>

      <article className="decision-core"><div className="decision-top"><span><i/>DECISIÓN ABIERTA</span><em>RETORNO A CARRERA</em></div><div className="decision-body"><div className="decision-number"><strong>6<small>/8</small></strong><span>dominios<br/>cumplidos</span></div><div><h3>Preparada para exposición controlada</h3><p>Falta confirmar carrera continua de 20 minutos y respuesta a las 24 horas.</p></div></div><div className="decision-footer"><span><Clock3/>Próxima revisión · Hoy 16:30</span><button onClick={() => setView("report")}>Abrir decisión <ArrowRight/></button></div></article>
    </section>
  </>;
}

function Biomechanics({ flash }: { flash: (s:string) => void }) {
  const [frame, setFrame] = useState(184);
  const [quality, setQuality] = useState("Válido");
  return <>
    <div className="screen-title"><div><span>ANÁLISIS DE MOVIMIENTO</span><h2>Sentadilla bilateral</h2><p>Plano sagital · intento 2 de 3 · 240 fps</p></div><div className="title-tools"><button><Upload/>Cambiar video</button><button className="accent" onClick={()=>flash("Evaluación guardada")}><Check/>Guardar análisis</button></div></div>
    <section className="analysis-layout">
      <article className="video-workspace">
        <div className="video-toolbar"><div><span className="rec-dot"/>VIDEO ORIGINAL</div><span>00:00:03.24</span><div><button>50%</button><button>1×</button><button><MoreHorizontal/></button></div></div>
        <div className="video-stage"><img src="/Muve-/biomech-squat.jpg" alt="Atleta realizando una sentadilla para análisis biomecánico"/><div className="grid-overlay"/><span className="joint hip"/><span className="joint knee"/><span className="joint ankle"/><i className="segment femur"/><i className="segment tibia"/><div className="angle knee-angle"><b>82.4°</b><span>RODILLA</span></div><div className="angle hip-angle"><b>68.1°</b><span>CADERA</span></div><div className="axis-line"/></div>
        <div className="video-controls"><button onClick={()=>setFrame(Math.max(0,frame-1))}>−1</button><button className="play"><Play/></button><button onClick={()=>setFrame(frame+1)}>+1</button><div className="scrubber"><i style={{width:`${Math.min(100,frame/240*100)}%`}}/><b style={{left:`${Math.min(100,frame/240*100)}%`}}/></div><span>FRAME <strong>{frame}</strong> / 240</span></div>
      </article>

      <aside className="analysis-inspector">
        <div className="inspector-head"><div><span>RESULTADOS DEL FRAME</span><h3>Profundidad máxima</h3></div><button><MoreHorizontal/></button></div>
        <div className="angle-stack"><AngleMetric label="Flexión de cadera" value="68.1°" delta="+4.2°"/><AngleMetric label="Flexión de rodilla" value="82.4°" delta="+8.6°" warning/><AngleMetric label="Dorsiflexión" value="31.6°" delta="+3.1°"/><AngleMetric label="Inclinación de tronco" value="27.3°" delta="−2.8°"/></div>
        <div className="quality-block"><span>CALIDAD DEL INTENTO</span><div>{["Válido","Dolor","Compensación"].map(x=><button key={x} className={quality===x?"active":""} onClick={()=>setQuality(x)}>{x==="Válido"&&<Check/>}{x}</button>)}</div></div>
        <label className="clinical-note"><span>OBSERVACIÓN CLÍNICA</span><textarea defaultValue="Buen control del tronco. Ligero desplazamiento anterior de rodilla derecha al final del descenso, sin incremento de dolor." /></label>
        <div className="capture-summary"><span><CircleDot/>3 puntos anatómicos</span><span><Layers3/>2 segmentos</span><span><Zap/>2 ángulos calculados</span></div>
      </aside>
    </section>
  </>;
}

function ClinicalReport({ flash }: { flash: (s:string) => void }) {
  const [audience,setAudience]=useState("Atleta");
  return <>
    <div className="screen-title"><div><span>REPORTING STUDIO</span><h2>Informe de evolución</h2><p>Una misma evidencia, adaptada a cada destinatario.</p></div><div className="title-tools"><button><MoreHorizontal/></button><button className="accent" onClick={()=>flash(`PDF para ${audience.toLowerCase()} generado`)}><Download/>Generar PDF</button></div></div>
    <section className="report-studio">
      <aside className="report-settings"><span className="settings-label">DESTINATARIO</span><div className="audience-list">{["Atleta","Fisioterapeuta","Médico","Entrenador"].map(a=><button key={a} className={audience===a?"active":""} onClick={()=>setAudience(a)}><UserRound/><span>{a}<small>{a==="Atleta"?"Resumen visual":a==="Fisioterapeuta"?"Detalle clínico":"Información autorizada"}</small></span><ChevronRight/></button>)}</div><span className="settings-label">SECCIONES</span><div className="report-switches">{["Resumen ejecutivo","Evolución","Perfil de capacidad","Próximos pasos"].map(x=><label key={x}><span>{x}</span><input type="checkbox" defaultChecked/></label>)}</div><div className="report-brand"><div className="mini-brand">M</div><span><strong>MUVETHERAPY</strong><small>Marca aplicada</small></span><Check/></div></aside>
      <article className="report-paper">
        <header><div className="paper-brand"><div>M</div><span><strong>MUVE</strong><small>THERAPY</small></span></div><div><span>INFORME PARA {audience.toUpperCase()}</span><strong>25 SEP 2026</strong></div></header>
        <section className="paper-athlete"><div><span>ATLETA</span><h2>Mariana López</h2><p>Running · 29 años · Rodilla derecha</p></div><div><span>EPISODIO</span><strong>Dolor femoropatelar</strong><small>Semana 8</small></div></section>
        <section className="paper-result"><div><span>ESTADO ACTUAL</span><h3>Progreso favorable con dos criterios pendientes</h3><p>La capacidad física ha mejorado de forma consistente. La progresión a carrera continua requiere confirmar exposición de 20 minutos y respuesta a las 24 horas.</p></div><strong>6<small>/8</small><em>dominios</em></strong></section>
        <section className="paper-kpis"><div><span>DOLOR</span><strong>2<small>/10</small></strong><em>−4 pts</em></div><div><span>FLEXIÓN</span><strong>146<small>°</small></strong><em>+18°</em></div><div><span>SIMETRÍA</span><strong>93<small>%</small></strong><em>+15 pts</em></div><div><span>CMJ</span><strong>31.8<small> cm</small></strong><em>+28%</em></div></section>
        <section className="paper-chart"><div><span>EVOLUCIÓN BILATERAL</span><h3>Altura de salto CMJ</h3></div><div><ResponsiveContainer width="100%" height="100%"><ComposedChart data={progressData} margin={{top:10,right:8,left:-18,bottom:0}}><CartesianGrid stroke="#dfe3df" vertical={false}/><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill:"#7f8781",fontSize:9}}/><YAxis domain={[20,34]} axisLine={false} tickLine={false} tick={{fill:"#7f8781",fontSize:9}}/><Line dataKey="right" stroke="#183d70" strokeWidth={2.2} dot={false}/><Line dataKey="left" stroke="#129474" strokeWidth={2.2} dot={false}/></ComposedChart></ResponsiveContainer></div></section>
        <section className="paper-next"><span>PRÓXIMOS PASOS</span><div><Check/><p><strong>Carrera continua · 20 minutos</strong><small>Registrar dolor inmediato y respuesta a las 24 horas.</small></p></div><div><Check/><p><strong>Reevaluación de control bajo fatiga</strong><small>Comparar calidad de movimiento con la línea base.</small></p></div></section>
        <footer><span>Datos de demostración · Caso ficticio</span><strong>Nahum H. · Fisioterapeuta</strong></footer>
      </article>
    </section>
  </>;
}

function Kpi({code,value,unit,delta,positive,series,inverse}:{code:string;value:string;unit:string;delta:string;positive?:boolean;series:number[];inverse?:boolean}) {
  const data=series.map((v,i)=>({i,v}));
  return <article className="lab-kpi"><div><span>{code}</span><button><MoreHorizontal/></button></div><section><strong>{value}<small>{unit}</small></strong><em className={positive?"positive":""}>{positive?(inverse?<ArrowDownRight/>:<ArrowUpRight/>):null}{delta}</em></section><div className="kpi-spark"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><defs><linearGradient id={`k-${code.replaceAll(" ","")}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6de8bc" stopOpacity=".25"/><stop offset="1" stopColor="#6de8bc" stopOpacity="0"/></linearGradient></defs><Area dataKey="v" type="monotone" stroke="#6de8bc" strokeWidth={2} fill={`url(#k-${code.replaceAll(" ","")})`} dot={false}/></AreaChart></ResponsiveContainer></div></article>;
}

function PanelHead({eyebrow,title,meta}:{eyebrow:string;title:string;meta:string}) { return <div className="panel-head-dark"><div><span>{eyebrow}</span><h3>{title}</h3></div><em>{meta}</em><button><MoreHorizontal/></button></div>; }
function AngleMetric({label,value,delta,warning}:{label:string;value:string;delta:string;warning?:boolean}) { return <div className="angle-metric"><span>{label}</span><strong>{value}</strong><em className={warning?"warning":""}>{delta}</em><div><i style={{width:warning?"74%":"58%"}}/></div></div>; }
