import User from '../models/Users';
import generateToken from '../utils/generateToken';
import { Request, Response } from 'express';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import { from } from 'form-data';


// Register new user
export const registerUser = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
  
    const userExists = await User.findOne({ email });
  
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
  
    const user = await User.create({
        email,
        password,
        role
    });
  
    if (user) {
        res.status(201).json({
            _id: user._id.toString(),
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};


export const authUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
  
    if (!user.isActive) {
        return res.status(403).json({ message: 'User account is deactivated' });
    }
  
    if (user && (await user.matchPassword(password))) {
        const twoFactorCode = (crypto.randomInt(0, 1000000) + 1000000).toString().slice(1);
        user.twoFactorCode = twoFactorCode;
        user.twoFactorExpire = new Date(Date.now() + 600000); // 10 minutes

        await user.save();

        const message = {
          to: user.email,
          from: process.env.SENDGRID_FROM!,
          subject: 'Two Factor Authentication Code',
          text: `Your two factor authentication code is: ${twoFactorCode}`,
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
          <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
              <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
                <!--[if !mso]><!-->
                <meta http-equiv="X-UA-Compatible" content="IE=Edge">
                <!--<![endif]-->
                <!--[if (gte mso 9)|(IE)]>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                <!--[if (gte mso 9)|(IE)]>
            <style type="text/css">
              body {width: 600px;margin: 0 auto;}
              table {border-collapse: collapse;}
              table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
              img {-ms-interpolation-mode: bicubic;}
            </style>
          <![endif]-->
                <style type="text/css">
              body, p, div {
                font-family: inherit;
                font-size: 14px;
              }
              body {
                color: #000000;
              }
              body a {
                color: #1188E6;
                text-decoration: none;
              }
              p { margin: 0; padding: 0; }
              table.wrapper {
                width:100% !important;
                table-layout: fixed;
                -webkit-font-smoothing: antialiased;
                -webkit-text-size-adjust: 100%;
                -moz-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
              }
              img.max-width {
                max-width: 100% !important;
              }
              .column.of-2 {
                width: 50%;
              }
              .column.of-3 {
                width: 33.333%;
              }
              .column.of-4 {
                width: 25%;
              }
              ul ul ul ul  {
                list-style-type: disc !important;
              }
              ol ol {
                list-style-type: lower-roman !important;
              }
              ol ol ol {
                list-style-type: lower-latin !important;
              }
              ol ol ol ol {
                list-style-type: decimal !important;
              }
              @media screen and (max-width:480px) {
                .preheader .rightColumnContent,
                .footer .rightColumnContent {
                  text-align: left !important;
                }
                .preheader .rightColumnContent div,
                .preheader .rightColumnContent span,
                .footer .rightColumnContent div,
                .footer .rightColumnContent span {
                  text-align: left !important;
                }
                .preheader .rightColumnContent,
                .preheader .leftColumnContent {
                  font-size: 80% !important;
                  padding: 5px 0;
                }
                table.wrapper-mobile {
                  width: 100% !important;
                  table-layout: fixed;
                }
                img.max-width {
                  height: auto !important;
                  max-width: 100% !important;
                }
                a.bulletproof-button {
                  display: block !important;
                  width: auto !important;
                  font-size: 80%;
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                }
                .columns {
                  width: 100% !important;
                }
                .column {
                  display: block !important;
                  width: 100% !important;
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                  margin-left: 0 !important;
                  margin-right: 0 !important;
                }
                .social-icon-column {
                  display: inline-block !important;
                }
              }
            </style>
                <!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Chivo&display=swap" rel="stylesheet"><style>
          body {font-family: 'Chivo', sans-serif;}
          </style><!--End Head user entered-->
              </head>
              <body>
                <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
                  <div class="webkit">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
                      <tr>
                        <td valign="top" bgcolor="#FFFFFF" width="100%">
                          <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="100%">
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td>
                                      <!--[if mso]>
              <center>
              <table><tr><td width="600">
            <![endif]-->
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                                <tr>
                                                  <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
              <tr>
                <td role="module-content">
                  <p></p>
                </td>
              </tr>
            </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:3px 0px 30px 0px;" bgcolor="#26619B" data-distribution="1">
              <tbody>
                <tr role="module-content">
                  <td height="100%" valign="top"><table width="600" style="width:600px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
                <tbody>
                  <tr>
                    <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="33d39ee4-da50-404a-8d62-ac83a12a2429">
              <tbody>
                <tr>
                  <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                    <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="50" alt="" data-proportionally-constrained="false" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/81fed812ba14f2fc/c0479c04-a720-41e4-8aab-0d7359d99e8a/256x256.png" height="50">
                  </td>
                </tr>
              </tbody>
            </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6683a2ab-dc01-4aea-8ba1-85edbd028276" data-mc-module-version="2019-10-22">
              <tbody>
                <tr>
                  <td style="padding:18px 0px 0px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 36px; font-family: &quot;lucida sans unicode&quot;, &quot;lucida grande&quot;, sans-serif"><strong>Antidote</strong></span></div><div></div></div></td>
                </tr>
              </tbody>
            </table></td>
                  </tr>
                </tbody>
              </table></td>
                </tr>
              </tbody>
            </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:50px 0px 0px 30px;" bgcolor="#ffffff" data-distribution="1">
              <tbody>
                <tr role="module-content">
                  <td height="100%" valign="top"><table width="550" style="width:550px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
                <tbody>
                  <tr>
                    <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b16a4afb-f245-4156-968e-8080176990ea" data-mc-module-version="2019-10-22">
              <tbody>
                <tr>
                  <td style="padding:18px 40px 0px 0px; line-height:26px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 24px; color: #000000">Your Authentication Code.</span></div><div></div></div></td>
                </tr>
              </tbody>
            </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b16a4afb-f245-4156-968e-8080176990ea.1" data-mc-module-version="2019-10-22">
              <tbody>
                <tr>
                  <td style="padding:18px 40px 0px 0px; line-height:18px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: left"><span style="color: #353740; font-family: Helvetica, Arial, sans-serif; font-size: 15px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space-collapse: collapse; text-wrap: wrap; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial">Please use the following code to help verify your identity:</span></div><div></div></div></td>
                </tr>
              </tbody>
            </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c97177b8-c172-4c4b-b5bd-7604cde23e3f">
              <tbody>
                <tr>
                  <td style="padding:0px 0px 10px 0px;" role="module-content" bgcolor="">
                  </td>
                </tr>
              </tbody>
            </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b16a4afb-f245-4156-968e-8080176990ea.1.1" data-mc-module-version="2019-10-22">
              <tbody>
                <tr>
                  <td style="padding:18px 40px 0px 0px; line-height:18px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 36px"><strong>${twoFactorCode}</strong></span></div><div></div></div></td>
                </tr>
              </tbody>
            </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c97177b8-c172-4c4b-b5bd-7604cde23e3f.1.1">
              <tbody>
                <tr>
                  <td style="padding:0px 0px 80px 0px;" role="module-content" bgcolor="">
                  </td>
                </tr>
              </tbody>
            </table></td>
                  </tr>
                </tbody>
              </table></td>
                </tr>
              </tbody>
            </table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="38ec2680-c847-4765-8c5f-aa2aba19a2b3">
              <tbody>
                <tr>
                  <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">
                    <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="7px" style="line-height:7px; font-size:7px;">
                      <tbody>
                        <tr>
                          <td style="padding:0px 0px 7px 0px;" bgcolor="#ffffff"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table><div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5"><div class="Unsubscribe--addressLine"><p class="Unsubscribe--senderName" style="font-size:12px; line-height:20px;">Antidote AI LLC</p><p style="font-size:12px; line-height:20px;"><span class="Unsubscribe--senderAddress">2020 N Bayshore Dr</span>, <span class="Unsubscribe--senderCity">Miami</span>, <span class="Unsubscribe--senderState">Florida</span> <span class="Unsubscribe--senderZip">33137</span></p></div><p style="font-size:12px; line-height:20px;"><a class="Unsubscribe--unsubscribeLink" href="" target="_blank" style=""></a> - <a href="" target="_blank" class="Unsubscribe--unsubscribePreferences" style=""></a></p></div><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="840a78da-be53-493f-8903-70244289fe77">
                <tbody>
                  <tr>
                    <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 20px 0px;">
                      <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                        <tbody>
                          <tr>
                          <td align="center" bgcolor="#f5f8fd" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><a href="https://sendgrid.com/" style="background-color:#f5f8fd; border:1px solid #f5f8fd; border-color:#f5f8fd; border-radius:25px; border-width:1px; color:#a8b9d5; display:inline-block; font-size:10px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:5px 18px 5px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:helvetica,sans-serif;" target="_blank">♥ POWERED BY TWILIO SENDGRID</a></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table></td>
                                                </tr>
                                              </table>
                                              <!--[if mso]>
                                            </td>
                                          </tr>
                                        </table>
                                      </center>
                                      <![endif]-->
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </div>
                </center>
              </body>
            </html>`
        }

        await sgMail.send(message);

        // res.json({
        //     _id: user._id.toString(),
        //     email: user.email,
        //     token: generateToken(user._id.toString()),
        // });
        res.status(200).json({ 
          id: user._id.toString(),
          email: user.email,
          role: user.role,
         });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!user.isActive) {
          return res.status(403).json({ message: 'User account is deactivated' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour

        await user.save();

        const resetUrl = `http://localhost:4173/reset_password/${resetToken}`;
        const message = {
            to: user.email,
            from: process.env.SENDGRID_FROM!,
            subject: 'Password Reset Request',
            text: `You are receiving this email because you (or someone else) have requested the reset of a password. Please click the link below to reset your password: \n\n ${resetUrl}`,
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
            <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
                  <!--[if !mso]><!-->
                  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
                  <!--<![endif]-->
                  <!--[if (gte mso 9)|(IE)]>
                  <xml>
                    <o:OfficeDocumentSettings>
                      <o:AllowPNG/>
                      <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                  </xml>
                  <![endif]-->
                  <!--[if (gte mso 9)|(IE)]>
              <style type="text/css">
                body {width: 600px;margin: 0 auto;}
                table {border-collapse: collapse;}
                table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
                img {-ms-interpolation-mode: bicubic;}
              </style>
            <![endif]-->
                  <style type="text/css">
                body, p, div {
                  font-family: inherit;
                  font-size: 14px;
                }
                body {
                  color: #000000;
                }
                body a {
                  color: #1188E6;
                  text-decoration: none;
                }
                p { margin: 0; padding: 0; }
                table.wrapper {
                  width:100% !important;
                  table-layout: fixed;
                  -webkit-font-smoothing: antialiased;
                  -webkit-text-size-adjust: 100%;
                  -moz-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                }
                img.max-width {
                  max-width: 100% !important;
                }
                .column.of-2 {
                  width: 50%;
                }
                .column.of-3 {
                  width: 33.333%;
                }
                .column.of-4 {
                  width: 25%;
                }
                ul ul ul ul  {
                  list-style-type: disc !important;
                }
                ol ol {
                  list-style-type: lower-roman !important;
                }
                ol ol ol {
                  list-style-type: lower-latin !important;
                }
                ol ol ol ol {
                  list-style-type: decimal !important;
                }
                @media screen and (max-width:480px) {
                  .preheader .rightColumnContent,
                  .footer .rightColumnContent {
                    text-align: left !important;
                  }
                  .preheader .rightColumnContent div,
                  .preheader .rightColumnContent span,
                  .footer .rightColumnContent div,
                  .footer .rightColumnContent span {
                    text-align: left !important;
                  }
                  .preheader .rightColumnContent,
                  .preheader .leftColumnContent {
                    font-size: 80% !important;
                    padding: 5px 0;
                  }
                  table.wrapper-mobile {
                    width: 100% !important;
                    table-layout: fixed;
                  }
                  img.max-width {
                    height: auto !important;
                    max-width: 100% !important;
                  }
                  a.bulletproof-button {
                    display: block !important;
                    width: auto !important;
                    font-size: 80%;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                  }
                  .columns {
                    width: 100% !important;
                  }
                  .column {
                    display: block !important;
                    width: 100% !important;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                  }
                  .social-icon-column {
                    display: inline-block !important;
                  }
                }
              </style>
                  <!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Chivo&display=swap" rel="stylesheet"><style>
            body {font-family: 'Chivo', sans-serif;}
            </style><!--End Head user entered-->
                </head>
                <body>
                  <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
                    <div class="webkit">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
                        <tr>
                          <td valign="top" bgcolor="#FFFFFF" width="100%">
                            <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="100%">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td>
                                        <!--[if mso]>
                <center>
                <table><tr><td width="600">
              <![endif]-->
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                                  <tr>
                                                    <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                <tr>
                  <td role="module-content">
                    <p></p>
                  </td>
                </tr>
              </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:3px 0px 30px 0px;" bgcolor="#26619B" data-distribution="1">
                <tbody>
                  <tr role="module-content">
                    <td height="100%" valign="top"><table width="600" style="width:600px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
                  <tbody>
                    <tr>
                      <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="33d39ee4-da50-404a-8d62-ac83a12a2429">
                <tbody>
                  <tr>
                    <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                      <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="50" alt="" data-proportionally-constrained="false" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/81fed812ba14f2fc/c0479c04-a720-41e4-8aab-0d7359d99e8a/256x256.png" height="50">
                    </td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6683a2ab-dc01-4aea-8ba1-85edbd028276" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:18px 0px 0px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 36px; font-family: &quot;lucida sans unicode&quot;, &quot;lucida grande&quot;, sans-serif"><strong>Antidote</strong></span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table></td>
                    </tr>
                  </tbody>
                </table></td>
                  </tr>
                </tbody>
              </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:50px 0px 0px 30px;" bgcolor="#ffffff" data-distribution="1">
                <tbody>
                  <tr role="module-content">
                    <td height="100%" valign="top"><table width="550" style="width:550px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
                  <tbody>
                    <tr>
                      <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b16a4afb-f245-4156-968e-8080176990ea" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:18px 40px 0px 0px; line-height:26px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 24px; color: #000000">We received a request to reset your password.</span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b16a4afb-f245-4156-968e-8080176990ea.1" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:18px 40px 10px 0px; line-height:18px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: left"><span style="color: #000000">Please click on the button below to begin.</span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c97177b8-c172-4c4b-b5bd-7604cde23e3f">
                <tbody>
                  <tr>
                    <td style="padding:0px 0px 10px 0px;" role="module-content" bgcolor="">
                    </td>
                  </tr>
                </tbody>
              </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="9c7ac938-a540-4353-9fec-543b193bf7da">
                  <tbody>
                    <tr>
                      <td align="left" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;">
                        <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                          <tbody>
                            <tr>
                            <td align="center" bgcolor="#26619b" class="inner-td" style="border-radius:6px; font-size:16px; text-align:left; background-color:inherit;">
                              <a href=${resetUrl} style="background-color:#26619b; border:1px solid #26619b; border-color:#26619b; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 50px 12px 50px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Reset Password</a>
                            </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c97177b8-c172-4c4b-b5bd-7604cde23e3f.1">
                <tbody>
                  <tr>
                    <td style="padding:0px 0px 40px 0px;" role="module-content" bgcolor="">
                    </td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b16a4afb-f245-4156-968e-8080176990ea.1.1" data-mc-module-version="2019-10-22">
                <tbody>
                  <tr>
                    <td style="padding:18px 40px 10px 0px; line-height:18px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #000000">If you did not request a password change, please contact us</span></div>
            <div style="font-family: inherit; text-align: inherit"><span style="color: #000000"><strong>immediately</strong></span><span style="color: #000000"> so we can keep your account secure.</span></div>
            <div style="font-family: inherit; text-align: inherit"><span style="color: #00634a"><br>
            </span></div>
            <div style="font-family: inherit; text-align: inherit"><span style="color: #000000"><strong>Email</strong></span><span style="color: #000000">: suppprt@antidote-ai.com</span></div><div></div></div></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c97177b8-c172-4c4b-b5bd-7604cde23e3f.1.1">
                <tbody>
                  <tr>
                    <td style="padding:0px 0px 80px 0px;" role="module-content" bgcolor="">
                    </td>
                  </tr>
                </tbody>
              </table></td>
                    </tr>
                  </tbody>
                </table></td>
                  </tr>
                </tbody>
              </table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="38ec2680-c847-4765-8c5f-aa2aba19a2b3">
                <tbody>
                  <tr>
                    <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">
                      <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="7px" style="line-height:7px; font-size:7px;">
                        <tbody>
                          <tr>
                            <td style="padding:0px 0px 7px 0px;" bgcolor="#ffffff"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table><div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5"><div class="Unsubscribe--addressLine"><p class="Unsubscribe--senderName" style="font-size:12px; line-height:20px;">Antidote AI LLC</p><p style="font-size:12px; line-height:20px;"><span class="Unsubscribe--senderAddress">2020 N Bayshore Dr</span>, <span class="Unsubscribe--senderCity">Miami</span>, <span class="Unsubscribe--senderState">Florida</span> <span class="Unsubscribe--senderZip">33137</span></p></div><p style="font-size:12px; line-height:20px;"><a class="Unsubscribe--unsubscribeLink" href="" target="_blank" style=""></a> - <a href="" target="_blank" class="Unsubscribe--unsubscribePreferences" style=""></a></p></div><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="840a78da-be53-493f-8903-70244289fe77">
                  <tbody>
                    <tr>
                      <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 20px 0px;">
                        <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                          <tbody>
                            <tr>
                            <td align="center" bgcolor="#f5f8fd" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><a href="https://sendgrid.com/" style="background-color:#f5f8fd; border:1px solid #f5f8fd; border-color:#f5f8fd; border-radius:25px; border-width:1px; color:#a8b9d5; display:inline-block; font-size:10px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:5px 18px 5px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:helvetica,sans-serif;" target="_blank">♥ POWERED BY TWILIO SENDGRID</a></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table></td>
                                                  </tr>
                                                </table>
                                                <!--[if mso]>
                                              </td>
                                            </tr>
                                          </table>
                                        </center>
                                        <![endif]-->
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </center>
                </body>
              </html>
            `,

        }

        await sgMail.send(message);

        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        // User.resetPasswordToken = undefined;
        // user.resetPasswordExpire = undefined;

        // await user.save();

        res.status(500).json({ message: 'Email could not be sent' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
  const resetToken = req.params.token;
  console.log('Received token:', resetToken);

  if (!resetToken) {
      return res.status(400).json({ message: 'Token is required' });
  }

  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  try {
      const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: new Date() },
      });

      if (!user) {
          return res.status(400).json({ message: 'Invalid token' });
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
      console.error('Error during password reset:', error);
      res.status(500).json({ message: 'Password reset failed' });
  }
};

export const verifyTwoFactorCode = async (req: Request, res: Response) => {
  const { email, twoFactorCode} = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.isActive) {
      return res.status(403).json({ message: 'User account is deactivated' });
  }

  if (user.twoFactorCode === twoFactorCode && user.twoFactorExpire && user.twoFactorExpire > new Date()) {
    user.twoFactorCode = undefined;
    user.twoFactorExpire = undefined;
    await user.save();

    res.json({
      _id: user._id.toString(),
      email: user.email,
      token: generateToken(user._id.toString()),
    })
  } else {
    res.status(401).json({ message: 'Invalid code' });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { userId, isActive } = req.body;
  try {
      const user = await User.findByIdAndUpdate(userId, { isActive: isActive }, { new: true });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to update user status', error });
  }

}