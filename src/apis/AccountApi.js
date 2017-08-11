import express from 'express';
import flowService from '../service/FlowService';

const router = express.Router();

router.get(
    '/:accountId',
    async (req, res) => {
        const accountId = req.params.accountId;
        const permissionFlag = await hasAccess(acl, req.user.id, '/api/accounts/:accountId', 'view');
        if (permissionFlag === false) {
            response.send(401, 'User not authenticated');
            return;
        }
        const account = await accountService.findAccount(accountId);
        res.send({ account });
    }
);

router.get(
    '/:accountId/flowlist',
    async (req, res) => {
        const allFlows = await flowService.getAllFlows();
        res.send({ allFlows });
    }
);

export const accountRouter = router;
