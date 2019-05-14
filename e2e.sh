#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RESET_COLOR='\033[0m'

ENTRIES_DIR=.changelog
LIB_DIR=lib/

CONFIG_FILE=.changelog.json

reset_and_rebuild () {
    echo ""
    echo "${YELLOW} Removing artifacts and resetting to a pristine state${RESET_COLOR}"
    echo ""

    [ ! -d "$ENTRIES_DIR" ] || rm -rf "$ENTRIES_DIR"
    [ ! -d "$LIB_DIR" ] || rm -rf "$LIB_DIR"
    [ ! -f "$CONFIG_FILE" ] || rm "$CONFIG_FILE"

    npm run build
}

run_help_commands () {
    echo ""
    echo "${YELLOW} Testing help command outputs...${RESET_COLOR}"
    echo ""
    # should display root help doc
    node ./index.js -h &&
    # should show help for init command
    node ./index.js init -h &&
    # should show help for entry command
    node ./index.js entry -h
    # should show help for generate command
    node ./index.js generate -h
}

# =====================

reset_and_rebuild
run_help_commands

reset_and_rebuild
# should display warning about runnint `init` command firsts
# should create default `.changelog` dir and `.changelog.json` config
npm run cmd:init:empty

reset_and_rebuild

# should create default entries dir and config with -p project name
npm run cmd:init &&
# should create an entry prompting user for each input
npm run cmd:entry:empty &&
# should create entry using cli arg values
npm run cmd:entry &&
# should create entry using same cli arg values an -f
npm run cmd:entry:force &&

# run unit tests
npm run test
