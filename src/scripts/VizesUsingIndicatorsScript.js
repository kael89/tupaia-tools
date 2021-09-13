import { ucFirst } from '../utils';
import Script from './Script';

export default class VizesUsingIndicatorsScript extends Script {
  help = [
    'This script prints codes of any vizes that use an indicator.',
    'Usage: yarn tupaia-tools vizesUsingIndicators',
  ];

  indicatorCodes = [];

  run = async () => {
    this.indicatorCodes = await this.selectIndicatorCodes();

    const dashboardItemCodes = await this.selectDashboardItemCodesUsingIndicators();
    this.printResults('dashboard items', dashboardItemCodes);
    const overlayCodes = await this.selectOverlayCodesUsingIndicators();
    this.printResults('overlays', overlayCodes);
  };

  selectIndicatorCodes = async () => this.db.select(`SELECT code from indicator`).get('code');

  printResults = (type, results) => {
    this.logHeader(`${ucFirst(type)} using indicators`);
    this.logList(results);
    this.logInfo(`Count: ${results.length}`);
    this.log();
  };

  selectDashboardItemCodesUsingIndicators = async () => {
    const modernReports = await this.db
      .select(`SELECT code, config FROM report WHERE config->'fetch' ? 'dataElements'`)
      .get();
    const modernReportCodes = modernReports
      .filter(r => r.config.fetch.dataElements.some(this.isDataElement))
      .map(r => r.code);

    const legacyReportWhere = this.indicatorCodes
      .map(code => `"data_builder_config"::text ${this.db.op.matchWord(code)}`)
      .join(' OR ');
    const legacyReportCodes = await this.db
      .select(`SELECT code from legacy_report WHERE ${legacyReportWhere}`)
      .get('code');

    return this.selectDashboardItemCodesUsingReports([...modernReportCodes, ...legacyReportCodes]);
  };

  selectOverlayCodesUsingIndicators = async () => {
    const where = this.indicatorCodes
      .map(
        code =>
          `"measureBuilderConfig"::text ${this.db.op.matchWord(
            code,
          )} OR "dataElementCode" = '${code}'`,
      )
      .join(' OR ');
    return this.db.select(`SELECT id from "mapOverlay" WHERE ${where} ORDER BY id`).get('id');
  };

  selectDashboardItemCodesUsingReports = async reportCodes =>
    this.db
      .select(
        `SELECT code from dashboard_item WHERE code ${this.db.op.in(reportCodes)} ORDER BY code`,
      )
      .get('code');

  isDataElement = code => this.indicatorCodes.includes(code);
}
