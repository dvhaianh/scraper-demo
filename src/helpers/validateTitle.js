module.exports = (string = '') => {
    const vString = string.trim().toLowerCase()
    const titlePartials = vString.split(' ')
    const title = titlePartials.map(word => {
        let vWord = ''
        for (let i = 0; i < word.length; i++) {
            const char = word[i]
            vWord += (i === 0) ? char.toUpperCase() : char
        }
        return vWord
    })
    return title.join('')
}