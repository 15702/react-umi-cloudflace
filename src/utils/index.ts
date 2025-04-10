import React from "react";
import { getIntl } from "umi";
import BigNumber from 'bignumber.js'
import { billion, million, one, oneThousandth, ten, thousand, zero } from './constants'
import { EventEmitter } from 'events';

export const eventBus = new EventEmitter();

BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
  },
  EXPONENTIAL_AT: 100000,
})

export function intl(key: string) {
    return getIntl().formatMessage({id: key})
}

export function timeoutPromise(timeout = 10000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ error: new Error('Request timeout'), result: false });
    }, timeout); // Set a timeout, such as 10 seconds
  });
}

export function subAddr(addr?: string) {
    if (addr) {
      return `${addr.substring(0, 4)}***${addr.substring(addr.length - 4)}`
    }
    return "--"
}

export function formatTime(time: any){
    const pad = (num: any) => num.toString().padStart(2, '0');
    const date = new Date(time);
    const year = pad(date.getFullYear());
    const month = pad(date.getMonth() + 1); 
    const day = pad(date.getDate());
    const hours = pad(date.getHours())
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minute}:${second}`;
}

export function toShorthandNumber(amount: BigNumber, suffix: string = '', precision?: number) {
  const sh = new BigNumber(
    amount
      .toString()
      .split('.')
      .map((part, index) => {
        if (index === 0) return part
        return part.substr(0, precision)
      })
      .filter((el) => el)
      .join('.'),
  )
  if (precision) {
    return sh.toFixed(precision).concat(suffix)
  }
  return sh.toFixed().concat(suffix)
}

export function formatAsShorthandNumbers(amount: BigNumber, precision?: number): string {
  if (amount.absoluteValue().gte(billion)) {
    return toShorthandNumber(amount.dividedBy(billion), 'B', precision)
  }
  if (amount.absoluteValue().gte(million)) {
    return toShorthandNumber(amount.dividedBy(million), 'M', precision)
  }
  if (amount.absoluteValue().gte(thousand)) {
    return toShorthandNumber(amount.dividedBy(thousand), 'K', precision)
  }
  return toShorthandNumber(amount, '', precision)
}

export function formatCryptoBalance(amount: BigNumber, digits: number = 2): string {
  const absAmount = amount.absoluteValue()

  if (absAmount.eq(zero)) {
    return formatAsShorthandNumbers(amount, 2)
  }

  if (absAmount.lt(oneThousandth)) {
    return `${amount.isNegative() ? '0.000' : '<0.0001'}`
  }

  if (absAmount.lt(ten)) {
    return formatAsShorthandNumbers(amount, 4)
  }

  // if (absAmount.lt(million)) return amount.toFormat(digits, BigNumber.ROUND_DOWN)

  return formatAsShorthandNumbers(amount, digits)
}

export function formatUsdValue(amount: BigNumber, decimalPlaces = 2): string {
  const absoluteAmount = amount.absoluteValue()

  return amount.isZero()
    ? '$ 0.00'
    : absoluteAmount.lt(0.01)
    ? `$ <${amount.isNegative() ? '-' : ''}0.01`
    : absoluteAmount.lt(million)
    ? `$ ${amount.toFormat(decimalPlaces, BigNumber.ROUND_DOWN)}`
    : `$ ${formatAsShorthandNumbers(amount, decimalPlaces)}`
}

export function formatFiatBalance(amount: BigNumber): string {
  const absAmount = amount.absoluteValue()

  if (absAmount.eq(zero)) return formatAsShorthandNumbers(amount, 2)
  if (absAmount.lt(one)) return formatAsShorthandNumbers(amount, 4)
  if (absAmount.lt(million)) return amount.toFormat(2, BigNumber.ROUND_DOWN)
  // We don't want to have numbers like 999999 formatted as 999.99k

  return formatAsShorthandNumbers(amount, 2)
}

export function formatPrecision(amount: BigNumber, precision: number): string {
  return amount.toFormat(precision, BigNumber.ROUND_DOWN)
}

interface FormatPercentOptions {
  precision?: number
  plus?: boolean
  noPercentSign?: boolean
  roundMode?: BigNumber.RoundingMode
}

export function formatPercent(number: BigNumber, { precision = 0, plus = false, roundMode = undefined, noPercentSign = false }: FormatPercentOptions = {}) {
  if(number.isNaN()){
    number = BigNumber(zero)
  }
  const sign = plus && number.isGreaterThan(0) ? '+' : ''

  return `${sign}${number.toFixed(precision, roundMode)}${noPercentSign ? '' : '%'}`
}

export function formatDecimalAsPercent(number: BigNumber, { precision = 2, plus = false, roundMode = BigNumber.ROUND_DOWN, noPercentSign = false }: FormatPercentOptions = {}) {
  return formatPercent(number.times(100), {
    precision,
    plus,
    roundMode,
    noPercentSign,
  })
}

export function formatLtvDecimalAsPercent(number: BigNumber, { precision = 2, plus = false, roundMode = BigNumber.ROUND_DOWN, noPercentSign = false }: FormatPercentOptions = {}) {
  const ltvHighestUiValue = new BigNumber(1.1)
  const value = number.gt(ltvHighestUiValue) ? ltvHighestUiValue : number
  const percentageValue = formatPercent(value.times(100), {
    precision,
    plus,
    roundMode,
    noPercentSign,
  })

  if (number.gt(ltvHighestUiValue)) {
    return `>${percentageValue}`
  }

  return percentageValue
}


export function formatAddress(address: string, first: number = 4, last: number = 5) {
  return `${address.slice(0, first)}...${address.slice(-last)}`
}

export function shortenTokenSymbol({ token, length = 15, first = 3, last = 3 }: { token: string; length?: number; first?: number; last?: number }) {
  return token.length > length ? `${token.slice(0, first)}...${token.slice(-last)}` : token
}

export function formatBigNumber(amount: BigNumber, digits: number) {
  return amount.dp(digits, BigNumber.ROUND_DOWN).toNumber()
}

export function formatBigString(amount: BigNumber, digits: number) {
  return amount.dp(digits, BigNumber.ROUND_DOWN).toString()
}

export function amountToWei(
  amount: BigNumber,
  precision: number = 18
): BigNumber {
  return amount.times(new BigNumber(10).pow(precision));
}

export function amountFromWei(
  amount: BigNumber,
  precision: number = 18
): BigNumber {
  return amount.div(new BigNumber(10).pow(precision));
}