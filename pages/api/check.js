// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const crossmintid = req.query.crossmintid;
  const reqHeader = new Headers();
  reqHeader.append("x-client-secret", process.env.XMINT_API_KEY);
  reqHeader.append("x-project-id", process.env.XMINT_PROJECT_ID);
  reqHeader.append("Content-Type", "application/json");


  // Form the request options
  var requestOptions = {
      method: 'GET',
      headers: reqHeader,
      redirect: 'follow'
    };

  // Interpret the response
  try {
    const resp = await fetch(process.env.XMINT_API_ENDPOINT + `/default/nfts/${crossmintid}`, requestOptions)
    const respjson = await resp.json();
    res.status(200).json(respjson)
  } catch (error) {
    res.status(500).json(error)
  }

}
