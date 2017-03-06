# snapscan
A NodeJS wrapper for the SnapScan API.

## Disclaimer & Things to know
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

TODO: Need to flesh this README out.

For now, take a look at the [official SnapScan API documentation](http://developer.getsnapscan.com/) for all possible endpoints and parameters. Everything is supported in this API Wrapper.

### getQRCode
#### Description
Used to generate your SnapCode/QR Code to display on a website, etc.

#### Parameters
All parameters are optional.
* snapCode - If you want to generate a SnapCode other than for your given merchant account
* id - Specify additional reference that is unique to the SnapCode. Will be associated to `merchantReference` in payments
* amount - Pre-populate owed amount
* strict - {true/false} Set to `true` to prevent customer from paying the same reference (`id`) twice or to edit the payment amount
* snapCodeType - The image file type to return. Either `svg` or `png` (Defaults to `svg`)
* snapCodeSize - The size of the image - between 50 and 500 (Defaults to 125)

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

### getPayments

### getPayment

### getCashUpPayments

### cashUp

### getCashUps


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
3.  This notice may not be removed or altered from any source distribution.