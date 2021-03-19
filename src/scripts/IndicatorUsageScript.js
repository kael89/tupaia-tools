import OVERLAY_LINKS from '../../config/overlayLinks.json';
import REPORT_LINKS from '../../config/reportLinks.json';
import Script from './Script';

const getOverlayList = reports => reports.map(r => [r, OVERLAY_LINKS[r]].filter(x => !!x));

const getReportList = overlays => overlays.map(r => [r, REPORT_LINKS[r]].filter(x => !!x));

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
    this.logInfo(`Count: ${reports.length}`);
    this.log();
  };

  logOverlaysUsingIndicators = async () => {
    const overlays = await this.selectOverlaysUsingIndicators();

    this.logHeader('Overlays using indicators');
    this.logList(getOverlayList(overlays));
    this.logInfo(`Count: ${overlays.length}`);
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
