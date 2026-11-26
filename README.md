# Northern Wisconsin Wildfire Preparedness
GEOG 778 capstone starter. Plain HTML, CSS and JavaScript; no build step.

## Files
- index.html: application layout and pinned ArcGIS Maps SDK 4.34 CDN dependency.
- styles.css: responsive three-panel layout.
- app.js: map, community search, county/risk filters, point visibility, selection and detail panel.
- communities.js: 569 representative community points derived from the supplied DNR PDF and Census reference locations.

## Upload through GitHub
Extract the ZIP. Open the folder and upload its CONTENTS to the repository root (where README.md is). Do not upload the ZIP or enclosing folder. Commit with `Add starter wildfire map`.

Uploading code does not publish a website. Hosting is a separate next step. A private repository may require a paid GitHub plan for GitHub Pages; check your account before choosing hosting. Keeping this repository private is fine during development.

## Preview locally
Serve this folder with VS Code Live Server, or `python -m http.server 8000` from the folder and visit http://localhost:8000. Internet is required for the Esri SDK and basemap. No API key or UW login is embedded. This starter uses the public Esri Light Gray raster service rather than a credentialed basemap style.

## Data scope and limits
Statewide source data is shown; study-area counties are NOT yet finalized. County filtering affects the points and result list, not the current map extent. Search results list at most 50 matches; refine the search to find others. All matching points remain available on the map. Five Menominee TRS records remain unlocated and are absent from the point layer.

The DNR classes Very High, High and Concern are preserved as supplied. The source PDF date has not been established; do not call these current or independently validated classifications. Locations are Census ACS25 county-subdivision internal points (Jan 1 2025), originally NAD83. Their use as display longitude/latitude here is approximate; for precise spatial work use the original NAD83 CSV in ArcGIS Pro. Internal points are not necessarily settlement centers. Historical municipality changes (Maine and Rib Mountain towns/current villages) and Namekagon/Namakagon spelling were documented in the prepared source dataset. Match notes are shown in the details panel.

Population, historical wildfire counts and routes are explicitly pending; no invented values or composite scores appear. Historical wildfire data is intended to cover 2012–2025. Daily fire danger and historical fire toggles will be added when actual layers are connected. Facilities are on hold.

## Next development
1. Prepare and validate municipal summaries in ArcGIS Pro.
2. Publish prepared layers with UW ArcGIS Online and set an appropriate sharing level.
3. Replace pending values with actual joined data and connect historical fires.
4. Finalize study-area filters and test with users.

## Sources
- DNR community list: supplied communitiesAtRiskWildfire(1).pdf.
- Coordinates: https://tigerweb.geo.census.gov/tigerwebmain/Files/acs26/tigerweb_acs26_cousub_2025_acs25_wi.html
- Map software/basemap: Esri. Attribution remains visible on the map.
