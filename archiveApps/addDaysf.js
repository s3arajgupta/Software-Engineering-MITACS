function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().substring(0, 10);
}

module.exports = addDays;