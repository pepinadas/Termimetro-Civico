import React, { useState, useMemo } from 'react';
import {
  Shield,
  TrendingUp,
  Users,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building2,
  Landmark,
  ChevronRight,
  Info,
  ExternalLink,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Layers,
  Award,
  BookOpen,
  X,
  SlidersHorizontal,
  RefreshCw,
  FileText,
  Check,
  BarChart3,
  Flame,
  ArrowRight,
  Vote
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';

import {
  PARTIDOS_CONFIG,
  ESTADOS_CATALOGO,
  PRESIDENTES_DATA,
  ESTADOS_MANDATARIOS_DATA,
  getMandatariosForEstado
} from './data/mandatariosData.js';

export default function TermometroCivicoStandalone() {
  const [activeTab, setActiveTab] = useState('presidencia');
  const [selectedEstadoId, setSelectedEstadoId] = useState('CDMX');
  const [selectedMandatarioId, setSelectedMandatarioId] = useState('amlo');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('TODAS');
  const [selectedPartyFilter, setSelectedPartyFilter] = useState('TODOS');
  
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [activeEjeFilter, setActiveEjeFilter] = useState('todos');
  const [copiedLink, setCopiedLink] = useState(false);
  
  const [comparadorLeftId, setComparadorLeftId] = useState('amlo');
  const [comparadorRightId, setComparadorRightId] = useState('pena');

  const mandatariosList = useMemo(() => {
    if (activeTab === 'presidencia') {
      return PRESIDENTES_DATA;
    }
    return getMandatariosForEstado(selectedEstadoId);
  }, [activeTab, selectedEstadoId]);

  const currentMandatario = useMemo(() => {
    const found = mandatariosList.find(m => m.id === selectedMandatarioId);
    if (found) return found;
    return mandatariosList[0] || PRESIDENTES_DATA[0];
  }, [mandatariosList, selectedMandatarioId]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab === 'presidencia') {
      setSelectedMandatarioId('amlo');
    } else if (newTab === 'estados') {
      const list = getMandatariosForEstado(selectedEstadoId);
      if (list && list.length > 0) {
        setSelectedMandatarioId(list[0].id);
      }
    }
  };

  const handleEstadoSelect = (estadoId) => {
    setSelectedEstadoId(estadoId);
    const list = getMandatariosForEstado(estadoId);
    if (list && list.length > 0) {
      setSelectedMandatarioId(list[0].id);
    }
  };

  const filteredEstados = useMemo(() => {
    return ESTADOS_CATALOGO.filter(est => {
      const matchesSearch = est.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            est.capital.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'TODAS' || est.region === selectedRegion;
      const matchesParty = selectedPartyFilter === 'TODOS' || est.partidoActual === selectedPartyFilter;
      return matchesSearch && matchesRegion && matchesParty;
    });
  }, [searchQuery, selectedRegion, selectedPartyFilter]);

  const activeEstadoObj = useMemo(() => {
    return ESTADOS_CATALOGO.find(e => e.id === selectedEstadoId) || ESTADOS_CATALOGO[8];
  }, [selectedEstadoId]);

  const currentParty = PARTIDOS_CONFIG[currentMandatario.partido] || PARTIDOS_CONFIG.MORENA;

  const handleCopyReport = () => {
    const reportText = `TERMÓMETRO CÍVICO MX\nMandatario: ${currentMandatario.nombre}\nCargo: ${currentMandatario.cargo} (${currentMandatario.periodo})\nPartido: ${currentMandatario.partido}\nBalance General: ${currentMandatario.resumenBalance.veredicto} (+${currentMandatario.resumenBalance.mejoras} Mejoras / -${currentMandatario.resumenBalance.deterioros} Deterioros)\n\nFuente: Datos oficiales SESNSP, RNPDNO, INEGI, CONEVAL, SHCP con Ventana de Inercia de 180 días.`;
    navigator.clipboard.writeText(reportText).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const allPresidentesAndGobernadores = useMemo(() => {
    const arr = [...PRESIDENTES_DATA];
    Object.values(ESTADOS_MANDATARIOS_DATA).forEach(list => {
      list.forEach(item => {
        if (!arr.find(x => x.id === item.id)) {
          arr.push(item);
        }
      });
    });
    return arr;
  }, []);

  const compLeft = useMemo(() => {
    return allPresidentesAndGobernadores.find(m => m.id === comparadorLeftId) || PRESIDENTES_DATA[4];
  }, [allPresidentesAndGobernadores, comparadorLeftId]);

  const compRight = useMemo(() => {
    return allPresidentesAndGobernadores.find(m => m.id === comparadorRightId) || PRESIDENTES_DATA[3];
  }, [allPresidentesAndGobernadores, comparadorRightId]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* HEADER */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold tracking-tight text-lg sm:text-xl text-white">
                  Termómetro Cívico <span className="text-emerald-400">MX</span>
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Datos Oficiales 1994–2025
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Evaluación técnica del balance inicial vs. final de administraciones federales y estatales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Metodología y Fuentes</span>
            </button>
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '¡Copiado!' : 'Compartir'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* SELECTOR DE NIVEL */}
      <div className="bg-slate-900/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto py-2.5">
            <nav className="flex space-x-2">
              <button
                onClick={() => handleTabChange('presidencia')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'presidencia'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span>Presidencia de la República</span>
                <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full font-mono">6 Mandatos</span>
              </button>

              <button
                onClick={() => handleTabChange('estados')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'estados'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Gobernadores Estatales</span>
                <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full font-mono">32 Estados</span>
              </button>

              <button
                onClick={() => handleTabChange('comparador')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'comparador'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Comparador Cara a Cara</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">Nuevo</span>
              </button>
            </nav>

            <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Regla Técnica: <strong>Ventana de inercia de 180 días</strong> aplicada a cada periodo</span>
            </div>
          </div>
        </div>
      </div>

      {/* CUERPO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">

        {/* MODO COMPARADOR */}
        {activeTab === 'comparador' ? (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Scale className="w-6 h-6 text-emerald-400" />
                    Comparador Cívico Cara a Cara
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Compara objetivamente las tasas iniciales vs finales entre dos mandatarios cualesquiera.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex-1 sm:w-64">
                    <label className="text-[11px] text-slate-400 uppercase font-mono block mb-1">Mandatario A</label>
                    <select
                      value={comparadorLeftId}
                      onChange={(e) => setComparadorLeftId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white font-medium"
                    >
                      {allPresidentesAndGobernadores.map(m => (
                        <option key={`left-${m.id}`} value={m.id}>
                          {m.nombre} ({m.partido} - {m.periodo})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="pt-5 text-slate-500 font-bold">VS</div>
                  <div className="flex-1 sm:w-64">
                    <label className="text-[11px] text-slate-400 uppercase font-mono block mb-1">Mandatario B</label>
                    <select
                      value={comparadorRightId}
                      onChange={(e) => setComparadorRightId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white font-medium"
                    >
                      {allPresidentesAndGobernadores.map(m => (
                        <option key={`right-${m.id}`} value={m.id}>
                          {m.nombre} ({m.partido} - {m.periodo})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* CARAS COMPARADAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PARTIDOS_CONFIG[compLeft.partido]?.badgeBg || 'bg-slate-800'}`}>
                        {compLeft.partido}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">{compLeft.nombre}</h3>
                      <p className="text-xs text-slate-400">{compLeft.cargo} ({compLeft.periodo})</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-400">
                        {compLeft.resumenBalance.mejoras} <span className="text-xs text-slate-400 font-normal">ejes ▲</span>
                      </div>
                      <div className="text-xs text-rose-400 font-medium">
                        {compLeft.resumenBalance.deterioros} <span className="text-slate-400 font-normal">ejes ▼</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <ComparisonMetricRow
                      label="Seguridad (Homicidios / 100k hab)"
                      t0={compLeft.ejes.seguridad.t0}
                      t1={compLeft.ejes.seguridad.t1}
                      delta={compLeft.ejes.seguridad.deltaPorcentaje}
                      isImprovement={compLeft.ejes.seguridad.deltaPorcentaje < 0}
                      unit="por 100k hab"
                    />
                    {compLeft.ejes.seguridad.desapariciones && (
                      <ComparisonMetricRow
                        label="Desaparición de Personas (RNPDNO / año)"
                        t0={compLeft.ejes.seguridad.desapariciones.t0}
                        t1={compLeft.ejes.seguridad.desapariciones.t1}
                        delta={compLeft.ejes.seguridad.desapariciones.deltaPorcentaje}
                        isImprovement={compLeft.ejes.seguridad.desapariciones.deltaPorcentaje <= 0}
                        unit="casos / año"
                      />
                    )}
                    <ComparisonMetricRow
                      label="Economía (Crecimiento PIB / Empleo)"
                      t0={compLeft.ejes.economia.t0}
                      t1={compLeft.ejes.economia.t1}
                      delta={compLeft.ejes.economia.deltaPorcentaje}
                      isImprovement={compLeft.ejes.economia.status === 'mejora'}
                      unit="% PIB anual"
                    />
                    <ComparisonMetricRow
                      label="Pobreza (% Población en Pobreza)"
                      t0={compLeft.ejes.pobreza.t0}
                      t1={compLeft.ejes.pobreza.t1}
                      delta={compLeft.ejes.pobreza.deltaPorcentaje}
                      isImprovement={compLeft.ejes.pobreza.deltaPorcentaje < 0}
                      unit="% población"
                    />
                    <ComparisonMetricRow
                      label="Disciplina (% Deuda Pública / PIB)"
                      t0={compLeft.ejes.disciplina.t0}
                      t1={compLeft.ejes.disciplina.t1}
                      delta={compLeft.ejes.disciplina.deltaPorcentaje}
                      isImprovement={compLeft.ejes.disciplina.deltaPorcentaje <= 0}
                      unit="% PIB"
                    />
                    {compLeft.ejes.democracia && (
                      <ComparisonMetricRow
                        label="Democracia (EIU / V-Dem / IDD-Mex)"
                        t0={compLeft.ejes.democracia.t0}
                        t1={compLeft.ejes.democracia.t1}
                        delta={compLeft.ejes.democracia.deltaPorcentaje}
                        isImprovement={compLeft.ejes.democracia.deltaPorcentaje >= 0}
                        unit={compLeft.ejes.democracia.unidad}
                      />
                    )}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PARTIDOS_CONFIG[compRight.partido]?.badgeBg || 'bg-slate-800'}`}>
                        {compRight.partido}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">{compRight.nombre}</h3>
                      <p className="text-xs text-slate-400">{compRight.cargo} ({compRight.periodo})</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-400">
                        {compRight.resumenBalance.mejoras} <span className="text-xs text-slate-400 font-normal">ejes ▲</span>
                      </div>
                      <div className="text-xs text-rose-400 font-medium">
                        {compRight.resumenBalance.deterioros} <span className="text-slate-400 font-normal">ejes ▼</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <ComparisonMetricRow
                      label="Seguridad (Homicidios / 100k hab)"
                      t0={compRight.ejes.seguridad.t0}
                      t1={compRight.ejes.seguridad.t1}
                      delta={compRight.ejes.seguridad.deltaPorcentaje}
                      isImprovement={compRight.ejes.seguridad.deltaPorcentaje < 0}
                      unit="por 100k hab"
                    />
                    {compRight.ejes.seguridad.desapariciones && (
                      <ComparisonMetricRow
                        label="Desaparición de Personas (RNPDNO / año)"
                        t0={compRight.ejes.seguridad.desapariciones.t0}
                        t1={compRight.ejes.seguridad.desapariciones.t1}
                        delta={compRight.ejes.seguridad.desapariciones.deltaPorcentaje}
                        isImprovement={compRight.ejes.seguridad.desapariciones.deltaPorcentaje <= 0}
                        unit="casos / año"
                      />
                    )}
                    <ComparisonMetricRow
                      label="Economía (Crecimiento PIB / Empleo)"
                      t0={compRight.ejes.economia.t0}
                      t1={compRight.ejes.economia.t1}
                      delta={compRight.ejes.economia.deltaPorcentaje}
                      isImprovement={compRight.ejes.economia.status === 'mejora'}
                      unit="% PIB anual"
                    />
                    <ComparisonMetricRow
                      label="Pobreza (% Población en Pobreza)"
                      t0={compRight.ejes.pobreza.t0}
                      t1={compRight.ejes.pobreza.t1}
                      delta={compRight.ejes.pobreza.deltaPorcentaje}
                      isImprovement={compRight.ejes.pobreza.deltaPorcentaje < 0}
                      unit="% población"
                    />
                    <ComparisonMetricRow
                      label="Disciplina (% Deuda Pública / PIB)"
                      t0={compRight.ejes.disciplina.t0}
                      t1={compRight.ejes.disciplina.t1}
                      delta={compRight.ejes.disciplina.deltaPorcentaje}
                      isImprovement={compRight.ejes.disciplina.deltaPorcentaje <= 0}
                      unit="% PIB"
                    />
                    {compRight.ejes.democracia && (
                      <ComparisonMetricRow
                        label="Democracia (EIU / V-Dem / IDD-Mex)"
                        t0={compRight.ejes.democracia.t0}
                        t1={compRight.ejes.democracia.t1}
                        delta={compRight.ejes.democracia.deltaPorcentaje}
                        isImprovement={compRight.ejes.democracia.deltaPorcentaje >= 0}
                        unit={compRight.ejes.democracia.unidad}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* SELECTOR DE ESTADOS (SI PESTAÑA ESTADOS ESTÁ ACTIVA) */}
        {activeTab === 'estados' ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                    Entidades Federativas de México
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {filteredEstados.length} de 32 estados
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecciona una entidad para desplegar su cronología histórica de gobernadores y métricas oficiales.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar estado..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="TODAS">Todas las Regiones</option>
                  <option value="Norte">Norte</option>
                  <option value="Centro">Centro</option>
                  <option value="Occidente">Occidente</option>
                  <option value="Sur-Sureste">Sur-Sureste</option>
                </select>

                <select
                  value={selectedPartyFilter}
                  onChange={(e) => setSelectedPartyFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="TODOS">Todos los Partidos</option>
                  <option value="MORENA">MORENA</option>
                  <option value="PAN">PAN</option>
                  <option value="PRI">PRI</option>
                  <option value="MC">MC</option>
                  <option value="PVEM">PVEM</option>
                </select>
              </div>
            </div>

            {/* GRID DE 32 ESTADOS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 pt-2 max-h-56 overflow-y-auto p-1">
              {filteredEstados.map((est) => {
                const isSelected = est.id === selectedEstadoId;
                const partyMeta = PARTIDOS_CONFIG[est.partidoActual] || PARTIDOS_CONFIG.MORENA;
                return (
                  <button
                    key={est.id}
                    onClick={() => handleEstadoSelect(est.id)}
                    className={`p-2 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-400">{est.id}</span>
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: partyMeta.accent }}
                        title={`Gobernado por ${est.partidoActual}`}
                      />
                    </div>
                    <div className="mt-1">
                      <div className="text-xs font-semibold text-white truncate">{est.nombre}</div>
                      <div className="text-[10px] text-slate-400 truncate">{est.region}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* LÍNEA DE TIEMPO INTERACTIVA */}
        {activeTab !== 'comparador' && (
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Línea de Tiempo ({activeTab === 'presidencia' ? 'Presidencia de México' : activeEstadoObj.nombre})
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Clic en un mandato para actualizar el dashboard
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {mandatariosList.map((mandatario) => {
                const isSelected = mandatario.id === currentMandatario.id;
                const party = PARTIDOS_CONFIG[mandatario.partido] || PARTIDOS_CONFIG.MORENA;
                return (
                  <button
                    key={mandatario.id}
                    onClick={() => setSelectedMandatarioId(mandatario.id)}
                    className={`group relative flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className="w-1.5 h-8 rounded-full"
                      style={{ backgroundColor: party.accent }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${party.badgeBg}`}>
                          {mandatario.partido}
                        </span>
                        {mandatario.enCurso && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-medium">
                            En curso
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5 group-hover:text-emerald-300 transition-colors">
                        {mandatario.nombre}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {mandatario.periodo}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PERFIL DEL MANDATARIO Y SCORE */}
        {activeTab !== 'comparador' && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: currentParty.accent }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              <div className="flex items-start sm:items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/80 p-1 flex items-center justify-center shadow-xl">
                    <div className="w-full h-full rounded-[14px] bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                      <Users className="w-10 h-10 text-slate-400" />
                      <div
                        className="absolute bottom-0 inset-x-0 h-1.5"
                        style={{ backgroundColor: currentParty.accent }}
                      />
                    </div>
                  </div>
                  <span
                    className={`absolute -bottom-2 -right-2 text-[10px] font-extrabold px-2 py-0.5 rounded-md border shadow-md ${currentParty.badgeBg}`}
                  >
                    {currentMandatario.partido}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {currentMandatario.nombre}
                    </h2>
                    {currentMandatario.enCurso && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        Mandato Vigente
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-300">
                    {currentMandatario.cargo}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {currentMandatario.periodoExacto}
                    </span>
                    <span className="hidden sm:inline text-slate-600">•</span>
                    <span>Partido: <strong className="text-slate-200">{currentParty.nombre}</strong></span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/90 border border-slate-800 min-w-28 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      Balance Cívico
                    </span>
                    <div className="text-2xl font-black mt-0.5 flex items-center justify-center gap-1">
                      {currentMandatario.enCurso ? (
                        <span className="text-amber-400 text-lg">En curso</span>
                      ) : (
                        <>
                          <span className="text-emerald-400">+{currentMandatario.resumenBalance.mejoras}</span>
                          <span className="text-slate-600">/</span>
                          <span className="text-rose-400">-{currentMandatario.resumenBalance.deterioros}</span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {currentMandatario.enCurso ? 'Datos iniciales' : 'de 5 ejes clave'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider inline-flex items-center gap-1.5 ${
                          currentMandatario.resumenBalance.veredicto === 'Balance Positivo'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : currentMandatario.resumenBalance.veredicto === 'Balance Favorable'
                            ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                            : currentMandatario.resumenBalance.veredicto === 'Balance Mixto'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : currentMandatario.resumenBalance.veredicto.includes('curso')
                            ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        {currentMandatario.resumenBalance.veredicto}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                      {currentMandatario.resumenBalance.sintesis}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Filtrar eje:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'todos', label: 'Todos (5)' },
                    { id: 'seguridad', label: 'Seguridad' },
                    { id: 'economia', label: 'Economía' },
                    { id: 'pobreza', label: 'Pobreza' },
                    { id: 'disciplina', label: 'Finanzas' },
                    { id: 'democracia', label: 'Democracia' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveEjeFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        activeEjeFilter === tab.id
                          ? 'bg-slate-200 text-slate-900 font-bold'
                          : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-3 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> ▲ = Mejoró
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> ▼ = Empeoró
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> Desaparición (RNPDNO)
                </span>
              </div>
            </div>

          </div>
        )}

        {/* 4 EJES CLAVE (CARDS Y GRÁFICAS) */}
        {activeTab !== 'comparador' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {(activeEjeFilter === 'todos' || activeEjeFilter === 'seguridad') && (
              <EjeCard
                ejeKey="seguridad"
                title="1. Seguridad Pública"
                icon={<Shield className="w-5 h-5 text-emerald-400" />}
                data={currentMandatario.ejes.seguridad}
                isEnCurso={currentMandatario.enCurso}
              />
            )}

            {(activeEjeFilter === 'todos' || activeEjeFilter === 'economia') && (
              <EjeCard
                ejeKey="economia"
                title="2. Economía y Empleo"
                icon={<TrendingUp className="w-5 h-5 text-teal-400" />}
                data={currentMandatario.ejes.economia}
                isEnCurso={currentMandatario.enCurso}
              />
            )}

            {(activeEjeFilter === 'todos' || activeEjeFilter === 'pobreza') && (
              <EjeCard
                ejeKey="pobreza"
                title="3. Pobreza y Bienestar Social"
                icon={<Users className="w-5 h-5 text-cyan-400" />}
                data={currentMandatario.ejes.pobreza}
                isEnCurso={currentMandatario.enCurso}
              />
            )}

            {(activeEjeFilter === 'todos' || activeEjeFilter === 'disciplina') && (
              <EjeCard
                ejeKey="disciplina"
                title="4. Disciplina Financiera y Corrupción"
                icon={<Scale className="w-5 h-5 text-indigo-400" />}
                data={currentMandatario.ejes.disciplina}
                isEnCurso={currentMandatario.enCurso}
              />
            )}

            {(activeEjeFilter === 'todos' || activeEjeFilter === 'democracia') && currentMandatario.ejes.democracia && (
              <EjeCard
                ejeKey="democracia"
                title="5. Calidad Democrática y Libertades"
                icon={<Vote className="w-5 h-5 text-amber-400" />}
                data={currentMandatario.ejes.democracia}
                isEnCurso={currentMandatario.enCurso}
              />
            )}

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 mt-12 py-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-emerald-400" />
            <p className="text-slate-300 font-medium">
              Termómetro Cívico MX — Plataforma de Transparencia Ciudadana y Análisis de Datos Oficiales.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <a href="https://www.gob.mx/sesnsp" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              SESNSP <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://versionpublicarnpdno.segob.gob.mx/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 flex items-center gap-1">
              RNPDNO (CNB) <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://www.inegi.org.mx/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              INEGI <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://www.coneval.org.mx/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              CONEVAL <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://www.disciplinafinanciera.hacienda.gob.mx/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
              SHCP <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://idd-mex.org/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1">
              IDD-Mex (INE/KAS) <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://freedomhouse.org/countries/freedom-world/scores" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1">
              Freedom House / V-Dem <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* MODAL METODOLOGÍA */}
      {isMethodologyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">
                  Metodología Oficial y Fuentes de Datos Abiertos
                </h3>
              </div>
              <button
                onClick={() => setIsMethodologyOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1.5">
                <div className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Regla de la Ventana de Inercia de 6 Meses (180 Días)
                </div>
                <p>
                  En análisis de políticas públicas, la inercia institucional estipula que los primeros 180 días de una administración corresponden preponderantemente a las condiciones contractuales y de presupuesto del gobierno saliente.
                </p>
                <p className="text-[11px] text-amber-300/80">
                  Por ello, el punto de inicio de evaluación (T0) toma como base el cierre consolidado del periodo inmediato anterior, evitando penalizaciones o reconocimientos injustificados al arranque.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-white">Fuentes Oficiales</h4>
                <ul className="space-y-2">
                  <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong className="text-white">Seguridad (Homicidios):</strong> SESNSP (Secretariado Ejecutivo del SNSP) — Incidencia Delictiva Oficial y Homicidios Dolosos.
                  </li>
                  <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong className="text-white">Desaparición de Personas:</strong> RNPDNO (Registro Nacional de Personas Desaparecidas y No Localizadas) de la Comisión Nacional de Búsqueda (CNB - SEGOB), con fundamento en la Ley General de 2017.
                  </li>
                  <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong className="text-white">Economía y Empleo:</strong> INEGI (Banco de Información Económica y tasas de desempleo) y registros de puestos formales IMSS.
                  </li>
                  <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong className="text-white">Pobreza:</strong> CONEVAL (Medición multidimensional de la pobreza y evolución por ingresos).
                  </li>
                  <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong className="text-white">Disciplina y Finanzas:</strong> SHCP (Registro Público Único de Deuda y Sistema de Alertas) y Encuesta ENCIG del INEGI.
                  </li>
                  <li className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong className="text-white">Democracia y Libertades:</strong> Varieties of Democracy (V-Dem Institute), Freedom House, Democracy Index de The Economist (EIU), e Índice de Desarrollo Democrático de México (IDD-Mex INE/KAS/Polilat).
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-white">Fórmula de Medición Neta</h4>
                <p>
                  Variación porcentual estricta: <code>[((T1 - T0) / T0) * 100]</code>.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-emerald-400 font-bold">▲ MEJORA:</span>
                    <ul className="list-disc list-inside text-slate-400 mt-1">
                      <li>Homicidios y desapariciones disminuyen</li>
                      <li>PIB / Empleo aumentan</li>
                      <li>Pobreza disminuye</li>
                      <li>Deuda pública disminuye</li>
                      <li>Democracia / Libertades aumentan</li>
                    </ul>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-rose-400 font-bold">▼ DETERIORO:</span>
                    <ul className="list-disc list-inside text-slate-400 mt-1">
                      <li>Homicidios y desapariciones aumentan</li>
                      <li>PIB / Empleo caen</li>
                      <li>Pobreza aumenta</li>
                      <li>Deuda pública aumenta</li>
                      <li>Democracia / Libertades disminuyen</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsMethodologyOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// SUB-COMPONENTE DE TARJETA CON GRÁFICA
function EjeCard({ ejeKey, title, icon, data, isEnCurso }) {
  const [seguridadSubTipo, setSeguridadSubTipo] = useState('homicidios');

  const isSeguridad = ejeKey === 'seguridad';
  const hasDesapariciones = isSeguridad && !!data.desapariciones;
  const isViewingDesapariciones = isSeguridad && seguridadSubTipo === 'desapariciones' && hasDesapariciones;

  const currentStatus = isViewingDesapariciones ? data.desapariciones.status : data.status;
  const isMejora = currentStatus === 'mejora';
  const isDeterioro = currentStatus === 'deterioro';

  const displayT0 = isViewingDesapariciones ? data.desapariciones.t0 : data.t0;
  const displayT1 = isViewingDesapariciones ? data.desapariciones.t1 : data.t1;
  const displayUnit = isViewingDesapariciones ? data.desapariciones.unidad : data.unidad;
  const displayDelta = isViewingDesapariciones ? data.desapariciones.deltaPorcentaje : data.deltaPorcentaje;
  const displayFuente = isViewingDesapariciones ? data.desapariciones.fuente : data.fuente;
  const displayEnlace = isViewingDesapariciones ? data.desapariciones.enlace : data.enlace;
  const chartDataKey = isViewingDesapariciones ? 'desapariciones' : 'valor';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition-all">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">{title}</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[240px] sm:max-w-xs">
                {isViewingDesapariciones ? data.desapariciones.metrica : data.metrica}
              </p>
            </div>
          </div>

          <div>
            {isEnCurso ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 uppercase tracking-wide">
                En curso
              </span>
            ) : isMejora ? (
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 uppercase tracking-wider">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                Mejoró
              </span>
            ) : (
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1 uppercase tracking-wider">
                <ArrowDownRight className="w-3.5 h-3.5 stroke-[3]" />
                Empeoró
              </span>
            )}
          </div>
        </div>

        {hasDesapariciones && (
          <div className="mt-3.5 flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => setSeguridadSubTipo('homicidios')}
              className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                seguridadSubTipo === 'homicidios'
                  ? 'bg-slate-800 text-white shadow border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Homicidios (SESNSP)</span>
            </button>
            <button
              onClick={() => setSeguridadSubTipo('desapariciones')}
              className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                seguridadSubTipo === 'desapariciones'
                  ? 'bg-purple-950/80 text-purple-200 border border-purple-800/60 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Desapariciones (RNPDNO)</span>
              <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono">Oficial</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-3 bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 block flex items-center gap-1">
              Inicio (T0)
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Ventana 180d"></span>
            </span>
            <div className="text-base font-black text-slate-200">{displayT0}</div>
            <span className="text-[9px] text-slate-500 block truncate">{displayUnit}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              {isEnCurso ? 'Actual (T1)' : 'Cierre (T1)'}
            </span>
            <div className="text-base font-black text-white">{displayT1}</div>
            <span className="text-[9px] text-slate-500 block truncate">{displayUnit}</span>
          </div>

          <div className="space-y-0.5 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Variación Neta</span>
            <div className={`text-base font-black ${isMejora ? 'text-emerald-400' : isDeterioro ? 'text-rose-400' : 'text-sky-300'}`}>
              {displayDelta > 0 ? `+${displayDelta}%` : `${displayDelta}%`}
            </div>
            <span className="text-[9px] text-slate-500 block">delta sexenal</span>
          </div>
        </div>

        {hasDesapariciones && (
          <div className="mt-2.5 p-2 rounded-xl bg-purple-950/30 border border-purple-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <div className="text-[11px] text-slate-300">
                <span className="font-bold text-purple-200">Acumulado en el periodo:</span>{' '}
                <span className="text-purple-300 font-medium">{data.desapariciones.acumuladas}</span>
              </div>
            </div>
            <span className="text-[10px] text-purple-400/90 font-mono">RNPDNO/CNB</span>
          </div>
        )}

        <div className="mt-3 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
          {data.criterio}
          {data.empleoGenerado && (
            <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
              • Empleo: {data.empleoGenerado}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1.5 pt-2">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
          <span>
            {isViewingDesapariciones ? 'Desapariciones Anuales (RNPDNO)' : 'Trayectoria Anual Oficial'}
          </span>
          <span className="text-amber-400/90 font-medium">Primer año = Inercia 180d</span>
        </div>

        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.serie} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-sa-${ejeKey}-${isViewingDesapariciones ? 'desap' : 'main'}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isViewingDesapariciones ? '#a855f7' : isMejora ? '#10b981' : isDeterioro ? '#f43f5e' : '#38bdf8'} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={isViewingDesapariciones ? '#a855f7' : isMejora ? '#10b981' : isDeterioro ? '#f43f5e' : '#38bdf8'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip unit={displayUnit} isViewingDesapariciones={isViewingDesapariciones} />} />
              <ReferenceLine y={displayT0} stroke="#475569" strokeDasharray="2 2" />
              <Area
                type="monotone"
                dataKey={chartDataKey}
                stroke={isViewingDesapariciones ? '#c084fc' : isMejora ? '#10b981' : isDeterioro ? '#f43f5e' : '#38bdf8'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#grad-sa-${ejeKey}-${isViewingDesapariciones ? 'desap' : 'main'})`}
                dot={{ r: 3, fill: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[230px] sm:max-w-xs">{displayFuente}</span>
        <a href={displayEnlace} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium">
          Fuente <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, unit, isViewingDesapariciones }) {
  if (active && payload && payload.length) {
    const item = payload[0];
    const isFirst = item.payload.inercia;
    const homVal = item.payload.valor;
    const desapVal = item.payload.desapariciones;

    return (
      <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1.5 min-w-44">
        <div className="font-mono text-[10px] text-slate-400 font-bold flex items-center justify-between gap-1.5">
          <span>Año {label}</span>
          {isFirst && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Inercia (T0)
            </span>
          )}
        </div>
        <div className="space-y-0.5">
          <div className="text-white font-bold text-sm">
            {item.value} <span className="text-slate-400 text-xs font-normal">{unit}</span>
          </div>
          {desapVal !== undefined && (
            <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 mt-1 flex flex-col gap-0.5">
              <span>• Homicidios: <strong className="text-slate-200">{homVal}</strong> / 100k hab</span>
              <span>• Desapariciones: <strong className="text-purple-300">{desapVal}</strong> casos</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

function ComparisonMetricRow({ label, t0, t1, delta, isImprovement, unit }) {
  return (
    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
      <div>
        <div className="font-semibold text-slate-200">{label}</div>
        <div className="text-[11px] text-slate-400 font-mono">
          T0: {t0} → T1: {t1} {unit}
        </div>
      </div>
      <div className="text-right">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isImprovement
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}
        >
          {delta > 0 ? `+${delta}%` : `${delta}%`}
        </span>
      </div>
    </div>
  );
}
