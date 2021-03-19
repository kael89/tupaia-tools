import Script from './Script';

export default class DataElementVizUsageScript extends Script {
  run = async () => {
    const [, , , dataElement] = process.argv;
    const usage = await this.getElementUsage([dataElement]);
    this.logUsage(usage);
  };

  getElementUsage = async dataElements => {
    const results = {};
    for (const dataElement of dataElements) {
      const reports = await this.findReportsUsingElement(dataElement);
      const overlays = await this.findOverlaysUsingElement(dataElement);
      results[dataElement] = { reports, overlays };
    }

    return results;
  };

  findReportsUsingElement = async dataElement =>
    this.db
      .select(
        `SELECT * FROM "dashboardReport" WHERE "dataBuilderConfig"::text ${this.db.op.matchWord(
          dataElement,
        )}
        ORDER BY id`,
      )
      .get('id');

  findOverlaysUsingElement = async dataElement =>
    this.db
      .select(
        `SELECT * FROM "mapOverlay" WHERE "dataElementCode" = '${dataElement}' OR "measureBuilderConfig"::text ${this.db.op.matchWord(
          dataElement,
        )}
          ORDER BY id`,
      )
      .get('id');

  logUsage = usage => {
    Object.entries(usage).forEach(([dataElement, { reports, overlays }]) => {
      this.logHeader(dataElement);
      this.logInfo('Reports:');
      this.logList(reports);
      this.log();
      this.logInfo('Overlays:');
      this.logList(overlays);
    });
  };
}
