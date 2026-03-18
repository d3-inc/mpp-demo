D3 API example payload:

```json
{
  "paymentOptions": {
    "contractAddress": "0x9aC6761B5A1006E09C60a0BE10cd1C9d32911e96",
    "networkId": "eip155:97476",
    "tokenAddress": null,
    "buyerAddress": "0x8a1D73715C410A555EF9552Dc4992a66C7Aa0bc8"
  },
  "names": [
    {
      "sld": "ks0317",
      "tld": "com",
      "autoRenew": false,
      "domainLength": 1
    }
  ],
  "registrantContact": {
    "firstName": "Kai",
    "lastName": "Sung",
    "organization": "Example Inc",
    "email": "kai@d3.com",
    "phone": "6504567890",
    "phoneCountryCode": "+1",
    "fax": "6504567890",
    "faxCountryCode": "+1",
    "street": "123 Main St",
    "city": "San Mateo",
    "state": "CA",
    "postalCode": "94404",
    "countryCode": "US"
  }
}
```

example response w/voucher:

```json
{
  "voucher": {
    "paymentId": "9020e413-2177-4a32-aaf4-868fb0e6a29f",
    "amount": "4385856521425139",
    "token": "0x0000000000000000000000000000000000000000",
    "buyer": "0x8a1D73715C410A555EF9552Dc4992a66C7Aa0bc8",
    "voucherExpiration": 1773783648,
    "orderId": "9020e413-2177-4a32-aaf4-868fb0e6a29f"
  },
  "signature": "0xc86193ab2ec3d0636cc6d13b57ee1b77cf21665a5fc08fee1dae9e69ea244ed9694f386dd0f94b9c76f4a65998830a027d1883a54b6a6630106b42ccfee955c41c"
}
```

payment contract address:
https://explorer-testnet.doma.xyz/address/0x9aC6761B5A1006E09C60a0BE10cd1C9d32911e96?tab=contract_code
