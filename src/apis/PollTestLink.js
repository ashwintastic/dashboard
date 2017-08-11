import express from 'express';
import fetch from 'node-fetch';
import { botEngine } from '../config';
import { auth } from '../config'
const router = express.Router();
router.get(
  '/:pollId',
  async (req, res) => {
    let refOption = {
      "id" : req.params.pollId,
      "type" : "testPoll",
      "nextNodes" : [
        "TEST_POLL"
      ]
    };
    refOption = JSON.stringify(refOption);
    const beRefApi = botEngine.url + '/dev/createmdotmeref';
    const resp = await fetch(beRefApi, { method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: refOption});
    const refString = await resp.text();
    // Using default 302 because 301 is stored by the browser.
    res.redirect(`https://m.me/${auth.facebook.testPageId}?ref=${refString}`);
  });

export const pollTestingRouter = router;
