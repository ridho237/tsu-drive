import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval('Menghapus Semua Sampah', { minutes: 1 }, internal.files.deleteAllFiles);

export default crons;
