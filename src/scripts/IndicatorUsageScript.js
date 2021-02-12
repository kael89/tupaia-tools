import Script from './Script';

export default class IndicatorUsageScript extends Script {
  indicatorCodes = [];

  run = async () => {
    this.indicatorCodes = await this.selectIndicatorCodes();
    await this.printReportsUsingIndicators();
    await this.printOverlaysUsingIndicators();
  };

  selectIndicatorCodes = async () => this.db.select(`SELECT code from indicator`).get('code');

  printReportsUsingIndicators = async () => {
    const reports = await this.selectReportsUsingIndicators();

    this.printHeader('Reports using indicators');
    this.printList(reports);
    this.printLine(`Count: ${reports.length}`);
    this.printLine();
  };

  printOverlaysUsingIndicators = async () => {
    const reports = await this.selectOverlaysUsingIndicators();

    this.printHeader('Overlays using indicators');
    this.printList(reports);
    this.printLine(`Count: ${reports.length}`);
    this.printLine();
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
