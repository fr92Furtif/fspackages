# changes on 0.3.7
* Fixed bug that could cause display issues in the same area as live traffic.

# changes on 0.3.6
* Updated for 1.16.2.0

# changes on 0.3.5
* Updated for 1.15.7.0
* Fixed compat problems with stock G3000

## Notice

Due to changes in how planes load their configurations in WU4, we had to change the code that loads custom display gauges from WTEngineDisplay.xml, as is done with our sample for the G36.   In order to get these to work now, aircraft creators or modders must put the contents of the `WTEngineDisplay` section directly into panel.xml, within the body of the main `PlaneHTMLConfig` section.   This is unfortunate, but it was the only way we could preserve this functionality.   Doing this to your panel.xml is fully backwards compatible and will not break planes that don't use the modded G1000.

# changes in v0.3.4
* Fixed compatibility problems with FBW A320
* Fixed nav map not drawing approach paths

# Changes in v0.3.3
* Compatibility with and improvements from v1.12.13.0.

# Changes in v0.3.2
* Compatibility fix for 1.10.7.

# Changes in v0.3.1

* Keep the G1000 from breaking synthetic vision on the G3000 and G3Xes
* Fix WPT-page maps breaking on the MFD when in Track Up.

# Changes in v0.3.0

## Main features

* Added track-up mode for both PFD and MFD
* Fixed unwanted U-turn on ACTIVATE APPROACH
* Fixed reversed behavior of NOSE UP/DN buttons in FLC mode
* Added a preference saving system tied to plane model
* Configured it to currently preserve the following across sessions:
  * PFD and MFD brightness
  * V Speeds
  * Track up mode
  * Barometer mode
  * HSI settings for BRG1, BRG2, and DME
* Support loading plane configuration information even in encrypted planes
* Detect hardware avionics knobs in all models and configure them automatically
* Added support for additional XML-configurable ENGINE pages on MFD
* Lots of changes to colors and styling to closer match reality

## PFD and MFD enhancements

* Added a flight path marker on the PFD when in Syn Vis mode above 30kts
* Added new vertical column type gauge for engine display
* Updated circular gauge to support custom gradations and rounding
* Added a new blinking yellow status for engine gauges
* Correctly handle wind data when on ground or wind speed <1 knot
* Fixed reversed wind arrow at all times on MFD
* Improve MFD soft key menus, including new switch for TRACK UP
* Increased MFD max range to 2000 with more intermediate steps
* Move weather radar to MAP page group, only show if radar is on board
* Change brightness of PFD/MFD knobs and softkeys along with display

## Styling improvements
* Change PFD and MFD headers to more closely match the real font size, spacing, and colour
* More accurate colors on attitude indicator, horizon, and map; new gradient on horizon
* Updated flight director and attitude arrows
* Updated styling of airport waypoint info page (more to come)
* Updated styling of softkey menus to be more realistic

## Miscellaneous

* Added sample engine page configuration for G36 Bonanza
* Fix false DON'T SINK alert when flying patterns / touch and goes
* Improve representation of whole numbers as decimals