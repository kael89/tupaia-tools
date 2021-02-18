import DataElementNameUsageScript from './DataElementNameUsageScript';
import IndicatorUsageScript from './IndicatorUsageScript';

const createScript = Script => db => new Script(db).run();

export default {
  'data-element-name-usage': createScript(DataElementNameUsageScript),
  'indicator-usage': createScript(IndicatorUsageScript),
};
