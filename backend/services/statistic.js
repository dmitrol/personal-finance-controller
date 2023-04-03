import RecordModel from '../models/recod.js'
import ProfileModel from '../models/profile.js'
import collectionHandler from '../helpers/collection-handler.js'

class StatisticService {
  async getStatisticByBills(userId, page, perPage) {
    const profile = await ProfileModel.findOne({ user: userId })
    const records = await RecordModel.find({ profile: profile.id }).lean()
    const statisticList = []
    profile.bills.forEach((bill) => {
      const statisticItem = {
        title: bill.title,
        currency: bill.currency,
      }
      const result = calcOneBillStatistic(bill._id, records)
      statisticItem.income = result.income
      statisticItem.expense = result.expense
      statisticItem.total = +(result.income - result.expense).toFixed(2)
      statisticList.push(statisticItem)
    })
    const res = collectionHandler.resolveCollectionByPage(
      statisticList,
      page,
      perPage
    )
    return {
      data: res?.data,
      total: res?.size,
    }
  }
}

function calcOneBillStatistic(billId, records) {
  const result = {
    income: 0,
    expense: 0,
  }
  records.forEach((record) => {
    if (record.type === 'income' && record.bill._id.equals(billId)) {
      result.income = result.income + record.sum
    } else if (record.bill._id.equals(billId)) {
      result.expense = result.expense + record.sum
    }
  })
  return result
}

export default new StatisticService()
