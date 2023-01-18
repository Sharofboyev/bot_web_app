# cashout_webapp_api

## Socket

The socket works on port 2020. You should provide a token in auth property of the Socket instance in order to connect. If the token is valid, the server lets you connect:

```javascript
const socket = io({
  auth: {
    token: "abc",
  },
});
```

After connecting the server, the seller should listen for events  
`new_deal`  
`cancel_deal`  
`offer_claimed`  
`deals_response`

The buyer should listen for events  
`new_offer`  
`cancel_offer`  
`offers_response`.

The seller can send events  
`get_deals`  
`cancel_offer`  
`new_offer`

The buyer can send events  
`get_offers`  
`claim_offer`  
`cancel_deal`

### Receiving events from server

#### new_deal event

The event will come with one JSON argument, called data. It will be in the format:

```typescript

{
  "id": number,
  "creator": {
    "id": number,
    "name": string
  },
  "amount": number,
  "exchange_rate": number,
  "currency": string,
  "currency_buy": string,
  "currency_sell": string,
  "method_withdraw": string,
  "method_pay": string
}
```

If the event is received, it means that a new deal is created by the buyer and the seller can make an offer on it.

#### cancel_deal

The event will come with arguments: `deal_id` in format number and `cause` can be `undefined` or in string format. Event means that the deal was canceled by the buyer or the expiration time is already gone.

#### offer_claimed

The event is received when the buyer claims an offer that's done by a seller. The event will come with one argument, `deal_id` which has a number type.

#### deals_response

This event will be received as the response for the event `get_deals` sent by the seller. The event will come with one argument `data` which has an array type and each element will be in JSON format:

```typescript
{
  "id": number,
  "creator": {
    "id": number,
    "name": string
  },
  "amount": number,
  "exchange_rate": number,
  "currency": string,
  "currency_buy": string,
  "currency_sell": string,
  "method_withdraw": string,
  "method_pay": string
}
```

#### new_offer

The event is sent by the server to the buyer when the seller makes an offer to the deal. Comes with the argument `data` which has the type JSON:

```typescript
{
  "exchange_rate": number,
  "seller": {
    "id": number,
    "name": string,
    "successful_deals": number,
    "rating": number
  }
}
```

#### cancel_offer

Event emitted when the seller canceled his/her offer. Comes with arguments `offer_id` which has a number type and `cause` which can be empty or in a string type.

#### offers_response

Event emitted as the response to the `get_offers` event. Comes with one argument, `data` which is an array of JSONs:

```typescript
{
  "exchange_rate": number,
  "seller": {
    "id": number,
    "name": string,
    "successful_deals": number,
    "rating": number
  },
  "created_date": Date
}
```

### Sending events to the server

#### get_deals

An event that's used for getting all active deals at the moment. No argument is needed. The response will come as event `deals_response` and the response will be returned only to the seller.

#### cancel_offer

An event that's used by the seller for canceling an offer that's sent to the buyer. Waits for arguments `deal_id` of type number (required) and `cause` of type string (optional).

#### get_offers

An event that's used for getting all active offers at the moment. No argument is needed. The response will come as event `offers_response` and the response will be returned only to the buyer if s/he has an active deal (which is not canceled and not claimed).

#### claim_offer

An event that's used for claiming an offer that's offered by a seller. Waits for an argument `offer_id` which has a type number. The event sent only by a buyer will be received.

#### new_offer

An event that's used for making a unique offer to the deal by the seller. Waits for the object in the first argument in the format:

```typescript
{
  "deal_id": number,
  "exchange_rate": number
}
```

`exchange_rate` will be rounded to 2 precision digits. On success, buyer will receive `new_offer` event with data in the format:

```typescript
{
  "id": number,
  "seller": {
    "id": number,
    "name": string
  },
  "exchange_rate": number
}
```
