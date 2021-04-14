const puppeteer = require('puppeteer')

module.exports = async (place) => {
    const browser = await puppeteer.launch({
        headless: true,
        ignoreDefaultArgs: ['--disable-extensions'],
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()

    await page.goto('https://maps.google.com/')
    await page.waitForTimeout(1000)

    const inp_search = '#gs_lc50>input[name]'
    await page.type(inp_search, place, {delay: 5})
    const btn_search = 'div.searchbox-searchbutton-container>button'
    await page.click(btn_search)
    await page.waitForTimeout(4000)

    try {
        const data = await page.evaluate(() => {
            const reviewImage = document.querySelector('.section-hero-header-image-hero-container>button>img').getAttribute('src') || null
            const title = document.querySelector('h1.section-hero-header-title-title>span:first-child').textContent.trim() || null
            const rating = parseFloat(document.querySelector('.section-star-display').textContent.trim()) || null
            const address = document.querySelector('div.ugiz4pqJLAG__text').textContent.trim() || null
            const reviews = []

            const avatars = document.querySelectorAll('img.section-review-reviewer-image')
            avatars.forEach((img, index) => {
                const avatar = img.getAttribute('src')
                reviews[index] = Object.assign({}, reviews[index], {avatar})
            })
            const reviewerSpans = document.querySelectorAll('div.section-review-title>span')
            reviewerSpans.forEach((span, index) => {
                const reviewer = span.textContent
                reviews[index] = Object.assign({}, reviews[index], {reviewer})
            })
            const rates = document.querySelectorAll('span.section-review-stars')
            rates.forEach((span, index) => {
                const rate = span.getAttribute('aria-label').trim()
                reviews[index] = Object.assign({}, reviews[index], {rate})
            })
            const comments = document.querySelectorAll('span.section-review-text')
            comments.forEach((span, index) => {
                const comment = span.textContent
                reviews[index] = Object.assign({}, reviews[index], {comment})
            })
            return {
                reviewImage,
                title,
                rating,
                address,
                reviews
            }
        })
        return data
    } catch (error) {
        console.log(error.message)
    }
}