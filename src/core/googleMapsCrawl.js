const puppeteer = require('puppeteer-extra')
const validateTitle = require('../helpers/validateTitle')

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
    await page.waitForTimeout(5000)

    try {
        const data = await page.evaluate(async () => {
            const title = (() => {
                try {
                    return document.querySelector('h1.section-hero-header-title-title>span:first-child').textContent.trim().split(' ').join('')
                } catch (e) {
                    throw new Error('Can not found')
                }
            })()

            const image = (() => {
                try {
                    return document.querySelector('.section-hero-header-image-hero-container>button>img').getAttribute('src')
                } catch (e) {
                    return null
                }
            })()

            const category = (() => {
                try {
                    return document.querySelector('button[jsaction="pane.rating.category"]').textContent.trim().toLowerCase()
                } catch (e) {
                    return null
                }
            })()

            const rating = (() => {
                try {
                    return parseFloat(document.querySelector('div.gm2-display-2').textContent.trim())
                } catch (e) {
                    return null
                }
            })()

            const address = (() => {
                try {
                    return document.querySelector('div.mapsConsumerUiSubviewSectionGm2Listitem__text>div').textContent.trim().toLowerCase()
                } catch (e) {
                    return null
                }
            })()

            const reviews = (() => {
                const temp = []
                const avatars = document.querySelectorAll('img.section-review-reviewer-image')
                avatars.forEach((img, index) => {
                    const avatar = img.getAttribute('src')
                    temp[index] = Object.assign({}, temp[index], {avatar})
                })
                const reviewerSpans = document.querySelectorAll('div.section-review-title>span')
                reviewerSpans.forEach((span, index) => {
                    const reviewer = span.textContent
                    temp[index] = Object.assign({}, temp[index], {reviewer})
                })
                const rates = document.querySelectorAll('span.section-review-stars')
                rates.forEach((span, index) => {
                    const rate = span.getAttribute('aria-label').trim()
                    temp[index] = Object.assign({}, temp[index], {rate})
                })
                const comments = document.querySelectorAll('span.section-review-text')
                comments.forEach((span, index) => {
                    const comment = span.textContent
                    temp[index] = Object.assign({}, temp[index], {comment})
                })
                return temp
            })()

            return {
                title,
                image,
                rating,
                category,
                address,
                reviews
            }
        })
        await browser.close()
        console.log({data})
        return data
    } catch (error) {
        console.log("NO INFORMATION");
        return null
    }
}