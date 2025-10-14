const DECISION_THRESHOLD = 75;
let isAnimating = false
let pullDeltaX = 0

function startDrag(e) {
    if (isAnimating) return

    const currentCard = e.target.closest('article')
    if (!currentCard) return
    const startX = e.pageX ?? e.touches[0].pageX

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })

    function onMove(e) {
        const currentX = e.pageX ?? e.touches[0].pageX
        pullDeltaX = currentX - startX
        if (pullDeltaX === 0) return

        isAnimating = true
        const deg = pullDeltaX / 10
        currentCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`
        currentCard.style.cursor = 'grabbing'

        const opacity = Math.abs(pullDeltaX) / 100
        const isRight = pullDeltaX > 0
        const choiceEl = isRight
            ? currentCard.querySelector('.choice.like')
            : currentCard.querySelector('.choice.nope')

        choiceEl.style.opacity = opacity
    }

    function onEnd() {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)
        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)

        const decisitionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

        if (decisitionMade) {
            const goRight = pullDeltaX >= 0
            currentCard.classList.add(goRight ? 'go-right' : 'go-left')
            currentCard.addEventListener('transitionend', () => {
                currentCard.remove()
            })
        } else {
            currentCard.classList.add('reset')
            currentCard.classList.remove('go-right', 'go-left')
            currentCard.querySelectorAll('.choice').forEach(choice => {
                choice.style.opacity = 0
            })
        }
    }

    currentCard.addEventListener('transitionend', () => {
        currentCard.removeAttribute('style')
        currentCard.classList.remove('reset')
        
        pullDeltaX = 0
        isAnimating = false
    })

    currentCard.querySelectorAll('.choice').forEach(choice => {
        choice.style.opacity = 0
    })
}

document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, { passive: true })