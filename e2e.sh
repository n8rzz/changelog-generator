#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RESET_COLOR='\033[0m'

ENTRIES_DIR=.changelog
LIB_DIR=lib/

CONFIG_FILE=.changelog.json

log_block () {
    color=$1
    msg=$2

    echo ""
    echo "--- --- :: ::: ::: ::: :: --- ---"
    echo ""
    echo "${color} ${msg}${RESET_COLOR}"
    echo ""
    echo "--- --- :: ::: ::: ::: :: --- ---"
    echo ""
}

log_line () {
    color=$1
    msg=$2

    echo ""
    echo "--- :: ${color}${msg}${RESET_COLOR} :: ---"
    echo ""
}

reset_and_rebuild () {
    log_block "${YELLOW}" "Removing artifacts and resetting to a pristine state"

    [ ! -d "$ENTRIES_DIR" ] || rm -rf "$ENTRIES_DIR"
    [ ! -d "$LIB_DIR" ] || rm -rf "$LIB_DIR"
    [ ! -f "$CONFIG_FILE" ] || rm "$CONFIG_FILE"

    npm run build
}

run_help_commands () {
    log_block "${YELLOW}" "Testing help command outputs..."
    log_block "${YELLOW}" "should display root help doc"

    node ./index.js -h &&

    log_block "${YELLOW}" "should show help for init command"

    node ./index.js init -h &&

    log_block "${YELLOW}" "should show help for entry command"

    node ./index.js entry -h

    log_block "${YELLOW}" "should show help for generate command"

    node ./index.js generate -h
}

# =====================

reset_and_rebuild
run_help_commands

reset_and_rebuild
# should display warning about runnint `init` command firsts
# should create default `.changelog` dir and `.changelog.json` config

log_block "${YELLOW}" "INIT command"

npm run cmd:init:empty

reset_and_rebuild

log_block "${YELLOW}" "ENTRY command"

log_line "${GREEN}" "should create default entries dir and config with -p project name"
npm run cmd:init &&
log_line "${GREEN}" "should create an entry prompting user for each input"
npm run cmd:entry:empty &&
log_line "${GREEN}" "should create entry using cli arg values"
npm run cmd:entry &&
log_line "${GREEN}" "should create entry using same cli arg values an -f"
npm run cmd:entry:force &&


log_block "${YELLOW}" "GENERATE command"


npm run cmd:generate:empty &&
npm run cmd:generate &&

npm run test
