import { getLogger } from 'botworx-utils/lib/logger';
import { log as logConfig } from '../config';

export const logger = getLogger(logConfig.app);
export const dblogger = getLogger(logConfig.db);

export default logger;
