/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

const col = require('colors');
import { DateTime } from 'luxon';

export function getRelativeTime(millisec: number) {
  const diff = new Date().getTime() - new Date(millisec).getTime();
  if (diff < 60000 && diff > 0) {
    return 'Less than a minute ago...';
  }
  return millisec ? DateTime.fromMillis(millisec).toRelative() : '';
}

function showTableFromTobject(tObject: any, title?: string) {
  // console.table(tObject)
  let serverMode = false;
  let MAX_TERMINAL_LENGTH = 250;
  if (process.stdout && process.stdout.columns) {
    MAX_TERMINAL_LENGTH = process.stdout.columns;
  } else {
    // log(INFO, 'SERVER MODE')
    serverMode = true;
  }
  //console.log('MAX_TERMINAL_LENGTH: ', MAX_TERMINAL_LENGTH);
  const Table = require('cli-table');
  let topLeft = '╔';
  let topRight = '╗';
  if (title) {
    topLeft = '╠';
    topRight = '╣';
  }
  let { colNames, colAlignArray, maxColLengthObject } = getColNamesAndWidth(tObject);

  let tableWidth = 3;
  const colWidthsArray: number[] = [];
  let highestIndex = 0;
  let idX = 0;
  for (const colLen of Object.keys(maxColLengthObject)) {
    colWidthsArray.push(maxColLengthObject[colLen] + 3);
    tableWidth += maxColLengthObject[colLen] + 3;
    if (maxColLengthObject[colLen] > colWidthsArray[highestIndex]!) {
      highestIndex = idX;
    }
    idX++;
  }
  let screenOffset = 0;

  if (tableWidth >= MAX_TERMINAL_LENGTH) {
    // Screen is smaller than the table
    screenOffset = tableWidth - MAX_TERMINAL_LENGTH + (colWidthsArray.length - 2);
    if (colWidthsArray[highestIndex]! - screenOffset > 8) {
      colWidthsArray[highestIndex] = colWidthsArray[highestIndex]! - screenOffset;
    } else {
      colWidthsArray[highestIndex] = 8;
    }
  }
  const tab = new Table({
    chars: {
      top: '═',
      'top-mid': '╤',
      'top-left': topLeft,
      'top-right': topRight,
      bottom: '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      left: '║',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '║',
      'right-mid': '',
      middle: '│',
    },
    colAligns: colAlignArray,
    colWidths: colWidthsArray,
    style: { compact: true, 'padding-left': 1, 'padding-right': 1, head: ['green'], border: ['white'] },
    head: colNames,
  });
  let index = 0;
  for (const row of Object.keys(tObject)) {
    index++;
    const rowArray = [String(index)];
    for (const el of Object.keys(tObject[row])) {
      if (tObject[row][el]) {
        rowArray.push(tObject[row][el]);
      } else {
        let val = getEmptyVal(tObject[row][el]);
        rowArray.push(val);
      }
    }
    tab.push(rowArray);
  }
  const tabString = tab.toString();
  if (title) {
    const length = tabString.indexOf('\n');
    if (length > 0) {
      if (length > 12) {
        console.log(col.white('╔' + '═'.repeat(length - 12) + '╗'));
      }
      const nrSpaces = length - (title.length + 20);
      // console.log(nrSpaces)
      let after = '';
      if (nrSpaces > 0) {
        after = ' '.repeat(nrSpaces) + col.white('║');
      }
      console.log(col.white('║') + col.reset(' TABLE: ') + col.blue(title) + after);
    }
  }
  if (serverMode) {
    console.table(tObject);
  } else {
    console.log(tabString);
  }
}

function getColNamesAndWidth(arrOfObj: any) {
  let colNames: string[] = [];
  let colAlignArray: string[] = [];
  const maxColLengthObject: any = {};
  let ind = 0;
  for (const row of Object.keys(arrOfObj)) {
    ind++;
    colNames = ['NR'];
    colAlignArray = ['middle'];
    for (const col of Object.keys(arrOfObj[row])) {
      colNames.push(col);
      colAlignArray.push('left');
      const indexLength = String(ind).length;
      if (!maxColLengthObject.NR || maxColLengthObject.NR < indexLength) {
        maxColLengthObject.NR = indexLength;
      }
      if (!maxColLengthObject[col]) {
        maxColLengthObject[col] = String(col).length; // consider header length as max
      }
      if (arrOfObj[row][col]) {
        let colValLength = String(arrOfObj[row][col]).length;
        if (maxColLengthObject[col] < colValLength) {
          maxColLengthObject[col] = colValLength;
        }
      }
    }
  }

  return {
    colNames: colNames,
    colAlignArray: colAlignArray,
    maxColLengthObject: maxColLengthObject,
  };
}

function getEmptyVal(val: any) {
  let emptyVal;
  if (typeof val === 'number') {
    emptyVal = '0';
  } else if (typeof val === 'boolean') {
    emptyVal = false.toString();
  }
  return emptyVal || '';
}

export function showTable(tObject: any, title?: string) {
  // console.log('Table: ', title)
  // console.table(tObject)
  showTableFromTobject(tObject, title);
}

export let table = { showTable, getRelativeTime };
