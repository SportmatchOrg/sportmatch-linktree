#!/usr/bin/env python3
"""PERT/CPM v2 — WBS v3 (incluye Notificaciones, Invitaciones, Moderación y Cancelación).
Mantiene intacto generate-pert.py, que sigue siendo la fuente del PERT v1."""

import csv, json, re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EST_FILE = ROOT / 'docs' / 'planning' / 'estimaciones-wbs.csv'

EST = {}
with EST_FILE.open(encoding='utf-8-sig') as f:
    for row in csv.DictReader(f):
        idx = row['Índice'].strip()
        if re.fullmatch(r'\d+(\.\d+)*', idx) and row['Estimación']:
            EST[idx] = float(row['Estimación'])

DEPS_FULL = {
 '1.1.1':[], '1.1.2':['1.1.1'], '1.1.3':['1.1.2'], '1.2.1':['1.1.1'], '1.2.2':['1.2.1'],
 '1.2.3':['1.2.2'], '1.2.4':['1.1.1'], '1.3.1':['1.1.1'], '1.3.2':['1.3.1'], '1.3.3':['1.2.2'],
 '1.4.1':['8.2.4','9.1.3'], '1.4.2':['9.1.2','9.1.3','10.1.1'],
 '2.1.1':['1.1.1'], '2.1.2':['1.1.1','2.1.1'],
 '2.2.1':['2.1.2'], '2.2.2':['2.1.2'], '2.2.3':['2.1.2'], '2.2.4':['2.1.2'],
 '2.2.5':['2.1.2'], '2.2.6':['2.1.2'], '2.2.7':['2.1.2'], '2.2.8':['2.1.2'],
 '2.3.1':['1.1.1'], '2.3.2':['2.3.1'],
 '3.1.1':['1.1.1'], '3.1.2':['3.1.1'], '3.1.3':['3.1.1'],
 '3.2.1':['3.1.1'], '3.2.2':['2.3.1','3.2.1'], '3.2.3':['3.2.1'],
 '4.1.1':['3.2.2'], '4.1.2':['4.1.1'], '4.1.3':['4.1.2'], '4.2.1':['2.2.1','4.1.2'],
 '5.1.1':['4.1.1','2.3.1'], '5.1.2':['5.1.1','4.1.3'], '5.1.3':['6.1.1','6.3.1'],
 '5.1.4':['6.4.1','6.4.2','6.4.3'], '5.2.1':['2.2.2','5.1.2'], '5.2.2':['2.2.2','5.1.2'],
 '5.2.3':['5.1.3'], '5.2.4':['5.1.4'],
 '6.1.1':['2.3.1','2.3.2'], '6.1.2':['6.1.1'], '6.1.3':['6.1.1'], '6.1.4':['6.1.1','6.1.2'],
 '6.2.1':['2.2.3','6.1.2'], '6.2.2':['2.2.3','6.1.2'], '6.2.3':['6.1.2','6.1.3'],
 '6.2.5':['6.1.4','6.2.3'], '6.2.6':['6.1.4','11.1.3'],
 '6.3.1':['4.1.1','6.1.1'], '6.3.2':['6.3.1','6.2.3'], '6.3.3':['6.3.2'], '6.3.4':['6.3.2','6.3.3'],
 '6.4.1':['4.1.1','6.1.1'], '6.4.2':['2.2.2','6.4.1'], '6.4.3':['6.4.1'],
 '6.5.1':['6.1.1','6.2.3'], '6.5.2':['6.1.1','4.1.1','11.1.3'], '6.5.3':['6.5.2','6.3.1'],
 '7.1.1':['6.1.3'], '7.1.2':['7.1.1'], '7.1.3':['7.1.1','5.1.4'],
 '7.2.1':['2.2.5','7.1.1'], '7.2.2':['7.2.1','6.3.2'],
 '7.3.1':['3.2.1','3.2.3'], '7.3.2':['7.3.1','7.1.1'], '7.3.3':['7.3.2','6.2.3'],
 '8.1.1':['3.2.2','4.1.1','5.1.1','6.1.2'], '8.1.2':['4.2.1','4.1.3'],
 '8.1.3':['5.2.1','5.2.2','5.2.3','5.2.4'], '8.1.4':['6.2.1','6.2.2','6.2.3'],
 '8.1.5':['6.3.2','6.3.3','6.3.4'], '8.1.6':['7.2.2','7.3.3'],
 '8.1.7':['6.4.2','6.4.3','5.1.4','5.2.4'], '8.1.8':['11.1.3','11.1.4','11.2.1','11.2.2'],
 '8.1.9':['6.5.1','6.5.2','6.5.3'], '8.1.10':['12.1.3','12.2.1','12.2.2','12.2.3'],
 '8.2.1':['8.1.2','8.1.3','8.1.4','8.1.5','8.1.6','8.1.7','8.1.8','8.1.9','8.1.10'],
 '8.2.2':['8.2.1'], '8.2.3':['8.2.2'], '8.2.4':['8.2.3'],
 '9.1.1':['3.2.1','3.2.2','3.2.3'], '9.1.2':['9.1.1'], '9.1.3':['9.1.2'],
 '10.1.1':['9.1.2','9.1.3'],
 '10.1.2':['2.2.1','2.2.2','2.2.3','2.2.4','2.2.5','2.2.6','2.2.7','2.2.8'],
 '10.2.1':['3.2.3'],
 '10.2.2':['4.1.3','5.1.4','6.1.3','6.3.4','7.1.3','11.1.3','12.1.2'],
 '11.1.1':['4.1.1'], '11.1.2':['4.1.1'], '11.1.3':['11.1.1','11.1.2','6.3.2','6.3.3'],
 '11.1.4':['11.1.3','6.1.1'], '11.2.1':['11.1.1','2.2.7'], '11.2.2':['11.1.2'], '11.2.3':['11.2.1'],
 '12.1.1':['4.1.1'], '12.1.2':['12.1.1'], '12.1.3':['12.1.2','2.2.8','5.2.1','6.2.3'],
 '12.2.1':['12.1.2','2.2.8'], '12.2.2':['12.2.1','4.1.3'], '12.2.3':['12.2.1'],
}
for pred, succ in [('3.1.3','3.2.1'),('3.1.2','4.1.1'),('2.2.4','6.3.2'),('2.2.4','6.3.3'),
                   ('2.2.4','6.3.4'),('2.2.6','7.3.2'),('2.2.2','5.2.3'),('2.2.2','5.2.4'),
                   ('2.2.3','6.2.3'),('2.2.7','11.2.2'),('2.2.8','12.1.3')]:
    if pred not in DEPS_FULL[succ]:
        DEPS_FULL[succ].append(pred)

# ---- Recorte de alcance para cerrar a mediados de noviembre ----
CUT = set()
DEPS_FULL = {k:[d for d in v if d not in CUT] for k,v in DEPS_FULL.items() if k not in CUT}

def cpm(deps, dur):
    indeg = {k: 0 for k in deps}; children = defaultdict(list)
    for n, ps in deps.items():
        for p in ps: children[p].append(n); indeg[n] += 1
    order, queue = [], [k for k, v in indeg.items() if v == 0]
    while queue:
        x = queue.pop(0); order.append(x)
        for c in children[x]:
            indeg[c] -= 1
            if indeg[c] == 0: queue.append(c)
    ES, EF = {}, {}
    for n in order:
        ES[n] = max((EF[p] for p in deps[n]), default=0.0); EF[n] = ES[n] + dur[n]
    end = max(EF.values()); LS, LF = {}, {}
    for n in reversed(order):
        LF[n] = end if not children[n] else min(LS[s] for s in children[n])
        LS[n] = LF[n] - dur[n]
    tf = {n: round(LS[n]-ES[n], 2) for n in deps}
    return ES, EF, LS, LF, tf, end

DUR = {k: EST[k] for k in DEPS_FULL}
ES, EF, LS, LF, TF, END = cpm(DEPS_FULL, DUR)
crit = sorted([n for n in DEPS_FULL if abs(TF[n]) < 0.01], key=lambda n: ES[n])

print(f"Tareas: {len(DEPS_FULL)} | Esfuerzo: {sum(DUR.values()):.2f} h | Camino crítico: {END:.2f} h | Críticas: {len(crit)}")
print("Camino crítico:", " -> ".join(crit))

key = lambda s: tuple(int(p) for p in s.split('.'))
lines = ["const TASKS3 = {"]
for n in sorted(DEPS_FULL, key=key):
    lines.append(f"  '{n}':{{ dur:{DUR[n]:.2f}, es:{ES[n]:.2f}, ef:{EF[n]:.2f}, "
                 f"ls:{LS[n]:.2f}, lf:{LF[n]:.2f}, tf:{TF[n]:.2f} }},")
lines.append("};")
(ROOT/'scripts'/'_pert_v2_tasks.js').write_text('\n'.join(lines), encoding='utf-8')
(ROOT/'scripts'/'_pert_v2_deps.json').write_text(json.dumps(DEPS_FULL, indent=1, ensure_ascii=False), encoding='utf-8')
print("-> scripts/_pert_v2_tasks.js  y  _pert_v2_deps.json")
