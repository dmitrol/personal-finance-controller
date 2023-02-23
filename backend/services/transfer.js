import RecordModel from '../models/recod.js'
import ProfileModel from '../models/profile.js'
import TransferModal from '../models/transfer.js'
import RecordDto from '../dtos/record_dto.js'
import profileService from '../services/profile.js'
import ApiError from '../exceptions/api_error.js'

class TransferService {
  async getTransferById(userId, transferId) {
    const profile = await ProfileModel.findOne({ user: userId })
    const transfer = await TransferModal.findById(transferId)
    if (!transfer) {
      throw ApiError.badRequest('transfer not found')
    }
    const records = await RecordModel.find({
      profile: profile.id,
      'transfer._id': transfer.id,
    }).lean()
    const promises = records.map(async (record) => {
      const bill = await profileService.getOneBill(userId, record.bill)
      record.bill = bill
      return new RecordDto(record)
    })
    return await Promise.all(promises)
  }

  async addTransfer(userId, formRecord, toRecord, transferRate) {
    const profile = await ProfileModel.findOne({ user: userId })
    const transfer = await TransferModal.create({ rate: transferRate })
    if (transfer) {
      return Promise.all([
        this.addTransferRecord(profile.id, formRecord, transfer),
        this.addTransferRecord(profile.id, toRecord, transfer),
      ])
    }
    return null
  }

  async addTransferRecord(profileId, record, transfer) {
    return await RecordModel.create({
      profile: profileId,
      bill: record.bill,
      sum: record.sum,
      transfer: transfer,
      type: record.type,
      created_at: record.created_at,
      description: record.description,
    })
  }

  async updateTransfer(userId, transferId, fromRecord, toRecord, transferRate) {
    const transfer = await TransferModal.findById(transferId)
    if (!transfer) {
      throw ApiError.badRequest('transfer not found')
    }
    const profile = await ProfileModel.findOne({ user: userId })
    const records = await RecordModel.find({
      profile: profile.id,
      'transfer._id': transfer.id,
    })
    if (records.length < 2) {
      return null
    }
    const newTansfer = await TransferModal.findByIdAndUpdate(transferId, {
      rate: transferRate,
    })
    return Promise.all([
      await this.updateTransferRecord(records[0]._id, fromRecord, newTansfer),
      await this.updateTransferRecord(records[1]._id, toRecord, newTansfer),
    ])
  }

  async updateTransferRecord(recordId, record, transfer) {
    const data = { ...record }
    data.transfer = transfer
    console.log(data)
    return await RecordModel.findOneAndUpdate(recordId, data, { new: true })
  }

  async deleteTransfer(userId, transferId) {
    const profile = await ProfileModel.findOne({ user: userId })
    const transfer = await TransferModal.findById(transferId)
    if (!transfer) {
      throw ApiError.badRequest('transfer not found')
    }
    return Promise.all([
      RecordModel.deleteMany({
        profile: profile.id,
        'transfer._id': transfer.id,
      }),
      TransferModal.findByIdAndDelete(transferId),
    ])
  }
}

export default new TransferService()
