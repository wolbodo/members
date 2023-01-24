import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

const config = dotenv.config();

expand(config);

console.log(config);
