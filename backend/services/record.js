import RecordModel from '../models/recod.js'
import ProfileModel from '../models/profile.js'
import RecordDto from '../dtos/record_dto.js'
import profileService from '../services/profile.js'
import ApiError from '../exceptions/api_error.js'
import transferService from '../services/transfer.js'
import collectionHandler from '../helpers/collection-handler.js'

class RecordService {
  async getRecords(userId, page, perPage, type, billId) {
    const profile = await ProfileModel.findOne({ user: userId })
    const records = await RecordModel.find({ profile: profile.id }).lean()
    const sortedTypeList = []
    records.forEach((record) => {
      if (!!type) {
        if (record.type === type) {
          sortedTypeList.push(record)
        }
      } else {
        sortedTypeList.push(record)
      }
    })
    const sortedList = []
    sortedTypeList.forEach((recod) => {
      if (!!billId) {
        if (recod.bill._id.equals(billId)) {
          sortedList.push(recod)
        }
      } else {
        sortedList.push(recod)
      }
    })
    const res = collectionHandler.resolveCollectionByPage(
      sortedList || [],
      page,
      perPage
    )
    const promises = Promise.all(
      res.data.map(async (record) => {
        const bill = await profileService.getOneBill(userId, record.bill)
        const category = await profileService.getOneCategory(
          userId,
          record.category
        )
        record.bill = bill
        record.category = category
        return RecordDto.resolveRecord(record)
      })
    )
    return {
      data: await promises,
      total: res.size,
    }
  }
  async getRecordById(userId, recordId) {
    const profile = await ProfileModel.findOne({ user: userId })
    const record = await RecordModel.findById(recordId).lean()
    if (!record || !record.profile.equals(profile.id)) {
      return null
    }
    return await this.getFullRecod(userId, record)
  }

  async addRecord(userId, record) {
    const profile = await ProfileModel.findOne({ user: userId })
    const data = await RecordModel.create({
      profile: profile.id,
      bill: record.bill,
      category: record.category,
      sum: record.sum,
      transfer: null,
      type: record.type,
      created_at: record.created_at,
      description: record.description,
    })
    return await this.getFullRecod(userId, data)
  }

  async updateRecord(userId, recordId, record) {
    const profile = await ProfileModel.findOne({ user: userId })
    const oldRecord = await RecordModel.findById(recordId)
    if (!oldRecord || !oldRecord.profile.equals(profile.id)) {
      throw ApiError.badRequest('Record not found')
    }
    const data = await RecordModel.findOneAndUpdate(
      {
        profile: profile.id,
        _id: recordId,
      },
      record,
      { new: true }
    ).lean()
    if (!data) {
      return null
    }
    return await this.getFullRecod(userId, data)
  }

  async deleteRecord(userId, recordId) {
    const profile = await ProfileModel.findOne({ user: userId })
    const record = await RecordModel.findOne({
      profile: profile,
      _id: recordId,
    })
    if (!record) {
      throw ApiError.badRequest('Record not found')
    }
    if (record.transfer !== null) {
      return await transferService.deleteTransfer(userId, record.transfer._id)
    }
    return await record.delete()
  }

  async getFullRecod(userId, record) {
    const bill = await profileService.getOneBill(userId, record.bill)
    const category = await profileService.getOneCategory(
      userId,
      record.category
    )
    record.bill = bill
    record.category = category
    return RecordDto.resolveRecord(record)
  }
}

export default new RecordService()
