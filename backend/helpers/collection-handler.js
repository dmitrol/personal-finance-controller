export default {
  resolveCollectionByPage(list, page, perPage) {
    if (!Array.isArray(list)) {
      return null
    }
    if (perPage >= list.length) {
      return {
        data: list,
        size: 1,
      }
    }

    const res = list.reduce(
      (acc, current) => {
        if (acc[acc.length - 1].length == perPage) {
          acc.push([])
        }

        acc[acc.length - 1].push(current)
        return acc
      },
      [[]]
    )
    let currentPage = +page
    if (currentPage.length < 1) {
      currentPage = 1
    }
    if (currentPage > res.length) {
      currentPage = res.length
    }
    return {
      data: res[currentPage - 1],
      size: res.length,
    }
  },
}
