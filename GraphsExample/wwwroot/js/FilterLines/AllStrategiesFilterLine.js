class AllStrategiesFilterLine extends BaseFilterLine {
    constructor() {
        super();

        this.translation = new Map([
            ['Roi_AllTimeFrom', 'ROI (from)'],
            ['Roi_AllTimeTo', 'ROI (to)'],
            ['Profit_AllTimeFrom', 'Profit (from)'],
            ['Profit_AllTimeTo', 'Profit (to)'],
            ['Instruments', 'Instruments']
        ]);
    }
};