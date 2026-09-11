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

    stageTimeLimit: 60,
    preludeBeats: 2,
    inputLocked: true,
    readinessShown: false,
    lastVisualBeat: -1,
    stageTimeRemaining: 60,
    previousMusicTime: 0,
    beatOffset: 0,
    defeated: false,
    stageHeal: 20,

    stageIndex: 0,
    enemyIndex: 0,
    phase2Active: false,
    enemyTransitioning: false,
    encounterReadyAt: 0,
    resultType: "victory",

    noteTravelTime: 2.0,
    subdivision: 1,
    inputGrace: 0.025,
    missGrace: 0.025,

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

// Mobile performance mode keeps rhythm timing/audio precise while reducing paint work.
game.lowPerformance = window.matchMedia("(max-width: 700px)").matches || (navigator.maxTouchPoints > 0 && window.innerWidth <= 900);
game.visualFrameInterval = game.lowPerformance ? (1000 / 30) : 0;
game.lastVisualUpdateMs = 0;
game.lastUiUpdateMs = 0;
if (game.lowPerformance) document.body.classList.add("low-performance");


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

const endingText = {
    eng: {
        eyebrow: "THE END",
        title: "A LONG JOURNEY, A NEW BEGINNING",
        p1: "After a journey through fear, corruption, and an unbroken rhythm, you finally stand before a fallen Dororo, the Tyranny King.",
        p2: "The office that once ruled through fear is silent. The people step forward. Endo has another chance to choose what comes next.",
        p3: "But victory is not a promise that darkness is gone. Devils can always return—sometimes not as rulers, but as whispers beside them.",
        p4: "The song ends here. The responsibility does not.",
        playAgain: "PLAY AGAIN"
    },
    ind: {
        eyebrow: "TAMAT",
        title: "PERJALANAN PANJANG, AWAL YANG BARU",
        p1: "Setelah perjalanan melewati ketakutan, korupsi, dan irama yang tak pernah berhenti, akhirnya kau berdiri di hadapan Dororo, Raja Tirani, yang telah tumbang.",
        p2: "Kantor yang dulu berkuasa lewat ketakutan kini sunyi. Rakyat melangkah maju. Endo mendapat kesempatan untuk menentukan arah yang baru.",
        p3: "Namun kemenangan bukan jaminan bahwa kegelapan telah lenyap. Devil bisa kembali—kadang bukan sebagai penguasa, melainkan sebagai bisikan di samping mereka.",
        p4: "Lagu berakhir di sini. Tanggung jawabnya tidak.",
        playAgain: "KEMBALI BERMAIN LAGI"
    }
};


/* =====================================================
   STAGE CONFIGURATION
===================================================== */

const stages = [
    {
        number: 1,
        music: "audio/stage1-endo.mp3",
        title: {
            eng: "THE FOLLOWERS",
            ind: "PARA PENJILAT"
        },
        description: {
            eng: "Those who kneel before power will defend it.",
            ind: "Mereka yang berlutut kepada kekuasaan akan membelanya."
        },
        timeLimit: 60,
        bpm: 120,
        noteSpeed: 420,
        subdivision: 1,
        hitWindow: { perfect: 0.055, excellent: 0.11, good: 0.18 },
        enemies: [
            {
                name: { eng: "THEIR FOLLOWERS", ind: "PARA PENGIKUT MEREKA" },
                hp: 180,
                maxHP: 180
            }
        ]
    },
    {
        number: 2,
        music: "audio/stage2-endo.mp3",
        title: {
            eng: "THE GATEKEEPERS",
            ind: "PARA PENJAGA GERBANG"
        },
        description: {
            eng: "The first gate is guarded by something that was never human.",
            ind: "Gerbang pertama dijaga oleh sesuatu yang tidak pernah menjadi manusia."
        },
        timeLimit: 65,
        bpm: 124,
        beatOffset: 0.90909,
        noteSpeed: 450,
        subdivision: 1,
        hitWindow: { perfect: 0.052, excellent: 0.100, good: 0.165 },
        enemies: [
            {
                name: { eng: "THE GATE WARDEN", ind: "PENJAGA GERBANG" },
                hp: 230,
                maxHP: 230
            }
        ]
    },
    {
        number: 3,
        music: "audio/stage3-endo.mp3",
        title: {
            eng: "LILBA, THE MIDDLE DEVIL",
            ind: "LILBA, DEVIL PANGKAT SEDANG"
        },
        description: {
            eng: "Deeper inside, the whispers become stronger. Lilba, a Middle Devil, stands in your way.",
            ind: "Semakin jauh ke dalam, bisikannya semakin kuat. Lilba, seorang Devil pangkat sedang, berdiri menghalangimu."
        },
        timeLimit: 70,
        bpm: 138,
        beatOffset: 0.42254,
        noteSpeed: 480,
        subdivision: 1,
        hitWindow: { perfect: 0.048, excellent: 0.092, good: 0.150 },
        enemies: [
            {
                name: { eng: "LILBA, MIDDLE DEVIL", ind: "LILBA, DEVIL PANGKAT SEDANG" },
                hp: 330,
                maxHP: 330
            }
        ]
    }
    ,{
        number: 4,
        music: "audio/stage4-endo.mp3",
        title: {
            eng: "TED, THE HIGH DEVIL",
            ind: "TED, DEVIL PANGKAT TINGGI"
        },
        description: {
            eng: "The deeper chambers belong to those who command the whispers. Ted awaits you.",
            ind: "Ruang-ruang terdalam dikuasai oleh mereka yang memerintah bisikan. Ted menunggumu."
        },
        timeLimit: 75,
        bpm: 148,
        beatOffset: 0.38961,
        noteSpeed: 510,
        subdivision: 1,
        hitWindow: { perfect: 0.045, excellent: 0.085, good: 0.140 },
        enemies: [
            {
                name: { eng: "TED, HIGH DEVIL", ind: "TED, DEVIL PANGKAT TINGGI" },
                hp: 380,
                maxHP: 380
            }
        ]
    },
    {
        number: 5,
        music: "audio/stage5-endo.mp3",
        title: {
            eng: "DORORO, THE TYRANNY KING",
            ind: "DORORO, RAJA TIRANI"
        },
        description: {
            eng: "At the heart of the government office, the ruler behind the devils finally shows himself.",
            ind: "Di jantung kantor pemerintahan, penguasa di balik para Devil akhirnya menunjukkan dirinya."
        },
        timeLimit: 96,
        bpm: 156,
        beatOffset: 0,
        noteSpeed: 540,
        subdivision: 1,
        hitWindow: { perfect: 0.040, excellent: 0.078, good: 0.125 },
        enemies: [
            {
                name: { eng: "DORORO", ind: "DORORO" },
                hp: 500,
                maxHP: 500,
            }
        ]
    }
];

function getStageConfig() {
    return stages[game.stageIndex] || stages[0];
}

function getEnemyConfig() {
    const stage = getStageConfig();
    return stage.enemies[game.enemyIndex] || stage.enemies[stage.enemies.length - 1];
}


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

const noteLanes =
    noteTrack.querySelectorAll(".note-lane");

const stageTimeElement =
    document.getElementById("stage-time");

const stageNumberElement =
    document.getElementById("battle-stage-number");

const enemyNameElement =
    document.getElementById("enemy-name");

const stageIntroNumberElement =
    document.getElementById("stage-number");

const enemyPreviewElement =
    document.getElementById("enemy-preview");

const enemyPlaceholderElement =
    document.getElementById("enemy-placeholder");

const rhythmPulse =
    document.getElementById("rhythm-pulse");

const stageMusic =
    document.getElementById("stage-music");

const transitionElement =
    document.getElementById("scene-transition");


/* =====================================================
   MENU / NARRATIVE AMBIENCE
===================================================== */

let menuMusicTimer = null;
let menuMusicNodes = [];
let menuAudioUnlocked = false;

function startMenuAmbience() {
    const ctx = ensureAudioContext();
    stopMenuAmbience();
    const chords = [
        [110, 164.81, 220],
        [98, 146.83, 196],
        [87.31, 130.81, 174.61],
        [82.41, 123.47, 164.81]
    ];
    let step = 0;
    const playChord = () => {
        const now = ctx.currentTime;
        const chord = chords[step % chords.length];
        chord.forEach((frequency, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = i === 0 ? "sine" : "triangle";
            osc.frequency.setValueAtTime(frequency, now);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(0.052, now + 0.35);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 3.8);
            menuMusicNodes.push(osc);
        });
        const pulse = ctx.createOscillator();
        const pulseGain = ctx.createGain();
        pulse.type = "sine";
        pulse.frequency.setValueAtTime(55, now);
        pulse.frequency.exponentialRampToValueAtTime(38, now + 0.28);
        pulseGain.gain.setValueAtTime(0.0001, now);
        pulseGain.gain.linearRampToValueAtTime(0.075, now + 0.03);
        pulseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
        pulse.connect(pulseGain).connect(ctx.destination);
        pulse.start(now);
        pulse.stop(now + 0.34);
        menuMusicNodes.push(pulse);
        step++;
    };
    playChord();
    menuMusicTimer = setInterval(playChord, 3800);
}

function stopMenuAmbience() {
    if (menuMusicTimer) {
        clearInterval(menuMusicTimer);
        menuMusicTimer = null;
    }
    menuMusicNodes = [];
}

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




function transitionToScreen(id, soundType = "transition", delay = 180) {

    if (!transitionElement) {
        showScreen(id);
        return;
    }

    transitionElement.classList.remove("flash");
    void transitionElement.offsetWidth;
    transitionElement.classList.add("flash");
    playUISound(soundType);

    setTimeout(() => showScreen(id), delay);
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

    document.getElementById("default-name-text").textContent =
        game.language === "eng" ? "Ordinary Citizen" : "Rakyat Biasa";


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

    const stage = getStageConfig();
    document.getElementById("stage-title").textContent = stage.title[game.language];
    document.getElementById("stage-description").textContent = stage.description[game.language];
    if (stageIntroNumberElement) stageIntroNumberElement.textContent = `STAGE ${String(stage.number).padStart(2, "0")}`;
    if (stageNumberElement) stageNumberElement.textContent = `STAGE ${String(stage.number).padStart(2, "0")}`;
    const enemy = getEnemyConfig();
    if (enemyNameElement) enemyNameElement.textContent = enemy.name[game.language];

    const ending = endingText[game.language];
    const endingEyebrow = document.getElementById("ending-eyebrow");
    const endingTitle = document.getElementById("ending-title");
    const endingButton = document.getElementById("play-again-button");
    if (endingEyebrow) endingEyebrow.textContent = ending.eyebrow;
    if (endingTitle) endingTitle.textContent = ending.title;
    if (endingButton) endingButton.textContent = ending.playAgain;
    document.getElementById("ending-text-1").textContent = ending.p1;
    document.getElementById("ending-text-2").textContent = ending.p2;
    document.getElementById("ending-text-3").textContent = ending.p3;
    document.getElementById("ending-text-4").textContent = ending.p4;

}


/* =====================================================
   UI / GAME FEEDBACK AUDIO
===================================================== */

function ensureAudioContext() {
    if (!game.audioContext) {
        game.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (game.audioContext.state === "suspended") {
        game.audioContext.resume();
    }
    return game.audioContext;
}

function playUISound(type = "tap") {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain).connect(ctx.destination);

    const presets = {
        tap: [560, 0.055, 0.07],
        transition: [220, 0.16, 0.08],
        story: [330, 0.11, 0.055],
        battle: [110, 0.22, 0.10],
        victory: [740, 0.35, 0.12],
        miss: [95, 0.18, 0.10],
        wrong: [145, 0.20, 0.10]
    };
    const [freq, dur, vol] = presets[type] || presets.tap;
    osc.type = type === "miss" ? "sawtooth" : "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(45, freq * 0.55), now + dur);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.start(now);
    osc.stop(now + dur + 0.01);
}

function playDefeatScream() {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(85, now + 0.9);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(500, now + 0.9);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1);
}

function unlockMenuAudio() {
    if (menuAudioUnlocked) return;
    menuAudioUnlocked = true;
    try {
        ensureAudioContext();
        startMenuAmbience();
    } catch (_) {}
}

document.addEventListener("pointerdown", unlockMenuAudio, { once: true });
document.addEventListener("keydown", unlockMenuAudio, { once: true });

/* =====================================================
   TITLE
===================================================== */

document
    .getElementById("start-game-button")
    .addEventListener(
        "click",
        () => {

            transitionToScreen(
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
                    : (game.language === "eng"
                        ? "Ordinary Citizen"
                        : "Rakyat Biasa");


            startStory();

        }
    );


/* =====================================================
   STORY
===================================================== */

let storyIndex = 0;


function startStory() {

    ensureAudioContext();
    startMenuAmbience();
    storyIndex = 0;

    transitionToScreen(
        "story-screen",
        "story"
    );

    showStoryLine();

}


function showStoryLine() {

    playUISound("story");

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

    const stage = getStageConfig();
    startMenuAmbience();

    if (enemyPreviewElement) {
        enemyPreviewElement.dataset.stage = String(stage.number);
    }
    if (enemyPlaceholderElement) {
        enemyPlaceholderElement.dataset.stage = String(stage.number);
    }

    transitionToScreen(
        "stage-intro-screen",
        "transition"
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

    const stage = getStageConfig();
    const enemy = stage.enemies[0];

    stopMenuAmbience();
    game.score = 0;
    game.combo = 0;
    game.multiplier = 1;

    // Carry HP between stages. Each successful stage grants a modest heal.
    if (game.stageIndex === 0 || game.resultType !== "victory") {
        game.playerHP = 100;
    } else {
        game.playerHP = Math.min(100, game.playerHP + game.stageHeal);
    }

    game.enemyIndex = 0;
    game.phase2Active = false;
    game.enemyHP = enemy.hp;
    game.enemyMaxHP = enemy.maxHP;
    game.notes = [];
    game.beatNumber = 0;
    game.nextBeat = 0;
    game.running = false;
    game.inputLocked = true;
    game.readinessShown = false;
    game.enemyTransitioning = false;
    game.defeated = false;
    game.bpm = stage.bpm;
    game.beatDuration = 60 / stage.bpm;
    game.beatOffset = stage.beatOffset || 0;
    game.stageTimeLimit = stage.timeLimit;
    game.stageTimeRemaining = stage.timeLimit;
    game.noteSpeed = stage.noteSpeed;
    game.subdivision = stage.subdivision || 1;
    game.hitWindow = { ...stage.hitWindow };

    updateBattleUI();
    document.getElementById("player-name-ui").textContent = game.playerName;

    const battleScreen = document.getElementById("battle-screen");
    if (battleScreen) battleScreen.dataset.stage = String(stage.number);

    transitionToScreen(
        "battle-screen",
        "battle"
    );

    battleMessage.textContent =
        game.language === "eng"
            ? "GET READY"
            : "BERSIAP";

    initializeAudio();

}

/* =====================================================
   AUDIO ENGINE
===================================================== */

function initializeAudio() {
    const stage = getStageConfig();
    stageMusic.src = stage.music;
    stageMusic.currentTime = 0;
    stageMusic.volume = 0.82;
    stageMusic.loop = true;
    ensureAudioContext();

    startRhythm();

    const playPromise = stageMusic.play();
    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
            battleMessage.textContent =
                game.language === "eng"
                    ? "TAP TO START"
                    : "TEKAN UNTUK MULAI";
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
    game.inputLocked = true;
    game.readinessShown = false;
    game.encounterReadyAt = game.preludeBeats * game.beatDuration;
    game.defeated = false;
    game.beatNumber = 0;

    // The first musical beat is intentionally empty.
    // Notes begin one full beat after the preparation window so the player
    // has a clean visual/audio runway before the first required input.
    const firstPlayableHit =
        game.beatOffset +
        ((game.preludeBeats + 1) * game.beatDuration);

    // nextBeat is the note spawn time; hitTime is spawn + travel time.
    game.nextBeat = firstPlayableHit - game.noteTravelTime;
    game.beatNumber = game.preludeBeats + 1;
    game.currentTime = 0;
    game.previousMusicTime = 0;
    game.lastVisualBeat = -1;
    game.notes = [];
    noteLanes.forEach(lane => { lane.innerHTML = ""; });

    battleMessage.textContent =
        game.language === "eng"
            ? "GET READY"
            : "BERSIAP";

    stageMusic.currentTime = 0;
    stageMusic.play().catch(() => {});

    requestAnimationFrame(rhythmLoop);
}

/* =====================================================
   RHYTHM LOOP
===================================================== */

function rhythmLoop() {

    if (!game.running) return;

    game.currentTime = stageMusic.currentTime;
    game.stageTimeRemaining = Math.max(0, game.stageTimeLimit - game.currentTime);

    const nowMs = performance.now();
    const shouldRender = !game.lowPerformance || (nowMs - game.lastVisualUpdateMs >= game.visualFrameInterval);
    if (shouldRender) game.lastVisualUpdateMs = nowMs;
    if (stageTimeElement && (!game.lowPerformance || nowMs - game.lastUiUpdateMs >= 100)) {
        stageTimeElement.textContent = Math.ceil(game.stageTimeRemaining);
        game.lastUiUpdateMs = nowMs;
    }

    const preludeDuration = game.preludeBeats * game.beatDuration;
    const effectiveTime = Math.max(0, game.currentTime - preludeDuration - game.beatOffset);

    if (game.enemyTransitioning) {
        // Music keeps running, but no new notes are spawned while the next enemy enters.
    } else {
        if (game.inputLocked && game.currentTime >= game.encounterReadyAt) {
            game.inputLocked = false;
            game.readinessShown = true;
            battleMessage.textContent = game.language === "eng" ? "FIGHT!" : "MULAI!";
            playUISound("battle");
        }

        const currentSubdivision = game.subdivision;
        const stepDuration = game.beatDuration / currentSubdivision;
        while (game.nextBeat <= game.currentTime + game.noteTravelTime + 0.08) {
            createBeat(game.nextBeat, game.beatNumber);
            game.nextBeat += stepDuration;
            game.beatNumber++;
        }
    }

    if (shouldRender) updateNotes();
    checkMissedNotes();

    // Keep the active-note list small so mobile devices do not accumulate old DOM state.
    if (game.notes.length > 96) {
        game.notes = game.notes.filter(note => !note.hit && !note.missed);
    }

    const currentSubdivision = game.subdivision;
    const currentBeat = Math.floor(Math.max(0, effectiveTime) / (game.beatDuration / currentSubdivision));
    if (currentBeat !== game.lastVisualBeat) {
        game.lastVisualBeat = currentBeat;
        rhythmPulse.classList.remove("pulse");
        void rhythmPulse.offsetWidth;
        rhythmPulse.classList.add("pulse");
    }

    if (effectiveTime >= game.stageTimeLimit) {
        loseByTime();
        return;
    }

    requestAnimationFrame(rhythmLoop);
}

/* =====================================================
   BEAT PATTERN
===================================================== */

function getLaneForBeat(step) {

    const stage = getStageConfig();

    // Stage 1 stays intentionally simple as the tutorial.
    // Difficulty rises gradually through tempo, lane patterns,
    // selective subdivisions, and tighter timing -- not note spam.
    const charts = {
        1: [
            0, 1, 2, 1,
            0, 0, 2, 1,
            2, 1, 0, 1,
            0, 2, 2, 1
        ],
        2: [
            1, 0, 2, 0,
            1, 2, 1, 0,
            2, 1, 0, 2,
            1, 0, 2, 0
        ],
        3: [
            0, 1, 2, 1,
            2, 0, 1, 2,
            1, 0, 2, 1,
            0, 2, 1, 0
        ],
        4: [
            0, 1, 2, 1, 0, 2, 1, 2,
            2, 0, 1, 2, 0, 1, 0, 2,
            1, 2, 0, 1, 2, 1, 0, 2
        ]
    };

    const chart = charts[stage.number] || charts[1];
    return chart[Math.floor(step) % chart.length];

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

        // beatTime is spawn time; hitTime is the actual musical target.
        hitTime:
            beatTime + game.noteTravelTime,

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
    noteLanes[note.lane].appendChild(element);
    note.element = element;
}

/* =====================================================
   UPDATE NOTES
===================================================== */

function updateNotes() {

    const trackHeight = noteTrack.clientHeight;
    const hitLineY = trackHeight - 78;

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
            game.hitWindow.good + game.missGrace
        ) {

            missNote(note);

        }

    });

}


/* =====================================================
   INPUT
===================================================== */

document.addEventListener("keydown", event => {
    if (event.repeat) return;
    const laneMap = { KeyQ: 0, KeyW: 1, KeyE: 2 };
    const lane = laneMap[event.code];
    if (lane === undefined) return;
    event.preventDefault();
    handleLaneInput(lane);
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
    if (!game.running || game.inputLocked) {
        return;
    }

    flashLane(lane);

    // Find the note closest to the hit point across all lanes.
    // This lets the game distinguish a correct lane from a wrong one.
    let target = null;
    let smallestDifference = Infinity;

    game.notes.forEach(note => {
        if (note.hit || note.missed || !note.element) return;

        const difference = Math.abs(game.currentTime - note.hitTime);
        if (difference < smallestDifference) {
            smallestDifference = difference;
            target = note;
        }
    });

    if (!target) return;

    const wrongHitWindow = game.hitWindow.good + game.inputGrace;

    // Only punish a wrong lane while an actual note is playable.
    // Empty/random taps between notes remain harmless.
    if (target.lane !== lane) {
        if (smallestDifference <= wrongHitWindow) {
            wrongLaneHit();
        }
        return;
    }

    const difference = Math.abs(game.currentTime - target.hitTime);
    let judgement;

    if (difference <= game.hitWindow.perfect) {
        judgement = "PERFECT";
    } else if (difference <= game.hitWindow.excellent) {
        judgement = "EXCELLENT";
    } else if (difference <= game.hitWindow.good + game.inputGrace) {
        judgement = "GOOD";
    } else {
        return;
    }

    hitNote(target, judgement);
}

function wrongLaneHit() {
    const wrongDamage = 5;

    game.combo = 0;
    game.multiplier = 1;
    game.playerHP = Math.max(0, game.playerHP - wrongDamage);

    playUISound("wrong");
    showJudgement(game.language === "eng" ? "WRONG!" : "SALAH!");
    document.body.classList.add("screen-shake");
    setTimeout(() => document.body.classList.remove("screen-shake"), 220);
    updateBattleUI();

    if (game.playerHP <= 0) {
        loseBattle();
    }
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


    if (game.enemyHP <= 0) {
        handleEnemyDefeat();
    }

}


/* =====================================================
   ENEMY DEFEAT / PHASE CHANGE
===================================================== */

function handleEnemyDefeat() {
    if (!game.running || game.enemyTransitioning) return;

    game.enemyTransitioning = true;
    game.inputLocked = true;
    game.combo = 0;
    game.multiplier = 1;
    noteLanes.forEach(lane => { lane.innerHTML = ""; });
    game.notes = [];

    playDefeatScream();
    document.body.classList.add("screen-shake");
    setTimeout(() => document.body.classList.remove("screen-shake"), 500);
    battleMessage.textContent = game.language === "eng" ? "DEFEATED" : "DIKALAHKAN";

    setTimeout(() => {
        game.enemyTransitioning = false;
        winBattle();
    }, 900);
}


/* =====================================================
   MISS
===================================================== */

function missNote(note) {

    note.missed = true;

    if (note.element) note.element.remove();

    game.combo = 0;
    game.multiplier = 1;

    const missDamage = 8;
    game.playerHP = Math.max(0, game.playerHP - missDamage);

    playUISound("miss");
    showJudgement("MISS");
    updateBattleUI();

    if (game.playerHP <= 0) {
        loseBattle();
    }
}

/* =====================================================
   MULTIPLIER
===================================================== */

function updateMultiplier() {

    if (
        game.combo >= 20
    ) {

        game.multiplier =
            2;

    }

    else if (
        game.combo >= 10
    ) {

        game.multiplier =
            2;

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

    const stage = getStageConfig();
    const enemy = getEnemyConfig();
    if (stageNumberElement) stageNumberElement.textContent = `STAGE ${String(stage.number).padStart(2, "0")}`;
    if (enemyNameElement) enemyNameElement.textContent = enemy.name[game.language];

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


    const enemyPercent = game.enemyMaxHP > 0
        ? (game.enemyHP / game.enemyMaxHP) * 100
        : 0;

    enemyHPElement.style.width =
        `${enemyPercent}%`;


    enemyHPText.textContent =
        `${game.enemyHP} / ${game.enemyMaxHP}`;

}


/* =====================================================
   WIN
===================================================== */

function winBattle() {
    if (!game.running) return;
    game.running = false;
    game.defeated = true;
    game.enemyTransitioning = false;
    game.resultType = "victory";
    stopMusic();
    stopMenuAmbience();
    noteLanes.forEach(lane => { lane.innerHTML = ""; });
    game.notes = [];

    playDefeatScream();
    document.body.classList.add("screen-shake");
    setTimeout(() => document.body.classList.remove("screen-shake"), 500);
    battleMessage.textContent =
        game.language === "eng" ? "DEFEATED" : "DIKALAHKAN";

    const stageWon = game.stageIndex;
    setTimeout(() => {
        if (stageWon === stages.length - 1) {
            transitionToScreen("ending-screen", "victory", 420);
            updateLanguage();
            startMenuAmbience();
            return;
        }

        transitionToScreen("result-screen", "victory", 220);
        const title = stageWon === 0
            ? (game.language === "eng" ? "VICTORY" : "KEMENANGAN")
            : stageWon === 1
                ? (game.language === "eng" ? "GATEBREAKER" : "PEMBUKA GERBANG")
                : (game.language === "eng" ? "THE WHISPER FADES" : "BISIKAN MEREDUP");
        const description = stageWon === 0
            ? (game.language === "eng" ? "The first wall has fallen." : "Tembok pertama telah runtuh.")
            : stageWon === 1
                ? (game.language === "eng" ? "The gate is open. Something worse is waiting beyond it." : "Gerbang telah terbuka. Sesuatu yang lebih buruk menunggu di baliknya.")
                : stageWon === 2
                    ? (game.language === "eng" ? "The Middle Devils are down. The higher chambers are listening." : "Para Middle Devil telah tumbang. Ruang yang lebih tinggi sedang mendengarkan.")
                    : (game.language === "eng" ? "The High Devils are defeated. Only Dororo remains." : "Para High Devil telah dikalahkan. Hanya Dororo yang tersisa.");
        document.getElementById("result-title").textContent = title;
        document.getElementById("result-description").textContent = description;
        document.getElementById("result-button").textContent =
            game.stageIndex < stages.length - 1
                ? (game.language === "eng" ? "NEXT STAGE" : "STAGE BERIKUTNYA")
                : (game.language === "eng" ? "REPLAY FINAL STAGE" : "ULANGI STAGE TERAKHIR");
    }, 1100);
}

function loseBattle(timeUp = false) {
    if (!game.running && !timeUp) return;
    game.resultType = "gameover";
    game.running = false;
    stopMusic();
    stopMenuAmbience();
    noteLanes.forEach(lane => { lane.innerHTML = ""; });
    game.notes = [];

    battleMessage.textContent =
        game.language === "eng" ? "ENDO HAS FALLEN" : "ENDO TELAH JATUH";

    setTimeout(() => {
        document.getElementById("result-title").textContent =
            "GAME OVER";
        document.getElementById("result-description").textContent = timeUp
            ? (game.language === "eng"
                ? "Time ran out. Their followers rushed into the room. The battle was lost."
                : "Waktu habis. Para pengikut mereka menyerbu ruangan. Pertempuran berakhir dengan kekalahanmu.")
            : (game.language === "eng"
                ? "You lost the rhythm. Endo has fallen."
                : "Kamu kehilangan irama. Endo telah jatuh.");
        document.getElementById("result-button").textContent =
            game.language === "eng" ? "START AGAIN FROM STAGE 1" : "ULANGI DARI STAGE 1";
        transitionToScreen("result-screen", "transition", 180);
    }, 700);
}

/* =====================================================
   RESULT BUTTON
===================================================== */

document.getElementById("result-button").addEventListener("click", () => {
    if (game.resultType === "victory" && game.stageIndex < stages.length - 1) {
        game.stageIndex += 1;
    } else if (game.resultType === "gameover") {
        game.stageIndex = 0;
        game.enemyIndex = 0;
        game.playerHP = 100;
    }
    startStageIntro();
});

document.getElementById("play-again-button").addEventListener("click", () => {
    game.stageIndex = 0;
    game.enemyIndex = 0;
    game.playerHP = 100;
    game.score = 0;
    game.combo = 0;
    game.multiplier = 1;
    game.defeated = false;
    game.phase2Active = false;
    game.enemyTransitioning = false;
    stopMusic();
    startMenuAmbience();
    transitionToScreen("title-screen", "transition", 220);
});

function loseByTime() {
    if (!game.running) return;
    game.running = false;
    stopMusic();
    stopMenuAmbience();
    noteLanes.forEach(lane => { lane.innerHTML = ""; });
    game.notes = [];
    showJudgement(game.language === "eng" ? "TIME" : "WAKTU");
    setTimeout(() => loseBattle(true), 420);
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
