#!/bin/bash

npm run clean:test &&
npm run clean:lib &&
npm run build &&
npm run help &&
npm run cmd:entry:help &&
npm run cmd:entry:empty &&
npm run cmd:entry &&
npm run cmd:entry:force &&
npm run test
