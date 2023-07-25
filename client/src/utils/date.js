const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const getDateInDDMONFormat = (dateObj) => {
    return dateObj.getDate() + '-' +  monthNames[dateObj.getMonth()]
}

export {
    getDateInDDMONFormat,
}
