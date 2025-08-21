const yopmail = require('easy-yopmail')

async function getLastConfirmationEmail(email) {
  const emails = (await yopmail.getInbox(email)).inbox
  const lastEmail = emails.filter(item => item.from === 'Flatirons Fuse' && item.subject === 'Confirmation instructions')[0]
  if (!lastEmail) {
    return {
      error: 'email confirmation email was not found'
    }
  }
  return lastEmail
}

async function readLastConfirmationEmail(email, id) {
  return await yopmail.readMessage(email, id, {format: 'html'})
}

async function getURLConfirmation(email){
  const lastConfirmationEmail = await getLastConfirmationEmail(email)
  const message = await readLastConfirmationEmail(email, lastConfirmationEmail.id)
  const regex = /href="([^"]+)"/
  return message.content.match(regex)[1];
}

module.exports = {
  getURLConfirmation,
}