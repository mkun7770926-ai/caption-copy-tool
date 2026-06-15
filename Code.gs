const SHEET_NAMES = {
  DAILY: '日常发布',
  CART: '挂车发布',
};

const STATUS = {
  UNUSED: '未使用',
  USED: '已使用',
};

// 如果脚本不是绑定在 Google Sheets 上，可以把表格 ID 填到这里。
// 绑定脚本时保持空字符串即可。
const SPREADSHEET_ID = '';

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('Mark 的个人小工具｜文案复制工作台')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function getDailyStats() {
  const sheet = getSheet_(SHEET_NAMES.DAILY);
  const rows = getDataRows_(sheet);

  return buildStats_(rows, {
    statusIndex: 4,
    requiredIndexes: [1],
  });
}

function getCartProducts() {
  const sheet = getSheet_(SHEET_NAMES.CART);
  const rows = getDataRows_(sheet);
  const names = rows
    .map((row) => normalizeText_(row[0]))
    .filter(Boolean);

  return Array.from(new Set(names));
}

function getCartStats(productName) {
  const selectedProduct = normalizeText_(productName);

  if (!selectedProduct) {
    return {
      productName: '',
      total: 0,
      used: 0,
      unused: 0,
    };
  }

  const sheet = getSheet_(SHEET_NAMES.CART);
  const rows = getDataRows_(sheet).filter((row) => normalizeText_(row[0]) === selectedProduct);
  const stats = buildStats_(rows, {
    statusIndex: 5,
    requiredIndexes: [0, 2],
  });

  return Object.assign({ productName: selectedProduct }, stats);
}

function claimDailyCaption() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = getSheet_(SHEET_NAMES.DAILY);
    const rows = getDataRowsWithRowNumber_(sheet);
    const candidates = rows
      .filter((item) => normalizeText_(item.row[1]) && normalizeText_(item.row[4]) === STATUS.UNUSED)
      .sort((a, b) => compareSortOrder_(a.row[0], b.row[0]));

    if (candidates.length === 0) {
      return {
        success: false,
        code: 'NO_AVAILABLE',
        message: '当前没有可用文案，请在 Google Sheets「日常发布」表中新增文案。',
      };
    }

    const picked = candidates[0];
    const usedAt = formatNow_();

    sheet.getRange(picked.rowNumber, 5).setValue(STATUS.USED);
    sheet.getRange(picked.rowNumber, 6).setValue(usedAt);

    return {
      success: true,
      copyText: normalizeText_(picked.row[1]),
      cnNote: normalizeText_(picked.row[2]),
      language: normalizeText_(picked.row[3]),
      usedAt,
    };
  } finally {
    lock.releaseLock();
  }
}

function claimCartCaption(productName) {
  const selectedProduct = normalizeText_(productName);

  if (!selectedProduct) {
    return {
      success: false,
      code: 'NO_PRODUCT',
      message: '请先选择商品。',
    };
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = getSheet_(SHEET_NAMES.CART);
    const rows = getDataRowsWithRowNumber_(sheet);
    const candidates = rows
      .filter((item) => {
        const row = item.row;
        return (
          normalizeText_(row[0]) === selectedProduct &&
          normalizeText_(row[2]) &&
          normalizeText_(row[5]) === STATUS.UNUSED
        );
      })
      .sort((a, b) => compareSortOrder_(a.row[1], b.row[1]));

    if (candidates.length === 0) {
      return {
        success: false,
        code: 'NO_AVAILABLE',
        message: '当前商品没有可用文案，请在 Google Sheets「挂车发布」表中为该商品新增文案。',
      };
    }

    const picked = candidates[0];
    const usedAt = formatNow_();

    sheet.getRange(picked.rowNumber, 6).setValue(STATUS.USED);
    sheet.getRange(picked.rowNumber, 7).setValue(usedAt);

    return {
      success: true,
      productName: selectedProduct,
      copyText: normalizeText_(picked.row[2]),
      cnNote: normalizeText_(picked.row[3]),
      language: normalizeText_(picked.row[4]),
      usedAt,
    };
  } finally {
    lock.releaseLock();
  }
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error('未找到绑定的 Google Spreadsheet，请绑定脚本或填写 SPREADSHEET_ID。');
  }

  return spreadsheet;
}

function getSheet_(sheetName) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`未找到 Sheet：${sheetName}`);
  }

  return sheet;
}

function getDataRows_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow < 2 || lastColumn < 1) {
    return [];
  }

  return sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
}

function getDataRowsWithRowNumber_(sheet) {
  return getDataRows_(sheet).map((row, index) => ({
    row,
    rowNumber: index + 2,
  }));
}

function buildStats_(rows, config) {
  const validRows = rows.filter((row) => (
    config.requiredIndexes || []
  ).every((index) => normalizeText_(row[index])));

  const total = validRows.length;
  const used = validRows.filter((row) => normalizeText_(row[config.statusIndex]) === STATUS.USED).length;
  const unused = validRows.filter((row) => normalizeText_(row[config.statusIndex]) === STATUS.UNUSED).length;

  return {
    total,
    used,
    unused,
  };
}

function compareSortOrder_(left, right) {
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  const normalizedLeft = Number.isFinite(leftNumber) ? leftNumber : Number.MAX_SAFE_INTEGER;
  const normalizedRight = Number.isFinite(rightNumber) ? rightNumber : Number.MAX_SAFE_INTEGER;

  return normalizedLeft - normalizedRight;
}

function normalizeText_(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
}

function formatNow_() {
  const timezone = Session.getScriptTimeZone() || 'Asia/Shanghai';
  return Utilities.formatDate(new Date(), timezone, 'yyyy-MM-dd HH:mm:ss');
}
