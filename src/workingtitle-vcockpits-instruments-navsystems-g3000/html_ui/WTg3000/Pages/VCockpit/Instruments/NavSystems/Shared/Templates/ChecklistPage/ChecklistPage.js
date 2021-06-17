class ChecklistItemModel {
    constructor() {
        this.label = null;
        this.challenge = null;
        this.checked = false;
    }
}

class ChecklistModel {
    constructor() {
        this.groupName = "";
        this.checklistName = "";
        this.checklistItems = [];
        this.currentItemIndex = 0;
    }
}

class HandbookModel {
    constructor() {
        this.airplaneIcao = null;
        this.checklists = []
        this.currentItemIndex = 0;
    }
}

class ChecklistPage extends HTMLElement {

    constructor() {

        super();

        this._htmlConnected = false;
        this._isAwake = false;
        this._modelNew = null;
        this._isAs3000 = false;
        this._svgBuilt = false;
        this._itemsSvg = null;
        this._handbook = null;
        this._active = false;
        this._gotoNextChecklistCursorSelected = false;
        this._currentChecklistIndex = 0;
        this.itemsRect = [];
        // Retrieve the Handbook for the current Airplane
        this._model = SimVar.GetSimVarValue("ATC MODEL", "string", "FMC");
        this._handbookUrl = null;
        //this.loadHandbook(this._model);
        this.loadHandbookNew(this._model);
        // ******************************* TEMPO FOR TEST *************************
        /*
        let newChecklistModel = new ChecklistModel();
        newChecklistModel.groupName = "STARTING ENGINE";
        newChecklistModel.checklistName = "STARTING ENGINE";
        newChecklistModel.checklistItems.push(new ChecklistItemModel("1. Strobe lights (ACL)", "ON"));
        newChecklistModel.checklistItems.push(new ChecklistItemModel("2. ENGINE MASTER", "ON (L)"));
        newChecklistModel.checklistItems.push(new ChecklistItemModel("3. Annunciations", "check 'L ENGINE GLOW' ON"));
        newChecklistModel.checklistItems.push(new ChecklistItemModel("4. Annunciations / Engine / System Page", "check OK/normal range"));
        newChecklistModel.checklistItems.push(new ChecklistItemModel("5. START LEFT button", "PRESS as required / release when engine has started"));
        newChecklistModel.checklistItems.push(new ChecklistItemModel("6. Annunciations / Engine / System Page", "check OK/normal range"));
        newChecklistModel.checklistItems.push(new ChecklistItemModel("7. Annunciations / Starter", "check OFF"));
        newChecklistModel.checklistItems.push(new ChecklistItemModel("8. Annunciations / Oil pressure", "check OK"));
        newChecklistModel.checklistItems.push(new ChecklistItemModel("9. Circuit breakers", "check all in/as required"));
        newChecklistModel.checklistItems.push(new ChecklistItemModel("10. Idle RPM", "check, 710 +/- 30 RPM"));
        */
        // ******************************* TEMPO FOR TEST *************************
        this.crosstrackFullError = 2;
        this.isDmeDisplayed = false;
        this.isBearing1Displayed = false;
        this.isBearing2Displayed = false;
        this.crossTrackCurrent = 0;
        this.crossTrackGoal = 0;
        this.sourceIsGps = true;
        // this.displayStyle = HSIndicatorDisplayType.GlassCockpit;
        this.fmsAlias = "FMS";
        this.logic_dmeDisplayed = false; //WTDataStore.get("HSI.ShowDme", false);
        // SimVar.SetSimVarValue("L:PFD_DME_Displayed", "number", this.logic_dmeDisplayed ? 1 : 0);
        this.logic_dmeSource = 1;
        this.logic_cdiSource = 3;
        this.logic_brg1Source = 0; // WTDataStore.get("HSI.Brg1Src", 0);
        // SimVar.SetSimVarValue("L:PFD_BRG1_Source", "number", this.logic_brg1Source);
        this.logic_brg2Source = 0; // WTDataStore.get("HSI.Brg2Src", 0);
        // SimVar.SetSimVarValue("L:PFD_BRG2_Source", "number", this.logic_brg2Source);

        this._viewWidth = 0;
        this._viewHeight = 0;

        this._overlay = document.createElementNS(Avionics.SVG.NS, "svg");
        this._overlay.style.position = "absolute";
        this._overlay.style.transform = "rotateX(0deg)";
        this._overlay.style.overflow = "hidden";

    }

    static get observedAttributes() {
        return [
            "toggle_active",
            "dec_cursor",
            "inc_cursor",
            "check_cursor",
            "ent_push",
            "as3000"
            /*
            "display_deviation",
            "crosstrack_full_error",
            "turn_rate",
            "nav_source",
            "flight_phase",
            "show_dme",
            "show_bearing1",
            "show_bearing2",
            "toggle_dme",
            "toggle_bearing1",
            "toggle_bearing2",
            "bearing1_source",
            "bearing1_ident",
            "bearing1_distance",
            "bearing1_bearing",
            "bearing2_source",
            "bearing2_ident",
            "bearing2_distance",
            "bearing2_bearing",
            "dme_source",
            "dme_ident",
            "dme_distance",
            "to_from",
            "current_track",
            "displaystyle"*/
        ];
    }

    connectedCallback() {
        this._htmlConnected = true;
        this.createSVG();
        //this.createSVGForTest();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "toggle_active") {
            this.toggleActiveState();
            this.updateCursorVisibility();
        } else {
            if (this._active) {
                switch (name) {
                    case "dec_cursor":
                        this.decrementCursor();
                        break;
                    case "inc_cursor":
                        this.incrementCursor();
                        break;
                    case "check_cursor":
                        if (this._isAs3000) {
                            let isEnterUsed = this.enterPushed();
                            if (!isEnterUsed) {
                                this.toggleCurrentCursorCheck();
                            }
                        } else {
                            this.toggleCurrentCursorCheck();
                        }
                        break;
                    case "ent_push":
                        this.enterPushed();
                        break;
                }
            }
        }
        if (oldValue == newValue) {
            return;
        }
        if (name === "as3000") {
            this._isAs3000 = newValue;
        }
    }

    createSVG() {
        if (!this._htmlConnected || this._svgBuilt) {
            return;
        }
        if (this._isAs3000) {
          this.style.backgroundColor = "black";
        }
        if (!this._handbook) {
            Utils.RemoveAllChildren(this);
            this.root = document.createElementNS(Avionics.SVG.NS, "svg");
            this.root.style.width = "100%";
            this.root.style.height = this._isAs3000 ? "99%" : "100%";
            this.root.setAttribute("viewBox", "0 0 1000 1000");
            if (this._isAs3000) {
                this.root.style.backgroundColor = "black";
            }
            this.appendChild(this.root);
            let textChecklistPageError1 = document.createElementNS(Avionics.SVG.NS, "text");
            textChecklistPageError1.textContent = "ERROR responseReadyState : " + this._responseReadyState;
            textChecklistPageError1.setAttribute("x", 10);
            textChecklistPageError1.setAttribute("y", "40%");
            textChecklistPageError1.setAttribute("style", "font-size:1.0em;letter-spacing:0px;word-spacing:0px;fill:#ffffff;");
            this.root.appendChild(textChecklistPageError1);
            let textChecklistPageError2 = document.createElementNS(Avionics.SVG.NS, "text");
            textChecklistPageError2.textContent = "ERROR handbookUrl : " + this._handbookUrl;
            textChecklistPageError2.setAttribute("x", 10);
            textChecklistPageError2.setAttribute("y", "42%");
            textChecklistPageError2.setAttribute("style", "font-size:1.0em;letter-spacing:0px;word-spacing:0px;fill:#ffffff;");
            this.root.appendChild(textChecklistPageError2);
            let textChecklistPageError3 = document.createElementNS(Avionics.SVG.NS, "text");
            textChecklistPageError3.textContent = "ERROR-Handbook HTTP Response Code : " + this._response;
            textChecklistPageError3.setAttribute("x", 10);
            textChecklistPageError3.setAttribute("y", "45%");
            textChecklistPageError3.setAttribute("style", "font-size:1.0em;letter-spacing:0px;word-spacing:0px;fill:#ffffff;");
            this.root.appendChild(textChecklistPageError3);
            let textChecklistPageError4 = document.createElementNS(Avionics.SVG.NS, "text");
            textChecklistPageError4.textContent = "this._handbook = " + this._handbook;
            textChecklistPageError4.setAttribute("x", 10);
            textChecklistPageError4.setAttribute("y", "47%");
            textChecklistPageError4.setAttribute("style", "font-size:1.0em;letter-spacing:0px;word-spacing:0px;fill:#ffffff;");
            this.root.appendChild(textChecklistPageError4);
            let textChecklistPageError5 = document.createElementNS(Avionics.SVG.NS, "text");
            textChecklistPageError5.textContent = "this._goCreateSVG = " + this._goCreateSVG;
            textChecklistPageError5.setAttribute("x", 10);
            textChecklistPageError5.setAttribute("y", "49%");
            textChecklistPageError5.setAttribute("style", "font-size:1.0em;letter-spacing:0px;word-spacing:0px;fill:#ffffff;");
            this.root.appendChild(textChecklistPageError5);
            this._textChecklistPageError6 = document.createElementNS(Avionics.SVG.NS, "text");
            this._textChecklistPageError6.textContent = "Error Line 6..............";
            this._textChecklistPageError6.setAttribute("x", 10);
            this._textChecklistPageError6.setAttribute("y", "51%");
            this._textChecklistPageError6.setAttribute("style", "font-size:1.0em;letter-spacing:0px;word-spacing:0px;fill:#ffffff;");
            this.root.appendChild(this._textChecklistPageError6);
            return;
        }
        this._svgBuilt = true;
        // Clean up
        Utils.RemoveAllChildren(this);
        this.itemsRect = [];
        let theCurrentChecklist = this.getCurrentChecklist();
        // Useful variables
        const _maxUnitsX = 1000;
        const _maxUnitsY = 1000;
        const _bottomMarge = this._isAs3000 ? 10 : 240;
        //const _maxY = ;
        const _minX = this._isAs3000 ? 10 : 80;
        const _minY = this._isAs3000 ? 10 : 30;
        let _width = _maxUnitsX - _minX - 5;
        let _height = _maxUnitsY - _minY - _bottomMarge;
        // The Overall Big SVG
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.style.width = "100%";
        this.root.style.height = "100%";
        this.root.setAttribute("viewBox", "0 0 " + _maxUnitsX + " " + _maxUnitsY);
        this.appendChild(this.root);
        // FOR TEST *************************************************************************************
        {
            /*
            let rectTest = document.createElementNS(Avionics.SVG.NS, "rect");
            rectTest.setAttribute("x", "10");
            rectTest.setAttribute("y", "10");
            rectTest.setAttribute("width", "980");
            rectTest.setAttribute("height", "980");
            rectTest.setAttribute("style", "fill:red;fill-opacity:1.0;stroke:yellow;stroke-width:2.0");
            this.root.appendChild(rectTest);
            */
        }
        // FOR TEST *************************************************************************************
        // Checkbox Mark Symbol
        {
            let checkboxMarkSymbol = document.createElementNS(Avionics.SVG.NS, "symbol");
            checkboxMarkSymbol.setAttribute("id", "checkmark");
            checkboxMarkSymbol.setAttribute("viewBox", "0 0 24 24");
            let checkboxMarkPath = document.createElementNS(Avionics.SVG.NS, "path");
            checkboxMarkPath.setAttribute("stroke-linecap", "round");
            checkboxMarkPath.setAttribute("stroke-miterlimit", "10");
            checkboxMarkPath.setAttribute("fill", "none");
            checkboxMarkPath.setAttribute("stroke", "green");
            checkboxMarkPath.setAttribute("d", "M22.9 3.7l-15.2 16.6-6.6-7.1");
            checkboxMarkSymbol.appendChild(checkboxMarkPath);
            this.root.appendChild(checkboxMarkSymbol);
        }
        // The overall white Rect
        {
            let rectOverall = document.createElementNS(Avionics.SVG.NS, "rect");
            rectOverall.setAttribute("x", _minX);
            rectOverall.setAttribute("y", _minY);
            rectOverall.setAttribute("width", _width);
            rectOverall.setAttribute("height", _height);
            rectOverall.setAttribute("style", "fill-opacity:0;stroke:#ffffff;stroke-width:2.0");
            this.root.appendChild(rectOverall);
        }
        // document->svg->g
        let gTitle = document.createElementNS(Avionics.SVG.NS, "g");
        gTitle.setAttribute("id", "gTitle");
        this.root.appendChild(gTitle);
        // Checklist Title
        {
            // Checklist GROUP
            let textChecklistGroupNameLabel = document.createElementNS(Avionics.SVG.NS, "text");
            textChecklistGroupNameLabel.textContent = "GROUP";
            textChecklistGroupNameLabel.setAttribute("x", _minX + 5);
            textChecklistGroupNameLabel.setAttribute("y", _minY + 25);
            textChecklistGroupNameLabel.setAttribute("style", "font-size:1.0em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#ffffff;stroke:none;stroke-width:0.26458332");
            gTitle.appendChild(textChecklistGroupNameLabel);
            let textChecklistGroupName = document.createElementNS(Avionics.SVG.NS, "text");
            textChecklistGroupName.setAttribute("id", "checklistGroupName");
            textChecklistGroupName.textContent = theCurrentChecklist.groupName;
            textChecklistGroupName.setAttribute("x", _minX + 70);
            textChecklistGroupName.setAttribute("y", _minY + 25);
            textChecklistGroupName.setAttribute("style", "font-size:1.3em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#9bd8d9;");
            gTitle.appendChild(textChecklistGroupName);
            // Checklist NAME
            let textChecklistNameLabel = document.createElementNS(Avionics.SVG.NS, "text");
            textChecklistNameLabel.textContent = "CHECKLIST";
            textChecklistNameLabel.setAttribute("x", _minX + 5);
            textChecklistNameLabel.setAttribute("y", _minY + 50);
            textChecklistNameLabel.setAttribute("style", "font-size:1.0em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#ffffff;stroke:none;stroke-width:0.26458332");
            gTitle.appendChild(textChecklistNameLabel);
            let textChecklistName = document.createElementNS(Avionics.SVG.NS, "text");
            textChecklistName.setAttribute("id", "checklistName");
            textChecklistName.textContent = theCurrentChecklist.checklistName;
            textChecklistName.setAttribute("x", _minX + 100);
            textChecklistName.setAttribute("y", _minY + 50);
            textChecklistName.setAttribute("style", "font-size:1.3em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#9bd8d9;");
            gTitle.appendChild(textChecklistName);
        }
        // Draw Checklist Items
        //let gItems = document.createElementNS(Avionics.SVG.NS, "g");
        //gItems.setAttribute("id", "gItems");
        //this.root.appendChild(gItems);
        this._itemsSvg = document.createElementNS(Avionics.SVG.NS, "svg");
        this._itemsSvg.setAttribute("x", _minX + 30); // _minX + 30
        this._itemsSvg.setAttribute("y", _minY + 70); // _minY + 75
        this._itemsSvg.setAttribute("width", _width - 35);
        this._itemsSvg.setAttribute("height", _height - 110); // 650
        this._itemsSvg.setAttribute("viewBox", "0 0 1000 1000"); // 0 0 990 650
        this._itemsSvg.setAttribute("overflow", "scroll");
        this._itemsSvg.setAttribute("preserveAspectRatio", "xMinYMin slice");
        this.root.appendChild(this._itemsSvg);
        // TEST ******************************************************************************************
        {
            let rectTest = document.createElementNS(Avionics.SVG.NS, "rect");
            rectTest.setAttribute("x", 0);
            rectTest.setAttribute("y", 0);
            rectTest.setAttribute("width", "100%");
            rectTest.setAttribute("height", "100%");
            //anItemSelectRect.setAttribute("fill-opacity:0", "23");
            rectTest.setAttribute("style", "fill-opacity:1.0;stroke:#ffffff;stroke-width:1.0;fill:red;");
            // anItemSelectRect.animate({'stroke': ['#ffffff', '#000000']}, {duration: 500, repeatCount: 'indefinite'});
            //gOverall.appendChild(anItemSelectRect);
            //this._itemsSvg.appendChild(rectTest);
        }
        // TEST ******************************************************************************************
        let itemY = 12;
        for (let i = 0; i < theCurrentChecklist.checklistItems.length; i++) {
            let aChecklistItem = theCurrentChecklist.checklistItems[i];
            // The g for the whole Checklist Item
            let anItemG = document.createElementNS(Avionics.SVG.NS, "g");
            anItemG.setAttribute("id", "anItemG");
            this._itemsSvg.appendChild(anItemG);
            // The Item selection big Rect
            let anItemSelectRect = document.createElementNS(Avionics.SVG.NS, "rect");
            anItemSelectRect.setAttribute("x", 1);
            anItemSelectRect.setAttribute("y", itemY - 7);
            anItemSelectRect.setAttribute("width", 992);
            anItemSelectRect.setAttribute("height", 29);
            anItemSelectRect.setAttribute("style", "fill-opacity:0;stroke:#ffffff;stroke-width:1.0");
            anItemSelectRect.setAttribute("visibility", "hidden");
            anItemG.appendChild(anItemSelectRect);
            // The Item Checkbox
            let anItemCheckboxRect = document.createElementNS(Avionics.SVG.NS, "rect");
            anItemCheckboxRect.setAttribute("x", 6);
            anItemCheckboxRect.setAttribute("y", itemY + 4);
            anItemCheckboxRect.setAttribute("width", "10");
            anItemCheckboxRect.setAttribute("height", "10");
            anItemCheckboxRect.setAttribute("style", "fill-opacity:0;stroke:#ffffff;stroke-width:1.0");
            anItemG.appendChild(anItemCheckboxRect);
            // TEMP TEST ***************************************************************************************
            // The Item Checkbox Mark
            let checkboxMarkPathTest = document.createElementNS(Avionics.SVG.NS, "path");
            checkboxMarkPathTest.setAttribute("stroke-linecap", "round");
            checkboxMarkPathTest.setAttribute("stroke-miterlimit", "10");
            checkboxMarkPathTest.setAttribute("fill", "none");
            checkboxMarkPathTest.setAttribute("stroke", "green");
            checkboxMarkPathTest.setAttribute("stroke-width", "4.0");
            checkboxMarkPathTest.setAttribute("d", "M5 " + (itemY + 9) + " l 5 5 l 5 -10");
            checkboxMarkPathTest.setAttribute("visibility", "hidden");
            anItemG.appendChild(checkboxMarkPathTest);
            // TEMP TEST ***************************************************************************************
            //let markSymbolUse = document.createElementNS(Avionics.SVG.NS, "use");
            //markSymbolUse.setAttributeNS("xlink", "href", "#checkmark");
            //markSymbolUse.setAttribute("x", "95");
            //markSymbolUse.setAttribute("y", itemY);
            //anItemG.appendChild(markSymbolUse);
            // document->svg->g->text (testChecklistItem1)
            let anItemLabel = document.createElementNS(Avionics.SVG.NS, "text");
            anItemLabel.textContent = aChecklistItem.label + "....................." + aChecklistItem.challenge;
            anItemLabel.setAttribute("x", 23);
            anItemLabel.setAttribute("y", itemY + 14);
            anItemLabel.setAttribute("fill", "#9bd8d9");
            anItemLabel.setAttribute("style", "font-size:1.4em;line-height:1.25;letter-spacing:0px;word-spacing:0px;");
            anItemG.appendChild(anItemLabel);
            this.itemsRect.push(anItemG);
            //
            itemY += 31;
        }
        /*
        // document->svg->g->rect (checklist checkbox)
        let rectCheckboxItem1 = document.createElementNS(Avionics.SVG.NS, "rect");
        rectCheckboxItem1.setAttribute("x", "95");
        rectCheckboxItem1.setAttribute("y", "110");
        rectCheckboxItem1.setAttribute("width", "10");
        rectCheckboxItem1.setAttribute("height", "10");
        rectCheckboxItem1.setAttribute("style", "fill-opacity:0;stroke:#ffffff;stroke-width:1.0");
        gOverall.appendChild(rectCheckboxItem1);
        // document->svg->g->text (testChecklistItem1)
        let textTestChecklistItem1 = document.createElementNS(Avionics.SVG.NS, "text");
        textTestChecklistItem1.setAttribute("id", "testChecklistItem1");
        textTestChecklistItem1.textContent = "1. Throttle Control...........................OPEN 1/4 INCH";
        textTestChecklistItem1.setAttribute("x", "115");
        textTestChecklistItem1.setAttribute("y", "120");
        textTestChecklistItem1.setAttribute("style", "font-size:1.25em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#9bd8d9;");
        gOverall.appendChild(textTestChecklistItem1);
        // document->svg->g->rect (testChecklistItemCheckbox2)
        let rectTestCheckboxItem2 = document.createElementNS(Avionics.SVG.NS, "rect");
        rectTestCheckboxItem2.setAttribute("x", "95");
        rectTestCheckboxItem2.setAttribute("y", "135");
        rectTestCheckboxItem2.setAttribute("width", "10");
        rectTestCheckboxItem2.setAttribute("height", "10");
        rectTestCheckboxItem2.setAttribute("style", "fill-opacity:0;stroke:#ffffff;stroke-width:1.0");
        gOverall.appendChild(rectTestCheckboxItem2);
        // document->svg->g->text (testChecklistItem2)
        let textTestChecklistItem2 = document.createElementNS(Avionics.SVG.NS, "text");
        textTestChecklistItem2.setAttribute("id", "testChecklistItem1");
        textTestChecklistItem2.textContent = "2. Mixture Control...................IDLE CUTOFF (pull full out)";
        textTestChecklistItem2.setAttribute("x", "115");
        textTestChecklistItem2.setAttribute("y", "145");
        textTestChecklistItem2.setAttribute("style", "font-size:1.25em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#9bd8d9;");
        gOverall.appendChild(textTestChecklistItem2);
        // document->svg->g->text (testChecklistItem3)
        let textTestChecklistItem3 = document.createElementNS(Avionics.SVG.NS, "text");
        textTestChecklistItem3.setAttribute("id", "testChecklistItem1");
        textTestChecklistItem3.textContent = "3. STBY BATT Switch:";
        textTestChecklistItem3.setAttribute("x", "115");
        textTestChecklistItem3.setAttribute("y", "170");
        textTestChecklistItem3.setAttribute("style", "font-size:1.25em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#9A9A9A;");
        gOverall.appendChild(textTestChecklistItem3);
        */
        // Block : goToNextChecklist
        {
            let rectGoToNextChecklist = document.createElementNS(Avionics.SVG.NS, "rect");
            rectGoToNextChecklist.setAttribute("x", _maxUnitsX -  261);
            rectGoToNextChecklist.setAttribute("y", _maxUnitsY - 29 - _bottomMarge);
            rectGoToNextChecklist.setAttribute("width", 256);
            rectGoToNextChecklist.setAttribute("height", 28);
            rectGoToNextChecklist.setAttribute("fill-opacity", "0");
            rectGoToNextChecklist.setAttribute("style", "stroke:#ffffff;stroke-width:2.0");
            this.root.appendChild(rectGoToNextChecklist);
            // Next Checklist Selection Rect
            this.rectSelectGoToNextChecklist = document.createElementNS(Avionics.SVG.NS, "rect");
            this.rectSelectGoToNextChecklist.setAttribute("x", _maxUnitsX - 256);
            this.rectSelectGoToNextChecklist.setAttribute("y", _maxUnitsY - 25 - _bottomMarge);
            this.rectSelectGoToNextChecklist.setAttribute("width", 247);
            this.rectSelectGoToNextChecklist.setAttribute("height", 20);
            this.rectSelectGoToNextChecklist.setAttribute("fill", "white");
            this.rectSelectGoToNextChecklist.setAttribute("visibility", "hidden");
            this.rectSelectGoToNextChecklist.setAttribute("style", "stroke:#ffffff;stroke-width:2.0");
            this.root.appendChild(this.rectSelectGoToNextChecklist);
            // Next Checklist Text
            let textGoToNextChecklist = document.createElementNS(Avionics.SVG.NS, "text");
            textGoToNextChecklist.setAttribute("id", "textGoToNextChecklist");
            textGoToNextChecklist.textContent = "GO TO NEXT CHECKLIST?";
            textGoToNextChecklist.setAttribute("x", _maxUnitsX - 255);
            textGoToNextChecklist.setAttribute("y", _maxUnitsY - 8 - _bottomMarge);
            textGoToNextChecklist.setAttribute("style", "font-size:1.25em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#9bd8d9;");
            this.root.appendChild(textGoToNextChecklist);
        }
        // Draw Debug Grid ****************************************************
        /*{
            for (let x = 0; x < 1000; x += 100) {
                let textDebugSize = document.createElementNS(Avionics.SVG.NS, "text");
                textDebugSize.setAttribute("id", "textDebugSize" + x);
                textDebugSize.textContent = "" + x;
                textDebugSize.setAttribute("x", "" + x);
                textDebugSize.setAttribute("y", "50");
                textDebugSize.setAttribute("style", "font-size:1.25em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#9bd8d9;");
                this.root.appendChild(textDebugSize);
                let vLine = document.createElementNS(Avionics.SVG.NS, "line");
                vLine.setAttribute("x1", "" + x);
                vLine.setAttribute("y1", "0");
                vLine.setAttribute("x2", "" + x);
                vLine.setAttribute("y2", "1000");
                vLine.setAttribute("style", "stroke:#9bd8d9;stroke-width:1");
                this.root.appendChild(vLine);
            }
            for (let y = 0; y <= 1000; y += 100) {
                let textDebugSize = document.createElementNS(Avionics.SVG.NS, "text");
                textDebugSize.setAttribute("id", "textDebugSize" + y);
                textDebugSize.textContent = "" + y;
                textDebugSize.setAttribute("x", "50");
                textDebugSize.setAttribute("y", "" + y);
                textDebugSize.setAttribute("style", "font-size:1.25em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#9bd8d9;");
                this.root.appendChild(textDebugSize);
                let hLine = document.createElementNS(Avionics.SVG.NS, "line");
                hLine.setAttribute("x1", "0");
                hLine.setAttribute("y1", "0" + y);
                hLine.setAttribute("x2", "1000");
                hLine.setAttribute("y2", "" + y);
                hLine.setAttribute("style", "stroke:#9bd8d9;stroke-width:1");
                this.root.appendChild(hLine);
            }
        }*/
    }

    createSVGForTest() {

        //
        if (!this._htmlConnected || this._svgBuilt) {
            return;
        }

        //
        this._svgBuilt = true;

        // Clean up
        Utils.RemoveAllChildren(this);

        //
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.style.width = "100%";
        this.root.style.height = "100%";
        this.root.setAttribute("viewBox", "0 0 1000 1000");
        this.appendChild(this.root);

        this.style.backgroundColor = "black";

        // Draw Debug Grid ****************************************************
        {
            for (let x = 0; x < 1000; x += 100) {
                let textDebugSize = document.createElementNS(Avionics.SVG.NS, "text");
                textDebugSize.setAttribute("id", "textDebugSize" + x);
                textDebugSize.textContent = "" + x;
                textDebugSize.setAttribute("x", "" + x);
                textDebugSize.setAttribute("y", "50");
                textDebugSize.setAttribute("style", "font-size:1.25em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#9bd8d9;");
                this.root.appendChild(textDebugSize);
                let vLine = document.createElementNS(Avionics.SVG.NS, "line");
                vLine.setAttribute("x1", "" + x);
                vLine.setAttribute("y1", "0");
                vLine.setAttribute("x2", "" + x);
                vLine.setAttribute("y2", "1000");
                vLine.setAttribute("style", "stroke:#9bd8d9;stroke-width:1");
                this.root.appendChild(vLine);
            }
            for (let y = 0; y <= 1000; y += 100) {
                let textDebugSize = document.createElementNS(Avionics.SVG.NS, "text");
                textDebugSize.setAttribute("id", "textDebugSize" + y);
                textDebugSize.textContent = "" + y;
                textDebugSize.setAttribute("x", "50");
                textDebugSize.setAttribute("y", "" + y);
                textDebugSize.setAttribute("style", "font-size:1.25em;line-height:1.25;letter-spacing:0px;word-spacing:0px;fill:#9bd8d9;");
                this.root.appendChild(textDebugSize);
                let hLine = document.createElementNS(Avionics.SVG.NS, "line");
                hLine.setAttribute("x1", "0");
                hLine.setAttribute("y1", "0" + y);
                hLine.setAttribute("x2", "1000");
                hLine.setAttribute("y2", "" + y);
                hLine.setAttribute("style", "stroke:#9bd8d9;stroke-width:1");
                this.root.appendChild(hLine);
            }
        }

    }

    _resizeOverlay() {
        let viewWidth = this.viewWidth;
        let viewHeight = this.viewHeight;
        this.root.style.width = `${viewWidth}px`;
        this.root.style.height = `${viewHeight}px`;
        this.root.style.left = "0";
        this.root.style.top = "0";
        this.root.setAttribute("viewBox", `0 0 ${viewWidth} ${viewHeight}`);
    }

    getExternalTextZonePath(radius, beginAngle, endAngle, xEnd, reverse = false) {
        let beginX = 50 - (radius * Math.cos(beginAngle));
        let beginY = 50 - (radius * Math.sin(beginAngle));
        let endX = 50 - (radius * Math.cos(endAngle));
        let endY = 50 - (radius * Math.sin(endAngle));
        let path = "M" + beginX + " " + beginY + "L" + xEnd + " " + beginY + "L" + xEnd + " " + endY + "L" + endX + " " + endY;
        path += "A " + radius + " " + radius + " 0 0 " + (reverse ? 0 : 1) + " " + beginX + " " + beginY;
        return path;
    }

    applyHUDStyle(_elem) {
        _elem.setAttribute("fill", "rgb(26,29,33)");
        _elem.setAttribute("fill-opacity", "0.5");
        _elem.setAttribute("stroke", "rgb(255, 255, 255)");
        _elem.setAttribute("stroke-width", "0.75");
        _elem.setAttribute("stroke-opacity", "0.2");
    }

    init() {
      this._textChecklistPageError6.textContent = "ChecklistPage - init()";
    }

    update() {

        //
        if (!this.isAwake()) {
            return;
        }

        // Responds to CHECK_ITEM SimVar
        let simVarNavTouchChecklistPush = SimVar.GetSimVarValue("L:NAV_TOUCH_CHECKLIST_PUSH", "Bool");
        if (simVarNavTouchChecklistPush) {
            SimVar.SetSimVarValue("L:NAV_TOUCH_CHECKLIST_PUSH", "Bool", false)
                  .catch(console.log);
            this.setAttribute("check_cursor", "1");
        }

        if (!this._modelNew) {
            return;
        }

        //let viewWidth = this.clientWidth;
        //let viewHeight = this.clientHeight;
        if (this.clientWidth * this.clientHeight === 0) {
            return;
        }

        let needRedraw = false;

        if (this.clientWidth != this._viewWidth || this.clientHeight != this._viewHeight) {
            this._viewWidth = this.clientWidth;
            this._viewHeight = this.clientHeight;
            this._resizeOverlay();
            needRedraw = true;
        }

        if (needRedraw) {
            //this._redraw();
        }

      /*
      var compass = SimVar.GetSimVarValue("PLANE HEADING DEGREES MAGNETIC", "degree");
      var roundedCompass = fastToFixed(compass, 3);
      this.setAttribute("rotation", roundedCompass);
      var turnRate = SimVar.GetSimVarValue("TURN INDICATOR RATE", "degree per second");
      var roundedTurnRate = fastToFixed(turnRate, 3);
      this.setAttribute("turn_rate", roundedTurnRate);
      var heading = SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK DIR", "degree");
      var roundedHeading = fastToFixed(heading, 3);
      this.setAttribute("heading_bug_rotation", roundedHeading);
      this.setAttribute("current_track", SimVar.GetSimVarValue("GPS GROUND MAGNETIC TRACK", "degrees"));
      this.logic_cdiSource = SimVar.GetSimVarValue("GPS DRIVES NAV1", "Bool") ? 3 : SimVar.GetSimVarValue("AUTOPILOT NAV SELECTED", "Number");
      switch (this.logic_cdiSource) {
          case 1:
              this.setAttribute("display_deviation", SimVar.GetSimVarValue("NAV HAS NAV:1", "boolean") != 0 ? "True" : "False");
              if (SimVar.GetSimVarValue("NAV HAS LOCALIZER:1", "Bool")) {
                  this.setAttribute("nav_source", "LOC1");
                  this.setAttribute("course", SimVar.GetSimVarValue("NAV LOCALIZER:1", "degree").toString());
              }
              else {
                  this.setAttribute("nav_source", "VOR1");
                  this.setAttribute("course", SimVar.GetSimVarValue("NAV OBS:1", "degree").toString());
              }
              this.setAttribute("course_deviation", (SimVar.GetSimVarValue("NAV CDI:1", "number") / 127).toString());
              this.setAttribute("to_from", SimVar.GetSimVarValue("NAV TOFROM:1", "Enum").toString());
              break;
          case 2:
              this.setAttribute("display_deviation", SimVar.GetSimVarValue("NAV HAS NAV:2", "boolean") != 0 ? "True" : "False");
              if (SimVar.GetSimVarValue("NAV HAS LOCALIZER:2", "Bool")) {
                  this.setAttribute("nav_source", "LOC2");
                  this.setAttribute("course", SimVar.GetSimVarValue("NAV LOCALIZER:2", "degree").toString());
              }
              else {
                  this.setAttribute("nav_source", "VOR2");
                  this.setAttribute("course", SimVar.GetSimVarValue("NAV OBS:2", "degree").toString());
              }
              this.setAttribute("course_deviation", (SimVar.GetSimVarValue("NAV CDI:2", "number") / 127).toString());
              this.setAttribute("to_from", SimVar.GetSimVarValue("NAV TOFROM:2", "Enum").toString());
              break;
          case 3:
              this.setAttribute("nav_source", "FMS");
              this.setAttribute("display_deviation", SimVar.GetSimVarValue("GPS WP NEXT ID", "string") != "" ? "True" : "False");
              this.setAttribute("course", SimVar.GetSimVarValue("GPS WP DESIRED TRACK", "degree"));
              this.setAttribute("course_deviation", SimVar.GetSimVarValue("GPS WP CROSS TRK", "nautical mile"));
              this.setAttribute("to_from", "1");
              let curPhase = SimVar.GetSimVarValue("L:GPS_Current_Phase", "number");
              switch (curPhase) {
                  case 1:
                      this.setAttribute("flight_phase", "DPRT");
                      this.setAttribute("crosstrack_full_error", "0.3");
                      break;
                  case 2:
                      this.setAttribute("flight_phase", "TERM");
                      this.setAttribute("crosstrack_full_error", "1.0");
                      break;
                  case 4:
                      this.setAttribute("flight_phase", "OCN");
                      this.setAttribute("crosstrack_full_error", "4.0");
                      break;
                  default:
                      this.setAttribute("flight_phase", "ENR");
                      this.setAttribute("crosstrack_full_error", "2.0");
                      break;
              }
              break;
      }
      this.logic_brg1Source = SimVar.GetSimVarValue("L:PFD_BRG1_Source", "Number");
      if (this.logic_brg1Source)
          this.setAttribute("show_bearing1", "true");
      else
          this.setAttribute("show_bearing1", "false");
      switch (this.logic_brg1Source) {
          case 1:
              this.setAttribute("bearing1_source", "NAV1");
              if (SimVar.GetSimVarValue("NAV HAS NAV:1", "Bool")) {
                  this.setAttribute("bearing1_ident", SimVar.GetSimVarValue("NAV IDENT:1", "string"));
                  this.setAttribute("bearing1_distance", SimVar.GetSimVarValue("NAV HAS DME:1", "Bool") ? SimVar.GetSimVarValue("NAV DME:1", "nautical miles") : "");
                  this.setAttribute("bearing1_bearing", ((180 + SimVar.GetSimVarValue("NAV RADIAL:1", "degree")) % 360).toString());
              }
              else {
                  this.setAttribute("bearing1_ident", "NO DATA");
                  this.setAttribute("bearing1_distance", "");
                  this.setAttribute("bearing1_bearing", "");
              }
              break;
          case 2:
              this.setAttribute("bearing1_source", "NAV2");
              if (SimVar.GetSimVarValue("NAV HAS NAV:2", "Bool")) {
                  this.setAttribute("bearing1_ident", SimVar.GetSimVarValue("NAV IDENT:2", "string"));
                  this.setAttribute("bearing1_distance", SimVar.GetSimVarValue("NAV HAS DME:2", "Bool") ? SimVar.GetSimVarValue("NAV DME:2", "nautical miles") : "");
                  this.setAttribute("bearing1_bearing", ((180 + SimVar.GetSimVarValue("NAV RADIAL:2", "degree")) % 360).toString());
              }
              else {
                  this.setAttribute("bearing1_ident", "NO DATA");
                  this.setAttribute("bearing1_distance", "");
                  this.setAttribute("bearing1_bearing", "");
              }
              break;
          case 3:
              this.setAttribute("bearing1_source", "GPS");
              this.setAttribute("bearing1_ident", SimVar.GetSimVarValue("GPS WP NEXT ID", "string"));
              this.setAttribute("bearing1_distance", SimVar.GetSimVarValue("GPS WP DISTANCE", "nautical miles"));
              this.setAttribute("bearing1_bearing", SimVar.GetSimVarValue("GPS WP BEARING", "degree"));
              break;
          case 4:
              this.setAttribute("bearing1_source", "ADF");
              this.setAttribute("bearing1_distance", "");
              if (SimVar.GetSimVarValue("ADF SIGNAL:1", "number")) {
                  this.setAttribute("bearing1_ident", fastToFixed(SimVar.GetSimVarValue("ADF ACTIVE FREQUENCY:1", "KHz"), 1));
                  this.setAttribute("bearing1_bearing", ((SimVar.GetSimVarValue("ADF RADIAL:1", "degree") + compass) % 360).toString());
              }
              else {
                  this.setAttribute("bearing1_ident", "NO DATA");
                  this.setAttribute("bearing1_bearing", "");
              }
              break;
      }
      this.logic_brg2Source = SimVar.GetSimVarValue("L:PFD_BRG2_Source", "Number");
      if (this.logic_brg2Source)
          this.setAttribute("show_bearing2", "true");
      else
          this.setAttribute("show_bearing2", "false");
      switch (this.logic_brg2Source) {
          case 1:
              this.setAttribute("bearing2_source", "NAV1");
              if (SimVar.GetSimVarValue("NAV HAS NAV:1", "Bool")) {
                  this.setAttribute("bearing2_ident", SimVar.GetSimVarValue("NAV IDENT:1", "string"));
                  this.setAttribute("bearing2_distance", SimVar.GetSimVarValue("NAV HAS DME:1", "Bool") ? SimVar.GetSimVarValue("NAV DME:1", "nautical miles") : "");
                  this.setAttribute("bearing2_bearing", ((180 + SimVar.GetSimVarValue("NAV RADIAL:1", "degree")) % 360).toString());
              }
              else {
                  this.setAttribute("bearing2_ident", "NO DATA");
                  this.setAttribute("bearing2_distance", "");
                  this.setAttribute("bearing2_bearing", "");
              }
              break;
          case 2:
              this.setAttribute("bearing2_source", "NAV2");
              if (SimVar.GetSimVarValue("NAV HAS NAV:2", "Bool")) {
                  this.setAttribute("bearing2_ident", SimVar.GetSimVarValue("NAV IDENT:2", "string"));
                  this.setAttribute("bearing2_distance", SimVar.GetSimVarValue("NAV HAS DME:2", "Bool") ? SimVar.GetSimVarValue("NAV DME:2", "nautical miles") : "");
                  this.setAttribute("bearing2_bearing", ((180 + SimVar.GetSimVarValue("NAV RADIAL:2", "degree")) % 360).toString());
              }
              else {
                  this.setAttribute("bearing2_ident", "NO DATA");
                  this.setAttribute("bearing2_distance", "");
                  this.setAttribute("bearing2_bearing", "");
              }
              break;
          case 3:
              this.setAttribute("bearing2_source", "GPS");
              this.setAttribute("bearing2_ident", SimVar.GetSimVarValue("GPS WP NEXT ID", "string"));
              this.setAttribute("bearing2_distance", SimVar.GetSimVarValue("GPS WP DISTANCE", "nautical miles"));
              this.setAttribute("bearing2_bearing", SimVar.GetSimVarValue("GPS WP BEARING", "degree"));
              break;
          case 4:
              this.setAttribute("bearing2_source", "ADF");
              this.setAttribute("bearing2_distance", "");
              if (SimVar.GetSimVarValue("ADF SIGNAL:1", "number")) {
                  this.setAttribute("bearing2_ident", fastToFixed(SimVar.GetSimVarValue("ADF ACTIVE FREQUENCY:1", "KHz"), 1));
                  this.setAttribute("bearing2_bearing", ((SimVar.GetSimVarValue("ADF RADIAL:1", "degree") + compass) % 360).toString());
              }
              else {
                  this.setAttribute("bearing2_ident", "NO DATA");
                  this.setAttribute("bearing2_bearing", "");
              }
              break;
      }
      this.logic_dmeDisplayed = SimVar.GetSimVarValue("L:PFD_DME_Displayed", "number");
      if (this.logic_dmeDisplayed) {
          this.setAttribute("show_dme", "true");
      }
      else {
          this.setAttribute("show_dme", "false");
      }
      this.logic_dmeSource = SimVar.GetSimVarValue("L:Glasscockpit_DmeSource", "Number");
      switch (this.logic_dmeSource) {
          case 0:
              SimVar.SetSimVarValue("L:Glasscockpit_DmeSource", "Number", 1);
          case 1:
              this.setAttribute("dme_source", "NAV1");
              if (SimVar.GetSimVarValue("NAV HAS DME:1", "Bool")) {
                  this.setAttribute("dme_ident", fastToFixed(SimVar.GetSimVarValue("NAV ACTIVE FREQUENCY:1", "MHz"), 2));
                  this.setAttribute("dme_distance", SimVar.GetSimVarValue("NAV DME:1", "nautical miles"));
              }
              else {
                  this.setAttribute("dme_ident", "");
                  this.setAttribute("dme_distance", "");
              }
              break;
          case 2:
              this.setAttribute("dme_source", "NAV2");
              if (SimVar.GetSimVarValue("NAV HAS DME:2", "Bool")) {
                  this.setAttribute("dme_ident", fastToFixed(SimVar.GetSimVarValue("NAV ACTIVE FREQUENCY:2", "MHz"), 2));
                  this.setAttribute("dme_distance", SimVar.GetSimVarValue("NAV DME:2", "nautical miles"));
              }
              else {
                  this.setAttribute("dme_ident", "");
                  this.setAttribute("dme_distance", "");
              }
              break;
      }
      let diff = this.crossTrackGoal - this.crossTrackCurrent;
      let toAdd = (_deltaTime / 1000) * diff * 7.5;
      if (Math.abs(toAdd) < 0.75) {
          toAdd = toAdd > 0 ? 0.75 : -0.75;
      }
      if (Math.abs(diff) < 0.1 || Math.abs(toAdd) > Math.abs(diff)) {
          this.crossTrackCurrent = this.crossTrackGoal;
      }
      else {
          this.crossTrackCurrent += toAdd;
      }
      Avionics.Utils.diffAndSetAttribute(this.CDI, "transform", "translate(" + this.crossTrackCurrent + " 0)");
      */

    }

    onExit() {
    }
    onEvent(_event) {
        // let model = SimVar.GetSimVarValue("ATC MODEL", "string", "FMC");
        switch (_event) {
            case "FMS_Upper_PUSH":
                this.setAttribute("toggle_active", "true");
                break;
            case "FMS_Lower_DEC":
            case "FMS_Upper_DEC":
                this.setAttribute("dec_cursor", "true");
                break;
            case "FMS_Lower_INC":
            case "FMS_Upper_INC":
                this.setAttribute("inc_cursor", "true");
                break;
            case "SOFTKEYS_6":
                this.setAttribute("check_cursor", "true");
                break;
            case "ENT_Push":
                this.setAttribute("ent_push", "true");
                break;
            /*
            case "CRS_INC":
                if (this.logic_cdiSource == 1) {
                    SimVar.SetSimVarValue("K:VOR1_OBI_INC", "number", 0);
                }
                else if (this.logic_cdiSource == 2) {
                    SimVar.SetSimVarValue("K:VOR2_OBI_INC", "number", 0);
                }
                break;
            case "CRS_DEC":
                if (this.logic_cdiSource == 1) {
                    SimVar.SetSimVarValue("K:VOR1_OBI_DEC", "number", 0);
                }
                else if (this.logic_cdiSource == 2) {
                    SimVar.SetSimVarValue("K:VOR2_OBI_DEC", "number", 0);
                }
                break;
            case "CRS_PUSH":
                if (this.logic_cdiSource == 1) {
                    SimVar.SetSimVarValue("K:VOR1_SET", "number", ((180 + SimVar.GetSimVarValue("NAV RADIAL:1", "degree")) % 360));
                }
                else if (this.logic_cdiSource == 2) {
                    SimVar.SetSimVarValue("K:VOR2_SET", "number", ((180 + SimVar.GetSimVarValue("NAV RADIAL:2", "degree")) % 360));
                }
                break;
            case "SoftKeys_PFD_DME":
                this.logic_dmeDisplayed = !this.logic_dmeDisplayed;
                SimVar.SetSimVarValue("L:PFD_DME_Displayed", "number", this.logic_dmeDisplayed ? 1 : 0);
                // WTDataStore.set("HSI.ShowDme", this.logic_dmeDisplayed);
                if (this.logic_dmeDisplayed) {
                    this.setAttribute("show_dme", "true");
                }
                else {
                    this.setAttribute("show_dme", "false");
                }
                break;
            case "SoftKeys_PFD_BRG1":
            case "BRG1Switch":
                this.logic_brg1Source = (this.logic_brg1Source + 1) % 5;
                SimVar.SetSimVarValue("L:PFD_BRG1_Source", "number", this.logic_brg1Source);
                // WTDataStore.set("HSI.Brg1Src", this.logic_brg1Source);
                if (this.logic_brg1Source == 0) {
                    this.setAttribute("show_bearing1", "false");
                }
                else {
                    this.setAttribute("show_bearing1", "true");
                }
                break;
            case "SoftKeys_PFD_BRG2":
            case "BRG2Switch":
                this.logic_brg2Source = (this.logic_brg2Source + 1) % 5;
                SimVar.SetSimVarValue("L:PFD_BRG2_Source", "number", this.logic_brg2Source);
                // WTDataStore.set("HSI.Brg2Src", this.logic_brg2Source);
                if (this.logic_brg2Source == 0) {
                    this.setAttribute("show_bearing2", "false");
                }
                else {
                    this.setAttribute("show_bearing2", "true");
                }
                break;
            case "SoftKey_CDI":
            case "NavSourceSwitch":
                this.logic_cdiSource = (this.logic_cdiSource % 3) + 1;
                let isGPSDrived = SimVar.GetSimVarValue("GPS DRIVES NAV1", "Bool");
                if (this.logic_cdiSource == 2 && !SimVar.GetSimVarValue("NAV AVAILABLE:2", "Bool")) {
                    this.logic_cdiSource = 3;
                }
                if (this.logic_cdiSource == 3 != isGPSDrived) {
                    SimVar.SetSimVarValue("K:TOGGLE_GPS_DRIVES_NAV1", "Bool", 0);
                }
                if (this.logic_cdiSource != 3) {
                    SimVar.SetSimVarValue("K:AP_NAV_SELECT_SET", "number", this.logic_cdiSource);
                }
                break;
            */
        }
    }
    toggleActiveState() {
        if (this._active) {
            this._gotoNextChecklistCursorSelected = this.isGotoNextChecklistSelectRectVisible();
        }
        this._active = !this._active;
    }
    updateCursorVisibility() {
        if (this._active) { // New State == Active
            if (this._gotoNextChecklistCursorSelected) {
                this.rectSelectGoToNextChecklist.setAttribute("visibility", "visible");
            } else {
                this.showCurrentCursorRect();
            }
        } else { // New State == Not Active
            this.hideCurrentCursorRect();
            // this._gotoNextChecklistCursorSelected = this.isGotoNextChecklistSelectRectVisible();
            this.rectSelectGoToNextChecklist.setAttribute("visibility", "hidden");
        }
    }/*
    checkUncheckCurrentCursor() {
        if (this._active) {
            let theCurrentChecklist = this.getCurrentChecklist();
            let theCurrentChecklistItem = theCurrentChecklist.checklistItems[theCurrentChecklist.currentItemIndex];
            theCurrentChecklistItem.checked = !theCurrentChecklistItem.checked;
        }
    }*/
    incrementCursor() {
        let theCurrentChecklist = this.getCurrentChecklist();
        this.hideCurrentCursorRect();
        if (theCurrentChecklist.currentItemIndex === (theCurrentChecklist.checklistItems.length - 1)) {
            if (this.rectSelectGoToNextChecklist.getAttribute("visibility") === "visible") {
                this.hideNextChecklistSelectRect();
                theCurrentChecklist.currentItemIndex = 0;
                this.showCurrentCursorRect();
            } else {
                this.showNextChecklistSelectRect();
            }
        } else {
            theCurrentChecklist.currentItemIndex = (theCurrentChecklist.currentItemIndex + 1) % theCurrentChecklist.checklistItems.length;
            this.showCurrentCursorRect();
        }
    }
    decrementCursor() {
        let theCurrentChecklist = this.getCurrentChecklist();
        this.hideCurrentCursorRect();
        if (this.rectSelectGoToNextChecklist.getAttribute("visibility") === "visible") {
            this.hideNextChecklistSelectRect();
            theCurrentChecklist.currentItemIndex = (theCurrentChecklist.checklistItems.length - 1);
            this.showCurrentCursorRect();
        } else {
            if (theCurrentChecklist.currentItemIndex > 0) {
                theCurrentChecklist.currentItemIndex--;
                this.showCurrentCursorRect();
            } else {
                this.showNextChecklistSelectRect();
            }
        }
    }
    toggleCurrentCursorCheck() {
        let theCurrentChecklist = this.getCurrentChecklist();
        if (this.rectSelectGoToNextChecklist.getAttribute("visibility") === "visible") {
            // Nothing to do, should not happen (Check should be grayed in this case)
        } else {
            let theCurrentItem = theCurrentChecklist.checklistItems[theCurrentChecklist.currentItemIndex];
            theCurrentItem.checked = !theCurrentItem.checked;
            if (theCurrentItem.checked) {
                this.getCurrentCursorCheckmarkPath().setAttribute("visibility", "visible");
                this.getCurrentCursorLabelText().setAttribute("fill", "green");
                do {
                    this.incrementCursor();
                    theCurrentItem = theCurrentChecklist.checklistItems[theCurrentChecklist.currentItemIndex];
                } while (theCurrentItem.checked && theCurrentChecklist.currentItemIndex < (theCurrentChecklist.length - 1));
            } else {
                this.getCurrentCursorCheckmarkPath().setAttribute("visibility", "hidden");
                this.getCurrentCursorLabelText().setAttribute("fill", "#9bd8d9")
            }
            let theItemY = this.getCurrentCursorLabelText().getAttribute("y");
            if (theItemY > 920) {
                let theItemsSvgViewPortAttribute = this._itemsSvg.getAttribute("viewBox");
                let theViewBox = theItemsSvgViewPortAttribute.split(" ");
                let theNewViewBox = theViewBox[0] + " " + (parseInt(theViewBox[1]) + 50) + " " + theViewBox[2] + " " + (parseInt(theViewBox[3]) + 50);
                this._itemsSvg.setAttribute("viewBox", theNewViewBox);
                //this.getCurrentCursorLabelText().setAttribute("y", theItemY - 50);
            }
        }
    }
    enterPushed() {
        if (this.isGotoNextChecklistSelectRectVisible()) {
            this.hideNextChecklistSelectRect();
            this._currentChecklistIndex = (this._currentChecklistIndex + 1) % this._handbook.checklists.length;
            this.getCurrentChecklist().currentItemIndex = 0;
            this._svgBuilt = false;
            //this.createSVG();
            this.showCurrentCursorRect();
            return true;
        }
        return false;
    }
    hideCurrentCursorRect() {
        let theCurrentCursorRect = this.getCurrentCursorRect();
        theCurrentCursorRect.setAttribute("visibility", "hidden");
    }
    showCurrentCursorRect() {
        let theCurrentCursorRect = this.getCurrentCursorRect();
        theCurrentCursorRect.setAttribute("visibility", "visible");
    }
    hideNextChecklistSelectRect() {
        this.rectSelectGoToNextChecklist.setAttribute("visibility", "hidden");
    }
    showNextChecklistSelectRect() {
        this.rectSelectGoToNextChecklist.setAttribute("visibility", "visible");
    }
    getCurrentChecklistItemG() {
        return this.itemsRect[this.getCurrentChecklist().currentItemIndex];
    }
    getCurrentCursorRect() {
        return this.getCurrentChecklistItemG().childNodes[0];
    }
    getCurrentCursorCheckmarkPath() {
        return this.getCurrentChecklistItemG().childNodes[2];
    }
    getCurrentCursorLabelText() {
        return this.getCurrentChecklistItemG().childNodes[3];
    }
    isGotoNextChecklistSelectRectVisible() {
        return this.rectSelectGoToNextChecklist.getAttribute("visibility") === "visible";
    }
    getCurrentChecklist() {
        return this._handbook.checklists[this._currentChecklistIndex];
    }

    setModel(model) {
        this._modelNew = model;
    }

    isAwake() {
        return this._isAwake;
    }
    wake() {
        this._isAwake = true;
    }
    sleep() {
        this._isAwake = false;
    }

    handbookLoaded() {
        this._goCreateSVG = true;
        this.createSVG();
        //this.createSVGForTest();
        if (this._isAs3000) {
            if (this._svgBuilt && !this._active) {
                this.setAttribute("toggle_active", "true");
            }
        }
    }

    loadHandbookNew(theModelAtc) {
        let checklistLoader = new WT_ChecklistLoader();
        checklistLoader
            .loadHandbook(theModelAtc)
            .then((handbookLoaded) => {
                this._handbook = handbookLoaded;
                this.handbookLoaded();
            })
            .catch((error) => {
                console.log("ChecklistPage.js - loadHandbookNew - error = " + error);
            });
    }

}
function getSize(_elementPercent, _canvasSize) {
    return _elementPercent * _canvasSize / 10;
}
customElements.define('checklist-page', ChecklistPage);
//# sourceMappingURL=ChecklistPage.js.map
