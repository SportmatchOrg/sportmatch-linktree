#!/usr/bin/env python3
"""Cronograma v2: replanifica con 3 devs a 6 h/semana.
El primer mes queda fijado con las fechas reales de Linear; el resto se reprograma."""
import csv, re, math, json
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EST = {}
with (ROOT/'docs'/'planning'/'estimaciones-wbs.csv').open(encoding='utf-8-sig') as f:
    for row in csv.DictReader(f):
        i = row['Índice'].strip()
        if re.fullmatch(r'\d+(\.\d+)*', i) and row['Estimación']:
            EST[i] = float(row['Estimación'])

DEPS = {
 '3.1.2':[], '3.1.3':[], '3.2.1':['3.1.3'], '3.2.2':['3.2.1'], '3.2.3':['3.2.1'],
 '4.1.1':['3.2.2','3.1.2'], '4.1.2':['4.1.1'], '4.1.3':['4.1.2'], '4.2.1':['4.1.2'],
 '5.1.1':['4.1.1'], '5.1.2':['5.1.1','4.1.3'], '5.1.3':['6.1.1','6.3.1'],
 '5.1.4':['6.4.1','6.4.2','6.4.3'], '5.2.1':['5.1.2'], '5.2.2':['5.1.2'],
 '5.2.3':['5.1.3'], '5.2.4':['5.1.4'],
 '6.1.1':['3.2.2'], '6.1.2':['6.1.1'], '6.1.3':['6.1.1'], '6.1.4':['6.1.1','6.1.2'],
 '6.2.1':['6.1.2'], '6.2.2':['6.1.2'], '6.2.3':['6.1.2','6.1.3'],
 '6.2.5':['6.1.4','6.2.3'], '6.2.6':['6.1.4','11.1.3'],
 '6.3.1':['4.1.1','6.1.1'], '6.3.2':['6.3.1','6.2.3'], '6.3.3':['6.3.2'], '6.3.4':['6.3.2','6.3.3'],
 '6.4.1':['4.1.1','6.1.1'], '6.4.2':['6.4.1'], '6.4.3':['6.4.1'],
 '6.5.1':['6.1.1','6.2.3'], '6.5.2':['6.1.1','4.1.1','11.1.3'], '6.5.3':['6.5.2','6.3.1'],
 '7.1.1':['6.1.3'], '7.1.2':['7.1.1'], '7.1.3':['7.1.1','5.1.4'],
 '7.2.1':['7.1.1'], '7.2.2':['7.2.1','6.3.2'],
 '7.3.1':['3.2.1','3.2.3'], '7.3.2':['7.3.1','7.1.1'], '7.3.3':['7.3.2','6.2.3'],
 '9.1.1':['3.2.1','3.2.2','3.2.3'], '9.1.2':['9.1.1'], '9.1.3':['9.1.2'],
 '10.2.1':['3.2.3'], '10.2.2':['4.1.3','5.1.4','6.1.3','6.3.4','7.1.3','11.1.3','12.1.2'],
 '11.1.1':['4.1.1'], '11.1.2':['4.1.1'], '11.1.3':['11.1.1','11.1.2','6.3.2','6.3.3'],
 '11.1.4':['11.1.3','6.1.1'], '11.2.1':['11.1.1'], '11.2.2':['11.1.2'], '11.2.3':['11.2.1'],
 '12.1.1':['4.1.1'], '12.1.2':['12.1.1'], '12.1.3':['12.1.2','5.2.1','6.2.3'],
 '12.2.1':['12.1.2'], '12.2.2':['12.2.1','4.1.3'], '12.2.3':['12.2.1'],
}

# ---- Fijado con las fechas reales de Linear (Sem-01 a Sem-04) ----
DONE = {
 '3.1.2':(1,'2026-08-15','2026-08-16'), '3.1.3':(2,'2026-08-15','2026-08-16'),
 '3.2.1':(3,'2026-08-16','2026-08-16'), '3.2.2':(3,'2026-08-16','2026-08-17'),
 '3.2.3':(3,'2026-08-21','2026-08-21'), '4.1.1':(2,'2026-08-17','2026-08-17'),
 '4.1.2':(2,'2026-08-18','2026-08-20'), '4.1.3':(2,'2026-08-19','2026-08-20'),
 '4.2.1':(1,'2026-08-18','2026-08-19'), '5.1.1':(2,'2026-08-25','2026-08-26'),
 '5.2.1':(1,'2026-08-24','2026-08-27'), '6.1.1':(2,'2026-08-25','2026-08-26'),
 '6.1.2':(2,'2026-08-26','2026-08-26'), '6.1.3':(2,'2026-08-26','2026-08-26'),
 '6.2.1':(1,'2026-08-26','2026-08-27'), '6.3.1':(2,'2026-08-26','2026-08-27'),
 '6.3.2':(2,'2026-08-27','2026-08-30'), '7.2.1':(1,'2026-08-30','2026-08-30'),
 '7.2.2':(1,'2026-08-30','2026-08-30'), '9.1.1':(3,'2026-08-28','2026-08-29'),
 '10.2.1':(1,'2026-08-27','2026-08-27'),
}
IN_PROGRESS = {'6.2.3':(1,'2026-08-30','2026-09-04')}

# ---- Recorte de alcance para cerrar a mediados de noviembre ----
CUT = set()
DEPS = {k:[d for d in v if d not in CUT] for k,v in DEPS.items() if k not in CUT}

H_PER_DAY = 6/5.0                      # 6 h por semana repartidas en 5 días hábiles
REPLAN_FROM = date(2026,9,7)           # lunes de la Sem-05
def wd(d):                             # siguiente día hábil
    while d.weekday()>=5: d+=timedelta(days=1)
    return d
def add_wd(d,n):                       # sumar n días hábiles
    c=0
    while c<n:
        d+=timedelta(days=1)
        if d.weekday()<5: c+=1
    return d
P=lambda s: date(*map(int,s.split('-')))

sched={}
for k,(dv,st,e) in {**DONE, **IN_PROGRESS}.items():
    if k in DEPS: sched[k]=(dv,P(st),P(e))
free={1:REPLAN_FROM,2:REPLAN_FROM,3:REPLAN_FROM}
key=lambda s: tuple(int(p) for p in s.split('.'))

succ={k:[] for k in DEPS}
for k,ds in DEPS.items():
    for d in ds:
        if d in succ: succ[d].append(k)
rank={}
def rk(n):
    if n not in rank:
        rank[n]=EST[n]+max([rk(c) for c in succ[n]],default=0.0)
    return rank[n]
for k in DEPS: rk(k)

# El alcance con linea base v1 va primero; el alcance nuevo absorbe la cola.
ORIG={'3.1.2','3.1.3','3.2.1','3.2.2','3.2.3','4.1.1','4.1.2','4.1.3','4.2.1',
 '5.1.1','5.1.2','5.1.3','5.1.4','5.2.1','5.2.2','5.2.3','5.2.4',
 '6.1.1','6.1.2','6.1.3','6.2.1','6.2.3','6.3.1','6.3.2','6.3.3','6.3.4',
 '6.4.1','6.4.2','6.4.3','7.1.1','7.1.2','7.2.1','7.2.2','7.3.1','7.3.2',
 '9.1.1','9.1.2','9.1.3','10.2.1','10.2.2'}
prio=lambda k:(0 if k in ORIG else 1, -rank[k], key(k))

pending=[k for k in DEPS if k not in sched]
while pending:
    ready=[k for k in pending if all(d in sched for d in DEPS[k])]
    if not ready: ready=sorted(pending,key=prio)[:1]
    ready.sort(key=prio)
    t=ready[0]; pending.remove(t)
    dep_end=max([sched[d][2] for d in DEPS[t] if d in sched],default=REPLAN_FROM-timedelta(days=1))
    ndays=max(1,math.ceil(EST[t]/H_PER_DAY))
    best=None
    for dv in (1,2,3):
        st=wd(max(free[dv],wd(dep_end+timedelta(days=1)),REPLAN_FROM))
        en=add_wd(st,ndays-1)
        if best is None or (en,free[dv])<(best[2],free[best[0]]): best=(dv,st,en)
    dv,st,en=best
    sched[t]=(dv,st,en); free[dv]=add_wd(en,1)

MOD={'3':'3.0 Capacitación y Setup','4':'4.0 Autenticación','5':'5.0 Perfil de Usuario',
 '6':'6.0 Gestión de Partidos','7':'7.0 Sistema de Matchmaking','9':'9.0 Deployment',
 '10':'10.0 Documentación Final','11':'11.0 Notificaciones','12':'12.0 Moderación y Reportes'}
NAMES={}
with (ROOT/'docs'/'planning'/'estimaciones-wbs.csv').open(encoding='utf-8-sig') as f:
    for row in csv.DictReader(f):
        i=row['Índice'].strip()
        if i in DEPS: NAMES[i]=row['Descripción'].split(':')[0].strip()

out=[]
for t in sorted(DEPS,key=key):
    dv,s,e=sched[t]; st='done' if t in DONE else ('wip' if t in IN_PROGRESS else 'todo')
    out.append(f'  {{ id:"{t}", mod:"{MOD[t.split(".")[0]]}", name:"{NAMES[t]}", dev:{dv}, '
               f'start:"{s}", end:"{e}", hours:{EST[t]:.2f}, status:"{st}", deps:{json.dumps(DEPS[t])} }},')
(ROOT/'scripts'/'_gantt_v2_tasks.js').write_text("const TASKS_L3 = [\n"+"\n".join(out)+"\n];\n",encoding='utf-8')

fin=max(e for _,_,e in sched.values())
print(f"Tareas: {len(sched)} | fin del cronograma: {fin} ({fin.strftime('%d/%m')})")
for d in (1,2,3):
    hs=sum(EST[k] for k,(dv,_,_) in sched.items() if dv==d)
    print(f"  D{d}: {sum(1 for v in sched.values() if v[0]==d):2d} tareas · {hs:6.2f} h")
print("-> scripts/_gantt_v2_tasks.js")
