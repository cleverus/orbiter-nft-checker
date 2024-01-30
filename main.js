const ethers = require('ethers');

const ORBITER_NFT = {
  'orbiter-trainee-pilot-nft': {
    id: 'orbiter-trainee-pilot-nft',
    name: 'Orbiter Trainee Pilot NFT',
    contract: '0xbc2b5d07e8658d74176e3044fd60b38d08f926a4',
  },
  'orbiter-pilot-nft': {
    id: 'orbiter-pilot-nft',
    name: 'Orbiter Pilot NFT',
    contract: '0x4a0e7cf70e2816de8e6c30f67968575d17925a55',
  },
  'orbiter-elite-pilot-nft': {
    id: 'orbiter-elite-pilot-nft',
    name: 'Orbiter Elite Pilot NFT',
    contract: '0x83ed3b8a9dca0a3d40a9be9f7aee0e58f7918c4c',
  },
  'orbiter-expert-pilot-nft': {
    id: 'orbiter-expert-pilot-nft',
    name: 'Orbiter Expert Pilot NFT',
    contract: '0xe20847f3c593296613df763afe7ea039d8398e78',
  },
  'orbiter-ace-pilot-nft': {
    id: 'orbiter-ace-pilot-nft',
    name: 'Orbiter Ace Pilot NFT',
    contract: '0x5b9b40c26f6fbd053840a212a0627c55db8ea28c',
  },
};
const provider = new ethers.JsonRpcProvider('https://polygon.blockpi.network/v1/rpc/public');
const fs = require('fs');
const ABI = JSON.parse(fs.readFileSync('ABI.json', 'utf8'));
(async function () {
  try {
    const all_balance = {};
    var lines = require('fs').readFileSync('./wallets.txt', 'utf-8').split('\n').filter(Boolean);

    const title_row = ['Wallet'];
    for (const id in ORBITER_NFT) {
      title_row.push(ORBITER_NFT[id].name);
      all_balance[id] = 0;
    }
    fs.writeFileSync(`./result.csv`, `${title_row.join(';')}`);

    for (const i in lines) {
      const wallet = lines[i];
      const wallet_row = [wallet];
      for (const id in ORBITER_NFT) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        const contract = ORBITER_NFT[id].contract;
        const CONTRACT = new ethers.Contract(contract, ABI, provider);
        const balance = parseFloat(await CONTRACT.balanceOf(wallet));

        all_balance[id] += balance;

        wallet_row.push(balance);
      }

      fs.appendFileSync(`./result.csv`, `\n${wallet_row.join(';')}`);

      console.log(`${parseFloat(i) + 1}/${lines.length} done`);
    }

    const footer_row = ['All'];
    for (const i in all_balance) {
      footer_row.push(all_balance[i]);
    }
    fs.appendFileSync(`./result.csv`, `\n${footer_row.join(';')}`);
  } catch (error) {
    console.log(error);
  }
})();
