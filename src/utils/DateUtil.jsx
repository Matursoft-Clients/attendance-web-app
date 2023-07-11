const DateUtil = {
    formatYmdHisFromDate: (date) => {
        const dateObj = new Date(date)

        const year = dateObj.getFullYear()
        const month = dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() + 1 : `0` + (dateObj.getMonth() + 1)
        const day = dateObj.getDate() > 9 ? dateObj.getDate() : `0` + dateObj.getDate()
        const hours = dateObj.getHours() > 9 ? dateObj.getHours() : `0` + dateObj.getHours()
        const minutes = dateObj.getMinutes() > 9 ? dateObj.getMinutes() : `0` + dateObj.getMinutes()
        const seconds = dateObj.getSeconds() > 9 ? dateObj.getSeconds() : `0` + dateObj.getSeconds()

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    formatYmdFromDate: (date) => {
        const dateObj = new Date(date)

        const year = dateObj.getFullYear()
        const month = dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() + 1 : `0` + (dateObj.getMonth() + 1)
        const day = dateObj.getDate() > 9 ? dateObj.getDate() : `0` + dateObj.getDate()

        return `${year}-${month}-${day}`
    },
    getCurrentYear: () => {
        const dateObj = new Date()

        return dateObj.getFullYear()
    },
    getCurrentMonth: () => {
        const dateObj = new Date()

        return dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() + 1 : `0${dateObj.getMonth() + 1}`
    }
}

export default DateUtil