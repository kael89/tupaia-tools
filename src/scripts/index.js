import DataElementNameUsageScript from './DataElementNameUsageScript';
import DataElementVizUsageScript from './DataElementVizUsageScript';
import IndicatorUsageScript from './IndicatorUsageScript';

const createScript = Script => db => new Script(db).run();

export default {
  'data-element-name-usage': createScript(DataElementNameUsageScript),
  'data-element-viz-usage': createScript(DataElementVizUsageScript),
  'indicator-usage': createScript(IndicatorUsageScript),
};
