class WT_G1000ChecklistLoader {
    constructor() {
        this.titi = 0;
    }
    loadCurrent() {
        console.log("G1000ChecklistLoader.js - HandbookLoader.loadCurrent() - start");
        this.titi = 1;
        console.log("G1000ChecklistLoader.js - HandbookLoader.loadCurrent() - end");
    }

    loadHandbook(theModelAtc) {
        let theAirplaneIcao = this.toModelIcao(theModelAtc);
        let loaderPromise = new Promise((resolve, reject) => {
            let handbookHttpRequest = new XMLHttpRequest();
            handbookHttpRequest.overrideMimeType("application/json");
            handbookHttpRequest.onreadystatechange = () => {
                this._responseReadyState = handbookHttpRequest.readyState;
                if (handbookHttpRequest.readyState === XMLHttpRequest.DONE) {
                    this._response = handbookHttpRequest.status;
                    if (handbookHttpRequest.status === 200 || handbookHttpRequest.status === 0) {
                        let loadedHandbook = JSON.parse(handbookHttpRequest.responseText, (key, value) => {
                            if (value instanceof Object) {
                                if (value.hasOwnProperty("challenge")) {
                                    return Object.assign(new ChecklistItemModel(), value);
                                } else if (value.hasOwnProperty("groupName")) {
                                    return Object.assign(new ChecklistModel(), value);
                                } else if (value.hasOwnProperty("airplaneIcao")) {
                                    return Object.assign(new HandbookModel(), value);
                                }
                            }
                            return value;
                        });
                        console.log("handbookLoaded...");
                        resolve(loadedHandbook);
                        //this.handbookLoaded();
                    } else {
                        console.log("handbook Load not HTTP 200 !!!!!!");
                        reject(handbookHttpRequest.status);
                        //this._
                    }
                }
                //this.createSVG();
            };
            this._handbookUrl = "/WTg3000/SDK/Checklist/handbook-" + theAirplaneIcao + ".json?_=" + new Date().getTime();
            handbookHttpRequest.open("GET", "/WTg3000/SDK/Checklist/handbook-" + theAirplaneIcao + ".json?_=" + new Date().getTime());
            handbookHttpRequest.send();
        });
        return loaderPromise;
    }

    toModelIcao(theModelAtc) {
    if (theModelAtc.indexOf("DA62") > -1) {
      return "da62";
    } else {
      return "da62";
    }
    // TBM9
    // TT:ATCCOM.AC_MODEL_DA62.0.text
  }


}
