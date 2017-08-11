import { Crypto } from 'botworx-utils/lib/crypto';
import { logger } from '../core/logger'
import { auth } from '../config';

export const crypto = new Crypto(auth.jwt.secret, logger);
