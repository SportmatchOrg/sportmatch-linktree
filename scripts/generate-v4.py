#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera los datos v4 de las vistas de leadership (WBS, PERT y Gantt) y las tablas
del calendario semana a semana del Cronograma v4.

Entradas
  docs/planning/WBS-SportMatch-v4.md        116 paquetes: título, dependencias, horas PERT
  docs/planning/Export Thu Sep 17 2026.csv  export de Linear: estado y fechas reales por ticket

Salidas (intermedias; se pegan a mano en los HTML y en el doc, no se commitean)
  scripts/_v4_wbs.js          bloque V4_ADD para leadership/wbs.html
  scripts/_v4_pert.js         tasks / deps / groups para leadership/pert.html (116 paquetes)
  scripts/_v4_gantt.js        tasks para leadership/gantt.html (76 paquetes de desarrollo)
  scripts/_v4_calendario.md   tablas para Cronograma-y-PERT-v4.md (§4 con fechas y §9 semanal)

Calendario: semanas de jueves a jueves, cierre a las 18 h. La semana 1 abre el 06/08.
S1 = semanas 1–6 (cierra 17/09) · S2 = 7–10 (15/10) · S3 = 11–13 (05/11) · semana 14 = reserva.
"""
import csv, io, json, re
from collections import defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WBS = ROOT / 'docs' / 'planning' / 'WBS-SportMatch-v4.md'
EXPORT = ROOT / 'docs' / 'planning' / 'Export Thu Sep 17 2026.csv'
OUT = ROOT / 'scripts'

# ───────────────────────── calendario ─────────────────────────
WEEK1 = date(2026, 8, 6)                  # jueves que abre la semana 1
N_WEEKS = 14
RESERVE_WEEK = 14                         # 05/11 → 12/11: sin trabajo planificado
SPRINT_WEEKS = {'S1': (1, 6), 'S2': (7, 10), 'S3': (11, 13)}
CAP_PER_DEV = 6.0                         # h por dev y semana
MIN_CHUNK = 3.0                           # h mínimas libres en la semana en que arranca una tarea
TAIL = 0.5                                # cola máxima que una semana absorbe por encima de las 6 h
DEVS = (1, 2, 3)                          # 1 Front (Pache) · 2 Back (Rudolph) · 3 Infra (Siaba)

def wstart(n): return WEEK1 + timedelta(days=7 * (n - 1))
def wend(n):   return WEEK1 + timedelta(days=7 * n)
def week_of(ts_utc):
    """Semana a la que pertenece un instante de Linear: cierra el jueves a las 18 h (ART)."""
    t = ts_utc - timedelta(hours=3)
    for n in range(1, N_WEEKS + 1):
        if t <= datetime.combine(wend(n), datetime.min.time()).replace(hour=18):
            return n
    raise ValueError(ts_utc)
def sprint_of_week(n):
    for s, (a, b) in SPRINT_WEEKS.items():
        if a <= n <= b: return s
    return 'reserva'

# ───────────────────────── WBS v4 ─────────────────────────
txt = io.open(WBS, encoding='utf-8').read()
PKG_RE = re.compile(r'^\*\*(\d+\.\d+\.\d+)\*\*([^\n]*?)— ([^\n:]+?)[:.] [^\n]*\n<br>\*Dependencias:\* ([^·]+)· \*Estimación:\* ([0-9.]+) h', re.M)
TASKS = {}
for m in PKG_RE.finditer(txt):
    tid, mark, title, deps, est = m.groups()
    deps = [] if deps.strip().startswith('—') else [d.strip() for d in deps.split(',') if d.strip()]
    TASKS[tid] = {'title': title.strip(), 'deps': deps, 'dur': float(est), 'new_v4': '✳️' in mark}
assert len(TASKS) == 116, len(TASKS)

MODULES = dict(re.findall(r'^## (\d+)\.0 ([^\n]+?)(?: — \*\*NUEVO\*\*)?$', txt, re.M))          # '4' -> 'Autenticación'
SUBS = dict(re.findall(r'^### (\d+\.\d+) ([^\n]+?)(?: — \*\*NUEVO\*\*)?$', txt, re.M))          # '4.1' -> 'Backend de autenticación'
MOD_NAME = {k: f'{k}.0 {v}' for k, v in MODULES.items()}
key = lambda s: tuple(int(p) for p in s.split('.'))
l2 = lambda s: '.'.join(s.split('.')[:2])

# Dependencias blandas que conserva el modelo de desarrollo (mismas que en v2 y en pert_v4.py).
SOFT = {'3.2.1': ['3.1.3'], '4.1.1': ['3.1.2']}
for k, v in SOFT.items():
    TASKS[k]['deps'] = sorted(set(TASKS[k]['deps'] + v), key=key)

# ───────────────────────── CPM ─────────────────────────
def cpm(scope):
    """scope: dict id -> {'deps','dur'}; deps fuera del scope se ignoran. Devuelve ES/EF/LS/LF/H."""
    deps = {k: [d for d in v['deps'] if d in scope] for k, v in scope.items()}
    order, seen = [], {}
    def visit(n):
        if seen.get(n) == 2: return
        assert seen.get(n) != 1, 'ciclo en ' + n
        seen[n] = 1
        for d in deps[n]: visit(d)
        seen[n] = 2; order.append(n)
    for n in scope: visit(n)
    r = {}
    for n in order:
        es = max([r[d]['EF'] for d in deps[n]] or [0.0])
        r[n] = {'ES': es, 'EF': es + scope[n]['dur']}
    T = max(v['EF'] for v in r.values())
    succ = defaultdict(list)
    for n, ds in deps.items():
        for d in ds: succ[d].append(n)
    for n in reversed(order):
        lf = min([r[s]['LS'] for s in succ[n]] or [T])
        r[n]['LF'] = lf; r[n]['LS'] = lf - scope[n]['dur']
        r[n]['H'] = round(r[n]['LS'] - r[n]['ES'], 2)
    return r, deps, T

FULL, FULL_DEPS, T_FULL = cpm(TASKS)
DEV_SCOPE = {'3', '4', '5', '6', '7', '9', '10', '11', '12'}
DEV = {k: v for k, v in TASKS.items() if k.split('.')[0] in DEV_SCOPE}
DEVCPM, DEV_DEPS, T_DEV = cpm(DEV)
assert len(DEV) == 76, len(DEV)
crit_full = sorted([n for n in FULL if abs(FULL[n]['H']) < 1e-6], key=lambda n: FULL[n]['ES'])
crit_dev  = sorted([n for n in DEVCPM if abs(DEVCPM[n]['H']) < 1e-6], key=lambda n: DEVCPM[n]['ES'])

# ───────────────────────── Linear ─────────────────────────
DONE_STATUSES = {'Done', 'Todo', 'In Progress', 'In Review'}   # cierran antes del steering del 17/09
ASSIGNEE_DEV = {'ipacheco@mail.austral.edu.ar': 1, 'jrudolph@mail.austral.edu.ar': 2, 'jfsiaba@mail.austral.edu.ar': 3}
TICKETS = {}
with io.open(EXPORT, encoding='utf-8') as f:
    for r in csv.DictReader(f):
        n = int(r['ID'].split('-')[1])
        P = lambda s: datetime.strptime(s[:19], '%Y-%m-%dT%H:%M:%S') if s else None
        TICKETS[n] = {'status': r['Status'], 'started': P(r['Started']), 'completed': P(r['Completed']),
                      'dev': ASSIGNEE_DEV.get(r['Assignee']), 'title': r['Title']}

# Paquete -> tickets que lo cerraron. Fuente: columna "Qué se hizo" de Estado-real-WBS-15-09.md
# y tabla "Entregables incorporados" de WBS-SportMatch-v4.md. Quedan fuera los hotfix y los
# arreglos de UI (SPO-184, 194, 214) y las reglas de autorización (SPO-185 va sólo a 5.1.2):
# no son alcance del paquete y estiraban su ventana hasta septiembre.
PKG_TICKETS = {
 '3.1.2': [113,114,115,116,118,119,120,122,124,125,126],
 '3.2.1': [143,144,145],          '3.2.2': [146,163],          '3.2.3': [147,148,174],
 '4.1.1': [149,155],              '4.1.2': [157],              '4.1.3': [152],
 '4.1.4': [151,153,154],          '4.2.1': [158],              '4.2.2': [159],
 '4.2.3': [158],                  '4.2.4': [192],              '4.2.5': [165,177],
 '5.1.1': [149],                  '5.1.2': [155,157,185],      '5.1.3': [172,187,213],
 '5.1.4': [212],                  '5.1.5': [212],              '5.2.1': [142,191],
 '5.2.3': [191],                  '5.2.4': [191,212,218],      '5.2.5': [216],
 '6.1.1': [163],                  '6.1.2': [164,182],          '6.1.3': [170,186],
 '6.1.5': [169,183],              '6.2.1': [166,189],          '6.2.2': [219],
 '6.2.3': [179],                  '6.2.4': [180],              '6.3.1': [196],
 '6.3.2': [196],                  '6.3.3': [197,199],          '6.3.4': [198,213,217],
 '6.3.5': [168,171],              '6.4.1': [207,211],          '6.4.2': [208,215,218],
 '7.1.1': [186],                  '7.2.1': [178],              '7.2.2': [178,179,198],
 '9.1.1': [173],                  '9.1.2': [175,176],          '9.1.3': [176],
 '9.1.4': [161,167],
}
# Paquetes hechos sin ticket propio: semana (inicio, fin) fijada a mano.
MANUAL_WEEK = {
 '3.1.1': (1, 1, 3),   # stack definido en el kick-off (Infra)
 '3.1.3': (1, 1, 3),   # convenciones de ramas/PR/Linear escritas en AGENTS.md la semana del kick-off
 '10.2.1': (2, 2, 3),  # README con instalación y ejecución local, junto con la base del repo (SPO-143)
}
# Estado según Cronograma-y-PERT-v4.md §4/§5: 43 ✅ (S1), 5 🟡 (parciales, cierran en S2).
# 6.4.2 cierra en el S1: SPO-215 y SPO-218 pasaron a Done el 15/09 y el 16/09 (export del 17/09).
DONE = {'3.1.1','3.1.2','3.1.3','3.2.1','3.2.2','3.2.3','4.1.1','4.1.2','4.1.3','4.1.4','4.2.1','4.2.2',
        '4.2.3','4.2.4','4.2.5','5.1.2','5.1.3','5.1.5','5.2.1','5.2.4','5.2.5','6.1.1','6.1.2','6.1.3',
        '6.1.5','6.2.1','6.2.2','6.2.3','6.2.4','6.3.1','6.3.2','6.3.3','6.3.4','6.3.5','6.4.1','7.2.1',
        '6.4.2','7.2.2','9.1.1','9.1.2','9.1.3','9.1.4','10.2.1'}
WIP = {'5.1.1', '5.1.4', '5.2.3', '7.1.1', '10.1.2'}
SPRINT_OF = {}
for k in DONE: SPRINT_OF[k] = 'S1'
for k in ['5.1.1','5.1.4','5.2.2','5.2.3','6.1.4','6.2.5','6.2.6','6.4.3','7.1.1','7.1.2','7.1.3',
          '7.3.1','7.3.2','7.3.3','10.1.2','11.1.1','11.1.2','11.1.3','11.2.1','11.2.2','11.2.3']: SPRINT_OF[k] = 'S2'
for k in ['6.5.1','6.5.2','6.5.3','10.1.1','10.2.2','11.1.4','12.1.1','12.1.2','12.1.3','12.2.1','12.2.2','12.2.3']: SPRINT_OF[k] = 'S3'
assert set(SPRINT_OF) == set(DEV), set(DEV) ^ set(SPRINT_OF)
assert len(DONE) == 43 and len([k for k, s in SPRINT_OF.items() if s == 'S2']) == 21

# Dev preferido para lo pendiente, por naturaleza del paquete. El scheduler puede dárselo a otro
# dev si así termina antes: Siaba (3) tomó tickets de front en los sprints 4 y 5.
DEV_PREF = {}
for k in SPRINT_OF:
    if k in DONE: continue
    mod, sub = k.split('.')[0], l2(k)
    if k in ('7.3.1', '10.1.1', '10.1.2', '10.2.2', '11.1.2'): DEV_PREF[k] = 3
    elif sub in ('5.2', '6.2', '7.2', '7.3', '11.2') or k in ('7.1.2', '6.4.2', '6.5.1', '12.1.3', '12.2.1'): DEV_PREF[k] = 1
    else: DEV_PREF[k] = 2

# ───────────────────────── fechas de lo hecho ─────────────────────────
sched = {}   # id -> {'sw','ew','dev','status'}
for k in DEV:
    if k in PKG_TICKETS:
        ts = [TICKETS[n] for n in PKG_TICKETS[k]]
        bad = [n for n, t in zip(PKG_TICKETS[k], ts) if t['status'] not in DONE_STATUSES]
        assert not bad or k in WIP, (k, bad)
        starts = [week_of(t['started']) if t['started'] else 6 for t in ts if t['status'] in DONE_STATUSES]
        ends = [week_of(t['completed']) if t['completed'] else 6 for t in ts if t['status'] in DONE_STATUSES]
        devs = [t['dev'] for t in ts if t['dev']]
        dev = max(set(devs), key=devs.count) if devs else 3
        sched[k] = {'sw': min(starts), 'ew': max(ends), 'dev': dev}
    elif k in MANUAL_WEEK:
        sw, ew, dev = MANUAL_WEEK[k]; sched[k] = {'sw': sw, 'ew': ew, 'dev': dev}
    if k in DONE:
        assert k in sched, k
        assert sched[k]['ew'] <= 6, (k, sched[k])
        sched[k]['status'] = 'done'

# ───────────────────────── planificación de lo pendiente ─────────────────────────
cap = {d: {w: CAP_PER_DEV for w in range(1, N_WEEKS + 1)} for d in DEVS}
pending = [k for k in DEV if k not in DONE]
# Prioridad: sprint, después la cadena más larga que queda por delante dentro del mismo sprint
# (para que un dev tome el bloque completo y no se pierda una semana en cada cambio de manos), después id.
SUCC = defaultdict(list)
for k, ds in DEV_DEPS.items():
    for d in ds: SUCC[d].append(k)
_rank = {}
def rank(k):
    if k not in _rank:
        _rank[k] = DEV[k]['dur'] + max([rank(s) for s in SUCC[k] if SPRINT_OF[s] == SPRINT_OF[k]] or [0.0])
    return _rank[k]
# Las tareas del camino crítico del PERT, y las que las preceden, van primero dentro de su sprint.
_urg = {}
def urgent(k):
    if k not in _urg:
        _urg[k] = DEVCPM[k]['H'] < 1e-6 or any(urgent(s) for s in SUCC[k])
    return _urg[k]
prio = lambda k: (SPRINT_WEEKS[SPRINT_OF[k]][0], not urgent(k), -rank(k), key(k))
overflow = []
placed = set(DONE)
while pending:
    ready = [k for k in pending if all(d in placed or d not in DEV for d in DEV_DEPS[k])]
    assert ready, pending
    t = min(ready, key=prio); pending.remove(t); placed.add(t)
    s_a, s_b = SPRINT_WEEKS[SPRINT_OF[t]]
    # Un mismo dev puede encadenar una dependencia dentro de la semana (la ordena el plan de sprint);
    # entre devs distintos, el sucesor arranca la semana siguiente.
    # Una tarea arranca en una semana donde el dev tiene lugar para al menos MIN_CHUNK h (o la tarea
    # entera si es más corta): así una tarea de 1,5 h no queda regada en migajas de varias semanas.
    # Fuera de su área un dev paga penalidad: Siaba (3) es flexible y toma front o back si eso
    # ahorra una semana; Pache y Rudolph sólo cruzan de área si ahorra dos.
    best = None
    for dv in DEVS:
        w = max([sched[d]['ew'] + (0 if sched[d]['dev'] == dv else 1) for d in DEV_DEPS[t] if d in sched] + [s_a])
        need = min(DEV[t]['dur'], MIN_CHUNK)
        while w <= N_WEEKS and cap[dv][w] < need - 1e-9: w += 1
        rem, sw, ew = DEV[t]['dur'], w, w
        while rem > 1e-9 and ew <= N_WEEKS:
            take = min(rem, cap[dv][ew]); rem -= take
            if rem <= TAIL: rem = 0          # una cola de hasta TAIL h se absorbe en la misma semana
            if rem > 1e-9: ew += 1
        pen = 0 if dv == DEV_PREF[t] else (0.5 if dv == 3 else 1.5)
        cand = (ew > s_b, ew + pen, sw, dv)  # desbordar el sprint es el peor costo posible
        if best is None or cand < best[0]: best = (cand, sw, ew, dv)
    _, sw, ew, dv = best
    rem = DEV[t]['dur']
    for w in range(sw, ew + 1):
        take = min(rem, cap[dv][w]) if w < ew else rem
        cap[dv][w] -= take; rem -= take
    if ew > s_b: overflow.append((t, SPRINT_OF[t], sw, ew))
    st = sched.setdefault(t, {'sw': sw})
    st['sw'] = min(st['sw'], sw); st['ew'] = ew; st['dev'] = dv; st['psw'] = sw   # psw: semana en que se planifican las horas
    st['status'] = 'wip' if t in WIP else 'todo'

# ───────────────────────── checks ─────────────────────────
print(f'paquetes: {len(TASKS)} · desarrollo: {len(DEV)} ({sum(v["dur"] for v in DEV.values()):.2f} h)')
print(f'CPM completo: {T_FULL:.2f} h · crítico: {" → ".join(crit_full)}')
print(f'CPM desarrollo: {T_DEV:.2f} h · crítico: {" → ".join(crit_dev)}')
if overflow: print('!! DESBORDE DE SPRINT:', overflow)
assert all(v['ew'] < RESERVE_WEEK for v in sched.values()), 'hay trabajo en la semana de reserva'
# Sólo puede haber violaciones donde hay fechas reales: sucesor hecho o parcial, o dependencia hecha.
viol = sorted(f'{t}<{d}' for t in DEV for d in DEV_DEPS[t] if sched[t]['sw'] < sched[d]['ew'] and (t in DONE or t in WIP or d in DONE))
print('violaciones de dependencia por fechas reales:', viol)
for s, (a, b) in SPRINT_WEEKS.items():
    hs = sum(DEV[k]['dur'] for k, v in SPRINT_OF.items() if v == s)
    print(f'{s}: {sum(1 for v in SPRINT_OF.values() if v == s)} paquetes · {hs:.2f} h / {(b - a + 1) * 18} h')
for w in range(7, N_WEEKS + 1):
    load = {d: round(CAP_PER_DEV - cap[d][w], 2) for d in DEVS}
    print(f'  sem {w:2d} ({wstart(w):%d/%m}→{wend(w):%d/%m}) ' + '  '.join(f'D{d} {load[d]:4.1f}h' for d in DEVS))

# ───────────────────────── salidas JS ─────────────────────────
J = lambda s: json.dumps(s, ensure_ascii=False)

# WBS: altas v2 -> v4 (lo que la WBS v4 tiene y la vista v2 no), agrupadas por sub-paquete.
V2_IDS = set('''1.1.1 1.1.2 1.1.3 1.2.1 1.2.2 1.2.3 1.2.4 1.3.1 1.3.2 1.3.3 1.4.1 1.4.2 2.1.1 2.1.2 2.2.1 2.2.2 2.2.3 2.2.4
2.2.5 2.2.6 2.2.7 2.2.8 2.3.1 2.3.2 3.1.1 3.1.2 3.1.3 3.2.1 3.2.2 3.2.3 4.1.1 4.1.2 4.1.3 4.2.1 5.1.1 5.1.2 5.1.3 5.1.4 5.2.1
5.2.2 5.2.3 5.2.4 6.1.1 6.1.2 6.1.3 6.1.4 6.2.1 6.2.2 6.2.3 6.2.5 6.2.6 6.3.1 6.3.2 6.3.3 6.3.4 6.4.1 6.4.2 6.4.3 6.5.1 6.5.2
6.5.3 7.1.1 7.1.2 7.1.3 7.2.1 7.2.2 7.3.1 7.3.2 7.3.3 8.1.1 8.1.2 8.1.3 8.1.4 8.1.5 8.1.6 8.1.7 8.1.8 8.1.9 8.1.10 8.2.1 8.2.2
8.2.3 8.2.4 9.1.1 9.1.2 9.1.3 10.1.1 10.1.2 10.2.1 10.2.2 11.1.1 11.1.2 11.1.3 11.1.4 11.2.1 11.2.2 11.2.3 12.1.1 12.1.2 12.1.3'''.split())
assert len(V2_IDS) == 100
adds = defaultdict(list)
for k in sorted(TASKS, key=key):
    if k not in V2_IDS: adds[l2(k)].append(f'{k} {TASKS[k]["title"]}')
lines = ['const V4_ADD = [']
for sub, items in adds.items():
    lines.append(f' [{J(MOD_NAME[sub.split(".")[0]])}, {J(sub + " " + SUBS[sub])},')
    lines.append('   [' + ', '.join(J(i) for i in items) + ']],')
lines.append('];')
(OUT / '_v4_wbs.js').write_text('\n'.join(lines) + '\n', encoding='utf-8')

# PERT: 116 paquetes con CPM completo.
GROUPS = {
 '1.1':'Planificación técnica','1.2':'Gestión del proyecto','1.3':'Comunicación','1.4':'Cierre del proyecto',
 '2.1':'Identidad y perfiles','2.2':'Diseño de pantallas','2.3':'Modelo de datos',
 '3.1':'Configuración técnica','3.2':'Setup del entorno','4.1':'Autenticación backend','4.2':'Auth frontend',
 '5.1':'Backend de perfil','5.2':'Frontend de perfil','6.1':'Backend de partidos','6.2':'Frontend de partidos',
 '6.3':'Solicitudes','6.4':'Calificación','6.5':'Invitación a partido','7.1':'Motor de búsqueda',
 '7.2':'Experiencia swipe','7.3':'Visualización en mapa','8.1':'QA manual','8.2':'Pruebas con usuarios',
 '8.3':'QA automatizado','9.1':'Despliegue','10.1':'Docs de usuario','10.2':'Docs técnicas',
 '11.1':'Notificaciones backend','11.2':'Notificaciones frontend','12.1':'Reportar usuario','12.2':'Panel de moderación',
}
assert {l2(k) for k in TASKS} <= set(GROUPS)
f2 = lambda x: f'{x:.2f}'
lines = ['    tasks: {']
for k in sorted(TASKS, key=key):
    r = FULL[k]
    lines.append(f"      '{k}':{{ dur:{f2(TASKS[k]['dur'])}, es:{f2(r['ES'])}, ef:{f2(r['EF'])}, ls:{f2(r['LS'])}, lf:{f2(r['LF'])}, tf:{f2(abs(r['H']))} }},")
lines += ['    },', '    deps: {']
for k in sorted(TASKS, key=key):
    lines.append(f"      '{k}': {json.dumps(sorted(TASKS[k]['deps'], key=key))},")
lines += ['    },', '    groups: {']
for g in sorted(GROUPS, key=key):
    lines.append(f"      '{g}':{J(GROUPS[g])},")
lines += ['    },', f"    newIds: {json.dumps(sorted([k for k in TASKS if k not in V2_IDS], key=key))},"]
(OUT / '_v4_pert.js').write_text('\n'.join(lines) + '\n', encoding='utf-8')

# Gantt: 76 paquetes de desarrollo con fechas jueves a jueves.
lines = ['    tasks: [']
for k in sorted(DEV, key=key):
    s = sched[k]
    lines.append(f'    {{ id:"{k}", mod:{J(MOD_NAME[k.split(".")[0]])}, name:{J(DEV[k]["title"])}, dev:{s["dev"]}, '
                 f'start:"{wstart(s["sw"])}", end:"{wend(s["ew"])}", hours:{DEV[k]["dur"]:.2f}, status:"{s["status"]}", '
                 f'deps:{json.dumps(DEV_DEPS[k])} }},')
lines += ['    ],', '    devs: {1:"Pache", 2:"Rudolph", 3:"Siaba"},', f'    critical: {json.dumps(crit_dev)},',
          f"    newIds: {json.dumps(sorted([k for k in DEV if k not in V2_IDS], key=key))},",
          f'    knownDepViolations: {json.dumps(viol)},']
(OUT / '_v4_gantt.js').write_text('\n'.join(lines) + '\n', encoding='utf-8')

# ───────────────────────── salidas markdown ─────────────────────────
ST = {'done': '✅', 'wip': '🟡', 'todo': '⬜'}
DNAME = {1: 'Pache', 2: 'Rudolph', 3: 'Siaba'}
md = []
for s in ('S1', 'S2', 'S3'):
    ids = sorted([k for k, v in SPRINT_OF.items() if v == s], key=key)
    md += [f'### {s} — {sum(DEV[k]["dur"] for k in ids):.2f} h', '',
           '| ID | Paquete | Dur (h) | Holgura | Dev | Inicio | Fin | Estado |', '|---|---|---:|---:|---|---|---|:---:|']
    for k in ids:
        x = sched[k]
        md.append(f'| {k} | {DEV[k]["title"]} | {DEV[k]["dur"]:.2f} | {DEVCPM[k]["H"]:.2f} | {DNAME[x["dev"]]} | '
                  f'{wstart(x["sw"]):%d/%m} | {wend(x["ew"]):%d/%m} | {ST[x["status"]]} |')
    md.append('')
md += ['## Calendario semana a semana', '',
       '| Sem | Ventana | Sprint | Pache (Front) | Rudolph (Back) | Siaba (Infra) | Carga |', '|---|---|---|---|---|---|---:|']
for w in range(7, N_WEEKS + 1):
    cells = []
    for d in DEVS:
        items = [k for k in sorted(DEV, key=key) if sched[k]['dev'] == d and sched[k]['status'] != 'done' and sched[k]['psw'] <= w <= sched[k]['ew']]
        cells.append('<br>'.join(f'{k} {DEV[k]["title"]}' for k in items) or '—')
    load = sum(CAP_PER_DEV - cap[d][w] for d in DEVS)
    md.append(f'| {w} | {wstart(w):%d/%m} → {wend(w):%d/%m} | {sprint_of_week(w)} | ' + ' | '.join(cells) + f' | {load:.1f} / 18 h |')
md += ['', '### PERT completo (116 paquetes)', '',
       f'Duración del camino crítico: {T_FULL:.2f} h · {len(crit_full)} paquetes: ' + ' → '.join(crit_full), '']
(OUT / '_v4_calendario.md').write_text('\n'.join(md) + '\n', encoding='utf-8')
print('->', ', '.join(p.name for p in (OUT / '_v4_wbs.js', OUT / '_v4_pert.js', OUT / '_v4_gantt.js', OUT / '_v4_calendario.md')))
