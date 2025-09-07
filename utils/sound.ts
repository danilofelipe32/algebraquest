// Nota: Este sistema assume que você tem arquivos de áudio em uma pasta /sounds no seu projeto.
// Ex: /sounds/click.mp3, /sounds/dice-roll.mp3, etc.

const audioCache: { [key: string]: HTMLAudioElement } = {};
let backgroundMusic: HTMLAudioElement | null = null;

const SOUND_FILES = {
    CLICK: '/sounds/click.mp3',
    DICE_ROLL: '/sounds/dice-roll.mp3',
    CORRECT: '/sounds/correct.mp3',
    WRONG: '/sounds/wrong.mp3',
    LUCKY: '/sounds/lucky.mp3',
    UNLUCKY: '/sounds/unlucky.mp3',
    MUSIC: '/sounds/background-music.mp3'
};

class SoundManager {
    public isSoundOn = true;
    public isMusicOn = true;

    private play(src: string, volume = 0.7) {
        if (!this.isSoundOn) return;

        // Tenta tocar o som. A reprodução automática pode ser bloqueada pelo navegador
        // até que o usuário interaja com a página.
        try {
            let audio = audioCache[src];
            if (!audio) {
                audio = new Audio(src);
                audio.volume = volume;
                audioCache[src] = audio;
            }
    
            audio.currentTime = 0;
            audio.play().catch(error => {
                // Silencia erros de reprodução automática, pois são comuns
                // console.error(`Error playing sound: ${src}`, error);
            });
        } catch (error) {
            console.error(`Could not process sound: ${src}`, error);
        }
    }

    public toggleSound(isOn: boolean) {
        this.isSoundOn = isOn;
    }

    public toggleMusic(isOn: boolean) {
        this.isMusicOn = isOn;
        if (this.isMusicOn) {
            this.playMusic();
        } else {
            this.stopMusic();
        }
    }

    public playClick() { this.play(SOUND_FILES.CLICK, 0.5); }
    public playDiceRoll() { this.play(SOUND_FILES.DICE_ROLL); }
    public playCorrect() { this.play(SOUND_FILES.CORRECT); }
    public playWrong() { this.play(SOUND_FILES.WRONG); }
    public playLucky() { this.play(SOUND_FILES.LUCKY, 0.6); }
    public playUnlucky() { this.play(SOUND_FILES.UNLUCKY, 0.6); }

    private playMusic() {
        if (!backgroundMusic) {
            backgroundMusic = new Audio(SOUND_FILES.MUSIC);
            backgroundMusic.loop = true;
            backgroundMusic.volume = 0.2;
        }
        backgroundMusic.play().catch(error => {
            // console.error(`Error playing music:`, error);
        });
    }

    private stopMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
    }
}

// Exporta uma única instância para ser usada em toda a aplicação
export const soundManager = new SoundManager();
