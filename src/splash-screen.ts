import { el } from '@zero-dependency/dom'

import freakGames from '@/freak-games.mp3'

class SplashScreen {
    #el: HTMLDivElement | null = null
    #callback: (() => void) | null
    #hue = 0

    #onUpdateCursor(event: TouchEvent | MouseEvent) {
        if (!this.#el) return

        let x = 0
        let y = 0

        if ('clientX' in event) {
            x = event.clientX
            y = event.clientY
        } else if ('touches' in event) {
            x = event.touches[0].clientX
            y = event.touches[0].clientY
        }

        this.#hue = (this.#hue + 1) % 360
        this.#el.style.setProperty('--logo-hue', `${this.#hue}deg`)
        this.#el.style.setProperty('--cursor-x', `${x}px`)
        this.#el.style.setProperty('--cursor-y', `${y}px`)
    }

    constructor() {
        document.addEventListener('mousemove', this.#onUpdateCursor.bind(this))
        document.addEventListener('touchmove', this.#onUpdateCursor.bind(this))
    }

    onInit(callback: () => void) {
        this.#callback = callback
        // if (import.meta.env.DEV) {
        //     this.#callback()
        // }
    }

    init() {
        // if (import.meta.env.DEV) return
        if (this.#el) return

        this.#playAudio()
            .then(() => {
                this.#el = el(
                    'div',
                    {
                        className: 'splash-screen',
                        onanimationstart: (event) => {
                            if (event.animationName === 'fade-out') {
                                this.#callback?.()
                                this.#callback = null
                            }
                        },
                        onanimationend: (event) => {
                            if (event.animationName === 'fade-out') {
                                this.#el?.remove()
                                this.#el = null
                            }
                        }
                    },
                    el('div', { className: 'logo' })
                )
                document.body.prepend(this.#el)
            })
            .catch(() => {
                this.#el = el(
                    'div',
                    {
                        className: 'splash-screen',
                        onclick: () => {
                            this.#el?.remove()
                            this.#el = null
                            this.init()
                        }
                    },
                    el('h4', 'Click to start')
                )
                document.body.prepend(this.#el)
            })
    }

    destroy() {
        if (!this.#el) return
        this.#el.classList.add('destroy-animation')
    }

    #playAudio() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const audio = new Audio(freakGames)
                audio.volume = 1
                audio.playbackRate = 0.9
                audio.addEventListener('ended', () => this.destroy())
                await audio.play()
                resolve()
            } catch {
                reject()
            }
        })
    }
}

export const splashScreen = new SplashScreen()