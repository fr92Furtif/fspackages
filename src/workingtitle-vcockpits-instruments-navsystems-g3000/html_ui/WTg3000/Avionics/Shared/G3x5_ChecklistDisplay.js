class WT_G3x5_ChecklistDisplay {
    constructor(instrumentID) {
        this._instrumentID = instrumentID;
    }

    /**
     * @readonly
     * @property {String} instrumentID - the ID of this Checklist.
     * @type {String}
     */
    get instrumentID() {
        return this._instrumentID;
    }

    /**
     * @readonly
     * @property {WT_ChecklistModel} model - the model associated with this Checklist.
     * @type {WT_ChecklistModel}
     */
    get model() {
        return this._model;
    }

    /**
     * @readonly
     * @property {WT_DataStoreController} controller - the controller for this Checklist.
     * @type {WT_DataStoreController}
     */
    get controller() {
        return this._controller;
    }

    init(viewElement) {

        console.log("G3x5_ChecklistDisplay.js - init(viewElement)");
        this._checklistView = viewElement.querySelector(`checklist-page`);
        console.log("G3x5_ChecklistDisplay.js - this._checklistView = " + this._checklistView);
        this._model = new WT_ChecklistModel();
        this._checklistView.setModel(this.model);

        //this._controller = new WT_DataStoreController(`${this.instrumentID}`, this.model);

        //this.controller.addSetting(this._showSetting = new WT_WeatherRadarSetting(this.controller, "mode", WT_G3x5_WeatherRadar.SHOW_KEY, WT_G3x5_WeatherRadar.SHOW_DEFAULT, true, false));
        //this.controller.addSetting(this._modeSetting = new WT_WeatherRadarSetting(this.controller, "mode", WT_G3x5_WeatherRadar.MODE_KEY, WT_G3x5_WeatherRadar.MODE_DEFAULT, true, false));
        //this.controller.addSetting(this._displaySetting = new WT_WeatherRadarSetting(this.controller, "display", WT_G3x5_WeatherRadar.DISPLAY_KEY, WT_G3x5_WeatherRadar.DISPLAY_DEFAULT, true, false));
        //this.controller.addSetting(new WT_WeatherRadarSetting(this.controller, "scanMode", WT_G3x5_WeatherRadar.SCAN_MODE_KEY, WT_G3x5_WeatherRadar.SCAN_MODE_DEFAULT, true, false));
        //this.controller.addSetting(new WT_WeatherRadarSetting(this.controller, "showBearingLine", WT_G3x5_WeatherRadar.BEARING_LINE_SHOW_KEY, WT_G3x5_WeatherRadar.BEARING_LINE_SHOW_DEFAULT, true, false));
        //this.controller.addSetting(new WT_WeatherRadarRangeSetting(this.controller, WT_G3x5_WeatherRadar.RANGES, WT_G3x5_WeatherRadar.RANGE_DEFAULT));

        //this.controller.init();
        //this.controller.update();

    }

    sleep() {
        this._checklistView.sleep();
    }

    wake() {
        this._checklistView.wake();
    }

    _checkStandby() {
        //if (this.model.mode === WT_WeatherRadarModel.Mode.STANDBY) {
        //    this._displaySetting.setValue(WT_WeatherRadarModel.Display.OFF);
        //}
    }

    update() {
        //this._checkStandby();
        if (!this._checklistView.isAwake()) {
            this.wake();
        }
        this._checklistView.update();
    }

}
/*
WT_G3x5_WeatherRadar.SHOW_KEY = "WT_WeatherRadar_Show";
WT_G3x5_WeatherRadar.SHOW_DEFAULT = false;

WT_G3x5_WeatherRadar.MODE_KEY = "WT_WeatherRadar_Mode";
WT_G3x5_WeatherRadar.MODE_DEFAULT = WT_WeatherRadarModel.Mode.STANDBY;

WT_G3x5_WeatherRadar.DISPLAY_KEY = "WT_WeatherRadar_Display";
WT_G3x5_WeatherRadar.DISPLAY_DEFAULT = WT_WeatherRadarModel.Display.OFF;

WT_G3x5_WeatherRadar.SCAN_MODE_KEY = "WT_WeatherRadar_ScanMode";
WT_G3x5_WeatherRadar.SCAN_MODE_DEFAULT = WT_WeatherRadarModel.ScanMode.HORIZONTAL;

WT_G3x5_WeatherRadar.BEARING_LINE_SHOW_KEY = "WT_WeatherRadar_BearingLine_Show";
WT_G3x5_WeatherRadar.BEARING_LINE_SHOW_DEFAULT = true;

WT_G3x5_WeatherRadar.RANGES = [10, 20, 40, 60, 80, 100, 120, 160].map(range => WT_Unit.NMILE.createNumber(range));
WT_G3x5_WeatherRadar.RANGE_DEFAULT = WT_Unit.NMILE.createNumber(20);
*/
