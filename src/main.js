// Konfigurasi teks dua bahasa (IND / ENG)
const langData = {
    IND: {
        title: "ENDO: RHYTHM OF REBELLION",
        subtitle: "Gunakan Q, W, E, R (Laptop) atau Sentuh Tombol (HP) sesuai beat!",
        start: "MULAI REVOLUSI",
        introText: "Negeri Endo berada di ambang kehancuran.\nPendidikan diabaikan, makanan beracun dibagikan ke masyarakat,\nhutan dibakar demi kekuasaan, dan kantor pemerintahan dikuasai Devil in Disguise!\n\nDobrak masuk, hancurkan antek-antek penjilat, dan rebut kembali masa depan.\nNamun ingat... bisikan iblis bisa saja kembali menguasai penguasa.",
        stageClear: "AREA BERSIH!",
        nextStage: "LANJUTKAN PERJUANGAN",
        gameOver: "REVOLUSI GAGAL...\nEndo sepenuhnya hancur dan dikuasai oleh para devil...",
        victory: "KEMENANGAN MUTLAK!\nRakyat menduduki kantor pemerintahan dan memilih pemimpin yang adil.\nTapi ingat... waspadalah, iblis tak pernah mati dan selalu mengintai.",
        retry: "COBA LAGI",
        score: "Skor",
        hp: "HP Player",
        combo: "Kombo",
        mult: "Multiplier",
        bossHP: "Boss HP",
        powerReady: "POWER-UP SIAP! (Tekan Spasi / Tap Status)"
    },
    ENG: {
        title: "ENDO: RHYTHM OF REBELLION",
        subtitle: "Use Q, W, E, R (Laptop) or Tap Buttons (Mobile) to the beat!",
        start: "START REVOLUTION",
        introText: "Endo is on the brink of collapse.\nEducation is ignored, poisoned food distributed, forests burned,\nand the government headquarters is overrun by Devils in Disguise!\n\nBreak in, smash the corrupt minions, and take back the country.\nRemember... the devil's whispers can always return to power.",
        stageClear: "AREA CLEARED!",
        nextStage: "NEXT STAGE",
        gameOver: "REVOLUTION FAILED...\nEndo is fully consumed and ruled by devils...",
        victory: "TOTAL VICTORY!\nCitizens take back the government and rule fairly.\nBeware... the devil's whisper never truly dies.",
        retry: "TRY AGAIN",
        score: "Score",
        hp: "Player HP",
        combo: "Combo",
        mult: "Multiplier",
        bossHP: "Boss HP",
        powerReady: "POWER-UP READY! (Press Space / Tap Status)"
    }
};

let currentLang = "IND";

class TitleScene extends Phaser.Scene {
    constructor() { super("TitleScene"); }
    create() {
        let w = this.scale.width;
        let h = this.scale.height;

        this.add.text(w/2, h/4 - 20, langData[currentLang].title, { fontSize: '24px', fill: '#ff3333', fontStyle: 'bold', align: 'center' }).setOrigin(0.5);
        this.add.text(w/2, h/3 + 10, langData[currentLang].subtitle, { fontSize: '13px', fill: '#cccccc', align: 'center', wordWrap: { width: 380 } }).setOrigin(0.5);

        // Tombol Ganti Bahasa (IND/ENG)
        let langBtn = this.add.text(w - 55, 35, currentLang, { fontSize: '16px', fill: '#ffffff', backgroundColor: '#333333', padding: {x:10, y:5} }).setInteractive().setOrigin(0.5);
        langBtn.on('pointerdown', () => {
            currentLang = (currentLang === "IND") ? "ENG" : "IND";
            this.scene.restart();
        });

        // Tombol Mulai
        let startBtn = this.add.rectangle(w/2, h/2 + 80, 260, 50, 0xcc0000).setInteractive();
        this.add.text(w/2, h/2 + 80, langData[currentLang].start, { fontSize: '16px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

        startBtn.on('pointerdown', () => {
            this.scene.start("NarrativeScene", { stage: 1 });
        });
    }
}

class NarrativeScene extends Phaser.Scene {
    constructor() { super("NarrativeScene"); }
    init(data) { this.stage = data.stage; }
    create() {
        let w = this.scale.width;
        let h = this.scale.height;

        let textToShow = (this.stage === 1) ? langData[currentLang].introText : `${langData[currentLang].stageClear}\n\nMemasuki Stage ${this.stage}...`;
        if(this.stage === 5) textToShow = "FINAL STAGE: Menghadapi Raja Devil, DORORO (2 Fase Nyawa Penuh Amarah)!";

        this.add.text(w/2, h/2 - 40, textToShow, { fontSize: '15px', fill: '#ffffff', align: 'center', lineSpacing: 8, wordWrap: { width: 380 } }).setOrigin(0.5);

        let btn = this.add.rectangle(w/2, h/2 + 170, 220, 45, 0x00aa00).setInteractive();
        this.add.text(w/2, h/2 + 170, langData[currentLang].nextStage, { fontSize: '14px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

        btn.on('pointerdown', () => {
            this.scene.start("GameScene", { stage: this.stage });
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() { super("GameScene"); }
    init(data) {
        this.stage = data.stage;
        this.playerHP = 100;
        this.score = 0;
        this.combo = 0;
        this.multiplier = 1;
        this.notes = [];
        this.noteSpeed = 3.2 + (this.stage * 0.4);
        this.spawnTimer = 0;
        this.gameOverFlag = false;

        // Power-up Meter & State
        this.powerMeter = 0;
        this.powerReady = false;
        this.activeBuff = null; // 'SHIELD' atau 'CRIT'

        // Setup Boss / Musuh Berdasarkan Stage
        if (this.stage === 1) { this.bossMaxHP = 70; this.enemyName = "Kroco Penjilat & Ormas"; }
        else if (this.stage === 2) { this.bossMaxHP = 100; this.enemyName = "Low-Rank Devil Guard"; }
        else if (this.stage === 3) { this.bossMaxHP = 140; this.enemyName = "Mid-Rank Devil Bureaucrat"; }
        else if (this.stage === 4) { this.bossMaxHP = 190; this.enemyName = "High-Rank Devil Minister"; }
        else if (this.stage === 5) { this.bossMaxHP = 240; this.enemyName = "DORORO (Fase 1)"; this.isDororo = true; this.dororoPhase = 1; }
        
        this.bossHP = this.bossMaxHP;
    }

    create() {
        let w = this.scale.width;
        let h = this.scale.height;

        // UI Kiri (Status Pemain - Rapi & Terstruktur)[cite: 2]
        this.add.rectangle(105, h/2, 195, h - 30, 0x161616, 0.9).setStrokeStyle(2, 0x444444);
        this.txtHP = this.add.text(22, 35, `HP: ${this.playerHP}`, { fontSize: '14px', fill: '#00ff00', fontStyle: 'bold' });
        this.txtScore = this.add.text(22, 70, `Score: 0`, { fontSize: '14px', fill: '#ffff00' });
        this.txtCombo = this.add.text(22, 105, `Combo: 0`, { fontSize: '14px', fill: '#00ffff' });
        this.txtMult = this.add.text(22, 140, `Mult: x1`, { fontSize: '14px', fill: '#ff00ff' });
        
        // Power-Up Bar UI Interaktif
        this.txtPower = this.add.text(22, 175, `Power: 0%`, { fontSize: '12px', fill: '#ff8800', fontStyle: 'bold' });
        let powerBox = this.add.rectangle(105, 205, 170, 24, 0x333333).setInteractive();
        this.powerBarFill = this.add.rectangle(23, 205, 0, 20, 0xff8800).setOrigin(0, 0.5);
        
        powerBox.on('pointerdown', () => this.activatePowerUp());

        // UI Kanan Atas (Health Bar Boss Bersih di Tengah)[cite: 2]
        this.add.text(w - 230, 25, `${this.enemyName}`, { fontSize: '12px', fill: '#ff5555', fontStyle: 'bold' });
        this.bossBarBg = this.add.rectangle(w - 130, 48, 170, 14, 0x550000).setOrigin(0, 0.5);
        this.bossBar = this.add.rectangle(w - 130, 48, 170, 14, 0xff0000).setOrigin(0, 0.5);

        // Garis Jalur Gitar Hero (4 Jalur: Q, W, E, R)
        this.laneX = [w/2 - 70, w/2 - 23, w/2 + 23, w/2 + 70];
        this.laneKeys = ['Q', 'W', 'E', 'R'];
        this.laneColors = [0x00ffcc, 0xff00ff, 0xffff00, 0x00ff00];

        this.laneX.forEach((x, index) => {
            this.add.rectangle(x, h/2, 38, h, 0x141414).setDepth(-1);
            this.add.circle(x, h - 95, 19, 0x222222).setStrokeStyle(2, this.laneColors[index]);
            this.add.text(x, h - 95, this.laneKeys[index], { fontSize: '15px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

            // Touch Buttons untuk Mobile di bagian bawah layar[cite: 4]
            let tBtn = this.add.circle(x, h - 30, 28, this.laneColors[index], 0.3).setInteractive();
            tBtn.on('pointerdown', () => this.hitLane(index));
        });

        // Garis Hit Target
        this.hitY = h - 95;
        this.add.line(0, 0, w/2 - 90, this.hitY, w/2 + 90, this.hitY, 0xffffff).setOrigin(0).setLineWidth(2);

        // Keyboard Input (Q, W, E, R dan Space untuk Power-Up)[cite: 4, 5]
        this.input.keyboard.on('keydown-Q', () => this.hitLane(0));
        this.input.keyboard.on('keydown-W', () => this.hitLane(1));
        this.input.keyboard.on('keydown-E', () => this.hitLane(2));
        this.input.keyboard.on('keydown-R', () => this.hitLane(3));
        this.input.keyboard.on('keydown-SPACE', () => this.activatePowerUp());
    }

    update(time, delta) {
        if (this.gameOverFlag) return;

        // Spawn Notes dengan frekuensi yang makin agresif di stage tinggi[cite: 3]
        this.spawnTimer += delta;
        if (this.spawnTimer > Math.max(400, 1050 - (this.stage * 110))) {
            this.spawnTimer = 0;
            let lane = Phaser.Math.Between(0, 3);
            let note = this.add.circle(this.laneX[lane], 0, 15, this.laneColors[lane]);
            note.lane = lane;
            this.notes.push(note);
        }

        // Gerakkan Note ke Bawah
        for (let i = this.notes.length - 1; i >= 0; i--) {
            let n = this.notes[i];
            n.y += this.noteSpeed;

            // Jika lewat garis tanpa ditekan (MISS)
            if (n.y > this.hitY + 35) {
                n.destroy();
                this.notes.splice(i, 1);
                this.handleMiss();
            }
        }
    }

    handleMiss() {
        if (this.activeBuff === 'SHIELD') {
            this.triggerFeedback("SHIELD BLOCKED!", 0x00ffff);
            this.activeBuff = null;
            this.txtPower.setText("Power: Habis");
            return;
        }

        this.triggerFeedback("MISS", 0x888888);
        this.combo = 0;
        this.multiplier = 1;
        this.playerHP -= (5 + this.stage * 2);
        this.updateUI();

        // Screen Shake Juice effect saat kena miss[cite: 3]
        this.cameras.main.shake(120, 0.006);

        if (this.playerHP <= 0) {
            this.triggerGameOver();
        }
    }

    hitLane(laneIndex) {
        if (this.gameOverFlag) return;

        let targetNoteIndex = -1;
        let minDis = 999;

        for (let i = 0; i < this.notes.length; i++) {
            let n = this.notes[i];
            if (n.lane === laneIndex) {
                let dis = Math.abs(n.y - this.hitY);
                if (dis < minDis) {
                    minDis = dis;
                    targetNoteIndex = i;
                }
            }
        }

        if (targetNoteIndex !== -1 && minDis < 45) {
            let n = this.notes[targetNoteIndex];
            n.destroy();
            this.notes.splice(targetNoteIndex, 1);

            let judgment = "GOOD";
            let dmg = 2;
            let color = 0xffff00;

            if (minDis < 12) {
                judgment = "PERFECT!";
                dmg = 6;
                color = 0x00ff00;
                // Hit Stop Micro-pause Juice untuk ketukan Perfect[cite: 3]
                this.time.delayedCall(15, () => {});
            } else if (minDis < 25) {
                judgment = "EXCELLENT!";
                dmg = 4;
                color = 0x00ffff;
            }

            this.triggerFeedback(judgment, color);
            this.combo++;
            
            // Multiplier progresif
            if (this.combo >= 15) this.multiplier = 4;
            else if (this.combo >= 10) this.multiplier = 3;
            else if (this.combo >= 5) this.multiplier = 2;
            else this.multiplier = 1;

            // Tambah Power Meter
            if (!this.powerReady) {
                this.powerMeter = Math.min(100, this.powerMeter + 10);
                if (this.powerMeter >= 100) {
                    this.powerReady = true;
                    this.txtPower.setText("⚡ SIAP! (Tekan/Tap)");
                }
            }

            let finalDmg = dmg * this.multiplier;
            if (this.activeBuff === 'CRIT') finalDmg *= 2;

            this.score += finalDmg * 10;
            this.bossHP -= finalDmg;

            this.updateUI();

            // Cek Kemenangan Stage / Boss[cite: 4]
            if (this.bossHP <= 0) {
                if (this.isDororo && this.dororoPhase === 1) {
                    this.dororoPhase = 2;
                    this.enemyName = "DORORO (Fase 2 Demon King)";
                    this.bossMaxHP = 290;
                    this.bossHP = this.bossMaxHP;
                    this.noteSpeed += 0.9;
                    this.triggerFeedback("FASE 2: KEKUATAN IBILIS BANGKIT!", 0xff0000);
                } else {
                    this.stageClearSequence();
                }
            }
        }
    }

    activatePowerUp() {
        if (!this.powerReady) return;
        this.powerReady = false;
        this.powerMeter = 0;

        // Pilih random buff: SHIELD atau ALWAYS CRIT (2x Damage)
        if (Math.random() > 0.5) {
            this.activeBuff = 'SHIELD';
            this.triggerFeedback("SHIELD AKTIF!", 0x00ffff);
            this.txtPower.setText("Shield Melindungi");
        } else {
            this.activeBuff = 'CRIT';
            this.triggerFeedback("ALWAYS CRIT (2X)!", 0xff00ff);
            this.txtPower.setText("Crit 2x Aktif");
        }
    }

    triggerFeedback(text, color) {
        let w = this.scale.width;
        let h = this.scale.height;
        let feedbackText = this.add.text(w/2, h/2 - 35, text, { fontSize: '22px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        feedbackText.setColor(Phaser.Display.Color.IntegerToColor(color).rgba);

        // Efek Juice / Tweens (Membesar lalu memudar mulus)[cite: 3, 5]
        this.tweens.add({
            targets: feedbackText,
            scale: { from: 0.6, to: 1.3 },
            alpha: { from: 1, to: 0 },
            duration: 350,
            onComplete: () => feedbackText.destroy()
        });
    }

    updateUI() {
        this.txtHP.setText(`HP: ${Math.max(0, this.playerHP)}`);
        this.txtScore.setText(`Score: ${this.score}`);
        this.txtCombo.setText(`Combo: ${this.combo}`);
        this.txtMult.setText(`Mult: x${this.multiplier}`);
        
        if (!this.powerReady && !this.activeBuff) {
            this.txtPower.setText(`Power: ${this.powerMeter}%`);
        }
        this.powerBarFill.width = 170 * (this.powerMeter / 100);

        let ratio = Math.max(0, this.bossHP / this.bossMaxHP);
        this.bossBar.width = 170 * ratio;
    }

    stageClearSequence() {
        this.gameOverFlag = true;
        this.notes.forEach(n => n.destroy());
        this.notes = [];

        if (this.stage < 5) {
            this.scene.start("NarrativeScene", { stage: this.stage + 1 });
        } else {
            this.scene.start("VictoryScene");
        }
    }

    triggerGameOver() {
        this.gameOverFlag = true;
        this.scene.start("GameOverScene");
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() { super("GameOverScene"); }
    create() {
        let w = this.scale.width;
        let h = this.scale.height;
        this.add.text(w/2, h/2 - 40, langData[currentLang].gameOver, { fontSize: '15px', fill: '#ff0000', align: 'center', lineSpacing: 8, wordWrap: { width: 380 } }).setOrigin(0.5);

        let btn = this.add.rectangle(w/2, h/2 + 60, 200, 45, 0xcc0000).setInteractive();
        this.add.text(w/2, h/2 + 60, langData[currentLang].retry, { fontSize: '14px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

        btn.on('pointerdown', () => this.scene.start("TitleScene"));
    }
}

class VictoryScene extends Phaser.Scene {
    constructor() { super("VictoryScene"); }
    create() {
        let w = this.scale.width;
        let h = this.scale.height;
        this.add.text(w/2, h/2 - 40, langData[currentLang].victory, { fontSize: '14px', fill: '#00ff00', align: 'center', lineSpacing: 8, wordWrap: { width: 380 } }).setOrigin(0.5);

        let btn = this.add.rectangle(w/2, h/2 + 90, 220, 45, 0x00aa00).setInteractive();
        this.add.text(w/2, h/2 + 90, langData[currentLang].start, { fontSize: '14px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

        btn.on('pointerdown', () => this.scene.start("TitleScene"));
    }
}

// Konfigurasi Utama Phaser Game (Mobile & Desktop Friendly)[cite: 4, 5]
const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 700,
    parent: 'game-container',
    backgroundColor: '#0a0a0a',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [TitleScene, NarrativeScene, GameScene, GameOverScene, VictoryScene]
};

new Phaser.Game(config);