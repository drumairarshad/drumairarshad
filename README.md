# Dr. Umair Arshad — Pediatric Surgeon Website

A multi-page website for Dr. Umair Arshad, MBBS (UHS), MS Pediatric Surgery and Consultant Pediatric Surgeon. It includes home, about, services, hospitals, contact, and browser-local admin routes.

## Development

Requires Node.js 22 or newer.

```sh
npm install
npm run dev
```

## Checks

```sh
npm test
npm run lint
npm run build
```

The admin route stores content changes in the current browser's local storage. Export a JSON backup before clearing browser data or moving content to another device.
