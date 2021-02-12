import IndicatorUsageScript from './IndicatorUsageScript';

const createScript = Script => db => new Script(db).run();

export default {
  'indicator-usage': createScript(IndicatorUsageScript),
};
