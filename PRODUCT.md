# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Command Center Officers & Field Rescuers:** Provincial and national Disaster Management Committees (Ban Chỉ huy PCTT & TKCN), monitoring real-time telemetry, issuing emergency evacuations and GIS tactical dispatch.
- **Citizens & Communities:** 100M+ residents across 10,598 communes in Vietnam, seeking real-time storm trackings, localized flood warnings, and immediate rescue reporting.

## Product Purpose

HAEWS (Hydro-meteorological & Airborne Early Warning System) delivers real-time disaster intelligence, AI predictive simulation (LSTM / Typhoon / Radar Nowcasting), and civic rescue coordination to minimize loss of life and infrastructure during extreme weather events.

## Positioning

The only integrated platform combining official Decision 19/QD-TTg administrative coverage (10,598 communes), real-time WMO weather stations, Doppler radar nowcasting, transboundary reservoir alerts, and NASA/USGS global disaster feeds with a 1-click citizen rescue hotline.

## Operating Context

- High-stress war room command centers with wall-mounted GIS tactical displays.
- Field responders operating on mobile devices in heavy rain or low-connectivity zones.
- Public web portal accessed by citizens seeking emergency evacuation routes and shelter points.

## Capabilities and Constraints

- **Capabilities:** Real-time WebGIS mapping, 110 telemetry stations, WMO Open-Meteo feeds, NASA EONET & USGS live feeds, Gemini AI tactical consultation, 10,598 administrative units.
- **Constraints:** Must adhere to official Vietnamese meteorological terminologies (Báo động I/II/III, Rủi ro thiên tai cấp 1-5); zero latency on emergency ticker updates.

## Brand Commitments

- **Name:** HAEWS (Hệ Thống Cảnh Báo Sớm Thiên Tai & Cứu Hộ).
- **Emblem:** Hung Vuong University (HVU) emblem with tactical blue and gold accents.
- **Voice:** Authoritative, calm, clear, precise, urgent when critical.

## Evidence on Hand

- 10,598 verified communes in `src/data/communes_directory.ts`.
- 110 active telemetry stations in `server/data/stations.ts`.
- Live API integrations with NASA EONET, USGS, and Open-Meteo WMO in `server/services/`.

## Product Principles

1. **Mission-Critical Precision:** Telemetry, rainfall, and coordinates must be exact and high-contrast; no decorative fluff.
2. **Immediate Actionability:** Every warning must be accompanied by explicit response instructions (evacuate, prepare, shelter).
3. **Public Accessibility:** Civic features must be usable in 3 seconds on low-end mobile devices under stress.
4. **Resilience & Reliability:** Graceful fallback to offline cached data if network feeds fluctuate.

## Accessibility & Inclusion

- WCAG 2.1 AA compliance with high-contrast text ratios for all alert levels.
- Large tap targets on mobile rescue submission forms.
- Clear bilingual / Vietnamese terminology with no confusing technical jargon for citizens.
