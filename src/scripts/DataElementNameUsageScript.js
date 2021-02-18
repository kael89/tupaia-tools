import Script from './Script';

// Relative to the project root
const DATA_BUILDERS_USING_ELEMENT_NAMES_PATH = 'config/dataBuildersUsingElementNames.json';

const isCodeLabelled = (labels, code) => Object.keys(labels).includes(code);

const getElementsFromPairs = dataBuilder =>
  Object.values(dataBuilder.dataBuilderConfig.pairs || {});

const BUILDER_TO_HANDLER = {
  actualMonthlyValuesVsIdeal: getElementsFromPairs,
  percentagesByNominatedPairs: getElementsFromPairs,
};

const DEFAULT_BUILDER_HANDLER = dataBuilder => {
  const { dataBuilderConfig } = dataBuilder;
  const { labels = {}, dataElementCodes } = dataBuilderConfig;

  if (!dataElementCodes) {
    return false;
  }
  return dataElementCodes.filter(c => !isCodeLabelled(labels, c));
};

const getReportHandler = report =>
  BUILDER_TO_HANDLER[report.dataBuilder] || DEFAULT_BUILDER_HANDLER;

export default class DataElementNameUsageScript extends Script {
  run = async () => {
    this.logDisclaimer();
    const reports = await this.selectDataBuildersUsingElementNames();
    const { dataElements, unprocessedBuilderIds } = this.findDataElementsWithUsedNames(reports);
    this.logUnprocessedDataBuilders(unprocessedBuilderIds);
    this.logDataElements(dataElements);
  };

  logDisclaimer() {
    this.logWarn(
      `WARNING!! Please make sure that the list of data builders in '${DATA_BUILDERS_USING_ELEMENT_NAMES_PATH}' is up to date`,
    );
    this.logWarn('This script only checks data builders (not measure builders)');
  }

  selectDataBuildersUsingElementNames = async () => {
    const reports = this.readJsonFile(DATA_BUILDERS_USING_ELEMENT_NAMES_PATH);
    return this.db
      .select(`SELECT * FROM "dashboardReport" WHERE "dataBuilder" ${this.db.op.in(reports)}`)
      .get();
  };

  findDataElementsWithUsedNames = reports => {
    const dataElements = [];
    const unprocessedBuilderIds = [];

    reports.forEach(report => {
      const handler = getReportHandler(report);
      const newDataElements = handler(report);

      if (!newDataElements) {
        unprocessedBuilderIds.push(report.id);
        return;
      }
      dataElements.push(...newDataElements);
    });

    return {
      dataElements: [...new Set(dataElements)].sort(),
      unprocessedBuilderIds: unprocessedBuilderIds.sort(),
    };
  };

  logUnprocessedDataBuilders = ids => {
    this.logWarn(
      `No 'dataElementCodes' field found the following reports - you will need to manually check the data elements used:`,
    );
    this.logList(ids);
  };

  logDataElements = dataElements => {
    this.logSuccess('The following data element names are currently used in data builders:');
    this.logList(dataElements);
  };
}
