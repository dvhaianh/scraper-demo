const mongoose = require('mongoose')

const PLACES = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    image: {
        type: String,
    },
    rating: {
        type: Number,
    },
    category: {
        type: String,
    },
    address: {
        type: String,
    },
    reviews: {
        type: Array
    }
})

const places = mongoose.model('places', PLACES, 'places')

module.exports.listing = async () => {
    return places.find().sort([['rating', -1]]).select('title image rating')
}

module.exports.filtering = async args => {
    const {category, rating, address} = args
    const conditions = []
    if (category) {
        conditions.push(
            {category}
        )
    }
    if (rating) {
        conditions.push(
            {rating: {$gte: rating}}
        )
    }
    if (address) {
        conditions.push(
            {address: {
                $regex: address,
                $options: 'gi'
            }}
        )
    }

    console.log(conditions)
    const find = await places.find({
        $and: conditions
    })

    return find.length > 0 ? find : null
}

module.exports.update = async args => {
    const {title} = args
    const exist = await places.findOne({title})
    if (!exist) {
        await adding(args)
    } else {
        await editing(args)
    }
}

module.exports.reading = async args => {
    const {title} = args
    return places.findOne({title})
}

const adding = async args => {
    const {title, image, rating, category, address, reviews} = args
    console.log(`Add new place`)
    const newPlace = new places({
        title, image, rating, category, address, reviews
    })
    newPlace.save()
    return args
}

const editing = async args => {
    const {title, image, rating, category, address, reviews} = args
    console.log(`Update place ${title}`)
    await places.findOneAndUpdate(
        {title},
        {
            image, rating, category, address, reviews
        }
    )
}