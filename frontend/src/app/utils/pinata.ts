export async function uploadToIPFS(file: File, name: string, description: string) {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  if (!jwt) throw new Error('Pinata JWT not found in environment variables');

  // 1. Upload Image to Pinata IPFS
  const formData = new FormData();
  formData.append('file', file);

  const fileRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  const fileData = await fileRes.json();
  if (!fileRes.ok) throw new Error(fileData.error || 'Failed to upload image to IPFS');
  
  const imageIpfsUri = `ipfs://${fileData.IpfsHash}`;

  // 2. Prepare & Upload ERC-721 Metadata JSON to IPFS
  const metadata = {
    name,
    description,
    image: imageIpfsUri,
  };

  const jsonRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: { name: `${name}_metadata.json` },
    }),
  });

  const jsonData = await jsonRes.json();
  if (!jsonRes.ok) throw new Error(jsonData.error || 'Failed to upload metadata to IPFS');

  return `ipfs://${jsonData.IpfsHash}`;
}