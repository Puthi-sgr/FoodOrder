export const GenerateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000); //30 minutes from now

  return { otp, expiry };
};

export const OnRequestOTP = async (otp: number, to: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  try {
    const response = client.messages
      .create({
        body: `This is your otp code ${otp}`,
        from: "+17754874987",
        to: to,
        //096 9764313
        // +855 95 978 626
      })
      .then((message) => console.log(message.sid));

    return response;
  } catch (error) {
    console.log("On request error: ", error);
  }
};
