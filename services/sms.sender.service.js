const twilio = require("twilio")
const config = require("../config/config")

class SmsSender {
  constructor() {
    this.client = twilio(
      config.twilio.TWILIO_SID,
      config.twilio.TWILIO_AUTH_TOKEN
    )
  }

  async send(to, body) {
    const response = await this.client.messages.create({
      body,
      from: config.twilio.TWILIO_PHONE,
      to,
    })
  }
}

module.exports = new SmsSender()
