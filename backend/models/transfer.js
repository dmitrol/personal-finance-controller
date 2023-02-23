import { model } from 'mongoose'

import TransferSchema from '../schemas/TransferSchema.js'

export default model('transfers', TransferSchema)
