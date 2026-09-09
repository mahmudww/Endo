/* =====================================================
   ENDO
   RHYTHM ENGINE
===================================================== */


/* =====================================================
   GAME STATE
===================================================== */

const game = {

    language: "eng",

    playerName: "Ordinary Citizen",

    score: 0,

    combo: 0,

    multiplier: 1,

    playerHP: 100,

    enemyHP: 100,

    enemyMaxHP: 100,

    running: false,

    audioContext: null,

    startTime: 0,

    currentTime: 0,

    bpm: 120,

    beatDuration: 60 / 120,

    songOffset: 0,

    noteTravelTime: 2.0,

    nextBeat: 0,

    beatNumber: 0,

    notes: [],

    noteSpeed: 420,

    hitWindow: {

        perfect: 0.055,

        excellent: 0.11,

        good: 0.18

    }

};


/* =====================================================
   TRANSLATIONS
===================================================== */

const text = {

    eng: {

        startGame: "START GAME",

        nameTitle:
            "NAME YOUR CHARACTER",

        nameDescription:
            "Choose a name for the person who will stand against the rulers of Endo.",

        placeholder:
            "Enter your name",

        continue:
            "CONTINUE",

        story: [

            "The land of Endo was once a place where people believed their future belonged to them.",

            "But slowly, things began to change.",

            "Education was no longer a priority.",

            "Free food was distributed to the people. Behind the smiles and promises, something poisonous was being hidden.",

            "Factories grew larger. Rivers became darker. Forests disappeared beneath smoke and fire.",

            "People who struggled to survive became easier to manipulate. Anger spread faster than understanding.",

            "The rulers of Endo stopped listening to the people they were supposed to protect.",

            "And some people discovered that kneeling before power was an easier way to live.",

            "But not everyone was willing to kneel.",

            "Today, a group of citizens has decided to break into the government office.",

            "Among them is someone who has decided that Endo cannot continue like this.",

            "That person is you."
        ],

        stageTitle:
            "THE FOLLOWERS",

        stageDescription:
            "Those who kneel before power will defend it.",

        battle:
            "ENTER BATTLE"

    },


    ind: {

        startGame: "MULAI GAME",

        nameTitle:
            "BERI NAMA KARAKTERMU",

        nameDescription:
            "Pilih nama untuk seseorang yang akan berdiri melawan penguasa Endo.",

        placeholder:
            "Masukkan nama",

        continue:
            "LANJUT",

        story: [

            "Negeri Endo dulunya adalah tempat di mana masyarakat percaya bahwa masa depan mereka berada di tangan mereka sendiri.",

            "Namun perlahan, semuanya mulai berubah.",

            "Pendidikan tidak lagi menjadi prioritas.",

            "Makanan gratis dibagikan kepada masyarakat. Di balik senyum dan janji-janji itu, sesuatu yang beracun disembunyikan.",

            "Pabrik-pabrik semakin besar. Sungai menjadi semakin gelap. Hutan menghilang di balik asap dan api.",

            "Masyarakat yang kesulitan bertahan hidup menjadi semakin mudah dimanipulasi. Kemarahan menyebar lebih cepat daripada pemahaman.",

            "Para penguasa Endo berhenti mendengarkan rakyat yang seharusnya mereka lindungi.",

            "Dan sebagian masyarakat menemukan bahwa menjilat kaki penguasa adalah cara yang lebih mudah untuk hidup.",

            "Namun tidak semua orang bersedia berlutut.",

            "Hari ini, sekelompok masyarakat memutuskan untuk mendobrak kantor pemerintahan.",

            "Di antara mereka ada seseorang yang memutuskan bahwa Endo tidak boleh terus seperti ini.",

            "Orang itu adalah kamu."
        ],

        stageTitle:
            "PARA PENJILAT",

        stageDescription:
            "Mereka yang berlutut kepada kekuasaan akan membelanya.",

        battle:
            "MASUK KE PERTEMPURAN"

    }

};


/* =====================================================
   DOM
===================================================== */

const screens =
    document.querySelectorAll(".screen");

const judgementElement =
    document.getElementById("judgement");

const battleMessage =
    document.getElementById("battle-message");

const scoreElement =
    document.getElementById("score");

const comboElement =
    document.getElementById("combo");

const multiplierElement =
    document.getElementById("multiplier");

const playerHPElement =
    document.getElementById("player-hp");

const playerHPText =
    document.getElementById("player-hp-text");

const enemyHPElement =
    document.getElementById("enemy-hp");

const enemyHPText =
    document.getElementById("enemy-hp-text");

const arena =
    document.getElementById("battle-arena");

const noteTrack =
    document.getElementById("note-track");

const rhythmPulse =
    document.getElementById("rhythm-pulse");

const stageMusic =
    document.getElementById("stage-music");


/* =====================================================
   SCREEN MANAGEMENT
===================================================== */

function showScreen(id) {

    screens.forEach(screen => {

        screen.classList.remove("active");

    });


    const screen =
        document.getElementById(id);

    if (screen) {

        screen.classList.add("active");

    }

}


/* =====================================================
   LANGUAGE
===================================================== */

document
    .querySelectorAll(".language-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                game.language =
                    button.dataset.language;


                document
                    .querySelectorAll(
                        ".language-button"
                    )
                    .forEach(other => {

                        other.classList.remove(
                            "active"
                        );

                    });


                button.classList.add("active");

                updateLanguage();

            }
        );

    });


function updateLanguage() {

    const current =
        text[game.language];


    document.getElementById(
        "start-game-button"
    ).textContent =
        current.startGame;


    document.getElementById(
        "name-title"
    ).textContent =
        current.nameTitle;


    document.getElementById(
        "name-description"
    ).textContent =
        current.nameDescription;


    document.getElementById(
        "character-name"
    ).placeholder =
        current.placeholder;


    document.getElementById(
        "name-confirm-button"
    ).textContent =
        current.continue;


    document.getElementById(
        "battle-start-button"
    ).textContent =
        current.battle;


    document.getElementById(
        "stage-title"
    ).textContent =
        current.stageTitle;


    document.getElementById(
        "stage-description"
    ).textContent =
        current.stageDescription;

}


/* =====================================================
   TITLE
===================================================== */

document
    .getElementById("start-game-button")
    .addEventListener(
        "click",
        () => {

            showScreen(
                "name-screen"
            );

        }
    );


/* =====================================================
   NAME
===================================================== */

document
    .getElementById("name-confirm-button")
    .addEventListener(
        "click",
        () => {

            const input =
                document.getElementById(
                    "character-name"
                );


            const name =
                input.value.trim();


            game.playerName =
                name.length > 0
                    ? name
                    : "Rakyat Biasa";


            startStory();

        }
    );


/* =====================================================
   STORY
===================================================== */

let storyIndex = 0;


function startStory() {

    storyIndex = 0;

    showScreen(
        "story-screen"
    );

    showStoryLine();

}


function showStoryLine() {

    const current =
        text[game.language];


    const storyText =
        document.getElementById(
            "story-text"
        );


    storyText.style.animation =
        "none";


    void storyText.offsetWidth;


    storyText.style.animation =
        "story-fade .6s ease";


    storyText.textContent =
        current.story[storyIndex];


    document.getElementById(
        "story-next-button"
    ).textContent =
        current.continue;

}


document
    .getElementById("story-next-button")
    .addEventListener(
        "click",
        () => {

            const current =
                text[game.language];


            if (
                storyIndex <
                current.story.length - 1
            ) {

                storyIndex++;

                showStoryLine();

            }

            else {

                startStageIntro();

            }

        }
    );


/* =====================================================
   STAGE INTRO
===================================================== */

function startStageIntro() {

    showScreen(
        "stage-intro-screen"
    );

    updateLanguage();

}


/* =====================================================
   START BATTLE
===================================================== */

document
    .getElementById("battle-start-button")
    .addEventListener(
        "click",
        () => {

            startBattle();

        }
    );


function startBattle() {

    game.score = 0;

    game.combo = 0;

    game.multiplier = 1;

    game.playerHP = 100;

    game.enemyHP = 220;

    game.enemyMaxHP = 220;

    game.notes = [];

    game.beatNumber = 0;

    game.nextBeat = 0;

    game.running = false;


    updateBattleUI();


    document.getElementById(
        "player-name-ui"
    ).textContent =
        game.playerName;


    showScreen(
        "battle-screen"
    );


    battleMessage.textContent =
        game.language === "eng"
            ? "CLICK TO BEGIN"
            : "KLIK UNTUK MULAI";


    /*
        Browser membutuhkan user gesture
        untuk memulai AudioContext.

        Karena tombol ENTER BATTLE adalah
        user gesture, kita bisa memulai
        audio di sini.
    */

    initializeAudio();
    startRhythm();

}


/* =====================================================
   AUDIO ENGINE
===================================================== */

function initializeAudio() {

    stageMusic.src = "audio/stage1-endo.wav";
    stageMusic.currentTime = 0;
    stageMusic.volume = 0.82;

    const playPromise = stageMusic.play();

    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
            battleMessage.textContent =
                game.language === "eng"
                    ? "TAP TO START MUSIC"
                    : "TEKAN UNTUK MEMULAI MUSIK";

            const unlock = () => {
                stageMusic.play().catch(() => {});
                document.removeEventListener("pointerdown", unlock);
                document.removeEventListener("keydown", unlock);
            };

            document.addEventListener("pointerdown", unlock, { once: true });
            document.addEventListener("keydown", unlock, { once: true });
        });
    }
}

function stopMusic() {
    stageMusic.pause();
    stageMusic.currentTime = 0;
}

/* =====================================================
   RHYTHM START
===================================================== */

function startRhythm() {

    game.running = true;
    game.beatNumber = 0;
    game.nextBeat = 0;
    game.currentTime = 0;
    game.notes = [];

    noteTrack.innerHTML = "";

    battleMessage.textContent =
        game.language === "eng"
            ? "FIGHT!"
            : "MULAI!";

    requestAnimationFrame(rhythmLoop);

}

/* =====================================================
   RHYTHM LOOP
===================================================== */

function rhythmLoop() {

    if (!game.running) {
        return;
    }

    game.currentTime = stageMusic.currentTime - game.songOffset;

    while (
        game.nextBeat <= game.currentTime + game.noteTravelTime + 0.15
    ) {

        createBeat(
            game.nextBeat,
            game.beatNumber
        );

        game.nextBeat += game.beatDuration;
        game.beatNumber++;
    }

    updateNotes();
    checkMissedNotes();

    const currentBeat = Math.floor(
        Math.max(0, game.currentTime) / game.beatDuration
    );

    if (currentBeat !== game.lastVisualBeat) {
        game.lastVisualBeat = currentBeat;
        rhythmPulse.classList.remove("pulse");
        void rhythmPulse.offsetWidth;
        rhythmPulse.classList.add("pulse");
    }

    if (stageMusic.ended) {
        game.running = false;
        if (game.enemyHP > 0 && game.playerHP > 0) {
            game.notes.forEach(note => {
                if (!note.hit && !note.missed) missNote(note);
            });
        }
        return;
    }

    requestAnimationFrame(rhythmLoop);
}

/* =====================================================
   BEAT PATTERN
===================================================== */

function getLaneForBeat(beat) {

    // Three-lane pattern: notes travel on the left, center, or right lane.
    const pattern = [
        0, 1, 2, 1,
        0, 0, 2, 1,
        2, 1, 0, 1,
        0, 2, 2, 1
    ];

    return pattern[beat % pattern.length];
}

/* =====================================================
   CREATE NOTE
===================================================== */

function createBeat(
    beatTime,
    beatNumber
) {

    const lane =
        getLaneForBeat(
            beatNumber
        );


    /*
        Note akan jatuh selama 2 detik
        sebelum mencapai hit line.
    */

    const note = {

        lane,

        hitTime:
            beatTime,

        hit:
            false,

        missed:
            false,

        element:
            null

    };


    createNoteElement(
        note
    );


    game.notes.push(
        note
    );

}


/* =====================================================
   NOTE ELEMENT
===================================================== */

function createNoteElement(note) {

    const element = document.createElement("div");
    element.className = "rhythm-note";
    element.dataset.key = ["Q", "W", "E"][note.lane];
    element.dataset.lane = String(note.lane);
    element.style.setProperty("--travel-time", `${game.noteTravelTime}s`);
    noteTrack.appendChild(element);
    note.element = element;
}

/* =====================================================
   UPDATE NOTES
===================================================== */

function updateNotes() {

    const trackHeight = noteTrack.clientHeight;
    const hitLineY = trackHeight - 40;

    game.notes.forEach(note => {

        if (note.hit || note.missed || !note.element) return;

        const timeUntilHit = note.hitTime - game.currentTime;
        const y = hitLineY - (timeUntilHit * game.noteSpeed);
        note.element.style.top = `${y}px`;
    });
}

/* =====================================================
   MISSED NOTE
===================================================== */

function checkMissedNotes() {

    game.notes.forEach(note => {

        if (
            note.hit ||
            note.missed
        ) {

            return;

        }


        const difference =
            game.currentTime -
            note.hitTime;


        if (
            difference >
            game.hitWindow.good
        ) {

            missNote(note);

        }

    });

}


/* =====================================================
   INPUT
===================================================== */

document.addEventListener("keydown", event => {

    const key = event.key.toUpperCase();
    const laneMap = { Q: 0, W: 1, E: 2 };

    if (laneMap[key] === undefined) return;
    handleLaneInput(laneMap[key]);
});


/* =====================================================
   CREATE LANE KEYS
===================================================== */

function createLaneKeys() {

    document
        .querySelectorAll("#mobile-controls button")
        .forEach((key, index) => {
            key.addEventListener("pointerdown", event => {
                event.preventDefault();
                handleLaneInput(index);
            });
        });
}

/* =====================================================
   HANDLE INPUT
===================================================== */

function handleLaneInput(lane) {
    flashLane(lane);
    if (!game.running) {
        return;
    }


    /*
        Cari note terdekat di lane
        tersebut.
    */

    let target =
        null;


    let smallestDifference =
        Infinity;


    game.notes.forEach(note => {

        if (
            note.hit ||
            note.missed
        ) {

            return;

        }


        if (
            note.lane !== lane
        ) {

            return;

        }


        const difference =
            Math.abs(
                game.currentTime -
                note.hitTime
            );


        if (
            difference <
            smallestDifference
        ) {

            smallestDifference =
                difference;

            target =
                note;

        }

    });


    if (!target) {

        return;

    }


    const difference =
        Math.abs(
            game.currentTime -
            target.hitTime
        );


    let judgement;


    if (
        difference <=
        game.hitWindow.perfect
    ) {

        judgement =
            "PERFECT";

    }

    else if (
        difference <=
        game.hitWindow.excellent
    ) {

        judgement =
            "EXCELLENT";

    }

    else if (
        difference <=
        game.hitWindow.good
    ) {

        judgement =
            "GOOD";

    }

    else {

        return;

    }


    hitNote(
        target,
        judgement
    );

}


/* =====================================================
   HIT NOTE
===================================================== */

function hitNote(
    note,
    judgement
) {

    note.hit =
        true;


    if (note.element) {

        note.element.remove();

    }


    let damage =
        0;

    let score =
        0;


    if (
        judgement ===
        "PERFECT"
    ) {

        damage =
            10;

        score =
            100;

    }

    else if (
        judgement ===
        "EXCELLENT"
    ) {

        damage =
            8;

        score =
            80;

    }

    else {

        damage =
            5;

        score =
            50;

    }


    game.combo++;


    updateMultiplier();


    damage *=
        game.multiplier;


    score *=
        game.multiplier;


    game.enemyHP -=
        damage;


    game.score +=
        score;


    if (
        game.enemyHP < 0
    ) {

        game.enemyHP =
            0;

    }


    showJudgement(
        judgement
    );


    updateBattleUI();


    if (
        game.enemyHP <= 0
    ) {

        winBattle();

    }

}


/* =====================================================
   MISS
===================================================== */

function missNote(note) {

    note.missed =
        true;


    if (note.element) {

        note.element.remove();

    }


    game.combo =
        0;


    game.multiplier =
        1;


    showJudgement(
        "MISS"
    );


    updateBattleUI();

}


/* =====================================================
   MULTIPLIER
===================================================== */

function updateMultiplier() {

    if (
        game.combo >= 20
    ) {

        game.multiplier =
            4;

    }

    else if (
        game.combo >= 10
    ) {

        game.multiplier =
            3;

    }

    else if (
        game.combo >= 5
    ) {

        game.multiplier =
            2;

    }

    else {

        game.multiplier =
            1;

    }

}


/* =====================================================
   JUDGEMENT VISUAL
===================================================== */

function showJudgement(type) {

    judgementElement.textContent =
        type;


    judgementElement.classList.remove(
        "show"
    );


    void judgementElement.offsetWidth;


    judgementElement.classList.add(
        "show"
    );


    if (
        type === "PERFECT"
    ) {

        judgementElement.style.color =
            "#ffe45c";

    }

    else if (
        type === "EXCELLENT"
    ) {

        judgementElement.style.color =
            "#63e6a1";

    }

    else if (
        type === "GOOD"
    ) {

        judgementElement.style.color =
            "#65b7ff";

    }

    else {

        judgementElement.style.color =
            "#ff4057";

    }

}


/* =====================================================
   BATTLE UI
===================================================== */

function updateBattleUI() {

    scoreElement.textContent =
        game.score;


    comboElement.textContent =
        game.combo;


    multiplierElement.textContent =
        game.multiplier;


    playerHPElement.style.width =
        `${game.playerHP}%`;


    playerHPText.textContent =
        `${game.playerHP} / 100`;


    enemyHPElement.style.width =
        `${game.enemyHP}%`;


    enemyHPText.textContent =
        `${game.enemyHP} / ${game.enemyMaxHP}`;

}


/* =====================================================
   WIN
===================================================== */

function winBattle() {

    game.running = false;
    stopMusic();


    battleMessage.textContent =
        game.language === "eng"
            ? "DEFEATED"
            : "DIKALAHKAN";


    setTimeout(
        () => {

            showScreen(
                "result-screen"
            );


            document.getElementById(
                "result-title"
            ).textContent =
                game.language === "eng"
                    ? "VICTORY"
                    : "KEMENANGAN";


            document.getElementById(
                "result-description"
            ).textContent =
                game.language === "eng"
                    ? "The first wall has fallen."
                    : "Tembok pertama telah runtuh.";


            document.getElementById(
                "result-button"
            ).textContent =
                game.language === "eng"
                    ? "CONTINUE"
                    : "LANJUT";

        },
        1000
    );

}




function loseBattle() {

    if (!game.running) return;

    game.running = false;
    stopMusic();
    noteTrack.innerHTML = "";
    game.notes = [];

    battleMessage.textContent =
        game.language === "eng"
            ? "ENDO HAS FALLEN"
            : "ENDO TELAH JATUH";

    setTimeout(() => {
        const title = document.getElementById("result-title");
        const description = document.getElementById("result-description");
        const button = document.getElementById("result-button");

        title.textContent = game.language === "eng" ? "GAME OVER" : "GAME OVER";
        description.textContent = game.language === "eng"
            ? "The rhythm was lost. Endo has fallen."
            : "Irama telah hilang. Endo telah jatuh.";
        button.textContent = game.language === "eng" ? "TRY AGAIN" : "COBA LAGI";
        showScreen("result-screen");
    }, 900);
}
/* =====================================================
   INITIALIZE
===================================================== */

updateLanguage();

updateBattleUI();

createLaneKeys();



function flashLane(lane) {
    const buttons = document.querySelectorAll("#mobile-controls button");
    const key = buttons[lane];
    if (!key) return;
    key.classList.remove("pressed");
    void key.offsetWidth;
    key.classList.add("pressed");
    setTimeout(() => key.classList.remove("pressed"), 90);
}
