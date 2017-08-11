import express from 'express';
import flowService from '../service/FlowService';
import fetch from 'node-fetch';
import * as config from '../config';
import _ from 'lodash';
const router = express.Router();

// Sample fb response for '/permissions'
// {
//     "data": [
//         {
//             "permission": "manage_pages",
//             "status": "granted"
//         },
//         {
//             "permission": "pages_messaging",
//             "status": "declined"
//         }
//     ]
// }

/**
 * Get the botworx app permissions for the given user
 */
router.post('/permissions', async (req, res) => {
    const accessToken = req.body.accessToken;
    const fbUserId = req.body.fbUserId;

    // fetch user permissions from facebook graph api
    const url = `${config.auth.facebook.graphApiBase}/${fbUserId}/permissions?access_token=${accessToken}`;
    const response = await fetch(url);
    const userPermissions = (await response.json()).data;
    console.log('userPermissions',userPermissions);

    console.log('got user permissions from fb', userPermissions);
    const approved = _(userPermissions)
        .filter(x => x.status === 'granted')
        .map(x => x.permission)
        .value();
    const rejected = _(userPermissions)
        .filter(x => x.status === 'declined')
        .map(x => x.permission)
        .value();

    // all the required parameters for our app (from config)
    const required = Object.keys(config.botworx.permissions.required);
    const optional = Object.keys(config.botworx.permissions.optional);

    // additional permissions that are required but not available
    const additionalRequired = _(required).difference(approved).value();
    // permissions that are required but rejected by user
    const requiredRejected = _(rejected).intersection(required).value();
    res.send({ data: { approved, rejected, required, optional, additionalRequired, requiredRejected } });
});

export const facebookRouter = router;
