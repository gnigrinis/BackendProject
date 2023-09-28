const { Router } = require("express");
const mailSenderService = require("../services/mail.sender.service");
const smsSenderService = require("../services/sms.sender.service")

const router = Router()

router.get('/mail', (req, res) => {
  
  const template = `

    <p>Tu pedido en la tienda</p>
    
    <ol>
      <li>Producto 1</li>
      <li>Producto 2</li>
    </ol>

    <p>Tiene estatus <span>Pendinete</span></p>

  `
  
  mailSenderService.send('gnigrinis@gmail.com',template)

  res.send('OK')
})


router.get('/sms', (req, res) =>{
  smsSenderService.send('+573054835757', 'Hola estamos en vivo en la clase')
  res.send('OK')
})

module.exports = router