export const extractMentions = (req, res, next) => {
  const { notification } = req.body;

  if (!notification) {
    return res.status(400).json({ message: "Missing Notifications" });
  }

  const emailPattern = /@[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const mentionedEmails = (notification.match(emailPattern) || []).map(email => email.substring(1));

  req.body.mentionedEmails = mentionedEmails;

  next();
};

