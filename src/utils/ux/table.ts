// eslint-disable-next-line no-restricted-modules
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
  console.log('MAX_TERMINAL_LENGTH: ', MAX_TERMINAL_LENGTH);
  const Table = require('cli-table');
  let topLeft = '╔';
  let topRight = '╗';
  if (title) {
    topLeft = '╠';
    topRight = '╣';
  }
  let headerArray: string[] = [];
  let colAlignArray: string[] = [];
  const maxColLengthObject: any = {};
  let ind = 0;
  for (const row of Object.keys(tObject)) {
    ind++;
    headerArray = ['NR'];
    colAlignArray = ['middle'];
    for (const col of Object.keys(tObject[row])) {
      headerArray.push(col);
      colAlignArray.push('left');
      const indexLength = String(ind).length;
      if (!maxColLengthObject.NR || maxColLengthObject.NR < indexLength) {
        maxColLengthObject.NR = indexLength;
      }
      if (tObject[row][col]) {
        const headLength = String(col).length;
        const tempColLength = String(tObject[row][col]).length;
        let maxL = headLength;
        if (tempColLength > headLength) {
          maxL = tempColLength;
        }
        if (!maxColLengthObject[col] || maxColLengthObject[col] < maxL) {
          maxColLengthObject[col] = maxL;
        }
      }
    }
  }
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
  // console.log('tableWidth:', tableWidth)
  // console.log('MAX_TERMINAL_LENGTH:', MAX_TERMINAL_LENGTH)
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
    head: headerArray,
  });
  let index = 0;
  for (const row of Object.keys(tObject)) {
    index++;
    const rowArray = [String(index)];
    for (const el of Object.keys(tObject[row])) {
      if (tObject[row][el]) {
        rowArray.push(tObject[row][el]);
      } else {
        rowArray.push('');
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

export function showTable(tObject: any, title?: string) {
  // console.log('Table: ', title)
  // console.table(tObject)
  showTableFromTobject(tObject, title);
}

export let table = { showTable, getRelativeTime };
