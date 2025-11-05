import type { IMethods } from './methods';
import PageHandler from './PageHandler';

class PageController<T> extends PageHandler<IMethods<T>> {};

export default PageController;
