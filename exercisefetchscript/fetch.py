#!/usr/bin/env python3
"""
build_exercises_db.py (v9 – local‑assets edition)
=================================================
• **Images now stored as relative slugs** (e.g. `3_4_Sit-Up/0.jpg`).  
  Perfect for Expo’s `assets/exercises/` folder — just prepend the local
  path at runtime.
• Removed the over‑long GitHub URLs that doubled the folder name.
• `imgFolder` column in `exercises` unchanged (still the folder = id).

Schema unchanged; only the `exercise_images.img_url` values differ.
"""

import json
import subprocess
import sqlite3
from pathlib import Path
from typing import Dict, List

from tqdm import tqdm

# ---------------------------------------------------------------------------
# SETTINGS
# ---------------------------------------------------------------------------
REPO_URL = "https://github.com/yuhonas/free-exercise-db.git"
REPO_DIR = Path(__file__).with_name("free-exercise-db")
DATA_JSON = REPO_DIR / "dist" / "exercises.json"

PRIMARY_LOAD, SECONDARY_LOAD = 0.70, 0.30

MUSCLE_WIKI: Dict[str, str] = {
    "chest": "https://en.wikipedia.org/wiki/Pectoralis_major",
    "shoulders": "https://en.wikipedia.org/wiki/Deltoid_muscle",
    "traps": "https://en.wikipedia.org/wiki/Trapezius",
    "upper_back": "https://en.wikipedia.org/wiki/Trapezius",
    "lats": "https://en.wikipedia.org/wiki/Latissimus_dorsi_muscle",
    "biceps": "https://en.wikipedia.org/wiki/Biceps_brachii",
    "triceps": "https://en.wikipedia.org/wiki/Triceps_brachii_muscle",
    "forearms": "https://en.wikipedia.org/wiki/Forearm",
    "abdominals": "https://en.wikipedia.org/wiki/Rectus_abdominis_muscle",
    "obliques": "https://en.wikipedia.org/wiki/Abdominal_external_oblique_muscle",
    "lower_back": "https://en.wikipedia.org/wiki/Erector_spinae",
    "quadriceps": "https://en.wikipedia.org/wiki/Quadriceps_femoris_muscle",
    "hamstrings": "https://en.wikipedia.org/wiki/Hamstring",
    "glutes": "https://en.wikipedia.org/wiki/Gluteus_maximus",
    "calves": "https://en.wikipedia.org/wiki/Gastrocnemius_muscle",
    "adductors": "https://en.wikipedia.org/wiki/Adductor_muscles_of_the_hip",
}

BUCKET = {
    **dict.fromkeys([
        "chest","shoulders","traps","upper_back","lats","biceps","triceps","forearms"],"upper"),
    **dict.fromkeys(["abdominals","obliques","lower_back"],"core"),
    **dict.fromkeys(["quadriceps","hamstrings","glutes","calves","adductors"],"lower"),
}

# ---------------------------------------------------------------------------
# GIT SYNC
# ---------------------------------------------------------------------------
if not REPO_DIR.exists():
    print(f"⬇  Cloning {REPO_URL} …")
    subprocess.run(["git","clone","--depth","1",REPO_URL,str(REPO_DIR)],check=True)
else:
    print("⟳  Updating repo …")
    subprocess.run(["git","-C",str(REPO_DIR),"pull","--quiet"],check=True)

# ---------------------------------------------------------------------------
# LOAD DATA
# ---------------------------------------------------------------------------
print("📖  Loading JSON …")
all_ex = json.loads(DATA_JSON.read_text())
print(f"   {len(all_ex):,} exercises\n")

# ---------------------------------------------------------------------------
# DB SETUP
# ---------------------------------------------------------------------------
DB_PATH = Path(__file__).with_name("exercises.db")
print(f"🛠  Writing {DB_PATH.name}\n")
con = sqlite3.connect(DB_PATH)
cur = con.cursor()
cur.executescript(
    """
PRAGMA foreign_keys = ON;
DROP TABLE IF EXISTS muscles;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS ex_muscle_load;
DROP TABLE IF EXISTS exercise_images;
CREATE TABLE muscles(id TEXT PRIMARY KEY, wiki TEXT);
CREATE TABLE exercises(
    id TEXT PRIMARY KEY,
    name TEXT,
    bodyPart TEXT,
    mainMuscle TEXT,
    equipment TEXT,
    muscleWiki TEXT,
    force TEXT,
    level TEXT,
    mechanic TEXT,
    category TEXT,
    instructions TEXT,
    imgFolder TEXT
);
CREATE TABLE ex_muscle_load(
    exercise_id TEXT,
    muscle_id TEXT,
    load_percent REAL,
    FOREIGN KEY(exercise_id) REFERENCES exercises(id),
    FOREIGN KEY(muscle_id)   REFERENCES muscles(id)
);
CREATE TABLE exercise_images(
    exercise_id TEXT,
    img_url TEXT,
    FOREIGN KEY(exercise_id) REFERENCES exercises(id)
);
"""
)
cur.executemany(
    "INSERT INTO muscles VALUES (?,?)",
    [(m, MUSCLE_WIKI[m]) for m in MUSCLE_WIKI]
)

# ---------------------------------------------------------------------------
# INGEST
# ---------------------------------------------------------------------------
for ex in tqdm(all_ex, desc="Processing"):
    primaries = [m.lower() for m in ex.get("primaryMuscles", [])]
    if not primaries:
        continue
    main = primaries[0]
    secondaries = [m.lower() for m in ex.get("secondaryMuscles", [])]

    cur.execute(
        "INSERT INTO exercises VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        (
            ex["id"],
            ex["name"],
            BUCKET.get(main,"upper"),
            main,
            ex.get("equipment"),
            MUSCLE_WIKI.get(main,""),
            ex.get("force"),
            ex.get("level"),
            ex.get("mechanic"),
            ex.get("category"),
            json.dumps(ex.get("instructions", [])),
            ex["id"],
        )
    )

    loads: Dict[str,float] = {main: PRIMARY_LOAD}
    if secondaries:
        share = SECONDARY_LOAD/len(secondaries)
        for m in secondaries:
            loads[m] = loads.get(m,0)+share
    cur.executemany(
        "INSERT INTO ex_muscle_load VALUES (?,?,?)",
        [(ex["id"],m,round(p,3)) for m,p in loads.items() if m in MUSCLE_WIKI]
    )

    for img in ex.get("images", []):
        # store relative slug only (folder/file)
        cur.execute(
            "INSERT INTO exercise_images VALUES (?,?)",
            (ex["id"], img)
        )

# ---------------------------------------------------------------------------
# VIEWS
# ---------------------------------------------------------------------------
cur.executescript(
    """
DROP VIEW IF EXISTS upper_body;
DROP VIEW IF EXISTS core;
DROP VIEW IF EXISTS lower_body;
CREATE VIEW upper_body AS SELECT * FROM exercises WHERE bodyPart='upper';
CREATE VIEW core       AS SELECT * FROM exercises WHERE bodyPart='core';
CREATE VIEW lower_body AS SELECT * FROM exercises WHERE bodyPart='lower';
"""
)
con.commit()
con.close()
print("✅  Database complete — images now stored as local slugs.\n")
