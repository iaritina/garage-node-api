const router = require("express").Router();

const sendEmail = require('./mailer');
router.post('', (req, res) => {
  const { to, subject, text } = req.body;

  sendEmail(to, subject, text);

  res.send('E-mail envoyé avec succès');
});

module.exports = router;