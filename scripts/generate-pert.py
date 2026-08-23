#!/usr/bin/env python3
"""Recalcula PERT (full y devs) con estimaciones v3."""

import csv
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
ESTIMATES_FILE = REPO_ROOT / 'docs' / 'planning' / 'estimaciones-wbs.csv'

# ---------- v3 estimates ----------
EST_FULL = {}
with ESTIMATES_FILE.open(encoding='utf-8-sig') as f:
    r = csv.DictReader(f)
    for row in r:
        idx = row['Índice'].strip()
        parts = idx.split('.')
        if all(p.isdigit() for p in parts) and row['Estimación']:
            try:
                EST_FULL[idx] = float(row['Estimación'])
            except ValueError:
                pass

# ---------- Hard deps (FULL WBS) ----------
HARD_DEPS_FULL = {
    '1.1.1': [],
    '1.1.2': ['1.1.1'],
    '1.1.3': ['1.1.2'],
    '1.2.1': ['1.1.1'],
    '1.2.2': ['1.2.1'],
    '1.2.3': ['1.2.2'],
    '1.2.4': ['1.1.1'],
    '1.3.1': ['1.1.1'],
    '1.3.2': ['1.3.1'],
    '1.3.3': ['1.2.2'],
    '1.4.1': ['8.2.4', '9.1.3'],
    '1.4.2': ['9.1.2', '9.1.3', '10.1.1'],
    '2.1.1': ['1.1.1'],
    '2.1.2': ['1.1.1', '2.1.1'],
    '2.2.1': ['2.1.2'],
    '2.2.2': ['2.1.2'],
    '2.2.3': ['2.1.2'],
    '2.2.4': ['2.1.2'],
    '2.2.5': ['2.1.2'],
    '2.2.6': ['2.1.2'],
    '2.3.1': ['1.1.1'],
    '2.3.2': ['2.3.1'],
    '3.1.1': ['1.1.1'],
    '3.1.2': ['3.1.1'],
    '3.1.3': ['3.1.1'],
    '3.2.1': ['3.1.1'],
    '3.2.2': ['2.3.1', '3.2.1'],
    '3.2.3': ['3.2.1'],
    '4.1.1': ['3.2.2'],
    '4.1.2': ['4.1.1'],
    '4.1.3': ['4.1.2'],
    '4.2.1': ['2.2.1', '4.1.2'],
    '5.1.1': ['4.1.1', '2.3.1'],
    '5.1.2': ['5.1.1', '4.1.3'],
    '5.1.3': ['6.1.1', '6.3.1'],
    '5.1.4': ['6.4.1', '6.4.2', '6.4.3'],
    '5.2.1': ['2.2.2', '5.1.2'],
    '5.2.2': ['2.2.2', '5.1.2'],
    '5.2.3': ['5.1.3'],
    '5.2.4': ['5.1.4'],
    '6.1.1': ['2.3.1', '2.3.2'],
    '6.1.2': ['6.1.1'],
    '6.1.3': ['6.1.1'],
    '6.2.1': ['2.2.3', '6.1.2'],
    '6.2.2': ['2.2.3', '6.1.2'],
    '6.2.3': ['6.1.2', '6.1.3'],
    '6.3.1': ['4.1.1', '6.1.1'],
    '6.3.2': ['6.3.1', '6.2.3'],
    '6.3.3': ['6.3.2'],
    '6.3.4': ['6.3.2', '6.3.3'],
    '6.4.1': ['4.1.1', '6.1.1'],
    '6.4.2': ['2.2.2', '6.4.1'],
    '6.4.3': ['6.4.1'],
    '7.1.1': ['6.1.3'],
    '7.1.2': ['7.1.1'],
    '7.1.3': ['7.1.1', '5.1.4'],
    '7.2.1': ['2.2.5', '7.1.1'],
    '7.2.2': ['7.2.1', '6.3.2'],
    '7.3.1': ['3.2.1', '3.2.3'],
    '7.3.2': ['7.3.1', '7.1.1'],   # was 7.3.3 (visualización mapa)
    '7.3.3': ['7.3.2', '6.2.3'],   # was 7.3.4 (detalle desde mapa)
    '8.1.1': ['3.2.2', '4.1.1', '5.1.1', '6.1.2'],
    '8.1.2': ['4.2.1', '4.1.3'],
    '8.1.3': ['5.2.1', '5.2.2', '5.2.3', '5.2.4'],
    '8.1.4': ['6.2.1', '6.2.2', '6.2.3'],
    '8.1.5': ['6.3.2', '6.3.3', '6.3.4'],
    '8.1.6': ['7.2.2', '7.3.3'],   # was 7.3.4
    '8.1.7': ['6.4.2', '6.4.3', '5.1.4', '5.2.4'],
    '8.2.1': ['8.1.2', '8.1.3', '8.1.4', '8.1.5', '8.1.6', '8.1.7'],
    '8.2.2': ['8.2.1'],
    '8.2.3': ['8.2.2'],
    '8.2.4': ['8.2.3'],
    '9.1.1': ['3.2.1', '3.2.2', '3.2.3'],
    '9.1.2': ['9.1.1'],
    '9.1.3': ['9.1.2'],
    '10.1.1': ['9.1.2', '9.1.3'],
    '10.1.2': ['2.2.1', '2.2.2', '2.2.3', '2.2.4', '2.2.5', '2.2.6'],
    '10.2.1': ['3.2.3'],
    # 10.2.2 now covers APIs + model + deployment docs
    '10.2.2': ['4.1.1','4.1.2','4.1.3','5.1.1','5.1.2','5.1.3','5.1.4','6.1.1','6.1.2','6.1.3','6.3.1','6.3.2','6.3.3','6.3.4','7.1.1','7.1.2','7.1.3'],
}

# Soft deps from PM (full project)
SOFT_DEPS_FULL = [
    ('3.1.3', '3.2.1'),
    ('3.1.2', '4.1.1'),
    ('2.2.4', '6.3.2'),
    ('2.2.4', '6.3.3'),
    ('2.2.4', '6.3.4'),
    ('2.2.6', '7.3.2'),   # was 7.3.3
    ('2.2.2', '5.2.3'),
    ('2.2.2', '5.2.4'),
    ('2.2.3', '6.2.3'),
]

# Add soft deps to full
DEPS_FULL = {k: list(v) for k, v in HARD_DEPS_FULL.items()}
for pred, succ in SOFT_DEPS_FULL:
    if pred not in DEPS_FULL[succ]:
        DEPS_FULL[succ].append(pred)

# ---------- DEVS WBS deps ----------
DEPS_DEVS = {
    '3.1.2': [],
    '3.1.3': [],
    '3.2.1': ['3.1.3'],
    '3.2.2': ['3.2.1'],
    '3.2.3': ['3.2.1'],
    '4.1.1': ['3.2.2', '3.1.2'],
    '4.1.2': ['4.1.1'],
    '4.1.3': ['4.1.2'],
    '4.2.1': ['4.1.2'],
    '5.1.1': ['4.1.1'],
    '5.1.2': ['5.1.1', '4.1.3'],
    '5.1.3': ['6.1.1', '6.3.1'],
    '5.1.4': ['6.4.1', '6.4.2', '6.4.3'],
    '5.2.1': ['5.1.2'],
    '5.2.2': ['5.1.2'],
    '5.2.3': ['5.1.3'],
    '5.2.4': ['5.1.4'],
    '6.1.1': ['3.2.2'],
    '6.1.2': ['6.1.1'],
    '6.1.3': ['6.1.1'],
    '6.2.1': ['6.1.2'],
    '6.2.2': ['6.1.2'],
    '6.2.3': ['6.1.2', '6.1.3'],
    '6.3.1': ['4.1.1', '6.1.1'],
    '6.3.2': ['6.3.1', '6.2.3'],
    '6.3.3': ['6.3.2'],
    '6.3.4': ['6.3.2', '6.3.3'],
    '6.4.1': ['4.1.1', '6.1.1'],
    '6.4.2': ['6.4.1'],
    '6.4.3': ['6.4.1'],
    '7.1.1': ['6.1.3'],
    '7.1.2': ['7.1.1'],
    '7.1.3': ['7.1.1', '5.1.4'],
    '7.2.1': ['7.1.1'],
    '7.2.2': ['7.2.1', '6.3.2'],
    '7.3.1': ['3.2.1', '3.2.3'],
    '7.3.2': ['7.3.1', '7.1.1'],   # was 7.3.3 (visualización mapa)
    '7.3.3': ['7.3.2', '6.2.3'],   # was 7.3.4 (detalle desde mapa)
    '9.1.1': ['3.2.1', '3.2.2', '3.2.3'],
    '9.1.2': ['9.1.1'],
    '9.1.3': ['9.1.2'],
    '10.2.1': ['3.2.3'],
    '10.2.2': ['4.1.3', '5.1.4', '6.1.3', '6.3.4', '7.1.3'],
}

# Filter dev estimates from the full set
EST_DEVS = {k: EST_FULL[k] for k in DEPS_DEVS if k in EST_FULL}

# ---------- CPM ----------
def cpm(deps, dur):
    indeg = {k: 0 for k in deps}
    children = defaultdict(list)
    for n, ps in deps.items():
        for p in ps:
            children[p].append(n)
            indeg[n] += 1
    order = []
    queue = [k for k, v in indeg.items() if v == 0]
    while queue:
        x = queue.pop(0)
        order.append(x)
        for c in children[x]:
            indeg[c] -= 1
            if indeg[c] == 0:
                queue.append(c)
    ES, EF = {}, {}
    for n in order:
        es = max((EF[p] for p in deps[n]), default=0.0)
        ES[n] = es
        EF[n] = es + dur[n]
    project_end = max(EF.values())
    LS, LF = {}, {}
    for n in reversed(order):
        succs = children[n]
        if not succs:
            LF[n] = project_end
        else:
            LF[n] = min(LS[s] for s in succs)
        LS[n] = LF[n] - dur[n]
    slack = {n: round(LS[n] - ES[n], 4) for n in deps}
    return ES, EF, LS, LF, slack, project_end, order

def run(label, deps, est):
    print(f"\n========== {label} ==========")
    ES, EF, LS, LF, slack, end, order = cpm(deps, est)
    total = sum(est.values())
    crit = [n for n in deps if abs(slack[n]) < 0.01]
    print(f"Tareas: {len(deps)} | Esfuerzo total: {total:.2f}h | Camino crítico: {end:.2f}h | Tareas críticas: {len(crit)}")

    crit_sorted = sorted(crit, key=lambda n: ES[n])
    print(f"\nCamino crítico (ordenado):")
    for n in crit_sorted:
        print(f"  {n:8s}  dur={est[n]:6.2f}  ES={ES[n]:7.2f}  EF={EF[n]:7.2f}")

    return ES, EF, LS, LF, slack, end, est

# Run both
res_full = run("FULL v3", DEPS_FULL, EST_FULL)
res_devs = run("DEVS v3", DEPS_DEVS, EST_DEVS)

# Output full markdown table
def fmt_table(deps, est, ES, EF, LS, LF, slack):
    lines = ["| ID | Dur | ES | EF | LS | LF | Holgura | CRÍT |",
             "| --- | ---: | ---: | ---: | ---: | ---: | ---: | :---: |"]
    for n in sorted(deps.keys(), key=lambda s: tuple(int(p) for p in s.split('.'))):
        c = '★' if abs(slack[n]) < 0.01 else ''
        lines.append(f"| {n} | {est[n]:.2f} | {ES[n]:.2f} | {EF[n]:.2f} | {LS[n]:.2f} | {LF[n]:.2f} | {slack[n]:.2f} | {c} |")
    return '\n'.join(lines)

print("\n\n--- TABLA FULL ---")
ES, EF, LS, LF, slack, end, est = res_full
print(fmt_table(DEPS_FULL, est, ES, EF, LS, LF, slack))

print("\n\n--- TABLA DEVS ---")
ES, EF, LS, LF, slack, end, est = res_devs
print(fmt_table(DEPS_DEVS, est, ES, EF, LS, LF, slack))
