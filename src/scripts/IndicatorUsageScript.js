import overlayLinks from '../../config/overlayLinks.json';
import reportLinks from '../../config/reportLinks.json';
import Script from './Script';

const getOverlayList = reports => reports.map(r => [r, overlayLinks[r]].filter(x => !!x));

const getReportList = overlays => overlays.map(r => [r, reportLinks[r]].filter(x => !!x));

export default class IndicatorUsageScript extends Script {
  indicatorCodes = [];

  run = async () => {
    this.indicatorCodes = await this.selectIndicatorCodes();
    await this.logReportsUsingIndicators();
    await this.logOverlaysUsingIndicators();
  };

  selectIndicatorCodes = async () => this.db.select(`SELECT code from indicator`).get('code');

  logReportsUsingIndicators = async () => {
    const reports = await this.selectReportsUsingIndicators();

    this.logHeader('Reports using indicators');
    this.logList(getReportList(reports));
    this.log(`Count: ${reports.length}`);
    this.log();
  };

  logOverlaysUsingIndicators = async () => {
    const overlays = await this.selectOverlaysUsingIndicators();

    this.logHeader('Overlays using indicators');
    this.logList(getOverlayList(overlays));
    this.log(`Count: ${overlays.length}`);
    this.log();
  };

  selectReportsUsingIndicators = async () => {
    const where = this.indicatorCodes
      .map(code => `"dataBuilderConfig"::text ${this.db.op.matchWord(code)}`)
      .join(' OR ');
    return this.db.select(`SELECT id from "dashboardReport" WHERE ${where}`).get('id');
  };

  selectOverlaysUsingIndicators = async () => {
    const where = this.indicatorCodes
      .map(
        code =>
          `"measureBuilderConfig"::text ${this.db.op.matchWord(
            code,
          )} OR "dataElementCode" = '${code}'`,
      )
      .join(' OR ');
    return this.db.select(`SELECT id from "mapOverlay" WHERE ${where}`).get('id');
  };
}
