import type { IMethods } from '@/types';
import PageHandler from './PageHandler';

class PageController<T> extends PageHandler<IMethods<T>> {}

export default PageController;
