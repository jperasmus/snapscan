# snapscan
A NodeJS wrapper for the SnapScan API.

## Disclaimer & Things to know
I am not affiliated with [SnapScan](http://www.getsnapscan.com/) by any means and this is not an official API wrapper, but it is pretty cool.

This module uses some newer Javascript syntax, so it currently only supports node v4+. If someone really wants support for something below that, let me know and we can take a look at adding support for that.

The module can also technically work browser or server-side, but I would recommend using it server-side if possible since you will be passing in your `apiKey` and `merchant` name.

All methods return [Javascript Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) with JSON objects as return data.

## Installation

For the `npm` okes
```
npm install --save snapscan
```

or using `yarn`
```
yarn add snapscan
```

## Usage
```
const SnapScan = require('snapscan')

const snapscan = new SnapScan({
  apiKey: '<your_api_key>',
  merchant: '<your_merchant_name>'
})

// Example method you can use to get your SnapCode/QR Code link and image
snapscan.getQRCode()
  .then((snapCode) => {
    console.log(snapCode)
    // logs object containing `urlLink` and `imageLink`
  })
  .catch((error) => {
    console.error(error)
    // logs error thrown if anything failed
  })
```

## Supported Methods

Take a look at the [official SnapScan API documentation](http://developer.getsnapscan.com/) for all possible endpoints and parameters. Everything is supported in this API Wrapper.

### getQRCode()
#### Description
Used to generate your SnapCode/QR Code to display on a website, etc.

#### Parameters
All parameters are optional.
* `snapCode` - If you want to generate a SnapCode other than for your given merchant account
* `id` - Specify additional reference that is unique to the SnapCode. Will be associated to `merchantReference` in payments
* `amount` - Pre-populate owed amount
* `strict` - {true/false} Set to `true` to prevent customer from paying the same reference (`id`) twice or to edit the payment amount
* `snapCodeType` - The image file type to return. Either `svg` or `png` (Defaults to `svg`)
* `snapCodeSize` - The size of the image - between 50 and 500 (Defaults to 125)

#### Example
```
snapscan.getQRCode({
  id: 'order 51',
  amount: 250,
  strict: true,
  snapCodeType: 'png',
  snapCodeSize: 300
})
  .then((snapCode) => {
    console.log(snapCode)
    // logs object containing `urlLink` and `imageLink`
  })
  .catch((error) => {
    console.error(error)
    // logs error thrown if anything failed
  })
```

### getPayments()
#### Description
The API’s main purpose is to provide you with various ways to query the status of payments that were made against your merchant account.

#### Parameters
All parameters are optional.
* `startDate` - Payments that were started at or after this time, eg: `'2000-01-01T01:00:00Z'`
* `endDate` - Payments that were started before this time, eg: `'2000-01-01T01:00:00Z'`
* `status` - A comma separated string of the following values: `completed`, `error` or `pending`, eg. `'completed,pending'`
* `snapCode` - Payments with the SnapCode.
* `snapCodeReference` - Payments with the SnapCode reference.
* `userReference` - Payments with the user reference.
* `merchantReference` - Payments with your reference.
* `statementReference` - Payments included in the settlement with the provided reference.

#### Example
```
snapscan.getPayments({
  startDate: '2000-01-01T01:00:00Z',
  status: 'completed,pending'
})
  .then((payments) => {
    console.log(payments)
    // logs array of payment objects
  })
  .catch((error) => {
    console.error(error)
    // logs error thrown if anything failed
  })
```

### getPayment()
#### Description
Returns a single payment.

#### Parameters
This method only takes one required argument, namely the payment `id`

#### Example
```
snapscan.getPayment(123)
  .then((payment) => {
    console.log(payment)
    // logs payment object
  })
  .catch((error) => {
    console.error(error)
    // logs error thrown if anything failed
  })
```

### getCashUpPayments()
#### Description
Returns all payments that were completed successfully in the specified cash up period. If a cash up period contains any pending payments, the promise will reject. A cash up period is considered complete once the SnapScan guys know the status of all the payments within the period. See [Cash Ups](http://developer.getsnapscan.com/#cash-ups) for more details.

#### Parameters
This method only takes one required argument, namely the cash up period's `reference`

#### Example
```
snapscan.getCashUpPayments('1e07ac748d2627ba')
  .then((payments) => {
    console.log(payments)
    // logs array of payment object
  })
  .catch((error) => {
    console.error(error)
    // logs error thrown if anything failed
  })
```

### cashUp()
#### Description
The cash up API allows you to mark the end of your transaction period on the SnapScan system. Once a transaction period has been marked you will be able to query all payments that were completed within the associated period.

This method returns a reference that marks the end of the current transaction period and the start of a new one. The reference can be used to retrieve all the payments that were successfully completed in the associated period (using the getCashUpPayments() method above).

#### Parameters
This method takes no parameters

#### Example
```
snapscan.cashUp(')
  .then((cashUp) => {
    console.log(cashUp)
    // logs the cashUp object containing the `date` and `reference`
  })
  .catch((error) => {
    console.error(error)
    // logs error thrown if anything failed
  })
```

### getCashUps()
#### Description
Returns a paginated list of all cash up references that have been created. The references are ordered by descending date.

#### Parameters
This method takes no parameters

#### Example
```
snapscan.getCashUps(')
  .then((cashUps) => {
    console.log(cashUps)
    // logs array of cashUp objects
  })
  .catch((error) => {
    console.error(error)
    // logs error thrown if anything failed
  })
```


## License

This software is provided 'as-is', without any express or implied
warranty.  In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not
    claim that you wrote the original software. If you use this software
    in a product, an acknowledgment in the product documentation would be
    appreciated but is not required.
2.  Altered source versions must be plainly marked as such, and must not be
    misrepresented as being the original software.
3.  This notice may not be removed or altered from any source distribution.*  -