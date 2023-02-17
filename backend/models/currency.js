import { model } from 'mongoose'

import CurrencySchema from '../schemas/CurrencySchema.js'

export default model('currencies', CurrencySchema)
