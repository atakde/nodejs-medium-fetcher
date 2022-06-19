# nodejs-medium-fetcher


## API Usage

```http
  GET /?username={username}&limit={limit}&responseType={responseType}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required** |
| `limit`         | `number` | **Required** |
| `responseType`      | `string` | **Required** (json, html, svg) |


## Example
```raw
![Alt text here](https://nodejs-medium-fetcher.vercel.app/?username=atakde&limit=5&responseType=svg)(https://medium.com/@atakde)
```
## Demo

[![Medium Articles](https://nodejs-medium-fetcher.vercel.app/?username=atakde&limit=5&responseType=svg)](https://medium.com/@atakde)
