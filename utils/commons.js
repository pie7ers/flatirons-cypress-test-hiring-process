function getRandomEmail() {
  return `flatirons-test-${Date.now()}@yopmail.com`
}

function getValueTime(planName){
  return {
    Professional: '$2388/year',
  }[planName]
}

module.exports = {
  getRandomEmail,
  getValueTime,
}