// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const recipient = req.query.recipient;
  const reqHeader = new Headers();
  reqHeader.append("x-client-secret", process.env.XMINT_API_KEY);
  reqHeader.append("x-project-id", process.env.XMINT_PROJECT_ID);
  reqHeader.append("Content-Type", "application/json");

  // Form the request body
  const reqBody = JSON.stringify({
      "mainnet": false, // mainnet flag, use false for testnets
      "metadata": {
          "name": process.env.XMINT_NFT_NAME,
          "image": process.env.XMINT_NFT_IMAGE,
          "description": process.env.XMINT_NFT_DESCRIPTION
          // ... + whatever other metadata you'd like, please check https://docs.crossmint.io/create-and-send-nfts/nft-minting-api/metadata
      },
      "recipient": `email:${recipient}:poly`
  });

  // Form the request options
  var requestOptions = {
      method: 'POST',
      headers: reqHeader,
      body: reqBody,
      redirect: 'follow'
    };

  // Interpret the response
  try {
    const resp = await fetch(process.env.XMINT_API_ENDPOINT + "/default/nfts/", requestOptions)
    const respjson = await resp.json();
    res.status(200).json(respjson)
  } catch (error) {
    res.status(500).json(error)
  }

}
