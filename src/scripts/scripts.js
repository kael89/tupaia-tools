import DataElementNameUsageScript from './DataElementNameUsageScript';
import DataElementVizUsageScript from './DataElementVizUsageScript';
import VizesUsingIndicatorsScript from './VizesUsingIndicatorsScript';
import Script from './Script';

const createScript = ScriptClass => db => new ScriptClass(db).runScript();

export default class HelpScript extends Script {
  run = async () => {
    this.log('Usage: yarn tupaia-tools <script_name>');
    this.log();
    this.log('Script names:');
    this.logList(Object.keys(scripts));
    this.log();
  };
}

export const scripts = {
  dataElementNameUsage: createScript(DataElementNameUsageScript),
  dataElementVizUsage: createScript(DataElementVizUsageScript),
  help: createScript(HelpScript),
  vizesUsingIndicators: createScript(VizesUsingIndicatorsScript),
};
