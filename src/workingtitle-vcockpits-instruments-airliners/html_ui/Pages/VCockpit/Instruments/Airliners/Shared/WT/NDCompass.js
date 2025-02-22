
class Jet_MFD_NDCompass extends Jet_NDCompass {
    constructor() {
        super();
        this.hudTopOrigin = NaN;
        this.UPDATE_TIME = 250;
        this._updateTimer = this.UPDATE_TIME;
    }
    connectedCallback() {
        super.connectedCallback();
    }
    init() {
        super.init();
    }
    destroyLayout() {
        super.destroyLayout();
        this.hudTopOrigin = NaN;
    }
    constructArc() {
        super.constructArc();
        if (this.aircraft == Aircraft.CJ4)
            this.constructArc_CJ4();
        else if (this.aircraft == Aircraft.B747_8)
            this.constructArc_B747_8();
        else if (this.aircraft == Aircraft.AS01B)
            this.constructArc_AS01B();
        else
            this.constructArc_A320_Neo();
    }
    constructArc_CJ4() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "-225 -215 550 516");

        this.appendChild(this.root);
        var trsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(trsGroup, "transform", "translate(0, 70)");
        this.root.appendChild(trsGroup);
        {
            let viewBox = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(viewBox, "x", "-225");
            diffAndSetAttribute(viewBox, "y", "-300");
            diffAndSetAttribute(viewBox, "viewBox", "-325 -350 750 600");

            let ClipDefs = document.createElementNS(Avionics.SVG.NS, "defs");

            let rangeClip = document.createElementNS(Avionics.SVG.NS, "clipPath");
            diffAndSetAttribute(rangeClip, "id", "rangeClip");
            let rangeClipShape = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(rangeClipShape, "d", "M -132 -30 H -72 V 0 H -132 V 250 H 250 V -150 H -132 z");
            rangeClip.appendChild(rangeClipShape);
            ClipDefs.appendChild(rangeClip);

            viewBox.appendChild(ClipDefs);

            trsGroup.appendChild(viewBox);
            var circleRadius = 350;
            var maskHeight = 200;
            this.arcMaskGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.arcMaskGroup.setAttribute("id", "mask");
            viewBox.appendChild(this.arcMaskGroup);
            {
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topMask, "d", "M0 " + -maskHeight + ", L" + circleRadius * 2 + " " + -maskHeight + ", L" + circleRadius * 2 + " " + circleRadius + ", A 25 25 0 1 0 0, " + circleRadius + "Z");
                diffAndSetAttribute(topMask, "transform", "translate(" + (50 - circleRadius) + ", " + (50 - circleRadius) + ")");
                diffAndSetAttribute(topMask, "fill", "black");
                this.arcMaskGroup.appendChild(topMask);
            }
            var fixedGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(fixedGroup, "id", "fixedElements");
            viewBox.appendChild(fixedGroup);
            {
                var arc = new Avionics.SVGArc;
                arc.init("mainArc", circleRadius, 2, "white");
                arc.translate(50, 50);
                arc.rotate(-90 + 26.5);
                arc.setPercent(35);
                fixedGroup.appendChild(arc.svg);
                let vec = new Vec2(1, 0.45);
                vec.SetNorm(circleRadius * 0.92);
                this.addMapRange(fixedGroup, 30 - vec.x, 50 - vec.y, "white", "26", false, 1.0, false, "left");
                var smallCircleRadius = 170;
                vec.SetNorm(smallCircleRadius * 0.82);
                this.addMapRange(fixedGroup, 40 - vec.x, 50 - vec.y, "white", "26", false, 0.5, false);
                {
                    fixedGroup.getElementsByTagName("text")[1].setAttribute("x", -107);
                    fixedGroup.getElementsByTagName("text")[1].setAttribute("y", -10);
                    fixedGroup.getElementsByTagName("text")[1].setAttribute("text-anchor", "middle");
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", "50");
                    diffAndSetAttribute(circle, "cy", "50");
                    diffAndSetAttribute(circle, "r", smallCircleRadius.toString());
                    diffAndSetAttribute(circle, "fill-opacity", "0");
                    diffAndSetAttribute(circle, "stroke", "#cccac8");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    diffAndSetAttribute(circle, "stroke-opacity", "1");
                    diffAndSetAttribute(circle, "clip-path", "url(#rangeClip)");

                    // circle = fixedGroup.getElementsByTagNameNS(Avionics.SVG.NS, "circle");
                    var path = fixedGroup.querySelector('path');
                    let cLength = path.getTotalLength();


                    // create dot
                    let dot = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(dot, "width", "16");
                    diffAndSetAttribute(dot, "height", "6");
                    diffAndSetAttribute(dot, "id", "weather_radar_bug");
                    diffAndSetAttribute(dot, "fill", "#36c8d2");
                    diffAndSetAttribute(dot, "fill-opacity", "1");
                    diffAndSetAttribute(dot, "stroke", "blue");
                    diffAndSetAttribute(dot, "stroke-width", "2");
                    diffAndSetAttribute(dot, "stroke-opacity", "0");

                    fixedGroup.appendChild(dot);
                    fixedGroup.appendChild(circle);

                    let y = 0;
                    let initR = -61.5;
                    let r = initR;
                    let stopR = false;
                    setInterval(function () {
                        // dot.setAttribute('transform', 'translate(40,0) rotate(' + y + ')');
                        if (dot.style.display === "") {
                            if (y >= 0.9751) {
                                stopR = true;
                            }

                            if (y >= 1.2) {
                                y = 0;
                                r = initR;
                                stopR = false;
                            }

                            y += 0.013;
                            if (!stopR) {
                                r += 1.61;
                                diffAndSetAttribute(dot, "transform", "translate(" + (path.getPointAtLength(y * cLength).x + 42) + "," + (path.getPointAtLength(y * cLength).y + 51) + ") rotate( " + r + ",8,3)");
                            }
                        }
                    }, 30);

                    if (this._displayMode === Jet_NDCompass_Display.ARC || this._displayMode === Jet_NDCompass_Display.PPOS){
                        dashSpacing = 12;
                        let radians = 0;
                        var tfcGroup = document.createElementNS(Avionics.SVG.NS, "g");
                        diffAndSetAttribute(tfcGroup, "id", "tfcClockTicks");
                        for (let i = 0; i < dashSpacing; i++) {
                            let line = document.createElementNS(Avionics.SVG.NS, "line");
                            let length = 15;
                            let lineStart = 50 + smallCircleRadius - length * 0.4;
                            let lineEnd = 50 + smallCircleRadius + length * 0.4;
                            let degrees = (radians / Math.PI) * 180;
                            diffAndSetAttribute(line, "x1", "50");
                            diffAndSetAttribute(line, "y1", lineStart.toString());
                            diffAndSetAttribute(line, "x2", "50");
                            diffAndSetAttribute(line, "y2", lineEnd.toString());
                            diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                            diffAndSetAttribute(line, "stroke", "#cccac8");
                            diffAndSetAttribute(line, "stroke-width", "3");
                            diffAndSetAttribute(line, "stroke-opacity", "0.8");
                            tfcGroup.appendChild(line);
                            radians += (2 * Math.PI) / dashSpacing;

                            // TODO idea for 3nm TCAS radials
                            // let smallRadius = 40;
                            // let smallLength = 12;
                            // let smallLineStart = 50 + smallRadius - smallLength * 0.4;
                            // let smallLineEnd = 50 + smallRadius + smallLength * 0.4;
                            // let smallLine = document.createElementNS(Avionics.SVG.NS, "line");
                            // smallLine.setAttribute("x1", "50");
                            // smallLine.setAttribute("y1", smallLineStart.toString());
                            // smallLine.setAttribute("x2", "50");
                            // smallLine.setAttribute("y2", smallLineEnd.toString());
                            // smallLine.setAttribute("transform", "rotate(" + (-degrees + 180) + " 50 50)");
                            // smallLine.setAttribute("stroke", "#cccac8");
                            // smallLine.setAttribute("stroke-width", "2");
                            // tfcGroup.appendChild(smallLine);
                        }
                        fixedGroup.appendChild(tfcGroup);
                    }
                }
                let clipRect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(clipRect, "x", (50 - circleRadius).toString());
                diffAndSetAttribute(clipRect, "y", (-105 - circleRadius).toString());
                diffAndSetAttribute(clipRect, "width", (circleRadius * 2).toString());
                diffAndSetAttribute(clipRect, "height", (circleRadius).toString());
                diffAndSetAttribute(clipRect, "fill", "white");
                var clipPath = document.createElementNS(Avionics.SVG.NS, "clipPath");
                diffAndSetAttribute(clipPath, "id", "clip");
                clipPath.appendChild(clipRect);
                fixedGroup.appendChild(clipPath);
            }
            var clipGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(clipGroup, "id", "clipElements");
            diffAndSetAttribute(clipGroup, "clip-path", "url(#clip)");
            viewBox.appendChild(clipGroup);
            {
                this.graduations = document.createElementNS(Avionics.SVG.NS, "g");
                this.graduations.setAttribute("id", "graduations");
                clipGroup.appendChild(this.graduations);
                {
                    var dashSpacing = 72;
                    let texts = ["N", "E", "S", "W"];
                    let radians = 0;
                    for (let i = 0; i < dashSpacing; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        let bIsBig = (i % 2 == 0) ? true : false;
                        let bIsText = (i % 6 == 0) ? true : false;
                        let length = (bIsBig) ? 15 : 8.5;
                        let lineStart = 50 + circleRadius;
                        let lineEnd = 50 + circleRadius + length;
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x1", "50");
                        diffAndSetAttribute(line, "y1", lineStart.toString());
                        diffAndSetAttribute(line, "x2", "50");
                        diffAndSetAttribute(line, "y2", lineEnd.toString());
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                        diffAndSetAttribute(line, "stroke", "white");
                        diffAndSetAttribute(line, "stroke-width", "3");
                        diffAndSetAttribute(line, "stroke-opacity", "0.8");
                        this.graduations.appendChild(line);
                        if (bIsText) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            if (Math.round(degrees) % 90 == 0) {
                                let id = Math.round(degrees) / 90;
                                diffAndSetText(text, texts[id]);
                            }
                            else
                                diffAndSetText(text, fastToFixed(degrees / 10, 0));
                            diffAndSetAttribute(text, "x", "50");
                            diffAndSetAttribute(text, "y", (-(circleRadius - 50 + length + 10)).toString());
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", "29");
                            diffAndSetAttribute(text, "font-family", "Roboto-Light");
                            diffAndSetAttribute(text, "text-anchor", "middle");
                            diffAndSetAttribute(text, "alignment-baseline", "bottom");
                            diffAndSetAttribute(text, "transform", "rotate(" + degrees + " 50 50)");
                            this.graduations.appendChild(text);
                        }
                        radians += (2 * Math.PI) / dashSpacing;
                    }
                }
            }
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingCircle.setAttribute("id", "RotatingCircle");
            viewBox.appendChild(this.rotatingCircle);
            {
                this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.courseGroup.setAttribute("id", "CourseInfo");
                this.rotatingCircle.appendChild(this.courseGroup);
                {
                    this.course = document.createElementNS(Avionics.SVG.NS, "g");
                    this.course.setAttribute("id", "course");
                    this.courseGroup.appendChild(this.course);
                    {
                        this.courseColor = "";
                        if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                            this.courseColor = "#11d011";
                        }
                        else if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                            this.courseColor = "#ff00ff";
                        }
                        else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                            this.courseColor = "#11d011";
                        }
                        this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseTOBorder = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseTOLine = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                        this.courseFROM = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseFROMBorder = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseFROMLine = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseDeviationGhost = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseTOLineGhost = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseFROMLineGhost = document.createElementNS(Avionics.SVG.NS, "path");

                        if (this.navigationMode === Jet_NDCompass_Navigation.ILS) {
                            this.courseTO.setAttribute("style", "display:none");
                            this.courseTOBorder.setAttribute("style", "display:none");
                            this.courseFROM.setAttribute("style", "display:none");
                            this.courseFROMBorder.setAttribute("style", "display:none");
                        }

                        this.courseDeviation.setAttribute("x", "47");
                        this.courseDeviation.setAttribute("y", "-116");
                        this.courseDeviation.setAttribute("width", "6");
                        this.courseDeviation.setAttribute("height", "334");
                        this.courseDeviation.setAttribute("fill", this.courseColor.toString());
                        this.course.appendChild(this.courseDeviation);

                        this.courseTOBorder.setAttribute("d", "M 35.5 150 l 28 0 l -14 28 l -14 -28 Z");
                        this.courseTOBorder.setAttribute("transform", "rotate(180 50 50)");
                        this.courseTOBorder.setAttribute("stroke", "black");
                        this.courseTOBorder.setAttribute("stroke-width", "11");
                        this.courseTOBorder.setAttribute("fill", "none");
                        this.courseTOBorder.setAttribute("stroke-linejoin", "round");
                        this.course.appendChild(this.courseTOBorder);

                        this.courseTO.setAttribute("d", "M 35.5 150 l 28 0 l -14 28 l -14 -28 Z");
                        this.courseTO.setAttribute("transform", "rotate(180 50 50)");
                        this.courseTO.setAttribute("stroke", this.courseColor.toString());
                        this.courseTO.setAttribute("stroke-width", "6");
                        this.courseTO.setAttribute("fill", "none");
                        this.courseTO.setAttribute("stroke-linejoin", "round");
                        this.course.appendChild(this.courseTO);

                        this.courseTOLine.setAttribute("d", "M 50 342 l -11 0 l 11 52 l 11 -52 l -11 0 l 0 -118 Z");
                        this.courseTOLine.setAttribute("transform", "rotate(180 50 50)");
                        this.courseTOLine.setAttribute("stroke", this.courseColor.toString());
                        this.courseTOLine.setAttribute("stroke-width", "6");
                        this.courseTOLine.setAttribute("fill", "none");
                        this.courseTOLine.setAttribute("stroke-linejoin", "round");
                        this.course.appendChild(this.courseTOLine);

                        this.courseFROMBorder.setAttribute("d", "M35.5 -80 l 28 0 l -14 28 l -14 -28 Z");
                        this.courseFROMBorder.setAttribute("transform", "rotate(180 50 50)");
                        this.courseFROMBorder.setAttribute("stroke", "black");
                        this.courseFROMBorder.setAttribute("stroke-width", "11");
                        this.courseFROMBorder.setAttribute("fill", "none");
                        this.courseFROMBorder.setAttribute("stroke-linejoin", "round");
                        this.course.appendChild(this.courseFROMBorder);

                        this.courseFROM.setAttribute("d", "M35.5 -80 l 28 0 l -14 28 l -14 -28 Z");
                        this.courseFROM.setAttribute("transform", "rotate(180 50 50)");
                        this.courseFROM.setAttribute("stroke", this.courseColor.toString());
                        this.courseFROM.setAttribute("stroke-width", "6");
                        this.courseFROM.setAttribute("fill", "none");
                        this.courseFROM.setAttribute("stroke-linejoin", "round");
                        this.course.appendChild(this.courseFROM);

                        this.courseFROMLine.setAttribute("d", "M50 -123 l0 -178 Z");
                        this.courseFROMLine.setAttribute("fill", "none");
                        this.courseFROMLine.setAttribute("transform", "rotate(180 50 50)");
                        this.courseFROMLine.setAttribute("stroke", this.courseColor.toString());
                        this.courseFROMLine.setAttribute("stroke-width", "6");
                        this.course.appendChild(this.courseFROMLine);

                        let circlePosition = [-100, -50, 50, 100];
                        for (let i = 0; i < circlePosition.length; i++) {
                            let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                            diffAndSetAttribute(CDICircle, "cx", (50 + circlePosition[i]).toString());
                            diffAndSetAttribute(CDICircle, "cy", "50");
                            diffAndSetAttribute(CDICircle, "r", "5");
                            diffAndSetAttribute(CDICircle, "fill", "none");
                            diffAndSetAttribute(CDICircle, "stroke", "white");
                            diffAndSetAttribute(CDICircle, "stroke-width", "2");
                            this.course.appendChild(CDICircle);
                        }
                    }
                }

                this.ghostNeedleGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ghostNeedleGroup.setAttribute("id", "ghostNeedleGroup");
                {
                    this.courseDeviationGhost = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseDeviationGhost.setAttribute("d", "M 38 -116 l 0 5 m 0 10 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 10 l 0 5  M 63 -116 l 0 5 m 0 10 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 10 l 0 5 Z");
                    this.courseDeviationGhost.setAttribute("transform", "rotate(180 50 50)");
                    this.courseDeviationGhost.setAttribute("stroke", "cyan");
                    this.courseDeviationGhost.setAttribute("stroke-width", "3");
                    this.ghostNeedleGroup.appendChild(this.courseDeviationGhost);

                    this.courseTOLineGhost = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseTOLineGhost.setAttribute("d", "M 37.5 224 l 0 5 m 0 10 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 10 l 0 8 l -5 0 l 17.5 53 l 18.5 -53 l -5 0 l 0 -8 m 0 -10 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -10 l 0 -5 M 37.5 341 l 26 0 Z");
                    this.courseTOLineGhost.setAttribute("transform", "rotate(180 50 50)");
                    this.courseTOLineGhost.setAttribute("stroke", "cyan");
                    this.courseTOLineGhost.setAttribute("fill", "none");
                    this.courseTOLineGhost.setAttribute("stroke-width", "3");
                    this.ghostNeedleGroup.appendChild(this.courseTOLineGhost);

                    this.courseFROMLineGhost = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseFROMLineGhost.setAttribute("d", "M 38 -123 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -10 M 63 -123 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -10 Z");
                    this.courseFROMLineGhost.setAttribute("transform", "rotate(180 50 50)");
                    this.courseFROMLineGhost.setAttribute("stroke", "cyan");
                    this.courseFROMLineGhost.setAttribute("fill", "none");
                    this.courseFROMLineGhost.setAttribute("stroke-width", "3");
                    this.ghostNeedleGroup.appendChild(this.courseFROMLineGhost);

                    this.rotatingCircle.appendChild(this.ghostNeedleGroup);
                }

                if (this._displayMode === Jet_NDCompass_Display.PPOS) { //Removes the course needles on PPOS formats
                    this.courseGroup.setAttribute("style", "display:none");
                    this.ghostNeedleGroup.setAttribute("style", "display:none");
                }

                this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.headingGroup.setAttribute("id", "headingGroup");
                {
                }
                this.rotatingCircle.appendChild(this.headingGroup);
                this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedHeadingGroup.setAttribute("id", "selectedHeadingGroup");
                {
                    this.selectedHeadingLine = Avionics.SVG.computeDashLine(50, 50, circleRadius, 15, 3, "#00F2FF");
                    this.selectedHeadingLine.setAttribute("id", "selectedHeadingLine");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                    this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedHeadingBug.setAttribute("id", "selectedHeadingBug");
                    this.selectedHeadingBug.setAttribute("d", "M 50.5 400 h 21 v 19 h -13 l -8 -9 m -3 -10 l 0 10 l -8 9 h -13 v -19 z");
                    this.selectedHeadingBug.setAttribute("fill", "#00F2FF");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
                }
                this.rotatingCircle.appendChild(this.selectedHeadingGroup);

                this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.trackingGroup.setAttribute("id", "trackingGroup");
                {
                    let rad = 7;
                    this.trackingBug = document.createElementNS(Avionics.SVG.NS, "circle");
                    this.trackingBug.setAttribute("id", "trackingBug");
                    this.trackingBug.setAttribute("cx", "50");
                    this.trackingBug.setAttribute("cy", (50 + circleRadius + (rad * 1.2)).toString());
                    this.trackingBug.setAttribute("r", rad.toString());
                    this.trackingBug.setAttribute("fill", "black");
                    this.trackingBug.setAttribute("stroke", "#ff00e0");
                    this.trackingBug.setAttribute("stroke-width", "4");
                    this.trackingGroup.appendChild(this.trackingBug);
                }
                this.rotatingCircle.appendChild(this.trackingGroup);

                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ilsGroup.setAttribute("id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M50 " + (50 + circleRadius) + " l0 40 M35 " + (50 + circleRadius + 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "red");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    diffAndSetAttribute(ilsBug, "style", "display:none");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }

            if (this._displayMode !== Jet_NDCompass_Display.PPOS) {
                let airplaneSymbolGroup = document.createElementNS(Avionics.SVG.NS, "g");
                let airplaneStick = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(airplaneStick, "transform", "translate(50 88)");
                diffAndSetAttribute(airplaneStick, "d", "M 0 0 l 0 38 M 0 32 l 11 2 M 0 32 l -11 2 M 0 12 l 19 8 M 0 12 l -19 8");
                diffAndSetAttribute(airplaneStick, "stroke", "white");
                diffAndSetAttribute(airplaneStick, "stroke-width", "2.5");
                airplaneSymbolGroup.appendChild(airplaneStick);
                this.root.appendChild(airplaneSymbolGroup);
            }
            {
                this.noFplnGroup = document.createElementNS(Avionics.SVG.NS, "g");
                let noFpln = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(noFpln, "NO FLIGHT PLAN");
                diffAndSetAttribute(noFpln, "x", "50");
                diffAndSetAttribute(noFpln, "y", "75");
                diffAndSetAttribute(noFpln, "fill", "white");
                diffAndSetAttribute(noFpln, "font-size", "20");
                diffAndSetAttribute(noFpln, "font-family", "Roboto-Bold");
                diffAndSetAttribute(noFpln, "text-anchor", "middle");
                diffAndSetAttribute(noFpln, "alignment-baseline", "central");
                this.noFplnGroup.appendChild(noFpln);
                this.noFplnGroup.setAttribute("visibility", "hidden");
                this.root.appendChild(this.noFplnGroup);
            }
            {
                this.discoFplnGroup = document.createElementNS(Avionics.SVG.NS, "g");
                let discoFpln = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(discoFpln, "DISCONTINUITY");
                diffAndSetAttribute(discoFpln, "x", "50");
                diffAndSetAttribute(discoFpln, "y", "55");
                diffAndSetAttribute(discoFpln, "fill", "white");
                diffAndSetAttribute(discoFpln, "font-size", "20");
                diffAndSetAttribute(discoFpln, "font-family", "Roboto-Bold");
                diffAndSetAttribute(discoFpln, "text-anchor", "middle");
                diffAndSetAttribute(discoFpln, "alignment-baseline", "central");
                this.discoFplnGroup.appendChild(discoFpln);
                this.discoFplnGroup.setAttribute("visibility", "hidden");
                this.root.appendChild(this.discoFplnGroup);
            }

            this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.currentRefGroup.setAttribute("id", "currentRefGroup");
            {
                let centerX = 50;
                let centerY = -340;
                let rectWidth = 65;
                let rectHeight = 40;
                let rectArrowFactor = 0.35;
                let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5).toString());
                diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5).toString());
                diffAndSetAttribute(rect, "width", rectWidth.toString());
                diffAndSetAttribute(rect, "height", rectHeight.toString());
                diffAndSetAttribute(rect, "fill", "black");
                this.currentRefGroup.appendChild(rect);
                let d = "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5));
                d += " l0 " + rectHeight;
                d += " l" + (rectWidth * rectArrowFactor) + " 0";
                d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " 9";
                d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " -9";
                d += " l" + (rectWidth * rectArrowFactor) + " 0";
                d += " l0 " + (-rectHeight);
                let path = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(path, "d", d);
                diffAndSetAttribute(path, "fill", "black");
                diffAndSetAttribute(path, "stroke", "white");
                diffAndSetAttribute(path, "stroke-width", "2");
                this.currentRefGroup.appendChild(path);
                this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                this.currentRefValue.textContent = "";
                this.currentRefValue.setAttribute("x", centerX.toString());
                this.currentRefValue.setAttribute("y", centerY.toString());
                this.currentRefValue.setAttribute("fill", "green");
                this.currentRefValue.setAttribute("font-size", "28");
                this.currentRefValue.setAttribute("font-family", "Roboto-Bold");
                this.currentRefValue.setAttribute("text-anchor", "middle");
                this.currentRefValue.setAttribute("alignment-baseline", "central");
                this.currentRefGroup.appendChild(this.currentRefValue);
            }
            viewBox.appendChild(this.currentRefGroup);
            this.selectedRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.selectedRefGroup.setAttribute("id", "selectedRefGroup_arc");
            {
                let centerX = -150;
                let centerY = -340;
                let spaceX = 5;
                this.selectedRefMode = document.createElementNS(Avionics.SVG.NS, "text");
                this.selectedRefMode.textContent = "HDG";
                this.selectedRefMode.setAttribute("x", (centerX - spaceX).toString());
                this.selectedRefMode.setAttribute("y", centerY.toString());
                this.selectedRefMode.setAttribute("fill", "#00F2FF");
                this.selectedRefMode.setAttribute("font-size", "26");
                this.selectedRefMode.setAttribute("font-family", "Roboto-Bold");
                this.selectedRefMode.setAttribute("text-anchor", "end");
                this.selectedRefMode.setAttribute("alignment-baseline", "central");
                this.selectedRefGroup.appendChild(this.selectedRefMode);
                this.selectedRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                this.selectedRefValue.textContent = "";
                this.selectedRefValue.setAttribute("x", (centerX + spaceX).toString());
                this.selectedRefValue.setAttribute("y", centerY.toString());
                this.selectedRefValue.setAttribute("fill", "#00F2FF");
                this.selectedRefValue.setAttribute("font-size", "36");
                this.selectedRefValue.setAttribute("font-family", "Roboto-Bold");
                this.selectedRefValue.setAttribute("text-anchor", "start");
                this.selectedRefValue.setAttribute("alignment-baseline", "central");
                this.selectedRefGroup.appendChild(this.selectedRefValue);
            }
            viewBox.appendChild(this.selectedRefGroup);
        }
    }
    constructArc_A320_Neo() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "-225 -215 550 516");
        this.appendChild(this.root);
        var trsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(trsGroup, "transform", "translate(0, 200)");
        this.root.appendChild(trsGroup);
        {
            let viewBox = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(viewBox, "x", "-225");
            diffAndSetAttribute(viewBox, "y", "-475");
            diffAndSetAttribute(viewBox, "viewBox", "-225 -550 550 600");
            trsGroup.appendChild(viewBox);
            var circleRadius = 425;
            var dashSpacing = 72;
            var maskHeight = 200;
            this.arcMaskGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.arcMaskGroup.setAttribute("id", "MaskGroup");
            viewBox.appendChild(this.arcMaskGroup);
            {
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topMask, "d", "M0 " + -maskHeight + ", L" + circleRadius * 2 + " " + -maskHeight + ", L" + circleRadius * 2 + " " + circleRadius + ", A 25 25 0 1 0 0, " + circleRadius + "Z");
                diffAndSetAttribute(topMask, "transform", "translate(" + (50 - circleRadius) + ", " + (50 - circleRadius) + ")");
                diffAndSetAttribute(topMask, "fill", "black");
                this.arcMaskGroup.appendChild(topMask);
            }
            this.arcRangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.arcRangeGroup.setAttribute("id", "ArcRangeGroup");
            viewBox.appendChild(this.arcRangeGroup);
            {
                let rads = [0.25, 0.50, 0.75];
                let cone = [Math.PI, 0.92 * Math.PI, 0.88 * Math.PI];
                let count = [10, 22, 34];
                let width = 14;
                for (let r = 0; r < rads.length; r++) {
                    let rad = circleRadius * rads[r];
                    let radians = (Math.PI - cone[r]) * 0.5;
                    for (let i = 0; i <= count[r]; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "rect");
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x", "50");
                        diffAndSetAttribute(line, "y", (50 + rad).toString());
                        diffAndSetAttribute(line, "width", width.toString());
                        diffAndSetAttribute(line, "height", "2");
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees - 90) + " 50 50)");
                        diffAndSetAttribute(line, "fill", "white");
                        this.arcRangeGroup.appendChild(line);
                        radians += cone[r] / (count[r] + 0.5);
                    }
                    let vec = new Vec2(1, 0.6);
                    vec.SetNorm(rad - 25);
                    this.addMapRange(this.arcRangeGroup, 50 + vec.x, 50 - vec.y, "#00F2FF", "18", false, rads[r], true);
                    this.addMapRange(this.arcRangeGroup, 50 - vec.x, 50 - vec.y, "#00F2FF", "18", false, rads[r], true);
                }
                let vec = new Vec2(1, 0.6);
                vec.SetNorm(circleRadius - 25);
                this.addMapRange(this.arcRangeGroup, 50 + vec.x, 50 - vec.y, "#00F2FF", "18", false, 1.0, true);
                this.addMapRange(this.arcRangeGroup, 50 - vec.x, 50 - vec.y, "#00F2FF", "18", false, 1.0, true);
            }
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingCircle.setAttribute("id", "RotatingCircle");
            viewBox.appendChild(this.rotatingCircle);
            {
                let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(circle, "cx", "50");
                diffAndSetAttribute(circle, "cy", "50");
                diffAndSetAttribute(circle, "r", circleRadius.toString());
                diffAndSetAttribute(circle, "fill-opacity", "0");
                diffAndSetAttribute(circle, "stroke", "white");
                diffAndSetAttribute(circle, "stroke-width", "2");
                this.rotatingCircle.appendChild(circle);
                let graduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(graduationGroup, "id", "graduationGroup");
                {
                    let radians = 0;
                    for (let i = 0; i < dashSpacing; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        let bIsBig = (i % 2 == 0) ? true : false;
                        let length = (bIsBig) ? 16 : 8.5;
                        let lineStart = 50 + circleRadius;
                        let lineEnd = 50 + circleRadius + length;
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x1", "50");
                        diffAndSetAttribute(line, "y1", lineStart.toString());
                        diffAndSetAttribute(line, "x2", "50");
                        diffAndSetAttribute(line, "y2", lineEnd.toString());
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                        diffAndSetAttribute(line, "stroke", "white");
                        diffAndSetAttribute(line, "stroke-width", "3");
                        if (bIsBig) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(text, fastToFixed(degrees / 10, 0));
                            diffAndSetAttribute(text, "x", "50");
                            diffAndSetAttribute(text, "y", (-(circleRadius - 50 + length + 10)).toString());
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", (i % 3 == 0) ? "28" : "20");
                            diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(text, "text-anchor", "middle");
                            diffAndSetAttribute(text, "alignment-baseline", "bottom");
                            diffAndSetAttribute(text, "transform", "rotate(" + degrees + " 50 50)");
                            graduationGroup.appendChild(text);
                        }
                        radians += (2 * Math.PI) / dashSpacing;
                        graduationGroup.appendChild(line);
                    }
                }
                this.rotatingCircle.appendChild(graduationGroup);
                this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.trackingGroup.setAttribute("id", "trackingGroup");
                {
                    var halfw = 7;
                    var halfh = 10;
                    this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                    this.trackingLine.setAttribute("id", "trackingLine");
                    this.trackingLine.setAttribute("d", "M50 50 v " + (circleRadius - halfh * 2));
                    this.trackingLine.setAttribute("fill", "transparent");
                    this.trackingLine.setAttribute("stroke", "#00FF21");
                    this.trackingLine.setAttribute("stroke-width", "3");
                    this.trackingGroup.appendChild(this.trackingLine);
                    var p1 = (50) + ", " + (50 + circleRadius);
                    var p2 = (50 + halfw) + ", " + (50 + circleRadius - halfh);
                    var p3 = (50) + ", " + (50 + circleRadius - halfh * 2);
                    var p4 = (50 - halfw) + ", " + (50 + circleRadius - halfh);
                    this.trackingBug = document.createElementNS(Avionics.SVG.NS, "polygon");
                    this.trackingBug.setAttribute("id", "trackingBug");
                    this.trackingBug.setAttribute("points", p1 + " " + p2 + " " + p3 + " " + p4);
                    this.trackingBug.setAttribute("stroke", "#00FF21");
                    this.trackingBug.setAttribute("stroke-width", "2");
                    this.trackingGroup.appendChild(this.trackingBug);
                }
                this.rotatingCircle.appendChild(this.trackingGroup);
                this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.headingGroup.setAttribute("id", "headingGroup");
                {
                    this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.headingBug.setAttribute("id", "headingBug");
                    this.headingBug.setAttribute("d", "M50 " + (50 + circleRadius) + " l -11 20 l 22 0 z");
                    this.headingBug.setAttribute("stroke", "white");
                    this.headingBug.setAttribute("stroke-width", "2");
                    this.headingGroup.appendChild(this.headingBug);
                }
                this.rotatingCircle.appendChild(this.headingGroup);
                this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedHeadingGroup.setAttribute("id", "selectedHeadingGroup");
                {
                    this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedHeadingBug.setAttribute("id", "selectedHeadingBug");
                    this.selectedHeadingBug.setAttribute("d", "M50 " + (50 + circleRadius) + " l -11 20 l 22 0 z");
                    this.selectedHeadingBug.setAttribute("stroke", "#00F2FF");
                    this.selectedHeadingBug.setAttribute("stroke-width", "2");
                    this.selectedHeadingBug.setAttribute("fill", "none");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
                }
                this.rotatingCircle.appendChild(this.selectedHeadingGroup);
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ilsGroup.setAttribute("id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M50 " + (50 + circleRadius) + " l0 40 M35 " + (50 + circleRadius + 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            {
                let lineStart = 50 - circleRadius - 18;
                let lineEnd = 50 - circleRadius + 18;
                let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
                diffAndSetAttribute(neutralLine, "id", "NeutralLine");
                diffAndSetAttribute(neutralLine, "x1", "50");
                diffAndSetAttribute(neutralLine, "y1", lineStart.toString());
                diffAndSetAttribute(neutralLine, "x2", "50");
                diffAndSetAttribute(neutralLine, "y2", lineEnd.toString());
                diffAndSetAttribute(neutralLine, "stroke", "yellow");
                diffAndSetAttribute(neutralLine, "stroke-width", "4");
                viewBox.appendChild(neutralLine);
            }
        }
    }
    constructArc_B747_8() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "-225 -215 550 516");
        this.appendChild(this.root);
        var trsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(trsGroup, "transform", "translate(-266, -208) scale(1.15)");
        this.root.appendChild(trsGroup);
        {
            let viewBox = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(viewBox, "viewBox", "-250 -475 600 700");
            trsGroup.appendChild(viewBox);
            var circleRadius = 450;
            var dashSpacing = 72;
            var maskHeight = 200;
            this.arcMaskGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.arcMaskGroup.setAttribute("id", "MaskGroup");
            viewBox.appendChild(this.arcMaskGroup);
            {
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topMask, "d", "M0 " + -maskHeight + ", L" + circleRadius * 2 + " " + -maskHeight + ", L" + circleRadius * 2 + " " + circleRadius + ", A 25 25 0 1 0 0, " + circleRadius + "Z");
                diffAndSetAttribute(topMask, "transform", "translate(" + (50 - circleRadius) + ", " + (50 - circleRadius) + ")");
                diffAndSetAttribute(topMask, "fill", "black");
                this.arcMaskGroup.appendChild(topMask);
            }
            this.arcRangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.arcRangeGroup.setAttribute("id", "ArcRangeGroup");
            viewBox.appendChild(this.arcRangeGroup);
            {
                let rads = [0.25, 0.50, 0.75];
                for (let r = 0; r < rads.length; r++) {
                    let rad = circleRadius * rads[r];
                    let path = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(path, "d", "M" + (50 - rad) + ",50 a1,1 0 0 1 " + (rad * 2) + ",0");
                    diffAndSetAttribute(path, "fill", "none");
                    diffAndSetAttribute(path, "stroke", "white");
                    diffAndSetAttribute(path, "stroke-width", "2");
                    this.arcRangeGroup.appendChild(path);
                }
            }
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingCircle.setAttribute("id", "RotatingCircle");
            viewBox.appendChild(this.rotatingCircle);
            {
                let circleGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(circleGroup, "id", "circleGroup");
                {
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", "50");
                    diffAndSetAttribute(circle, "cy", "50");
                    diffAndSetAttribute(circle, "r", circleRadius.toString());
                    diffAndSetAttribute(circle, "fill-opacity", "0");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    circleGroup.appendChild(circle);
                    let radians = 0;
                    for (let i = 0; i < dashSpacing; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        let bIsBig = (i % 2 == 0) ? true : false;
                        let length = (bIsBig) ? 16 : 8.5;
                        let lineStart = 50 + circleRadius;
                        let lineEnd = lineStart - length;
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x1", "50");
                        diffAndSetAttribute(line, "y1", lineStart.toString());
                        diffAndSetAttribute(line, "x2", "50");
                        diffAndSetAttribute(line, "y2", lineEnd.toString());
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                        diffAndSetAttribute(line, "stroke", "white");
                        diffAndSetAttribute(line, "stroke-width", "3");
                        if (bIsBig) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(text, (i % 3 == 0) ? fastToFixed(degrees / 10, 0) : "");
                            diffAndSetAttribute(text, "x", "50");
                            diffAndSetAttribute(text, "y", (-(circleRadius - 50 - length - 18)).toString());
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", (i % 3 == 0) ? "28" : "20");
                            diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(text, "text-anchor", "middle");
                            diffAndSetAttribute(text, "alignment-baseline", "central");
                            diffAndSetAttribute(text, "transform", "rotate(" + degrees + " 50 50)");
                            circleGroup.appendChild(text);
                        }
                        radians += (2 * Math.PI) / dashSpacing;
                        circleGroup.appendChild(line);
                    }
                }
                this.rotatingCircle.appendChild(circleGroup);
                this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.trackingGroup.setAttribute("id", "trackingGroup");
                {
                    this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                    this.trackingLine.setAttribute("id", "trackingLine");
                    this.trackingLine.setAttribute("d", "M50 70 v " + (circleRadius - 20));
                    this.trackingLine.setAttribute("fill", "transparent");
                    this.trackingLine.setAttribute("stroke", "white");
                    this.trackingLine.setAttribute("stroke-width", "3");
                    this.trackingGroup.appendChild(this.trackingLine);
                }
                this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.headingGroup.setAttribute("id", "headingGroup");
                {
                    this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.headingBug.setAttribute("id", "headingBug");
                    this.headingBug.setAttribute("d", "M50 " + (50 + circleRadius) + " l -11 20 l 22 0 z");
                    this.headingBug.setAttribute("fill", "none");
                    this.headingBug.setAttribute("stroke", "white");
                    this.headingGroup.appendChild(this.headingBug);
                }
                this.rotatingCircle.appendChild(this.headingGroup);
                this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.courseGroup.setAttribute("id", "CourseInfo");
                this.rotatingCircle.appendChild(this.courseGroup);
                {
                    this.course = document.createElementNS(Avionics.SVG.NS, "g");
                    this.course.setAttribute("id", "course");
                    this.courseGroup.appendChild(this.course);
                    {
                        this.courseColor = "";
                        if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                            this.courseColor = "#ff00ff";
                        }
                        else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                            this.courseColor = "#00ffff";
                        }
                        this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseTO.setAttribute("d", "M46 110 l8 0 l0 25 l-4 5 l-4 -5 l0 -25 Z");
                        this.courseTO.setAttribute("fill", "none");
                        this.courseTO.setAttribute("transform", "rotate(180 50 50)");
                        this.courseTO.setAttribute("stroke", this.courseColor.toString());
                        this.courseTO.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseTO);
                        this.courseTOLine = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseTOLine.setAttribute("d", "M50 140 l0 " + (circleRadius - 90) + " Z");
                        this.courseTOLine.setAttribute("transform", "rotate(180 50 50)");
                        this.courseTOLine.setAttribute("stroke", this.courseColor.toString());
                        this.courseTOLine.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseTOLine);
                        this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                        this.courseDeviation.setAttribute("x", "45");
                        this.courseDeviation.setAttribute("y", "-10");
                        this.courseDeviation.setAttribute("width", "10");
                        this.courseDeviation.setAttribute("height", "125");
                        this.courseDeviation.setAttribute("fill", this.courseColor.toString());
                        this.course.appendChild(this.courseDeviation);
                        this.courseFROM = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseFROM.setAttribute("d", "M46 -15 l8 0 l0 -20 l-8 0 l0 20 Z");
                        this.courseFROM.setAttribute("fill", "none");
                        this.courseFROM.setAttribute("transform", "rotate(180 50 50)");
                        this.courseFROM.setAttribute("stroke", this.courseColor.toString());
                        this.courseFROM.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseFROM);
                        this.courseFROMLine = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseFROMLine.setAttribute("d", "M50 -35 l0 " + (-circleRadius + 85) + " Z");
                        this.courseFROMLine.setAttribute("fill", "none");
                        this.courseFROMLine.setAttribute("transform", "rotate(180 50 50)");
                        this.courseFROMLine.setAttribute("stroke", this.courseColor.toString());
                        this.courseFROMLine.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseFROMLine);
                        let circlePosition = [-80, -40, 40, 80];
                        for (let i = 0; i < circlePosition.length; i++) {
                            let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                            diffAndSetAttribute(CDICircle, "cx", (50 + circlePosition[i]).toString());
                            diffAndSetAttribute(CDICircle, "cy", "50");
                            diffAndSetAttribute(CDICircle, "r", "5");
                            diffAndSetAttribute(CDICircle, "fill", "none");
                            diffAndSetAttribute(CDICircle, "stroke", "white");
                            diffAndSetAttribute(CDICircle, "stroke-width", "2");
                            this.course.appendChild(CDICircle);
                        }
                    }
                }
                this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedHeadingGroup.setAttribute("id", "selectedHeadingGroup");
                {
                    this.selectedHeadingLine = Avionics.SVG.computeDashLine(50, 70, (circleRadius - 5), 15, 3, "#ff00e0");
                    this.selectedHeadingLine.setAttribute("id", "selectedHeadingLine");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                    this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedHeadingBug.setAttribute("id", "selectedHeadingBug");
                    this.selectedHeadingBug.setAttribute("d", "M50 " + (50 + circleRadius) + " h 22 v 22 h -7 l -15 -22 l -15 22 h -7 v -22 z");
                    this.selectedHeadingBug.setAttribute("stroke", "#ff00e0");
                    this.selectedHeadingBug.setAttribute("fill", "none");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
                }
                this.rotatingCircle.appendChild(this.selectedHeadingGroup);
                this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedTrackGroup.setAttribute("id", "selectedTrackGroup");
                {
                    this.selectedTrackLine = Avionics.SVG.computeDashLine(50, 70, (circleRadius - 5), 15, 3, "#ff00e0");
                    this.selectedTrackLine.setAttribute("id", "selectedTrackLine");
                    this.selectedTrackGroup.appendChild(this.selectedTrackLine);
                    this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedTrackBug.setAttribute("id", "selectedTrackBug");
                    this.selectedTrackBug.setAttribute("d", "M50 " + (50 + circleRadius) + " h -30 v -15 l 30 -15 l 30 15 v 15 z");
                    this.selectedTrackBug.setAttribute("stroke", "#ff00e0");
                    this.selectedTrackBug.setAttribute("stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ilsGroup.setAttribute("id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M50 " + (50 + circleRadius) + " l0 40 M35 " + (50 + circleRadius + 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            {
                this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.currentRefGroup.setAttribute("id", "currentRefGroup");
                {
                    let centerX = 50;
                    let centerY = -442;
                    let rectWidth = 65;
                    let rectHeight = 40;
                    let textOffset = 5;
                    this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
                    this.currentRefMode.textContent = "HDG";
                    this.currentRefMode.setAttribute("x", (centerX - rectWidth * 0.5 - textOffset).toString());
                    this.currentRefMode.setAttribute("y", centerY.toString());
                    this.currentRefMode.setAttribute("fill", "green");
                    this.currentRefMode.setAttribute("font-size", "23");
                    this.currentRefMode.setAttribute("font-family", "Roboto-Bold");
                    this.currentRefMode.setAttribute("text-anchor", "end");
                    this.currentRefMode.setAttribute("alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefMode);
                    let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5).toString());
                    diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5).toString());
                    diffAndSetAttribute(rect, "width", rectWidth.toString());
                    diffAndSetAttribute(rect, "height", rectHeight.toString());
                    diffAndSetAttribute(rect, "fill", "black");
                    this.currentRefGroup.appendChild(rect);
                    let path = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(path, "d", "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5)) + " l0 " + rectHeight + " l" + rectWidth + " 0 l0 " + (-rectHeight));
                    diffAndSetAttribute(path, "fill", "none");
                    diffAndSetAttribute(path, "stroke", "white");
                    diffAndSetAttribute(path, "stroke-width", "1");
                    this.currentRefGroup.appendChild(path);
                    this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                    this.currentRefValue.textContent = "266";
                    this.currentRefValue.setAttribute("x", centerX.toString());
                    this.currentRefValue.setAttribute("y", centerY.toString());
                    this.currentRefValue.setAttribute("fill", "white");
                    this.currentRefValue.setAttribute("font-size", "28");
                    this.currentRefValue.setAttribute("font-family", "Roboto-Bold");
                    this.currentRefValue.setAttribute("text-anchor", "middle");
                    this.currentRefValue.setAttribute("alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefValue);
                    this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
                    this.currentRefType.textContent = "MAG";
                    this.currentRefType.setAttribute("x", (centerX + rectWidth * 0.5 + textOffset).toString());
                    this.currentRefType.setAttribute("y", centerY.toString());
                    this.currentRefType.setAttribute("fill", "green");
                    this.currentRefType.setAttribute("font-size", "23");
                    this.currentRefType.setAttribute("font-family", "Roboto-Bold");
                    this.currentRefType.setAttribute("text-anchor", "start");
                    this.currentRefType.setAttribute("alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefType);
                }
                viewBox.appendChild(this.currentRefGroup);
                let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
                diffAndSetAttribute(rangeGroup, "transform", "scale(0.8)");
                {
                    let centerX = -95;
                    let centerY = -540;
                    let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(textBg, "x", (centerX - 40).toString());
                    diffAndSetAttribute(textBg, "y", (centerY - 32).toString());
                    diffAndSetAttribute(textBg, "width", "80");
                    diffAndSetAttribute(textBg, "height", "64");
                    diffAndSetAttribute(textBg, "fill", "black");
                    diffAndSetAttribute(textBg, "stroke", "white");
                    diffAndSetAttribute(textBg, "stroke-width", "1");
                    rangeGroup.appendChild(textBg);
                    let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(textTitle, "RANGE");
                    diffAndSetAttribute(textTitle, "x", centerX.toString());
                    diffAndSetAttribute(textTitle, "y", (centerY - 15).toString());
                    diffAndSetAttribute(textTitle, "fill", "white");
                    diffAndSetAttribute(textTitle, "font-size", "25");
                    diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
                    diffAndSetAttribute(textTitle, "text-anchor", "middle");
                    diffAndSetAttribute(textTitle, "alignment-baseline", "central");
                    rangeGroup.appendChild(textTitle);
                    this.addMapRange(rangeGroup, centerX, (centerY + 15), "white", "25", false, 1.0, false);
                }
                viewBox.appendChild(rangeGroup);
            }
        }
    }
    constructArc_AS01B() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 710");
        this.appendChild(this.root);
        var trsGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(trsGroup, "transform", "translate(-45, -100) scale(1.09)");
        this.root.appendChild(trsGroup);
        {
            var circleRadius;
            let viewBox = document.createElementNS(Avionics.SVG.NS, "svg");
            if (this._fullscreen) {
                diffAndSetAttribute(viewBox, "viewBox", "-250 -550 600 650");
                circleRadius = 419;
            }
            else {
                diffAndSetAttribute(viewBox, "viewBox", "-750 -1200 1400 1400");
                circleRadius = 1100;
            }
            trsGroup.appendChild(viewBox);
            this.arcMaskGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.arcMaskGroup.setAttribute("id", "MaskGroup");
            viewBox.appendChild(this.arcMaskGroup);
            {
                var maskMargin = 10;
                var maskHeight = 200;
                let topMask = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(topMask, "id", "MaskGroup");
                diffAndSetAttribute(topMask, "d", "M" + (-maskMargin) + " " + -maskHeight + ", L" + (circleRadius * 2 + maskMargin) + " " + -maskHeight + ", L" + (circleRadius * 2 + maskMargin) + " " + circleRadius + ", L" + (circleRadius * 2) + " " + circleRadius + ", A 25 25 0 1 0 0, " + circleRadius + ", L" + (-maskMargin) + " " + circleRadius + " Z");
                diffAndSetAttribute(topMask, "transform", "translate(" + (50 - circleRadius) + ", " + (50 - circleRadius) + ")");
                diffAndSetAttribute(topMask, "fill", "black");
                this.arcMaskGroup.appendChild(topMask);
            }
            this.arcRangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.arcRangeGroup.setAttribute("id", "ArcRangeGroup");
            viewBox.appendChild(this.arcRangeGroup);
            {
                let rads = [0.25, 0.50, 0.75];
                for (let r = 0; r < rads.length; r++) {
                    let rad = circleRadius * rads[r];
                    let path = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(path, "d", "M" + (50 - rad) + ",50 a1,1 0 0 1 " + (rad * 2) + ",0");
                    diffAndSetAttribute(path, "fill", "none");
                    diffAndSetAttribute(path, "stroke", "white");
                    diffAndSetAttribute(path, "stroke-width", "2");
                    this.arcRangeGroup.appendChild(path);
                }
            }
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingCircle.setAttribute("id", "RotatingCircle");
            viewBox.appendChild(this.rotatingCircle);
            {
                let circleGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(circleGroup, "id", "circleGroup");
                {
                    let circle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(circle, "cx", "50");
                    diffAndSetAttribute(circle, "cy", "50");
                    diffAndSetAttribute(circle, "r", circleRadius.toString());
                    diffAndSetAttribute(circle, "fill-opacity", "0");
                    diffAndSetAttribute(circle, "stroke", "white");
                    diffAndSetAttribute(circle, "stroke-width", "2");
                    circleGroup.appendChild(circle);
                    let radians = 0;
                    let dashSpacing = 72;
                    for (let i = 0; i < dashSpacing; i++) {
                        let line = document.createElementNS(Avionics.SVG.NS, "line");
                        let bIsBig = (i % 2 == 0) ? true : false;
                        let length = (bIsBig) ? 16 : 8.5;
                        let lineStart = 50 + circleRadius;
                        let lineEnd = lineStart - length;
                        let degrees = (radians / Math.PI) * 180;
                        diffAndSetAttribute(line, "x1", "50");
                        diffAndSetAttribute(line, "y1", lineStart.toString());
                        diffAndSetAttribute(line, "x2", "50");
                        diffAndSetAttribute(line, "y2", lineEnd.toString());
                        diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 50 50)");
                        diffAndSetAttribute(line, "stroke", "white");
                        diffAndSetAttribute(line, "stroke-width", "3");
                        if (bIsBig) {
                            let text = document.createElementNS(Avionics.SVG.NS, "text");
                            diffAndSetText(text, (i % 3 == 0) ? fastToFixed(degrees / 10, 0) : "");
                            diffAndSetAttribute(text, "x", "50");
                            diffAndSetAttribute(text, "y", (-(circleRadius - 50 - length - 18)).toString());
                            diffAndSetAttribute(text, "fill", "white");
                            diffAndSetAttribute(text, "font-size", (i % 3 == 0) ? "28" : "20");
                            diffAndSetAttribute(text, "font-family", "Roboto-Bold");
                            diffAndSetAttribute(text, "text-anchor", "middle");
                            diffAndSetAttribute(text, "alignment-baseline", "central");
                            diffAndSetAttribute(text, "transform", "rotate(" + degrees + " 50 50)");
                            circleGroup.appendChild(text);
                        }
                        radians += (2 * Math.PI) / dashSpacing;
                        circleGroup.appendChild(line);
                    }
                }
                this.rotatingCircle.appendChild(circleGroup);
                this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.trackingGroup.setAttribute("id", "trackingGroup");
                {
                    this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                    this.trackingLine.setAttribute("id", "trackingLine");
                    this.trackingLine.setAttribute("d", "M50 70 v " + (circleRadius - 20));
                    this.trackingLine.setAttribute("fill", "transparent");
                    this.trackingLine.setAttribute("stroke", "white");
                    this.trackingLine.setAttribute("stroke-width", "3");
                    this.trackingGroup.appendChild(this.trackingLine);
                }
                this.rotatingCircle.appendChild(this.trackingGroup);
                this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.headingGroup.setAttribute("id", "headingGroup");
                {
                    this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.headingBug.setAttribute("id", "headingBug");
                    this.headingBug.setAttribute("d", "M50 " + (50 + circleRadius) + " l -11 20 l 22 0 z");
                    this.headingBug.setAttribute("fill", "none");
                    this.headingBug.setAttribute("stroke", "white");
                    this.headingGroup.appendChild(this.headingBug);
                }
                this.rotatingCircle.appendChild(this.headingGroup);
                this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.courseGroup.setAttribute("id", "CourseInfo");
                this.rotatingCircle.appendChild(this.courseGroup);
                {
                    let scale;
                    if (this._fullscreen) {
                        scale = 0.8;
                        this.courseGroup.setAttribute("transform", "translate(10 10) scale(0.8)");
                    }
                    else {
                        scale = 1.5;
                        this.courseGroup.setAttribute("transform", "translate(-24 -24) scale(1.5)");
                    }
                    this.course = document.createElementNS(Avionics.SVG.NS, "g");
                    this.course.setAttribute("id", "course");
                    this.courseGroup.appendChild(this.course);
                    {
                        this.courseColor = "";
                        if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                            this.courseColor = "#ff00ff";
                        }
                        else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                            this.courseColor = "#00ffff";
                        }
                        this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseTO.setAttribute("d", "M46 110 l8 0 l0 25 l-4 5 l-4 -5 l0 -25 Z");
                        this.courseTO.setAttribute("fill", "none");
                        this.courseTO.setAttribute("transform", "rotate(180 50 50)");
                        this.courseTO.setAttribute("stroke", this.courseColor.toString());
                        this.courseTO.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseTO);
                        this.courseTOLine = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseTOLine.setAttribute("d", "M50 140 l0 " + ((circleRadius / scale) - 90) + " Z");
                        this.courseTOLine.setAttribute("transform", "rotate(180 50 50)");
                        this.courseTOLine.setAttribute("stroke", this.courseColor.toString());
                        this.courseTOLine.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseTOLine);
                        this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                        this.courseDeviation.setAttribute("x", "45");
                        this.courseDeviation.setAttribute("y", "-10");
                        this.courseDeviation.setAttribute("width", "10");
                        this.courseDeviation.setAttribute("height", "125");
                        this.courseDeviation.setAttribute("fill", this.courseColor.toString());
                        this.course.appendChild(this.courseDeviation);
                        this.courseFROM = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseFROM.setAttribute("d", "M46 -15 l8 0 l0 -20 l-8 0 l0 20 Z");
                        this.courseFROM.setAttribute("fill", "none");
                        this.courseFROM.setAttribute("transform", "rotate(180 50 50)");
                        this.courseFROM.setAttribute("stroke", this.courseColor.toString());
                        this.courseFROM.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseFROM);
                        this.courseFROMLine = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseFROMLine.setAttribute("d", "M50 -35 l0 " + (-(circleRadius / scale) + 85) + " Z");
                        this.courseFROMLine.setAttribute("fill", "none");
                        this.courseFROMLine.setAttribute("transform", "rotate(180 50 50)");
                        this.courseFROMLine.setAttribute("stroke", this.courseColor.toString());
                        this.courseFROMLine.setAttribute("stroke-width", "1");
                        this.course.appendChild(this.courseFROMLine);
                        let circlePosition = [-80, -40, 40, 80];
                        for (let i = 0; i < circlePosition.length; i++) {
                            let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                            diffAndSetAttribute(CDICircle, "cx", (50 + circlePosition[i]).toString());
                            diffAndSetAttribute(CDICircle, "cy", "50");
                            diffAndSetAttribute(CDICircle, "r", "5");
                            diffAndSetAttribute(CDICircle, "fill", "none");
                            diffAndSetAttribute(CDICircle, "stroke", "white");
                            diffAndSetAttribute(CDICircle, "stroke-width", "2");
                            this.course.appendChild(CDICircle);
                        }
                    }
                }
                this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedHeadingGroup.setAttribute("id", "selectedHeadingGroup");
                {
                    this.selectedHeadingLine = Avionics.SVG.computeDashLine(50, 70, (circleRadius - 5), 15, 3, "#ff00e0");
                    this.selectedHeadingLine.setAttribute("id", "selectedHeadingLine");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                    this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedHeadingBug.setAttribute("id", "selectedHeadingBug");
                    this.selectedHeadingBug.setAttribute("d", "M50 " + (50 + circleRadius) + " h 22 v 22 h -7 l -15 -22 l -15 22 h -7 v -22 z");
                    this.selectedHeadingBug.setAttribute("stroke", "#ff00e0");
                    this.selectedHeadingBug.setAttribute("fill", "none");
                    this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
                }
                this.rotatingCircle.appendChild(this.selectedHeadingGroup);
                this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedTrackGroup.setAttribute("id", "selectedTrackGroup");
                {
                    this.selectedTrackLine = Avionics.SVG.computeDashLine(50, 70, (circleRadius - 5), 15, 3, "#ff00e0");
                    this.selectedTrackLine.setAttribute("id", "selectedTrackLine");
                    this.selectedTrackGroup.appendChild(this.selectedTrackLine);
                    this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedTrackBug.setAttribute("id", "selectedTrackBug");
                    this.selectedTrackBug.setAttribute("d", "M50 " + (50 + circleRadius) + " h -30 v -15 l 30 -15 l 30 15 v 15 z");
                    this.selectedTrackBug.setAttribute("stroke", "#ff00e0");
                    this.selectedTrackBug.setAttribute("stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ilsGroup.setAttribute("id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M50 " + (50 + circleRadius) + " l0 40 M35 " + (50 + circleRadius + 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            {
                this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.currentRefGroup.setAttribute("id", "currentRefGroup");
                {
                    if (!this._fullscreen) {
                        this.currentRefGroup.setAttribute("transform", "translate(-10 212) scale(1.2)");
                    }
                    let centerX = 50;
                    let centerY = 50 - circleRadius - 40;
                    let rectWidth = 65;
                    let rectHeight = 40;
                    let textOffset = 5;
                    this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
                    this.currentRefMode.textContent = "HDG";
                    this.currentRefMode.setAttribute("x", (centerX - rectWidth * 0.5 - textOffset).toString());
                    this.currentRefMode.setAttribute("y", centerY.toString());
                    this.currentRefMode.setAttribute("fill", "green");
                    this.currentRefMode.setAttribute("font-size", "23");
                    this.currentRefMode.setAttribute("font-family", "Roboto-Bold");
                    this.currentRefMode.setAttribute("text-anchor", "end");
                    this.currentRefMode.setAttribute("alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefMode);
                    let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5).toString());
                    diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5).toString());
                    diffAndSetAttribute(rect, "width", rectWidth.toString());
                    diffAndSetAttribute(rect, "height", rectHeight.toString());
                    diffAndSetAttribute(rect, "fill", "black");
                    this.currentRefGroup.appendChild(rect);
                    let path = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(path, "d", "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5)) + " l0 " + rectHeight + " l" + rectWidth + " 0 l0 " + (-rectHeight));
                    diffAndSetAttribute(path, "fill", "none");
                    diffAndSetAttribute(path, "stroke", "white");
                    diffAndSetAttribute(path, "stroke-width", "1");
                    this.currentRefGroup.appendChild(path);
                    this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                    this.currentRefValue.textContent = "266";
                    this.currentRefValue.setAttribute("x", centerX.toString());
                    this.currentRefValue.setAttribute("y", centerY.toString());
                    this.currentRefValue.setAttribute("fill", "white");
                    this.currentRefValue.setAttribute("font-size", "28");
                    this.currentRefValue.setAttribute("font-family", "Roboto-Bold");
                    this.currentRefValue.setAttribute("text-anchor", "middle");
                    this.currentRefValue.setAttribute("alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefValue);
                    this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
                    this.currentRefType.textContent = "MAG";
                    this.currentRefType.setAttribute("x", (centerX + rectWidth * 0.5 + textOffset).toString());
                    this.currentRefType.setAttribute("y", centerY.toString());
                    this.currentRefType.setAttribute("fill", "green");
                    this.currentRefType.setAttribute("font-size", "23");
                    this.currentRefType.setAttribute("font-family", "Roboto-Bold");
                    this.currentRefType.setAttribute("text-anchor", "start");
                    this.currentRefType.setAttribute("alignment-baseline", "central");
                    this.currentRefGroup.appendChild(this.currentRefType);
                }
                viewBox.appendChild(this.currentRefGroup);
                let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
                diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
                {
                    let centerX = -185;
                    let centerY = 50 - circleRadius;
                    if (this._fullscreen) {
                        diffAndSetAttribute(rangeGroup, "transform", "scale(0.8)");
                        centerX += 2;
                        centerY -= 141;
                    }
                    else {
                        centerY -= 40;
                    }
                    let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(textBg, "x", (centerX - 40).toString());
                    diffAndSetAttribute(textBg, "y", (centerY - 32).toString());
                    diffAndSetAttribute(textBg, "width", "80");
                    diffAndSetAttribute(textBg, "height", "64");
                    diffAndSetAttribute(textBg, "fill", "black");
                    diffAndSetAttribute(textBg, "stroke", "white");
                    diffAndSetAttribute(textBg, "stroke-width", "2");
                    rangeGroup.appendChild(textBg);
                    let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(textTitle, "RANGE");
                    diffAndSetAttribute(textTitle, "x", centerX.toString());
                    diffAndSetAttribute(textTitle, "y", (centerY - 15).toString());
                    diffAndSetAttribute(textTitle, "fill", "white");
                    diffAndSetAttribute(textTitle, "font-size", "25");
                    diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
                    diffAndSetAttribute(textTitle, "text-anchor", "middle");
                    diffAndSetAttribute(textTitle, "alignment-baseline", "central");
                    rangeGroup.appendChild(textTitle);
                    this.addMapRange(rangeGroup, centerX, (centerY + 15), "white", "25", false, 1.0, false);
                }
                viewBox.appendChild(rangeGroup);
            }
        }
    }
    constructPlan() {
        super.constructPlan();
        if (this.aircraft == Aircraft.B747_8)
            this.constructPlan_B747_8();
        else if (this.aircraft == Aircraft.AS01B)
            this.constructPlan_AS01B();
        else if (this.aircraft == Aircraft.CJ4)
            this.constructPlan_CJ4();
        else
            this.constructPlan_A320_Neo();
    }
    constructPlan_B747_8() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        {
            let circleRadius = 333;
            let outerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(outerCircleGroup);
            {
                let texts = ["N", "E", "S", "W"];
                for (let i = 0; i < 4; i++) {
                    let textGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(textGroup, "transform", "rotate(" + fastToFixed(i * 90, 0) + " 500 500)");
                    {
                        let text = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetText(text, texts[i]);
                        diffAndSetAttribute(text, "x", "500");
                        diffAndSetAttribute(text, "y", "115");
                        diffAndSetAttribute(text, "fill", "white");
                        diffAndSetAttribute(text, "font-size", "50");
                        diffAndSetAttribute(text, "font-family", "Roboto-Light");
                        diffAndSetAttribute(text, "text-anchor", "middle");
                        diffAndSetAttribute(text, "alignment-baseline", "central");
                        diffAndSetAttribute(text, "transform", "rotate(" + -fastToFixed(i * 90, 0) + " 500 115)");
                        textGroup.appendChild(text);
                        outerCircleGroup.appendChild(textGroup);
                    }
                }
                let outerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(outerCircle, "cx", "500");
                diffAndSetAttribute(outerCircle, "cy", "500");
                diffAndSetAttribute(outerCircle, "r", circleRadius.toString());
                diffAndSetAttribute(outerCircle, "fill", "none");
                diffAndSetAttribute(outerCircle, "stroke", "white");
                diffAndSetAttribute(outerCircle, "stroke-width", "4");
                outerCircleGroup.appendChild(outerCircle);
                this.addMapRange(outerCircleGroup, 500, 167, "white", "30", true, 0.5, true);
                this.addMapRange(outerCircleGroup, 500, 833, "white", "30", true, 0.5, true);
            }
            let innerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(innerCircleGroup);
            {
                let innerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(innerCircle, "cx", "500");
                diffAndSetAttribute(innerCircle, "cy", "500");
                diffAndSetAttribute(innerCircle, "r", "166");
                diffAndSetAttribute(innerCircle, "fill", "none");
                diffAndSetAttribute(innerCircle, "stroke", "white");
                diffAndSetAttribute(innerCircle, "stroke-width", "4");
                innerCircleGroup.appendChild(innerCircle);
                this.addMapRange(innerCircleGroup, 500, 334, "white", "30", true, 0.25, true);
                this.addMapRange(innerCircleGroup, 500, 666, "white", "30", true, 0.25, true);
            }
            let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
            diffAndSetAttribute(rangeGroup, "transform", "scale(1.25)");
            {
                let centerX = 245;
                let centerY = 48;
                let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(textBg, "x", (centerX - 40).toString());
                diffAndSetAttribute(textBg, "y", (centerY - 32).toString());
                diffAndSetAttribute(textBg, "width", "80");
                diffAndSetAttribute(textBg, "height", "64");
                diffAndSetAttribute(textBg, "fill", "black");
                diffAndSetAttribute(textBg, "stroke", "white");
                diffAndSetAttribute(textBg, "stroke-width", "1");
                rangeGroup.appendChild(textBg);
                let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(textTitle, "RANGE");
                diffAndSetAttribute(textTitle, "x", centerX.toString());
                diffAndSetAttribute(textTitle, "y", (centerY - 15).toString());
                diffAndSetAttribute(textTitle, "fill", "white");
                diffAndSetAttribute(textTitle, "font-size", "25");
                diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
                diffAndSetAttribute(textTitle, "text-anchor", "middle");
                diffAndSetAttribute(textTitle, "alignment-baseline", "central");
                rangeGroup.appendChild(textTitle);
                this.addMapRange(rangeGroup, centerX, (centerY + 15), "white", "25", false, 1.0, false);
            }
            this.root.appendChild(rangeGroup);
        }
    }
    constructPlan_AS01B() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        {
            let circleRadius = 333;
            let outerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(outerCircleGroup);
            {
                let texts = ["N", "E", "S", "W"];
                for (let i = 0; i < 4; i++) {
                    let textGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(textGroup, "transform", "rotate(" + fastToFixed(i * 90, 0) + " 500 500)");
                    {
                        let text = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetText(text, texts[i]);
                        diffAndSetAttribute(text, "x", "500");
                        diffAndSetAttribute(text, "y", "115");
                        diffAndSetAttribute(text, "fill", "white");
                        diffAndSetAttribute(text, "font-size", "50");
                        diffAndSetAttribute(text, "font-family", "Roboto-Light");
                        diffAndSetAttribute(text, "text-anchor", "middle");
                        diffAndSetAttribute(text, "alignment-baseline", "central");
                        diffAndSetAttribute(text, "transform", "rotate(" + -fastToFixed(i * 90, 0) + " 500 115)");
                        textGroup.appendChild(text);
                        outerCircleGroup.appendChild(textGroup);
                    }
                }
                let outerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(outerCircle, "cx", "500");
                diffAndSetAttribute(outerCircle, "cy", "500");
                diffAndSetAttribute(outerCircle, "r", circleRadius.toString());
                diffAndSetAttribute(outerCircle, "fill", "none");
                diffAndSetAttribute(outerCircle, "stroke", "white");
                diffAndSetAttribute(outerCircle, "stroke-width", "4");
                outerCircleGroup.appendChild(outerCircle);
                this.addMapRange(outerCircleGroup, 500, 167, "white", "30", true, 0.5, true);
                this.addMapRange(outerCircleGroup, 500, 833, "white", "30", true, 0.5, true);
            }
            let innerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(innerCircleGroup);
            {
                let innerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(innerCircle, "cx", "500");
                diffAndSetAttribute(innerCircle, "cy", "500");
                diffAndSetAttribute(innerCircle, "r", "166");
                diffAndSetAttribute(innerCircle, "fill", "none");
                diffAndSetAttribute(innerCircle, "stroke", "white");
                diffAndSetAttribute(innerCircle, "stroke-width", "4");
                innerCircleGroup.appendChild(innerCircle);
                this.addMapRange(innerCircleGroup, 500, 334, "white", "30", true, 0.25, true);
                this.addMapRange(innerCircleGroup, 500, 666, "white", "30", true, 0.25, true);
            }
            let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
            {
                let centerX = 145;
                let centerY = 67;
                if (this._fullscreen) {
                    diffAndSetAttribute(rangeGroup, "transform", "scale(1.27)");
                }
                else {
                    centerX = 266;
                    centerY = 98;
                }
                let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(textBg, "x", (centerX - 40).toString());
                diffAndSetAttribute(textBg, "y", (centerY - 32).toString());
                diffAndSetAttribute(textBg, "width", "80");
                diffAndSetAttribute(textBg, "height", "64");
                diffAndSetAttribute(textBg, "fill", "black");
                diffAndSetAttribute(textBg, "stroke", "white");
                diffAndSetAttribute(textBg, "stroke-width", "2");
                rangeGroup.appendChild(textBg);
                let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(textTitle, "RANGE");
                diffAndSetAttribute(textTitle, "x", (centerX - 0.5).toString());
                diffAndSetAttribute(textTitle, "y", (centerY - 14).toString());
                diffAndSetAttribute(textTitle, "fill", "white");
                diffAndSetAttribute(textTitle, "font-size", "25");
                diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
                diffAndSetAttribute(textTitle, "text-anchor", "middle");
                diffAndSetAttribute(textTitle, "alignment-baseline", "central");
                rangeGroup.appendChild(textTitle);
                this.addMapRange(rangeGroup, (centerX - 0.5), (centerY + 15.5), "white", "25", false, 1.0, false);
            }
            this.root.appendChild(rangeGroup);
        }
    }
    constructPlan_A320_Neo() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        {
            let circleRadius = 333;
            let circleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(circleGroup);
            {
                let texts = ["N", "E", "S", "W"];
                for (let i = 0; i < 4; i++) {
                    let triangle = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(triangle, "fill", "white");
                    diffAndSetAttribute(triangle, "d", "M500 176 L516 199 L484 199 Z");
                    diffAndSetAttribute(triangle, "transform", "rotate(" + fastToFixed(i * 90, 0) + " 500 500)");
                    circleGroup.appendChild(triangle);
                    let textGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    diffAndSetAttribute(textGroup, "transform", "rotate(" + fastToFixed(i * 90, 0) + " 500 500)");
                    {
                        let text = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetText(text, texts[i]);
                        diffAndSetAttribute(text, "x", "500");
                        diffAndSetAttribute(text, "y", "230");
                        diffAndSetAttribute(text, "fill", "white");
                        diffAndSetAttribute(text, "font-size", "50");
                        diffAndSetAttribute(text, "font-family", "Roboto-Light");
                        diffAndSetAttribute(text, "text-anchor", "middle");
                        diffAndSetAttribute(text, "alignment-baseline", "central");
                        diffAndSetAttribute(text, "transform", "rotate(" + -fastToFixed(i * 90, 0) + " 500 230)");
                        textGroup.appendChild(text);
                        circleGroup.appendChild(textGroup);
                    }
                }
                {
                    let innerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(innerCircle, "cx", "500");
                    diffAndSetAttribute(innerCircle, "cy", "500");
                    diffAndSetAttribute(innerCircle, "r", (circleRadius * 0.5).toString());
                    diffAndSetAttribute(innerCircle, "fill", "none");
                    diffAndSetAttribute(innerCircle, "stroke", "white");
                    diffAndSetAttribute(innerCircle, "stroke-width", "4");
                    circleGroup.appendChild(innerCircle);
                    let outerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(outerCircle, "cx", "500");
                    diffAndSetAttribute(outerCircle, "cy", "500");
                    diffAndSetAttribute(outerCircle, "r", circleRadius.toString());
                    diffAndSetAttribute(outerCircle, "fill", "none");
                    diffAndSetAttribute(outerCircle, "stroke", "white");
                    diffAndSetAttribute(outerCircle, "stroke-width", "4");
                    circleGroup.appendChild(outerCircle);
                    let vec = new Vec2(1, 1);
                    vec.SetNorm(333 - 45);
                    this.addMapRange(circleGroup, 500 - vec.x, 500 + vec.y, "#00F2FF", "32", false, 1.0, true);
                }
            }
        }
    }
    constructPlan_CJ4() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 1000");

        let ClipDefs = document.createElementNS(Avionics.SVG.NS, "defs");

        let rangeClip = document.createElementNS(Avionics.SVG.NS, "clipPath");
        diffAndSetAttribute(rangeClip, "id", "rangeClip");
        let rangeClipShape = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(rangeClipShape, "d", "M 155 400 H 255 V 345 H 155 V 50 H 900 V 900 H 155 z");
        rangeClip.appendChild(rangeClipShape);
        ClipDefs.appendChild(rangeClip);

        this.root.appendChild(ClipDefs);

        this.appendChild(this.root);
        {
            let circleRadius = 333;
            let circleGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.root.appendChild(circleGroup);
            {
                let outerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(outerCircle, "cx", "500");
                diffAndSetAttribute(outerCircle, "cy", "500");
                diffAndSetAttribute(outerCircle, "r", circleRadius.toString());
                diffAndSetAttribute(outerCircle, "fill", "none");
                diffAndSetAttribute(outerCircle, "stroke", "#cccac8");
                diffAndSetAttribute(outerCircle, "stroke-width", "4");
                diffAndSetAttribute(outerCircle, "clip-path", "url(#rangeClip)");
                circleGroup.appendChild(outerCircle);

                let vec = new Vec2(1, 0.45);
                vec.SetNorm(circleRadius * 0.87);
                this.addMapRange(circleGroup, 490 - vec.x, 500 - vec.y, "white", "38", false, 1.0, false);

            }

            circleGroup.getElementsByTagName("text")[0].setAttribute("x", 195);
            circleGroup.getElementsByTagName("text")[0].setAttribute("y", 380);
            circleGroup.getElementsByTagName("text")[0].setAttribute("font-size", 40);
            circleGroup.getElementsByTagName("text")[0].setAttribute("text-anchor", "middle");

            {
                let northLbl = document.createElementNS(Avionics.SVG.NS, "text");
                diffAndSetText(northLbl, "N");
                diffAndSetAttribute(northLbl, "x", "500");
                diffAndSetAttribute(northLbl, "y", "155");
                diffAndSetAttribute(northLbl, "fill", "white");
                diffAndSetAttribute(northLbl, "font-size", "34");
                diffAndSetAttribute(northLbl, "font-family", "Roboto-Bold");
                diffAndSetAttribute(northLbl, "text-anchor", "middle");
                diffAndSetAttribute(northLbl, "align", "center");
                this.root.appendChild(northLbl);
            }

            this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.currentRefGroup.setAttribute("id", "currentRefGroup");
            this.currentRefGroup.setAttribute("transform", "scale(1.5)");
            {
                let centerX = 332;
                let centerY = 75;
                let rectWidth = 65;
                let rectHeight = 40;
                let rectArrowFactor = 0.35;
                let rect = document.createElementNS(Avionics.SVG.NS, "rect");
                diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5).toString());
                diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5).toString());
                diffAndSetAttribute(rect, "width", rectWidth.toString());
                diffAndSetAttribute(rect, "height", rectHeight.toString());
                diffAndSetAttribute(rect, "fill", "black");
                this.currentRefGroup.appendChild(rect);
                let d = "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5));
                d += " l0 " + rectHeight;
                d += " l" + (rectWidth * rectArrowFactor) + " 0";
                d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " 9";
                d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " -9";
                d += " l" + (rectWidth * rectArrowFactor) + " 0";
                d += " l0 " + (-rectHeight);
                let path = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(path, "d", d);
                diffAndSetAttribute(path, "fill", "none");
                diffAndSetAttribute(path, "stroke", "white");
                diffAndSetAttribute(path, "stroke-width", "2");
                this.currentRefGroup.appendChild(path);
                this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                this.currentRefValue.textContent = "";
                this.currentRefValue.setAttribute("x", centerX.toString());
                this.currentRefValue.setAttribute("y", centerY.toString());
                this.currentRefValue.setAttribute("fill", "green");
                this.currentRefValue.setAttribute("font-size", "28");
                this.currentRefValue.setAttribute("font-family", "Roboto-Bold");
                this.currentRefValue.setAttribute("text-anchor", "middle");
                this.currentRefValue.setAttribute("alignment-baseline", "central");
                this.currentRefGroup.appendChild(this.currentRefValue);
            }
            this.root.appendChild(this.currentRefGroup);
            this.selectedRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.selectedRefGroup.setAttribute("id", "selectedRefGroup");
            this.selectedRefGroup.setAttribute("transform", "scale(1.5)");
            {
                let centerX = 180;
                let centerY = 62;
                let spaceX = 5;
                this.selectedRefMode = document.createElementNS(Avionics.SVG.NS, "text");
                this.selectedRefMode.textContent = "HDG";
                this.selectedRefMode.setAttribute("x", (centerX - spaceX).toString());
                this.selectedRefMode.setAttribute("y", centerY.toString());
                this.selectedRefMode.setAttribute("fill", "#00F2FF");
                this.selectedRefMode.setAttribute("font-size", "18");
                this.selectedRefMode.setAttribute("font-family", "Roboto-Bold");
                this.selectedRefMode.setAttribute("text-anchor", "end");
                this.selectedRefMode.setAttribute("alignment-baseline", "central");
                this.selectedRefGroup.appendChild(this.selectedRefMode);
                this.selectedRefValue = document.createElementNS(Avionics.SVG.NS, "text");
                this.selectedRefValue.textContent = "";
                this.selectedRefValue.setAttribute("x", (centerX + spaceX).toString());
                this.selectedRefValue.setAttribute("y", centerY.toString());
                this.selectedRefValue.setAttribute("fill", "#00F2FF");
                this.selectedRefValue.setAttribute("font-size", "23");
                this.selectedRefValue.setAttribute("font-family", "Roboto-Bold");
                this.selectedRefValue.setAttribute("text-anchor", "start");
                this.selectedRefValue.setAttribute("alignment-baseline", "central");
                this.selectedRefGroup.appendChild(this.selectedRefValue);
            }
            //this.root.appendChild(this.selectedRefGroup);
        }
    }
    constructRose() {
        super.constructRose();
        if (this.aircraft == Aircraft.CJ4)
            this.constructRose_CJ4();
        else if (this.aircraft == Aircraft.B747_8)
            this.constructRose_B747_8();
        else if (this.aircraft == Aircraft.AS01B)
            this.constructRose_AS01B();
        else
            this.constructRose_A320_Neo();
    }
    constructRose_A320_Neo() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        let circleRadius = 333;
        {
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingCircle.setAttribute("id", "RotatingCircle");
            this.root.appendChild(this.rotatingCircle);
            let outerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(outerGroup, "id", "outerCircle");
            this.rotatingCircle.appendChild(outerGroup);
            {
                for (let i = 0; i < 72; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    let length = i % 2 == 0 ? 26 : 13;
                    diffAndSetAttribute(line, "x", "498");
                    diffAndSetAttribute(line, "y", fastToFixed(833, 0));
                    diffAndSetAttribute(line, "width", "4");
                    diffAndSetAttribute(line, "height", length.toString());
                    diffAndSetAttribute(line, "transform", "rotate(" + fastToFixed(i * 5, 0) + " 500 500)");
                    diffAndSetAttribute(line, "fill", "white");
                    outerGroup.appendChild(line);
                }
                for (let i = 0; i < 36; i += 3) {
                    let text = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(text, fastToFixed(i, 0));
                    diffAndSetAttribute(text, "x", "500");
                    diffAndSetAttribute(text, "y", "115");
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", "40");
                    diffAndSetAttribute(text, "font-family", "Roboto-Light");
                    diffAndSetAttribute(text, "text-anchor", "middle");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    diffAndSetAttribute(text, "transform", "rotate(" + fastToFixed(i * 10, 0) + " 500 500)");
                    outerGroup.appendChild(text);
                }
                let outerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(outerCircle, "cx", "500");
                diffAndSetAttribute(outerCircle, "cy", "500");
                diffAndSetAttribute(outerCircle, "r", circleRadius.toString());
                diffAndSetAttribute(outerCircle, "fill", "none");
                diffAndSetAttribute(outerCircle, "stroke", "white");
                diffAndSetAttribute(outerCircle, "stroke-width", "4");
                outerGroup.appendChild(outerCircle);
                let vec = new Vec2(1, 1);
                vec.SetNorm(circleRadius - 45);
                this.addMapRange(this.root, 500 - vec.x, 500 + vec.y, "#00F2FF", "32", false, 1.0, true);
            }
            let innerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(innerGroup, "id", "innerCircle");
            this.rotatingCircle.appendChild(innerGroup);
            {
                for (let i = 0; i < 8; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(line, "x", "497");
                    diffAndSetAttribute(line, "y", fastToFixed(583, 0));
                    diffAndSetAttribute(line, "width", "6");
                    diffAndSetAttribute(line, "height", "26");
                    diffAndSetAttribute(line, "transform", "rotate(" + fastToFixed(i * 45, 0) + " 500 500)");
                    diffAndSetAttribute(line, "fill", "white");
                    innerGroup.appendChild(line);
                }
                let innerCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                diffAndSetAttribute(innerCircle, "cx", "500");
                diffAndSetAttribute(innerCircle, "cy", "500");
                diffAndSetAttribute(innerCircle, "r", "166");
                diffAndSetAttribute(innerCircle, "fill", "none");
                diffAndSetAttribute(innerCircle, "stroke", "white");
                diffAndSetAttribute(innerCircle, "stroke-width", "4");
                innerGroup.appendChild(innerCircle);
            }
            this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.courseGroup.setAttribute("id", "CourseInfo");
            this.rotatingCircle.appendChild(this.courseGroup);
            {
                this.bearing1 = document.createElementNS(Avionics.SVG.NS, "g");
                this.bearing1.setAttribute("id", "bearing1");
                this.bearing1.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearing1);
                let arrow = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(arrow, "d", "M500 960 L500 800 M500 40 L500 200 M500 80 L570 150 M500 80 L430 150");
                diffAndSetAttribute(arrow, "stroke", "#36c8d2");
                diffAndSetAttribute(arrow, "stroke-width", "10");
                diffAndSetAttribute(arrow, "fill", "none");
                this.bearing1.appendChild(arrow);
                this.bearing2 = document.createElementNS(Avionics.SVG.NS, "g");
                this.bearing2.setAttribute("id", "bearing2");
                this.bearing2.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearing2);
                arrow = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(arrow, "d", "M500 960 L500 920 M470 800 L470 900 Q500 960 530 900 L530 800 M500 40 L500 80 L570 150 M500 80 L430 150 M470 110 L470 200 M530 110 L530 200");
                diffAndSetAttribute(arrow, "stroke", "#36c8d2");
                diffAndSetAttribute(arrow, "stroke-width", "10");
                diffAndSetAttribute(arrow, "fill", "none");
                this.bearing2.appendChild(arrow);
                this.course = document.createElementNS(Avionics.SVG.NS, "g");
                this.course.setAttribute("id", "course");
                this.courseGroup.appendChild(this.course);
                {
                    this.courseColor = "";
                    if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                        this.courseColor = "#ff00ff";
                    }
                    else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                        this.courseColor = "#00ffff";
                    }
                    this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseTO.setAttribute("d", "M497 666 L503 666 L503 696 L523 696 L523 702 L503 702 L503 826 L497 826 L497 702 L477 702 L477 696 L497 696 L497 666 Z");
                    this.courseTO.setAttribute("fill", "none");
                    this.courseTO.setAttribute("transform", "rotate(180 500 500)");
                    this.courseTO.setAttribute("stroke", this.courseColor.toString());
                    this.courseTO.setAttribute("stroke-width", "1");
                    this.course.appendChild(this.courseTO);
                    if (this.navigationMode === Jet_NDCompass_Navigation.ILS) {
                        this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                        this.courseDeviation.setAttribute("x", "495");
                        this.courseDeviation.setAttribute("y", "333");
                        this.courseDeviation.setAttribute("width", "10");
                        this.courseDeviation.setAttribute("height", "333");
                        this.courseDeviation.setAttribute("fill", this.courseColor.toString());
                        this.course.appendChild(this.courseDeviation);
                    }
                    else if (this.navigationMode === Jet_NDCompass_Navigation.VOR) {
                        this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "path");
                        this.courseDeviation.setAttribute("d", "M500 666 L500 333 L470 363 L500 333 L530 363 L500 333 Z");
                        this.courseDeviation.setAttribute("stroke", this.courseColor.toString());
                        this.courseDeviation.setAttribute("stroke-width", "5");
                        this.course.appendChild(this.courseDeviation);
                    }
                    this.courseFROM = document.createElementNS(Avionics.SVG.NS, "rect");
                    this.courseFROM.setAttribute("x", "497");
                    this.courseFROM.setAttribute("y", "166");
                    this.courseFROM.setAttribute("width", "6");
                    this.courseFROM.setAttribute("height", "166");
                    this.courseFROM.setAttribute("fill", "none");
                    this.courseFROM.setAttribute("transform", "rotate(180 500 500)");
                    this.courseFROM.setAttribute("stroke", this.courseColor.toString());
                    this.courseFROM.setAttribute("stroke-width", "1");
                    this.course.appendChild(this.courseFROM);
                    let circlePosition = [-166, -55, 55, 166];
                    for (let i = 0; i < circlePosition.length; i++) {
                        let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                        diffAndSetAttribute(CDICircle, "cx", (500 + circlePosition[i]).toString());
                        diffAndSetAttribute(CDICircle, "cy", "500");
                        diffAndSetAttribute(CDICircle, "r", "10");
                        diffAndSetAttribute(CDICircle, "stroke", "white");
                        diffAndSetAttribute(CDICircle, "stroke-width", "2");
                        this.course.appendChild(CDICircle);
                    }
                }
                this.bearingCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                this.bearingCircle.setAttribute("cx", "500");
                this.bearingCircle.setAttribute("cy", "500");
                this.bearingCircle.setAttribute("r", "30");
                this.bearingCircle.setAttribute("stroke", "white");
                this.bearingCircle.setAttribute("stroke-width", "0.8");
                this.bearingCircle.setAttribute("fill-opacity", "0");
                this.bearingCircle.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearingCircle);
            }
            this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.trackingGroup.setAttribute("id", "trackingGroup");
            {
                var halfw = 13;
                var halfh = 20;
                var p1 = (500) + ", " + (500 - circleRadius);
                var p2 = (500 + halfw) + ", " + (500 - circleRadius + halfh);
                var p3 = (500) + ", " + (500 - circleRadius + halfh * 2);
                var p4 = (500 - halfw) + ", " + (500 - circleRadius + halfh);
                this.trackingBug = document.createElementNS(Avionics.SVG.NS, "polygon");
                this.trackingBug.setAttribute("id", "trackingBug");
                this.trackingBug.setAttribute("points", p1 + " " + p2 + " " + p3 + " " + p4);
                this.trackingBug.setAttribute("stroke", "#00FF21");
                this.trackingBug.setAttribute("stroke-width", "2");
                this.trackingGroup.appendChild(this.trackingBug);
            }
            this.rotatingCircle.appendChild(this.trackingGroup);
            this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.headingGroup.setAttribute("id", "headingGroup");
            {
            }
            this.rotatingCircle.appendChild(this.headingGroup);
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.selectedHeadingGroup.setAttribute("id", "selectedHeadingGroup");
            {
                this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                this.selectedHeadingBug.setAttribute("id", "selectedHeadingBug");
                this.selectedHeadingBug.setAttribute("d", "M500 " + (500 - circleRadius) + " l -11 -25 l 22 0 z");
                this.selectedHeadingBug.setAttribute("stroke", "#00F2FF");
                this.selectedHeadingBug.setAttribute("stroke-width", "2");
                this.selectedHeadingBug.setAttribute("fill", "none");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
            }
            this.rotatingCircle.appendChild(this.selectedHeadingGroup);
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV || this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ilsGroup.setAttribute("id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M500 " + (500 - circleRadius) + " l0 -40 M485 " + (500 - circleRadius - 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedTrackGroup.setAttribute("id", "selectedTrackGroup");
                {
                    this.selectedTrackLine = Avionics.SVG.computeDashLine(500, 500, -circleRadius, 15, 3, "#00F2FF");
                    this.selectedTrackLine.setAttribute("id", "selectedTrackLine");
                    this.selectedTrackGroup.appendChild(this.selectedTrackLine);
                    this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedTrackBug.setAttribute("id", "selectedTrackBug");
                    this.selectedTrackBug.setAttribute("d", "M500 " + (500 - circleRadius) + " h -30 v -15 l 30 -15 l 30 15 v 15 z");
                    this.selectedTrackBug.setAttribute("stroke", "#00F2FF");
                    this.selectedTrackBug.setAttribute("stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
            }
        }
        this.glideSlopeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.glideSlopeGroup.setAttribute("id", "GlideSlopeGroup");
        this.root.appendChild(this.glideSlopeGroup);
        if (this.navigationMode === Jet_NDCompass_Navigation.ILS) {
            for (let i = 0; i < 5; i++) {
                if (i != 2) {
                    let glideSlopeDot = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(glideSlopeDot, "cx", "950");
                    diffAndSetAttribute(glideSlopeDot, "cy", (250 + i * 125).toFixed(0));
                    diffAndSetAttribute(glideSlopeDot, "r", "10");
                    diffAndSetAttribute(glideSlopeDot, "stroke", "white");
                    diffAndSetAttribute(glideSlopeDot, "stroke-width", "2");
                    this.glideSlopeGroup.appendChild(glideSlopeDot);
                }
            }
            let glideSlopeDash = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(glideSlopeDash, "x", "935");
            diffAndSetAttribute(glideSlopeDash, "y", "498");
            diffAndSetAttribute(glideSlopeDash, "width", "30");
            diffAndSetAttribute(glideSlopeDash, "height", "4");
            diffAndSetAttribute(glideSlopeDash, "fill", "yellow");
            this.glideSlopeGroup.appendChild(glideSlopeDash);
            this.glideSlopeCursor = document.createElementNS(Avionics.SVG.NS, "path");
            this.glideSlopeCursor.setAttribute("id", "GlideSlopeCursor");
            this.glideSlopeCursor.setAttribute("transform", "translate(" + 950 + " " + 500 + ")");
            this.glideSlopeCursor.setAttribute("d", "M-15 0 L0 -20 L15 0 M-15 0 L0 20 L15 0");
            this.glideSlopeCursor.setAttribute("stroke", "#ff00ff");
            this.glideSlopeCursor.setAttribute("stroke-width", "2");
            this.glideSlopeCursor.setAttribute("fill", "none");
            this.glideSlopeGroup.appendChild(this.glideSlopeCursor);
        }
        {
            let lineStart = 500 - circleRadius - 22;
            let lineEnd = 500 - circleRadius + 22;
            let neutralLine = document.createElementNS(Avionics.SVG.NS, "line");
            diffAndSetAttribute(neutralLine, "id", "NeutralLine");
            diffAndSetAttribute(neutralLine, "x1", "500");
            diffAndSetAttribute(neutralLine, "y1", lineStart.toString());
            diffAndSetAttribute(neutralLine, "x2", "500");
            diffAndSetAttribute(neutralLine, "y2", lineEnd.toString());
            diffAndSetAttribute(neutralLine, "stroke", "yellow");
            diffAndSetAttribute(neutralLine, "stroke-width", "6");
            this.root.appendChild(neutralLine);
        }
    }
    constructRose_B747_8() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        let circleRadius = 360;
        {
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingCircle.setAttribute("id", "RotatingCircle");
            this.root.appendChild(this.rotatingCircle);
            let outerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(outerGroup, "id", "outerCircle");
            this.rotatingCircle.appendChild(outerGroup);
            {
                for (let i = 0; i < 72; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    let startY = 500 - circleRadius;
                    let length = 30;
                    if (i % 2 != 0) {
                        if (this.navigationMode == Jet_NDCompass_Navigation.NONE || this.navigationMode == Jet_NDCompass_Navigation.NAV)
                            continue;
                        length = 13;
                    }
                    if (i % 9 == 0) {
                        if (this.navigationMode != Jet_NDCompass_Navigation.NONE && this.navigationMode != Jet_NDCompass_Navigation.NAV) {
                            startY -= 30;
                            length += 30;
                        }
                    }
                    diffAndSetAttribute(line, "x", "498");
                    diffAndSetAttribute(line, "y", startY.toString());
                    diffAndSetAttribute(line, "width", "4");
                    diffAndSetAttribute(line, "height", length.toString());
                    diffAndSetAttribute(line, "transform", "rotate(" + fastToFixed(i * 5, 0) + " 500 500)");
                    diffAndSetAttribute(line, "fill", "white");
                    outerGroup.appendChild(line);
                }
                for (let i = 0; i < 36; i += 3) {
                    let text = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(text, fastToFixed(i, 0));
                    diffAndSetAttribute(text, "x", "500");
                    diffAndSetAttribute(text, "y", (500 - circleRadius + 52).toString());
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", "40");
                    diffAndSetAttribute(text, "font-family", "Roboto-Light");
                    diffAndSetAttribute(text, "text-anchor", "middle");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    diffAndSetAttribute(text, "transform", "rotate(" + fastToFixed(i * 10, 0) + " 500 500)");
                    outerGroup.appendChild(text);
                }
            }
            this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.courseGroup.setAttribute("id", "CourseInfo");
            this.rotatingCircle.appendChild(this.courseGroup);
            {
                this.bearing1 = document.createElementNS(Avionics.SVG.NS, "g");
                this.bearing1.setAttribute("id", "bearing1");
                this.bearing1.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearing1);
                let arrow = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(arrow, "d", "M500 960 L500 800 M500 40 L500 200 M500 80 L570 150 M500 80 L430 150");
                diffAndSetAttribute(arrow, "stroke", "#36c8d2");
                diffAndSetAttribute(arrow, "stroke-width", "10");
                diffAndSetAttribute(arrow, "fill", "none");
                this.bearing1.appendChild(arrow);
                this.bearing2 = document.createElementNS(Avionics.SVG.NS, "g");
                this.bearing2.setAttribute("id", "bearing2");
                this.bearing2.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearing2);
                arrow = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(arrow, "d", "M500 960 L500 920 M470 800 L470 900 Q500 960 530 900 L530 800 M500 40 L500 80 L570 150 M500 80 L430 150 M470 110 L470 200 M530 110 L530 200");
                diffAndSetAttribute(arrow, "stroke", "#36c8d2");
                diffAndSetAttribute(arrow, "stroke-width", "10");
                diffAndSetAttribute(arrow, "fill", "none");
                this.bearing2.appendChild(arrow);
                this.course = document.createElementNS(Avionics.SVG.NS, "g");
                this.course.setAttribute("id", "course");
                this.courseGroup.appendChild(this.course);
                {
                    this.courseColor = "";
                    if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                        this.courseColor = "#ff00ff";
                    }
                    else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                        this.courseColor = "#00ffff";
                    }
                    this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseTO.setAttribute("d", "M497 666 L503 666 L503 696 L523 696 L523 702 L503 702 L503 826 L497 826 L497 702 L477 702 L477 696 L497 696 L497 666 Z");
                    this.courseTO.setAttribute("fill", "none");
                    this.courseTO.setAttribute("transform", "rotate(180 500 500)");
                    this.courseTO.setAttribute("stroke", this.courseColor.toString());
                    this.courseTO.setAttribute("stroke-width", "1");
                    this.course.appendChild(this.courseTO);
                    this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                    this.courseDeviation.setAttribute("x", "495");
                    this.courseDeviation.setAttribute("y", "333");
                    this.courseDeviation.setAttribute("width", "10");
                    this.courseDeviation.setAttribute("height", "333");
                    this.courseDeviation.setAttribute("fill", this.courseColor.toString());
                    this.course.appendChild(this.courseDeviation);
                    this.courseFROM = document.createElementNS(Avionics.SVG.NS, "rect");
                    this.courseFROM.setAttribute("x", "497");
                    this.courseFROM.setAttribute("y", "166");
                    this.courseFROM.setAttribute("width", "6");
                    this.courseFROM.setAttribute("height", "166");
                    this.courseFROM.setAttribute("fill", "none");
                    this.courseFROM.setAttribute("transform", "rotate(180 500 500)");
                    this.courseFROM.setAttribute("stroke", this.courseColor.toString());
                    this.courseFROM.setAttribute("stroke-width", "1");
                    this.course.appendChild(this.courseFROM);
                    let circlePosition = [-166, -55, 55, 166];
                    for (let i = 0; i < circlePosition.length; i++) {
                        let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                        diffAndSetAttribute(CDICircle, "cx", (500 + circlePosition[i]).toString());
                        diffAndSetAttribute(CDICircle, "cy", "500");
                        diffAndSetAttribute(CDICircle, "r", "10");
                        diffAndSetAttribute(CDICircle, "stroke", "white");
                        diffAndSetAttribute(CDICircle, "stroke-width", "2");
                        this.course.appendChild(CDICircle);
                    }
                }
                this.bearingCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                this.bearingCircle.setAttribute("cx", "500");
                this.bearingCircle.setAttribute("cy", "500");
                this.bearingCircle.setAttribute("r", "30");
                this.bearingCircle.setAttribute("stroke", "white");
                this.bearingCircle.setAttribute("stroke-width", "0.8");
                this.bearingCircle.setAttribute("fill-opacity", "0");
                this.bearingCircle.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearingCircle);
            }
            this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.headingGroup.setAttribute("id", "headingGroup");
            {
                this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                this.headingBug.setAttribute("id", "headingBug");
                this.headingBug.setAttribute("d", "M500 " + (500 - circleRadius) + " l -11 -20 l 22 0 z");
                this.headingBug.setAttribute("fill", "none");
                this.headingBug.setAttribute("stroke", "white");
                this.headingGroup.appendChild(this.headingBug);
            }
            this.rotatingCircle.appendChild(this.headingGroup);
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.selectedHeadingGroup.setAttribute("id", "selectedHeadingGroup");
            {
                this.selectedHeadingLine = Avionics.SVG.computeDashLine(500, 450, -(circleRadius - 50), 15, 3, "#ff00e0");
                this.selectedHeadingLine.setAttribute("id", "selectedHeadingLine");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                this.selectedHeadingBug.setAttribute("id", "selectedHeadingBug");
                this.selectedHeadingBug.setAttribute("d", "M500 " + (500 - circleRadius) + " h 22 v -22 h -7 l -15 22 l -15 -22 h -7 v 22 z");
                this.selectedHeadingBug.setAttribute("stroke", "#ff00e0");
                this.selectedHeadingBug.setAttribute("fill", "none");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
            }
            this.rotatingCircle.appendChild(this.selectedHeadingGroup);
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV || this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ilsGroup.setAttribute("id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M500 " + (500 - circleRadius) + " l0 -40 M485 " + (500 - circleRadius - 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedTrackGroup.setAttribute("id", "selectedTrackGroup");
                {
                    this.selectedTrackLine = Avionics.SVG.computeDashLine(500, 450, -(circleRadius - 50), 15, 3, "#ff00e0");
                    this.selectedTrackLine.setAttribute("id", "selectedTrackLine");
                    this.selectedTrackGroup.appendChild(this.selectedTrackLine);
                    this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedTrackBug.setAttribute("id", "selectedTrackBug");
                    this.selectedTrackBug.setAttribute("d", "M500 " + (500 - circleRadius) + " h -30 v 15 l 30 15 l 30 -15 v -15 z");
                    this.selectedTrackBug.setAttribute("stroke", "#ff00e0");
                    this.selectedTrackBug.setAttribute("stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
            }
            this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.trackingGroup.setAttribute("id", "trackingGroup");
            {
                this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                this.trackingLine.setAttribute("id", "trackingLine");
                this.trackingLine.setAttribute("d", "M500 400 v " + (-circleRadius + 100) + "M500 600 v " + (circleRadius - 100));
                this.trackingLine.setAttribute("fill", "transparent");
                this.trackingLine.setAttribute("stroke", "white");
                this.trackingLine.setAttribute("stroke-width", "3");
                this.trackingGroup.appendChild(this.trackingLine);
            }
            this.rotatingCircle.appendChild(this.trackingGroup);
        }
        this.glideSlopeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.glideSlopeGroup.setAttribute("id", "GlideSlopeGroup");
        this.glideSlopeGroup.setAttribute("transform", "translate(-20, 0)");
        this.root.appendChild(this.glideSlopeGroup);
        if (this.navigationMode === Jet_NDCompass_Navigation.ILS) {
            for (let i = 0; i < 5; i++) {
                if (i != 2) {
                    let glideSlopeDot = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(glideSlopeDot, "cx", "950");
                    diffAndSetAttribute(glideSlopeDot, "cy", (250 + i * 125).toFixed(0));
                    diffAndSetAttribute(glideSlopeDot, "r", "10");
                    diffAndSetAttribute(glideSlopeDot, "stroke", "white");
                    diffAndSetAttribute(glideSlopeDot, "stroke-width", "2");
                    this.glideSlopeGroup.appendChild(glideSlopeDot);
                }
            }
            let glideSlopeDash = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(glideSlopeDash, "x", "935");
            diffAndSetAttribute(glideSlopeDash, "y", "498");
            diffAndSetAttribute(glideSlopeDash, "width", "30");
            diffAndSetAttribute(glideSlopeDash, "height", "4");
            diffAndSetAttribute(glideSlopeDash, "fill", "yellow");
            this.glideSlopeGroup.appendChild(glideSlopeDash);
            this.glideSlopeCursor = document.createElementNS(Avionics.SVG.NS, "path");
            this.glideSlopeCursor.setAttribute("id", "GlideSlopeCursor");
            this.glideSlopeCursor.setAttribute("transform", "translate(" + 950 + " " + 500 + ")");
            this.glideSlopeCursor.setAttribute("d", "M-15 0 L0 -20 L15 0 M-15 0 L0 20 L15 0");
            this.glideSlopeCursor.setAttribute("stroke", "#ff00ff");
            this.glideSlopeCursor.setAttribute("stroke-width", "2");
            this.glideSlopeCursor.setAttribute("fill", "none");
            this.glideSlopeGroup.appendChild(this.glideSlopeCursor);
        }
        this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.currentRefGroup.setAttribute("id", "currentRefGroup");
        {
            let centerX = 500;
            let centerY = (500 - circleRadius - 50);
            let rectWidth = 100;
            let rectHeight = 55;
            let textOffset = 10;
            this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
            this.currentRefMode.textContent = "HDG";
            this.currentRefMode.setAttribute("x", (centerX - rectWidth * 0.5 - textOffset).toString());
            this.currentRefMode.setAttribute("y", centerY.toString());
            this.currentRefMode.setAttribute("fill", "green");
            this.currentRefMode.setAttribute("font-size", "35");
            this.currentRefMode.setAttribute("font-family", "Roboto-Bold");
            this.currentRefMode.setAttribute("text-anchor", "end");
            this.currentRefMode.setAttribute("alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefMode);
            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5).toString());
            diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5).toString());
            diffAndSetAttribute(rect, "width", rectWidth.toString());
            diffAndSetAttribute(rect, "height", rectHeight.toString());
            diffAndSetAttribute(rect, "fill", "black");
            this.currentRefGroup.appendChild(rect);
            let path = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(path, "d", "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5)) + " l0 " + rectHeight + " l" + rectWidth + " 0 l0 " + (-rectHeight));
            diffAndSetAttribute(path, "fill", "none");
            diffAndSetAttribute(path, "stroke", "white");
            diffAndSetAttribute(path, "stroke-width", "1");
            this.currentRefGroup.appendChild(path);
            this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
            this.currentRefValue.textContent = "266";
            this.currentRefValue.setAttribute("x", centerX.toString());
            this.currentRefValue.setAttribute("y", centerY.toString());
            this.currentRefValue.setAttribute("fill", "white");
            this.currentRefValue.setAttribute("font-size", "35");
            this.currentRefValue.setAttribute("font-family", "Roboto-Bold");
            this.currentRefValue.setAttribute("text-anchor", "middle");
            this.currentRefValue.setAttribute("alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefValue);
            this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
            this.currentRefType.textContent = "MAG";
            this.currentRefType.setAttribute("x", (centerX + rectWidth * 0.5 + textOffset).toString());
            this.currentRefType.setAttribute("y", centerY.toString());
            this.currentRefType.setAttribute("fill", "green");
            this.currentRefType.setAttribute("font-size", "35");
            this.currentRefType.setAttribute("font-family", "Roboto-Bold");
            this.currentRefType.setAttribute("text-anchor", "start");
            this.currentRefType.setAttribute("alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefType);
        }
        this.root.appendChild(this.currentRefGroup);
        let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
        diffAndSetAttribute(rangeGroup, "transform", "scale(1.25)");
        {
            let centerX = 245;
            let centerY = 35;
            let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(textBg, "x", (centerX - 40).toString());
            diffAndSetAttribute(textBg, "y", (centerY - 32).toString());
            diffAndSetAttribute(textBg, "width", "80");
            diffAndSetAttribute(textBg, "height", "64");
            diffAndSetAttribute(textBg, "fill", "black");
            diffAndSetAttribute(textBg, "stroke", "white");
            diffAndSetAttribute(textBg, "stroke-width", "1");
            rangeGroup.appendChild(textBg);
            let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(textTitle, "RANGE");
            diffAndSetAttribute(textTitle, "x", centerX.toString());
            diffAndSetAttribute(textTitle, "y", (centerY - 15).toString());
            diffAndSetAttribute(textTitle, "fill", "white");
            diffAndSetAttribute(textTitle, "font-size", "25");
            diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
            diffAndSetAttribute(textTitle, "text-anchor", "middle");
            diffAndSetAttribute(textTitle, "alignment-baseline", "central");
            rangeGroup.appendChild(textTitle);
            this.addMapRange(rangeGroup, centerX, (centerY + 15), "white", "25", false, 1.0, false);
        }
        this.root.appendChild(rangeGroup);
    }
    constructRose_AS01B() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 1000");
        this.appendChild(this.root);
        let circleRadius = 400;
        {
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingCircle.setAttribute("id", "RotatingCircle");
            this.root.appendChild(this.rotatingCircle);
            let outerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(outerGroup, "id", "outerCircle");
            this.rotatingCircle.appendChild(outerGroup);
            {
                for (let i = 0; i < 72; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    let startY = 500 - circleRadius;
                    let length = 30;
                    if (i % 2 != 0) {
                        if (this.navigationMode == Jet_NDCompass_Navigation.NONE || this.navigationMode == Jet_NDCompass_Navigation.NAV)
                            continue;
                        length = 13;
                    }
                    if (i % 9 == 0) {
                        if (this.navigationMode != Jet_NDCompass_Navigation.NONE && this.navigationMode != Jet_NDCompass_Navigation.NAV) {
                            startY -= 30;
                            length += 30;
                        }
                    }
                    diffAndSetAttribute(line, "x", "498");
                    diffAndSetAttribute(line, "y", startY.toString());
                    diffAndSetAttribute(line, "width", "4");
                    diffAndSetAttribute(line, "height", length.toString());
                    diffAndSetAttribute(line, "transform", "rotate(" + fastToFixed(i * 5, 0) + " 500 500)");
                    diffAndSetAttribute(line, "fill", "white");
                    outerGroup.appendChild(line);
                }
                for (let i = 0; i < 36; i += 3) {
                    let text = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetText(text, fastToFixed(i, 0));
                    diffAndSetAttribute(text, "x", "500");
                    diffAndSetAttribute(text, "y", (500 - circleRadius + 52).toString());
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", "40");
                    diffAndSetAttribute(text, "font-family", "Roboto-Light");
                    diffAndSetAttribute(text, "text-anchor", "middle");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    diffAndSetAttribute(text, "transform", "rotate(" + fastToFixed(i * 10, 0) + " 500 500)");
                    outerGroup.appendChild(text);
                }
            }
            this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.courseGroup.setAttribute("id", "CourseInfo");
            this.rotatingCircle.appendChild(this.courseGroup);
            {
                this.bearing1 = document.createElementNS(Avionics.SVG.NS, "g");
                this.bearing1.setAttribute("id", "bearing1");
                this.bearing1.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearing1);
                let arrow = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(arrow, "d", "M500 960 L500 800 M500 40 L500 200 M500 80 L570 150 M500 80 L430 150");
                diffAndSetAttribute(arrow, "stroke", "#36c8d2");
                diffAndSetAttribute(arrow, "stroke-width", "10");
                diffAndSetAttribute(arrow, "fill", "none");
                this.bearing1.appendChild(arrow);
                this.bearing2 = document.createElementNS(Avionics.SVG.NS, "g");
                this.bearing2.setAttribute("id", "bearing2");
                this.bearing2.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearing2);
                arrow = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(arrow, "d", "M500 960 L500 920 M470 800 L470 900 Q500 960 530 900 L530 800 M500 40 L500 80 L570 150 M500 80 L430 150 M470 110 L470 200 M530 110 L530 200");
                diffAndSetAttribute(arrow, "stroke", "#36c8d2");
                diffAndSetAttribute(arrow, "stroke-width", "10");
                diffAndSetAttribute(arrow, "fill", "none");
                this.bearing2.appendChild(arrow);
                this.course = document.createElementNS(Avionics.SVG.NS, "g");
                this.course.setAttribute("id", "course");
                this.courseGroup.appendChild(this.course);
                {
                    this.courseColor = "";
                    if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                        this.courseColor = "#ff00ff";
                    }
                    else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                        this.courseColor = "#00ffff";
                    }
                    this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseTO.setAttribute("d", "M497 666 L503 666 L503 696 L523 696 L523 702 L503 702 L503 826 L497 826 L497 702 L477 702 L477 696 L497 696 L497 666 Z");
                    this.courseTO.setAttribute("fill", "none");
                    this.courseTO.setAttribute("transform", "rotate(180 500 500)");
                    this.courseTO.setAttribute("stroke", this.courseColor.toString());
                    this.courseTO.setAttribute("stroke-width", "1");
                    this.course.appendChild(this.courseTO);
                    this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                    this.courseDeviation.setAttribute("x", "495");
                    this.courseDeviation.setAttribute("y", "333");
                    this.courseDeviation.setAttribute("width", "10");
                    this.courseDeviation.setAttribute("height", "333");
                    this.courseDeviation.setAttribute("fill", this.courseColor.toString());
                    this.course.appendChild(this.courseDeviation);
                    this.courseFROM = document.createElementNS(Avionics.SVG.NS, "rect");
                    this.courseFROM.setAttribute("x", "497");
                    this.courseFROM.setAttribute("y", "166");
                    this.courseFROM.setAttribute("width", "6");
                    this.courseFROM.setAttribute("height", "166");
                    this.courseFROM.setAttribute("fill", "none");
                    this.courseFROM.setAttribute("transform", "rotate(180 500 500)");
                    this.courseFROM.setAttribute("stroke", this.courseColor.toString());
                    this.courseFROM.setAttribute("stroke-width", "1");
                    this.course.appendChild(this.courseFROM);
                    let circlePosition = [-166, -55, 55, 166];
                    for (let i = 0; i < circlePosition.length; i++) {
                        let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                        diffAndSetAttribute(CDICircle, "cx", (500 + circlePosition[i]).toString());
                        diffAndSetAttribute(CDICircle, "cy", "500");
                        diffAndSetAttribute(CDICircle, "r", "10");
                        diffAndSetAttribute(CDICircle, "stroke", "white");
                        diffAndSetAttribute(CDICircle, "stroke-width", "2");
                        this.course.appendChild(CDICircle);
                    }
                }
                this.bearingCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                this.bearingCircle.setAttribute("cx", "500");
                this.bearingCircle.setAttribute("cy", "500");
                this.bearingCircle.setAttribute("r", "30");
                this.bearingCircle.setAttribute("stroke", "white");
                this.bearingCircle.setAttribute("stroke-width", "0.8");
                this.bearingCircle.setAttribute("fill-opacity", "0");
                this.bearingCircle.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearingCircle);
            }
            this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.trackingGroup.setAttribute("id", "trackingGroup");
            {
                this.trackingLine = document.createElementNS(Avionics.SVG.NS, "path");
                this.trackingLine.setAttribute("id", "trackingLine");
                this.trackingLine.setAttribute("d", "M500 450 v " + (-circleRadius + 50));
                this.trackingLine.setAttribute("fill", "transparent");
                this.trackingLine.setAttribute("stroke", "white");
                this.trackingLine.setAttribute("stroke-width", "3");
                this.trackingGroup.appendChild(this.trackingLine);
            }
            this.rotatingCircle.appendChild(this.trackingGroup);
            this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.headingGroup.setAttribute("id", "headingGroup");
            {
                this.headingBug = document.createElementNS(Avionics.SVG.NS, "path");
                this.headingBug.setAttribute("id", "headingBug");
                this.headingBug.setAttribute("d", "M500 " + (500 - circleRadius) + " l -11 -20 l 22 0 z");
                this.headingBug.setAttribute("fill", "none");
                this.headingBug.setAttribute("stroke", "white");
                this.headingGroup.appendChild(this.headingBug);
            }
            this.rotatingCircle.appendChild(this.headingGroup);
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.selectedHeadingGroup.setAttribute("id", "selectedHeadingGroup");
            {
                this.selectedHeadingLine = Avionics.SVG.computeDashLine(500, 450, -(circleRadius - 50), 15, 3, "#ff00e0");
                this.selectedHeadingLine.setAttribute("id", "selectedHeadingLine");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingLine);
                this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                this.selectedHeadingBug.setAttribute("id", "selectedHeadingBug");
                this.selectedHeadingBug.setAttribute("d", "M500 " + (500 - circleRadius) + " h 22 v -22 h -7 l -15 22 l -15 -22 h -7 v 22 z");
                this.selectedHeadingBug.setAttribute("stroke", "#ff00e0");
                this.selectedHeadingBug.setAttribute("fill", "none");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
            }
            this.rotatingCircle.appendChild(this.selectedHeadingGroup);
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV || this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ilsGroup.setAttribute("id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M500 " + (500 - circleRadius) + " l0 -40 M485 " + (500 - circleRadius - 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
            if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                this.selectedTrackGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.selectedTrackGroup.setAttribute("id", "selectedTrackGroup");
                {
                    this.selectedTrackLine = Avionics.SVG.computeDashLine(500, 450, -(circleRadius - 50), 15, 3, "#ff00e0");
                    this.selectedTrackLine.setAttribute("id", "selectedTrackLine");
                    this.selectedTrackGroup.appendChild(this.selectedTrackLine);
                    this.selectedTrackBug = document.createElementNS(Avionics.SVG.NS, "path");
                    this.selectedTrackBug.setAttribute("id", "selectedTrackBug");
                    this.selectedTrackBug.setAttribute("d", "M500 " + (500 - circleRadius) + " h -30 v 15 l 30 15 l 30 -15 v -15 z");
                    this.selectedTrackBug.setAttribute("stroke", "#ff00e0");
                    this.selectedTrackBug.setAttribute("stroke-width", "2");
                    this.selectedTrackGroup.appendChild(this.selectedTrackBug);
                }
                this.rotatingCircle.appendChild(this.selectedTrackGroup);
            }
        }
        this.glideSlopeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.glideSlopeGroup.setAttribute("id", "GlideSlopeGroup");
        this.root.appendChild(this.glideSlopeGroup);
        if (this._fullscreen)
            this.glideSlopeGroup.setAttribute("transform", "translate(-20, 0)");
        else
            this.glideSlopeGroup.setAttribute("transform", "translate(20, 20)");
        if (this.navigationMode === Jet_NDCompass_Navigation.ILS) {
            for (let i = 0; i < 5; i++) {
                if (i != 2) {
                    let glideSlopeDot = document.createElementNS(Avionics.SVG.NS, "circle");
                    diffAndSetAttribute(glideSlopeDot, "cx", "950");
                    diffAndSetAttribute(glideSlopeDot, "cy", (250 + i * 125).toFixed(0));
                    diffAndSetAttribute(glideSlopeDot, "r", "10");
                    diffAndSetAttribute(glideSlopeDot, "stroke", "white");
                    diffAndSetAttribute(glideSlopeDot, "stroke-width", "2");
                    this.glideSlopeGroup.appendChild(glideSlopeDot);
                }
            }
            let glideSlopeDash = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(glideSlopeDash, "x", "935");
            diffAndSetAttribute(glideSlopeDash, "y", "498");
            diffAndSetAttribute(glideSlopeDash, "width", "30");
            diffAndSetAttribute(glideSlopeDash, "height", "4");
            diffAndSetAttribute(glideSlopeDash, "fill", "yellow");
            this.glideSlopeGroup.appendChild(glideSlopeDash);
            this.glideSlopeCursor = document.createElementNS(Avionics.SVG.NS, "path");
            this.glideSlopeCursor.setAttribute("id", "GlideSlopeCursor");
            this.glideSlopeCursor.setAttribute("transform", "translate(" + 950 + " " + 500 + ")");
            this.glideSlopeCursor.setAttribute("d", "M-15 0 L0 -20 L15 0 M-15 0 L0 20 L15 0");
            this.glideSlopeCursor.setAttribute("stroke", "#ff00ff");
            this.glideSlopeCursor.setAttribute("stroke-width", "2");
            this.glideSlopeCursor.setAttribute("fill", "none");
            this.glideSlopeGroup.appendChild(this.glideSlopeCursor);
        }
        this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.currentRefGroup.setAttribute("id", "currentRefGroup");
        {
            let centerX = 500;
            let centerY = (500 - circleRadius - 50);
            let rectWidth = 100;
            let rectHeight = 55;
            let textOffset = 10;
            this.currentRefMode = document.createElementNS(Avionics.SVG.NS, "text");
            this.currentRefMode.textContent = "HDG";
            this.currentRefMode.setAttribute("x", (centerX - rectWidth * 0.5 - textOffset).toString());
            this.currentRefMode.setAttribute("y", centerY.toString());
            this.currentRefMode.setAttribute("fill", "green");
            this.currentRefMode.setAttribute("font-size", "35");
            this.currentRefMode.setAttribute("font-family", "Roboto-Bold");
            this.currentRefMode.setAttribute("text-anchor", "end");
            this.currentRefMode.setAttribute("alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefMode);
            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5).toString());
            diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5).toString());
            diffAndSetAttribute(rect, "width", rectWidth.toString());
            diffAndSetAttribute(rect, "height", rectHeight.toString());
            diffAndSetAttribute(rect, "fill", "black");
            this.currentRefGroup.appendChild(rect);
            let path = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(path, "d", "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5)) + " l0 " + rectHeight + " l" + rectWidth + " 0 l0 " + (-rectHeight));
            diffAndSetAttribute(path, "fill", "none");
            diffAndSetAttribute(path, "stroke", "white");
            diffAndSetAttribute(path, "stroke-width", "1");
            this.currentRefGroup.appendChild(path);
            this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
            this.currentRefValue.textContent = "266";
            this.currentRefValue.setAttribute("x", centerX.toString());
            this.currentRefValue.setAttribute("y", centerY.toString());
            this.currentRefValue.setAttribute("fill", "white");
            this.currentRefValue.setAttribute("font-size", "35");
            this.currentRefValue.setAttribute("font-family", "Roboto-Bold");
            this.currentRefValue.setAttribute("text-anchor", "middle");
            this.currentRefValue.setAttribute("alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefValue);
            this.currentRefType = document.createElementNS(Avionics.SVG.NS, "text");
            this.currentRefType.textContent = "MAG";
            this.currentRefType.setAttribute("x", (centerX + rectWidth * 0.5 + textOffset).toString());
            this.currentRefType.setAttribute("y", centerY.toString());
            this.currentRefType.setAttribute("fill", "green");
            this.currentRefType.setAttribute("font-size", "35");
            this.currentRefType.setAttribute("font-family", "Roboto-Bold");
            this.currentRefType.setAttribute("text-anchor", "start");
            this.currentRefType.setAttribute("alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefType);
        }
        this.root.appendChild(this.currentRefGroup);
        let rangeGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(rangeGroup, "id", "RangeGroup");
        {
            let centerX = 146;
            let centerY = 43;
            if (this._fullscreen) {
                diffAndSetAttribute(rangeGroup, "transform", "scale(1.27)");
            }
            else {
                centerX = 266;
                centerY = 53;
            }
            let textBg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(textBg, "x", (centerX - 40).toString());
            diffAndSetAttribute(textBg, "y", (centerY - 32).toString());
            diffAndSetAttribute(textBg, "width", "80");
            diffAndSetAttribute(textBg, "height", "64");
            diffAndSetAttribute(textBg, "fill", "black");
            diffAndSetAttribute(textBg, "stroke", "white");
            diffAndSetAttribute(textBg, "stroke-width", "2");
            rangeGroup.appendChild(textBg);
            let textTitle = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetText(textTitle, "RANGE");
            diffAndSetAttribute(textTitle, "x", (centerX - 0.5).toString());
            diffAndSetAttribute(textTitle, "y", (centerY - 14).toString());
            diffAndSetAttribute(textTitle, "fill", "white");
            diffAndSetAttribute(textTitle, "font-size", "25");
            diffAndSetAttribute(textTitle, "font-family", "Roboto-Light");
            diffAndSetAttribute(textTitle, "text-anchor", "middle");
            diffAndSetAttribute(textTitle, "alignment-baseline", "central");
            rangeGroup.appendChild(textTitle);
            this.addMapRange(rangeGroup, (centerX - 0.5), (centerY + 15.5), "white", "25", false, 1.0, false);
        }
        this.root.appendChild(rangeGroup);
    }
    constructRose_CJ4() {
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        this.root.setAttribute("width", "100%");
        this.root.setAttribute("height", "100%");
        this.root.setAttribute("viewBox", "0 0 1000 1000");

        this.appendChild(this.root);
        let circleRadius = 333;
        {
            this.rotatingCircle = document.createElementNS(Avionics.SVG.NS, "g");
            this.rotatingCircle.setAttribute("id", "RotatingCircle");
            this.root.appendChild(this.rotatingCircle);
            let outerGroup = document.createElementNS(Avionics.SVG.NS, "g");
            diffAndSetAttribute(outerGroup, "id", "outerCircle");
            this.rotatingCircle.appendChild(outerGroup);
            {
                let texts = ["N", "E", "S", "W"];
                for (let i = 0; i < 72; i++) {
                    let line = document.createElementNS(Avionics.SVG.NS, "rect");
                    let startY = 500 - circleRadius;
                    let length = (i % 2 == 0) ? 20 : 13;
                    diffAndSetAttribute(line, "x", "498");
                    diffAndSetAttribute(line, "y", startY.toString());
                    diffAndSetAttribute(line, "width", "4");
                    diffAndSetAttribute(line, "height", length.toString());
                    diffAndSetAttribute(line, "transform", "rotate(" + fastToFixed(i * 5, 0) + " 500 500)");
                    diffAndSetAttribute(line, "fill", "white");
                    outerGroup.appendChild(line);
                }
                for (let i = 0; i < 36; i += 3) {
                    let text = document.createElementNS(Avionics.SVG.NS, "text");
                    if (i % 9 == 0) {
                        let id = i / 9;
                        diffAndSetText(text, texts[id]);
                    }
                    else
                        diffAndSetText(text, fastToFixed(i, 0));
                    diffAndSetAttribute(text, "x", "500");
                    diffAndSetAttribute(text, "y", (500 - circleRadius + 52).toString());
                    diffAndSetAttribute(text, "fill", "white");
                    diffAndSetAttribute(text, "font-size", "40");
                    diffAndSetAttribute(text, "font-family", "Roboto-Light");
                    diffAndSetAttribute(text, "text-anchor", "middle");
                    diffAndSetAttribute(text, "alignment-baseline", "central");
                    diffAndSetAttribute(text, "transform", "rotate(" + fastToFixed(i * 10, 0) + " 500 500)");
                    outerGroup.appendChild(text);
                }
            }
            this.courseGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.courseGroup.setAttribute("id", "CourseInfo");
            this.rotatingCircle.appendChild(this.courseGroup);
            {
                this.bearing1 = document.createElementNS(Avionics.SVG.NS, "g");
                this.bearing1.setAttribute("id", "bearing1");
                this.bearing1.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearing1);
                let arrow = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(arrow, "d", "M500 960 L500 800 M500 40 L500 200 M500 80 L570 150 M500 80 L430 150");
                diffAndSetAttribute(arrow, "stroke", "#36c8d2");
                diffAndSetAttribute(arrow, "stroke-width", "10");
                diffAndSetAttribute(arrow, "fill", "none");
                this.bearing1.appendChild(arrow);
                this.bearing2 = document.createElementNS(Avionics.SVG.NS, "g");
                this.bearing2.setAttribute("id", "bearing2");
                this.bearing2.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearing2);
                arrow = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(arrow, "d", "M500 960 L500 920 M470 800 L470 900 Q500 960 530 900 L530 800 M500 40 L500 80 L570 150 M500 80 L430 150 M470 110 L470 200 M530 110 L530 200");
                diffAndSetAttribute(arrow, "stroke", "#36c8d2");
                diffAndSetAttribute(arrow, "stroke-width", "10");
                diffAndSetAttribute(arrow, "fill", "none");
                this.bearing2.appendChild(arrow);
                this.course = document.createElementNS(Avionics.SVG.NS, "g");
                this.course.setAttribute("id", "course");
                this.courseGroup.appendChild(this.course);
                {
                    this.courseColor = "";
                    if (this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                        this.courseColor = "#11d011";
                    }
                    else if (this.navigationMode == Jet_NDCompass_Navigation.NAV) {
                        this.courseColor = "#ff00ff";
                    }
                    else if (this.navigationMode == Jet_NDCompass_Navigation.VOR) {
                        this.courseColor = "#11d011";
                    }

                    this.courseDeviationGhost = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseTOGhost = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseFROMGhost = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseTOBorder = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseTO = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseFROMBorder = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseFROM = document.createElementNS(Avionics.SVG.NS, "path");

                    if (this.navigationMode === Jet_NDCompass_Navigation.ILS) {
                        this.courseTO.setAttribute("style", "display:none");
                        this.courseTOBorder.setAttribute("style", "display:none");
                    }

                    this.courseDeviation = document.createElementNS(Avionics.SVG.NS, "rect");
                    this.courseDeviation.setAttribute("x", "496");
                    this.courseDeviation.setAttribute("y", "333");
                    this.courseDeviation.setAttribute("width", "8");
                    this.courseDeviation.setAttribute("height", "333");
                    this.courseDeviation.setAttribute("fill", this.courseColor.toString());
                    this.course.appendChild(this.courseDeviation);

                    this.courseTOBorder.setAttribute("d", "M 500 630 l -18 -36 l 36 0 l -18 36 Z");
                    this.courseTOBorder.setAttribute("transform", "rotate(180 500 500)", "scale(.8)");
                    this.courseTOBorder.setAttribute("stroke", "black");
                    this.courseTOBorder.setAttribute("stroke-width", "11");
                    this.courseTOBorder.setAttribute("fill", "none");
                    this.courseTOBorder.setAttribute("stroke-linejoin", "round");
                    this.course.appendChild(this.courseTOBorder);

                    this.courseTO.setAttribute("d", "M 500 630 l -18 -36 l 36 0 l -18 36 Z");
                    this.courseTO.setAttribute("transform", "rotate(180 500 500)", "scale(.3)");
                    this.courseTO.setAttribute("stroke", this.courseColor.toString());
                    this.courseTO.setAttribute("stroke-width", "6");
                    this.courseTO.setAttribute("fill", "none");
                    this.courseTO.setAttribute("stroke-linejoin", "round");
                    this.course.appendChild(this.courseTO);

                    this.courseTOLine = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseTOLine.setAttribute("d", "M 500 764 l -15 0 l 15 66 l 15 -66 l -15 0 l 0 -88 Z");
                    this.courseTOLine.setAttribute("fill", "none");
                    this.courseTOLine.setAttribute("transform", "rotate(180 500 500)");
                    this.courseTOLine.setAttribute("stroke", this.courseColor.toString());
                    this.courseTOLine.setAttribute("stroke-width", "8");
                    this.courseTOLine.setAttribute("stroke-linejoin", "round");
                    this.course.appendChild(this.courseTOLine);

                    this.courseFROMBorder.setAttribute("d", "M 500 410 l -18 -36 l 36 0 l -18 36 Z");
                    this.courseFROMBorder.setAttribute("transform", "rotate(180 500 500)", "scale(.8)");
                    this.courseFROMBorder.setAttribute("stroke", "black");
                    this.courseFROMBorder.setAttribute("stroke-width", "11");
                    this.courseFROMBorder.setAttribute("fill", "none");
                    this.courseFROMBorder.setAttribute("stroke-linejoin", "round");
                    this.course.appendChild(this.courseFROMBorder);

                    this.courseFROM.setAttribute("d", "M 500 410 l -18 -36 l 36 0 l -18 36 Z");
                    this.courseFROM.setAttribute("transform", "rotate(180 500 500)", "scale(.3)");
                    this.courseFROM.setAttribute("stroke", this.courseColor.toString());
                    this.courseFROM.setAttribute("stroke-width", "6");
                    this.courseFROM.setAttribute("fill", "none");
                    this.courseFROM.setAttribute("stroke-linejoin", "round");
                    this.course.appendChild(this.courseFROM);

                    this.courseFROMLine = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseFROMLine.setAttribute("d", "M 500 165 l 0 163 Z");
                    this.courseFROMLine.setAttribute("fill", this.courseColor.toString());
                    this.courseFROMLine.setAttribute("transform", "rotate(180 500 500)");
                    this.courseFROMLine.setAttribute("stroke", this.courseColor.toString());
                    this.courseFROMLine.setAttribute("stroke-width", "8");
                    this.course.appendChild(this.courseFROMLine);

                    let circlePosition = [-150, -75, 75, 150];
                    for (let i = 0; i < circlePosition.length; i++) {
                        let CDICircle = document.createElementNS(Avionics.SVG.NS, "circle");
                        diffAndSetAttribute(CDICircle, "cx", (500 + circlePosition[i]).toString());
                        diffAndSetAttribute(CDICircle, "cy", "500");
                        diffAndSetAttribute(CDICircle, "r", "6.8");
                        diffAndSetAttribute(CDICircle, "stroke", "white");
                        diffAndSetAttribute(CDICircle, "stroke-width", "2");
                        diffAndSetAttribute(CDICircle, "fill", "none");
                        this.course.appendChild(CDICircle);
                    }
                }
                this.bearingCircle = document.createElementNS(Avionics.SVG.NS, "circle");
                this.bearingCircle.setAttribute("cx", "500");
                this.bearingCircle.setAttribute("cy", "500");
                this.bearingCircle.setAttribute("r", "30");
                this.bearingCircle.setAttribute("stroke", "white");
                this.bearingCircle.setAttribute("stroke-width", "0.8");
                this.bearingCircle.setAttribute("fill-opacity", "0");
                this.bearingCircle.setAttribute("visibility", "hidden");
                this.courseGroup.appendChild(this.bearingCircle);

                this.ghostNeedleGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ghostNeedleGroup.setAttribute("id", "ghostNeedleGroup");
                {
                    this.courseDeviationGhost = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseDeviationGhost.setAttribute("d", "M 484 333 l 0 12 m 0 12 l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 M 515 333 l 0 12 m 0 12 l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12l 0 12 m 0 12 l 0 12 m 0 12l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 Z");
                    this.courseDeviationGhost.setAttribute("stroke", "cyan");
                    this.courseDeviationGhost.setAttribute("stroke-width", "3");
                    this.ghostNeedleGroup.appendChild(this.courseDeviationGhost);

                    this.courseTOLineGhost = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseTOLineGhost.setAttribute("d", "M 486 673 l 0 5 m 0 10 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 5 l 0 3 l -8 0 l 21 50 l 24 -50 l -7 0 l 0 -3 m 0 -5 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -12 l 0 -12 m 0 -10 l 0 -5 m -30 107 l 30 0 z");
                    this.courseTOLineGhost.setAttribute("transform", "rotate(180 500 500)");
                    this.courseTOLineGhost.setAttribute("stroke", "cyan");
                    this.courseTOLineGhost.setAttribute("stroke-width", "3");
                    this.ghostNeedleGroup.appendChild(this.courseTOLineGhost);

                    this.courseFROMLineGhost = document.createElementNS(Avionics.SVG.NS, "path");
                    this.courseFROMLineGhost.setAttribute("d", "M 485 165 l 0 5 m 0 10 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 10 l 0 6 M 515 165 l 0 5 m 0 10 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 12 l 0 12 m 0 10 l 0 6 Z");
                    this.courseFROMLineGhost.setAttribute("transform", "rotate(180 500 500)");
                    this.courseFROMLineGhost.setAttribute("stroke", "cyan");
                    this.courseFROMLineGhost.setAttribute("stroke-width", "3");
                    this.ghostNeedleGroup.appendChild(this.courseFROMLineGhost);

                    this.rotatingCircle.appendChild(this.ghostNeedleGroup);
                }
            }

            this.trackingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.trackingGroup.setAttribute("id", "trackingGroup");

            this.headingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.headingGroup.setAttribute("id", "headingGroup");
            {
            }
            this.rotatingCircle.appendChild(this.headingGroup);
            this.selectedHeadingGroup = document.createElementNS(Avionics.SVG.NS, "g");
            this.selectedHeadingGroup.setAttribute("id", "selectedHeadingGroup");
            {
                this.selectedHeadingBug = document.createElementNS(Avionics.SVG.NS, "path");
                this.selectedHeadingBug.setAttribute("id", "selectedHeadingBug");
                this.selectedHeadingBug.setAttribute("d", "M 497 165 l -21 0 l 0 -19 l 13 0 l 8 10 l 0 9 m 3 0 l 0 -9 l 8 -10 l 13 0 l 0 19 l -21 0 z");
                this.selectedHeadingBug.setAttribute("fill", "#00F2FF");
                this.selectedHeadingGroup.appendChild(this.selectedHeadingBug);
            }
            this.rotatingCircle.appendChild(this.selectedHeadingGroup);
            this.rotatingCircle.appendChild(this.trackingGroup);
            {
                let rad = 9;
                this.trackingBug = document.createElementNS(Avionics.SVG.NS, "circle");
                this.trackingBug.setAttribute("id", "trackingBug");
                this.trackingBug.setAttribute("cx", "500");
                this.trackingBug.setAttribute("cy", (500 - circleRadius + rad).toString());
                this.trackingBug.setAttribute("r", rad.toString());
                this.trackingBug.setAttribute("fill", "black");
                this.trackingBug.setAttribute("stroke", "#ff00e0");
                this.trackingBug.setAttribute("stroke-width", "5");
                this.trackingGroup.appendChild(this.trackingBug);
            }

            if (this.navigationMode == Jet_NDCompass_Navigation.NAV || this.navigationMode == Jet_NDCompass_Navigation.ILS) {
                this.ilsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.ilsGroup.setAttribute("id", "ILSGroup");
                {
                    let ilsBug = document.createElementNS(Avionics.SVG.NS, "path");
                    diffAndSetAttribute(ilsBug, "id", "ilsBug");
                    diffAndSetAttribute(ilsBug, "d", "M500 " + (500 - circleRadius) + " l0 -40 M485 " + (500 - circleRadius - 10) + " l30 0");
                    diffAndSetAttribute(ilsBug, "fill", "transparent");
                    diffAndSetAttribute(ilsBug, "stroke", "#FF0CE2");
                    diffAndSetAttribute(ilsBug, "stroke-width", "3");
                    diffAndSetAttribute(ilsBug, "style", "display:none");
                    this.ilsGroup.appendChild(ilsBug);
                }
                this.rotatingCircle.appendChild(this.ilsGroup);
            }
        }


        let airplaneSymbolGroup = document.createElementNS(Avionics.SVG.NS, "g");
        let airplaneStick = document.createElementNS(Avionics.SVG.NS, "path");
        diffAndSetAttribute(airplaneStick, "transform", "translate(500 468) scale(2)");
        diffAndSetAttribute(airplaneStick, "d", "M 0 0 l 0 38 M 0 32 l 11 2 M 0 32 l -11 2 M 0 12 l 19 8 M 0 12 l -19 8");
        diffAndSetAttribute(airplaneStick, "stroke", "white");
        diffAndSetAttribute(airplaneStick, "stroke-width", "2.5");
        airplaneSymbolGroup.appendChild(airplaneStick);
        this.root.appendChild(airplaneSymbolGroup);

        this.noFplnGroup = document.createElementNS(Avionics.SVG.NS, "g");
        let noFpln = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(noFpln, "NO FLIGHT PLAN");
        diffAndSetAttribute(noFpln, "x", "500");
        diffAndSetAttribute(noFpln, "y", "450");
        diffAndSetAttribute(noFpln, "fill", "white");
        diffAndSetAttribute(noFpln, "font-size", "30");
        diffAndSetAttribute(noFpln, "font-family", "Roboto-Bold");
        diffAndSetAttribute(noFpln, "text-anchor", "middle");
        diffAndSetAttribute(noFpln, "alignment-baseline", "central");
        this.noFplnGroup.appendChild(noFpln);
        this.root.appendChild(this.noFplnGroup);

        this.discoFplnGroup = document.createElementNS(Avionics.SVG.NS, "g");
        let discoFpln = document.createElementNS(Avionics.SVG.NS, "text");
        diffAndSetText(discoFpln, "DISCONTINUITY");
        diffAndSetAttribute(discoFpln, "x", "500");
        diffAndSetAttribute(discoFpln, "y", "420");
        diffAndSetAttribute(discoFpln, "fill", "white");
        diffAndSetAttribute(discoFpln, "font-size", "30");
        diffAndSetAttribute(discoFpln, "font-family", "Roboto-Bold");
        diffAndSetAttribute(discoFpln, "text-anchor", "middle");
        diffAndSetAttribute(discoFpln, "alignment-baseline", "central");
        this.discoFplnGroup.appendChild(discoFpln);
        this.discoFplnGroup.setAttribute("visibility", "hidden");
        this.root.appendChild(this.discoFplnGroup);

        this.outerTickMarks = document.createElementNS(Avionics.SVG.NS, "g"); //Arrows go on 45, 135, 215, 345, lines go on 0, 90, 180, 270
        this.root.appendChild(this.outerTickMarks);
        for (let i = 9; i < 72; i += 9) {
            if (i % 18 == 0 ) {
                let line = document.createElementNS(Avionics.SVG.NS, "rect");
                let startY = 500 - (circleRadius + 33);
                diffAndSetAttribute(line, "x", "496");
                diffAndSetAttribute(line, "y", startY.toString());
                diffAndSetAttribute(line, "width", "5");
                diffAndSetAttribute(line, "height", "25");
                diffAndSetAttribute(line, "transform", "rotate(" + fastToFixed(i * 5, 0) + " 500 500)");
                diffAndSetAttribute(line, "fill", "white");
                this.outerTickMarks.appendChild(line);
            } else {
                let arrow = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(arrow, "d", "M 498 155 l 10 -18 l -10 0 l -10 0 z");
                diffAndSetAttribute(arrow, "stroke", "white");
                diffAndSetAttribute(arrow, "stroke-width", "4.0");
                diffAndSetAttribute(arrow, "transform", "rotate(" + fastToFixed(i * 5, 0) + " 500 500)");
                this.outerTickMarks.appendChild(arrow);
            }
        }


        /*let innerCircleGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(innerCircleGroup, "id", "innerCircle");
        this.root.appendChild(innerCircleGroup);
        {
            var smallCircleRadius = 170;
            let circle = document.createElementNS(Avionics.SVG.NS, "circle");
            diffAndSetAttribute(circle, "cx", "500");
            diffAndSetAttribute(circle, "cy", "500");
            diffAndSetAttribute(circle, "r", smallCircleRadius.toString());
            diffAndSetAttribute(circle, "fill-opacity", "0");
            diffAndSetAttribute(circle, "stroke", "#cccac8");
            diffAndSetAttribute(circle, "stroke-width", "2");
            diffAndSetAttribute(circle, "stroke-opacity", "1");
            innerCircleGroup.appendChild(circle);
            let dashSpacing = 12;
            let radians = 0;
            for (let i = 0; i < dashSpacing; i++) {
                let line = document.createElementNS(Avionics.SVG.NS, "line");
                let length = 15;
                let lineStart = 500 + smallCircleRadius - length * 0.5;
                let lineEnd = 500 + smallCircleRadius + length * 0.5;
                let degrees = (radians / Math.PI) * 180;
                diffAndSetAttribute(line, "x1", "500");
                diffAndSetAttribute(line, "y1", lineStart.toString());
                diffAndSetAttribute(line, "x2", "500");
                diffAndSetAttribute(line, "y2", lineEnd.toString());
                diffAndSetAttribute(line, "transform", "rotate(" + (-degrees + 180) + " 500 500)");
                diffAndSetAttribute(line, "stroke", "#cccac8");
                diffAndSetAttribute(line, "stroke-width", "4");
                diffAndSetAttribute(line, "stroke-opacity", "0.8");
                innerCircleGroup.appendChild(line);
                radians += (2 * Math.PI) / dashSpacing;
            }
            let vec = new Vec2(1, 0.45);
            vec.SetNorm(smallCircleRadius * 0.82);
            this.addMapRange(innerCircleGroup, 500 - vec.x, 500 - vec.y, "white", "30", false, 0.5, false);
        }*/

        this.currentRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.currentRefGroup.setAttribute("id", "currentRefGroup");
        this.currentRefGroup.setAttribute("transform", "scale(1.5)");
        {
            let centerX = 332;
            let centerY = 75;
            let rectWidth = 65;
            let rectHeight = 40;
            let rectArrowFactor = 0.35;
            let rect = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(rect, "x", (centerX - rectWidth * 0.5).toString());
            diffAndSetAttribute(rect, "y", (centerY - rectHeight * 0.5).toString());
            diffAndSetAttribute(rect, "width", rectWidth.toString());
            diffAndSetAttribute(rect, "height", rectHeight.toString());
            diffAndSetAttribute(rect, "fill", "black");
            this.currentRefGroup.appendChild(rect);
            let d = "M" + (centerX - (rectWidth * 0.5)) + " " + (centerY - (rectHeight * 0.5));
            d += " l0 " + rectHeight;
            d += " l" + (rectWidth * rectArrowFactor) + " 0";
            d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " 9";
            d += " l" + (rectWidth * 0.5 - rectWidth * rectArrowFactor) + " -9";
            d += " l" + (rectWidth * rectArrowFactor) + " 0";
            d += " l0 " + (-rectHeight);
            let path = document.createElementNS(Avionics.SVG.NS, "path");
            diffAndSetAttribute(path, "d", d);
            diffAndSetAttribute(path, "fill", "none");
            diffAndSetAttribute(path, "stroke", "white");
            diffAndSetAttribute(path, "stroke-width", "2");
            this.currentRefGroup.appendChild(path);
            this.currentRefValue = document.createElementNS(Avionics.SVG.NS, "text");
            this.currentRefValue.textContent = "";
            this.currentRefValue.setAttribute("x", centerX.toString());
            this.currentRefValue.setAttribute("y", centerY.toString());
            this.currentRefValue.setAttribute("fill", "green");
            this.currentRefValue.setAttribute("font-size", "28");
            this.currentRefValue.setAttribute("font-family", "Roboto-Bold");
            this.currentRefValue.setAttribute("text-anchor", "middle");
            this.currentRefValue.setAttribute("alignment-baseline", "central");
            this.currentRefGroup.appendChild(this.currentRefValue);
        }
        this.root.appendChild(this.currentRefGroup);
        this.selectedRefGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.selectedRefGroup.setAttribute("id", "selectedRefGroup_rose");
        this.selectedRefGroup.setAttribute("transform", "scale(1.27)");
        {
            let centerX = 195;
            let centerY = 85;
            let spaceX = 5;
            this.selectedRefMode = document.createElementNS(Avionics.SVG.NS, "text");
            this.selectedRefMode.textContent = "HDG";
            this.selectedRefMode.setAttribute("x", (centerX - spaceX).toString());
            this.selectedRefMode.setAttribute("y", centerY.toString());
            this.selectedRefMode.setAttribute("fill", "#00F2FF");
            this.selectedRefMode.setAttribute("font-size", "26");
            this.selectedRefMode.setAttribute("font-family", "Roboto-Bold");
            this.selectedRefMode.setAttribute("text-anchor", "end");
            this.selectedRefMode.setAttribute("alignment-baseline", "central");
            this.selectedRefGroup.appendChild(this.selectedRefMode);
            this.selectedRefValue = document.createElementNS(Avionics.SVG.NS, "text");
            this.selectedRefValue.textContent = "";
            this.selectedRefValue.setAttribute("x", (centerX + spaceX).toString());
            this.selectedRefValue.setAttribute("y", centerY.toString());
            this.selectedRefValue.setAttribute("fill", "#00F2FF");
            this.selectedRefValue.setAttribute("font-size", "36");
            this.selectedRefValue.setAttribute("font-family", "Roboto-Bold");
            this.selectedRefValue.setAttribute("text-anchor", "start");
            this.selectedRefValue.setAttribute("alignment-baseline", "central");
            this.selectedRefGroup.appendChild(this.selectedRefValue);
        }
        this.root.appendChild(this.selectedRefGroup);
    }
    update(_deltaTime) {
        super.update(_deltaTime);
        this._updateTimer -= _deltaTime;
        if (this._updateTimer < 0) {
            if (this.discoFplnGroup !== undefined) {
                const onDisco = SimVar.GetSimVarValue("L:WT_CJ4_IN_DISCONTINUITY", "number") === 1;
                this.discoFplnGroup.setAttribute("visibility", onDisco ? "visible" : "hidden");
            }
            this._updateTimer = this.UPDATE_TIME;
        }
        if (this.isHud) {
            if (!isFinite(this.hudTopOrigin)) {
                let clientRect = this.getBoundingClientRect();
                if (clientRect.width > 0)
                    this.hudTopOrigin = clientRect.top;
            }
            else {
                let ySlide = B787_10_HUD_Compass.getYSlide();
                this.style.top = this.hudTopOrigin + ySlide + "px";
            }
        }
    }
}
customElements.define("jet-mfd-nd-compass", Jet_MFD_NDCompass);