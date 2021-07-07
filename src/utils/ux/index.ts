import { prompt, promptChoices, promptChoicesWithSearch } from './interactive';
import { open } from './open';
import { progress } from './progress';
import { spinner } from './spinner';
import { showTable } from './table';

export let ux = { prompt, promptChoices, promptChoicesWithSearch, open, progress, spinner, showTable };
