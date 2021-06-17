class WT_G3x5_ChecklistDisplayPane extends WT_G3x5_DisplayPane {

    constructor(paneID, paneSettings, checklistDisplay) {
        super(paneID, paneSettings);
        this._checklistDisplay = checklistDisplay;
    }

    /**
     * @readonly
     * @type {WT_G3x5_Checklist}
     */
    get checklistView() {
        return this._checklistDisplay;
    }

    getTitle() {
        return "Checklist";
    }

    init(root) {
        this.checklistView.init(root);
    }

    update() {
        this.checklistView.update();
    }

}
