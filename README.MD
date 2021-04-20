# Expensify Challenge

## Software Engineering Intern Role : Rafit Jamil

### Documentation & Standards

**PHP**
* Avoid pyramid of doom switch statements
* Early exit switch clauses
* Avoid over-modularization of HTML
* Import order matters for CSS & JS scripts
* Use constants over strings
* Global constants UPPER_CASE, all classes and ids kebab-case, everything else camelCase
* Consider all errors (offline, timeouts, etc.)

**JavaScript**
* Define jQuery (and other) constants/enums to avoid errors and keep DOM reference
* Create isolated and individual utility functions
* Avoid var and let (use only for explicit globals)
* Keep \$(document).ready() light
* Use arrow functions always (performance and readability)
* jQuery should only handle events and manipulate classes (avoid CSS manipulation)
* Using ids are much faster in jQuery, provide context for classes if necessary
* Pass function paramaters as objects to avoid ordering issues
* Avoid declaring non-event handler functions (place those in utilities.js)
* Clearly define variables readability > short names
* Consider readability over cleverness
* Consider performance of different built-in operations
* Utilities should avoid interdependencies between functions
* Utilities should consume DOM values but avoid DOM style manipulations
* We return the AJAX call itself so we can perform try-catch

**CSS**
* Create reusable base components
* Use root variables (color and sizes)
* Only use ids for individual formatting (margin, padding, etc.)
* Be explcit in selectors (even if theres only one table create a class/id)
* Order properties alphabetically for quick scans
* Consider UI, hover, focus, etc.
* Make styles naturally responsive: use breakpoints for limited changes
* All classes and ids kebab-case
