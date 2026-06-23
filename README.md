# PayRouter

PayRouter is a static product dashboard mock for ecommerce payment profitability. It helps a merchant understand payment cost, PSP performance, revenue leakage, transaction exceptions, and store-level payment settings.

The app currently runs as a frontend-only demo with mock data. There is no backend database, authentication layer, payment-provider integration, or real customer data.

Live app:

```text
https://payrouter-production.up.railway.app
```

## Current Product State

PayRouter now opens directly to the dashboard. The public landing page has been removed.

Visible navigation:

- Dashboard: `/` and `/dashboard`
- PSP Comparison: `/compare`
- Transactions: `/transactions`
- Settings: `/settings`

Internal/direct route:

- PSP Setup: `/psp-setup`

The PSP Setup screen still exists as a direct route, but it is no longer shown in the left sidebar.

## Dashboard

The dashboard is the main homepage. It shows the current payment profitability view for the selected store and date range.

Current top counters:

- Processed Revenue: `₪420,270`
- Total PSP Cost: `₪8,932`
- Revenue Leakage: `₪14,450`
- Current PSP Provider: `PayPlus`
- Net After Fees & Leakage: `₪396,888`

Other dashboard sections:

- PSP cost breakdown donut
- Revenue leakage signals
- Payment methods performance table
- Store selector
- Date selector with preset and custom date-range options

## PSP Comparison

The PSP Comparison page compares provider options across monthly cost, effective rate, savings, payment-method support, platform fit, reliability, and recommended role.

Current notable rows:

- PayPlus is the current baseline provider with monthly cost `₪8,932` and monthly savings `₪0`.
- Tranzila is marked as the recommended primary provider.
- Tranzila has a verified badge next to its name.
- Hovering or focusing the verified badge shows: `most reccomended option`.

Tables support:

- Filtering
- Sorting by column
- Horizontal scrolling when needed

## Transactions

The Transactions page contains mock transaction exception data.

Current behavior:

- 100 mock transaction rows
- 10 rows per page
- 10 pages of pagination
- Sorting by table columns
- Filtering by orders, PSPs, statuses, or issue text

The transaction total is intentionally kept aligned with dashboard revenue:

```text
₪420,270
```

## Settings

The Settings page changes its tiles based on the selected store.

Available demo stores:

- My Store: Shopify
- Outlet Store: WooCommerce
- International Store: Wix

Changing the selected store updates:

- Store profile
- Platform
- Currency
- Monthly revenue
- Average order value
- Foreign card usage
- Current payment stack
- Settlement file behavior

## PSP Setup

The PSP Setup page is currently hidden from sidebar navigation but still available directly at:

```text
/psp-setup
```

It includes:

- Primary PSP card
- Backup PSP card
- Create/Edit controls on PSP cards
- Disabled Edit state when the PSP is not configured
- Recommended PSP Setup panel
- Execute Plan button
- View PSP Comparison button

The buttons currently show placeholder demo alerts rather than launching real workflows.

## Tech Stack

This is a lightweight static app:

- Plain HTML
- Plain CSS
- Plain JavaScript
- Node.js static file server
- No frontend framework
- No runtime dependencies

Main files:

- `index.html`: app shell
- `app.js`: all data, routing, rendering, filtering, sorting, pagination, and interactions
- `styles.css`: all visual styling
- `server.mjs`: static server with SPA fallback
- `assets/payrouter-hero.png`: legacy asset from the removed landing page

## Run Locally

From the project directory:

```bash
npm start
```

Then open:

```text
http://localhost:4173
```

The server binds to:

```text
0.0.0.0
```

Railway uses the `PORT` environment variable automatically.

## Deployment

The app is deployed on Railway from this repository:

```text
https://github.com/arkashaled/payrouter.git
```

Railway command used during development:

```bash
railway up --detach --message "Deployment message"
```

Because this is a static mock, deployments only need the files in this repository. No build step is required.

## Data Notes

All app data is hard-coded in `app.js`.

Important current assumptions:

- Currency is Israeli shekel (`₪`)
- Main demo period is May 2025
- Dashboard revenue is `₪420,270`
- Current provider is PayPlus
- Recommended primary provider is Tranzila
- Recommended backup provider is PayPlus
- Data is mock/demo data only

## Editing Guide

Common updates:

- Dashboard counters: edit `const kpis` in `app.js`
- PSP comparison rows: edit `const psps` in `app.js`
- Payment method table: edit `const paymentMethods` in `app.js`
- Transaction rows: edit seed/template transaction data in `app.js`
- Store settings: edit `const stores` in `app.js`
- Navigation: edit `const nav` in `app.js`
- Routes: edit the `routes` object in `route()` inside `app.js`
- Styles: edit `styles.css`

## Current Limitations

- No real PSP APIs are connected
- No real Shopify, WooCommerce, or Wix integration is connected
- No user accounts or authentication
- No database or persistence
- Buttons are demo placeholders unless explicitly wired later
- Data does not update from live merchant sources
